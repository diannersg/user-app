import { Injectable } from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {User} from "../interface/user.interface";
import {PageEvent} from "@angular/material/paginator";


export class ListUser {
  static readonly type = '[User] List';
  constructor(public users: User[]) {}
}

export class SearchUser {
  static readonly type = '[User] Search';
  constructor(public search: string) {}
}

export class PaginateUser {
  static readonly type = '[User] Paginate';
  constructor(public pageEvent: PageEvent) {}
}

export interface UsersStateModel {
  users: User[],
  page:PageEvent,
  searchStr: string,
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    users: [],
    searchStr: '',
    page: {
      pageIndex: 0,
      pageSize: 5,
      length: 0
    }
  }
})
@Injectable()
export class UserState {
  @Selector()
  static getUsers(state: UsersStateModel) {
    return state.users;
  }

  @Selector()
  static getPage(state: UsersStateModel) {
    return state.page;
  }

  @Selector()
  static getSearch(state: UsersStateModel) {
    return state.searchStr;
  }

  @Action(ListUser)
  list({ getState, patchState }: StateContext<UsersStateModel>, { users }: ListUser) {
    const state = getState();
    patchState({
      users: [...state.users, ...users],
    });
  }

  @Action(PaginateUser)
  paginate({ getState, patchState }: StateContext<UsersStateModel>, { pageEvent }: PaginateUser) {
    const state = getState();
    patchState({
      page: {
        pageIndex: pageEvent.pageIndex,
        pageSize: pageEvent.pageSize,
        length: pageEvent.length
      }
    });
  }

  @Action(SearchUser)
  search({ getState, patchState }: StateContext<UsersStateModel>, { search }: SearchUser) {
    const state = getState();
    patchState({
      searchStr: search,
    });
  }
}
