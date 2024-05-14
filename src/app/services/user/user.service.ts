import { Injectable } from '@angular/core';
import { Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {User} from "../../user/interface/user.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly username = 'testUser';
  readonly password = 'password';
  authenticated = false;

  private url =`https://jsonplaceholder.typicode.com/users`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.url)
  }
}
