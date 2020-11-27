import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private openedUser: User | null = null;

  userSubject = new Subject<User[]>();

  openedUserSubject = new Subject<User>();

  userCountSubject = new Subject<Number>();

  private userCount = 0;

  constructor() { }

  emitUser() {
    this.userSubject.next(this.users.slice());
  }

  emitOpenedUser() {
    this.openedUserSubject.next(this.openedUser);
  }

  emitUserCount() {
    this.userCountSubject.next(this.userCount);
  }

  getUsers(page = 1, pagesize = 5) {

    fetch("http://127.0.0.1:8000/users/" + page + "/" + 5, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      },
    }).then(async data => {

      let res = await data.json();

      this.users = res.map(el => {
        return {
          ...el,
          Id: el.id + ""
        }
      });

      this.emitUser();

    }).catch(err => {

      console.warn("errrooooor");
    });
    this.emitUser();
  }

  addUser(user: User) {

    fetch("http://127.0.0.1:8000/user", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        ...user
      })
    }).then(async data => {

      let res = await data.json();

      console.log('add successfully');

      console.log(res.id);

      user.Id = res.id + "";

      this.users.push(user);

      this.setOpenedUser(user);

      this.userCount++;
      this.emitUserCount();
      this.emitUser();
    }).catch(err => {
      console.warn("errrooooor");
    });




  }

  setOpenedUser(user: User | null) {
    this.openedUser = user;
    this.emitOpenedUser();
  }

  updateUser(newUser: User) {

    fetch("http://127.0.0.1:8000/user", {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        ...newUser
      })
    }).then(async data => {

      let res = await data.json();

      console.log('updated successfully');


      let index = this.users.findIndex(el => el.Id == newUser.Id);

      this.users[index] = newUser;

      this.emitUser();

    }).catch(err => {

      console.warn("errrooooor");
    });

  }

  deleteUser(Id: String) {

    fetch("http://127.0.0.1:8000/user/" + Id, {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      },

    }).then(async data => {

      let index = this.users.findIndex(el => el.Id == Id);

      console.log(index);

      this.users.splice(index, 1);

      console.log(this.users);


      if (Id == this.openedUser.Id) {
        this.setOpenedUser(null);
      }
      this.userCount--;
      this.emitUserCount();

      this.emitUser();
    }).catch(err => {

      console.warn("errrooooor");
    });


  }

  async countUser() {

    if (this.userCount == 0) {
      let res = await fetch("http://127.0.0.1:8000/user/count", {
        method: "GET",
        headers: {
          "content-type": "application/json"
        },

      });

      res = await res.json();

      this.userCount = res['user_count'];
      this.emitUserCount();

      return res['user_count'];
    } else {
      return this.userCount;
    }

  }
}
