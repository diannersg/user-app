import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsComponent } from './user-details.component';
import {NgxsModule, Store} from "@ngxs/store";
import {RouterModule} from "@angular/router";

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        UserDetailsComponent,
        NgxsModule.forRoot([]),
        RouterModule.forRoot([])
      ],
    })
    .compileComponents();

    const store:Store = TestBed.inject<Store>(Store);
    spyOn(store, 'selectSnapshot').and.returnValue([]);

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
