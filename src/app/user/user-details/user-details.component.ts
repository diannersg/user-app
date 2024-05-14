import {Component, Input, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {User} from "../interface/user.interface";
import {UserState} from "../store/users.state";
import {Store} from "@ngxs/store";

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    NgIf,
    RouterLink,
    MatButton
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit{
  @Input() id!: number;
  user!: User | undefined

  constructor(
    private store: Store,
  ) {
  }

  ngOnInit() {
    const users =  this.store.selectSnapshot(UserState.getUsers);
    this.user = users.find(user => user.id === +this.id);
  }

}
