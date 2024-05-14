import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {MatFormField} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, map, mergeMap, Observable, startWith, withLatestFrom} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {User} from "../interface/user.interface";
import {UserService} from "../../services/user/user.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {Select, Store} from "@ngxs/store";
import {ListUser, PaginateUser, SearchUser, UserState} from "../store/users.state";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatIcon,
    RouterModule,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatPaginator,
    MatButton
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  @ViewChild('errorDialog') errorDialog!: TemplateRef<HTMLElement>;
  @Select(UserState.getUsers) users$!: Observable<User[]>;
  @Select(UserState.getSearch) search$!: Observable<string>;
  @Select(UserState.getPage) page$!: Observable<PageEvent>;

  filteredUsers$!: Observable<User[]>;
  searchControl = new FormControl<string>('');

  dialogRef: MatDialogRef<HTMLElement> | undefined;

  constructor(
    private userService: UserService,
    private matDialog: MatDialog,
    private store: Store,
  ) {
  }

  ngOnInit() {
    const users = this.store.selectSnapshot(UserState.getUsers);
    this.searchControl.setValue(this.store.selectSnapshot(UserState.getSearch));

    if (users.length) {
      this.filterUsers();
      return;
    }

    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers()
      .subscribe({
        next: data => {
          this.store.dispatch(new ListUser(data));
          this.filterUsers();
        },
        error: () => this.openErrorDialog()
      })
  }

  filterUsers() {
    this.filteredUsers$ = this.searchControl.valueChanges
      .pipe(
        debounceTime(250),
        startWith(this.store.selectSnapshot(UserState.getSearch)),
        withLatestFrom(this.users$, this.search$,  this.page$),
        map(([newSearch, users, search, page] )=> {
          let start = page.pageIndex * page.pageSize;
          let end = start + page.pageSize
          const filteredUser = users.filter(user => user.name.toLowerCase().includes(newSearch || ''));
          if (newSearch !== search || page.length === 0) {
            this.store.dispatch(new SearchUser(newSearch || ''));
            const pageEvent = {pageIndex: 0, pageSize: page.pageSize, length: filteredUser.length};
            start = 0;
            end = page.pageSize;
            this.store.dispatch(new PaginateUser(pageEvent));
          }
          return filteredUser.slice(start, end);
        })
      )
  }

  openErrorDialog() {
    if (this.errorDialog) {
      this.dialogRef = this.matDialog.open(this.errorDialog, {
        width: '500px'
      });

      this.dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.getUsers();
        }
      })
    }
  }

  handlePageEvent(page: PageEvent) {
    this.store.dispatch(new PaginateUser(page));
    this.searchControl.updateValueAndValidity();
  }

}
