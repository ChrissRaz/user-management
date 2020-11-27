import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnDestroy {

  IdUser: String | null = null;

  userForm = this.fb.group({
    nom: [null, Validators.required],
    prenom: [null, Validators.required],
    mail: [null, Validators.email]
  });

  userOUServiceSubscription: Subscription;

  constructor(private fb: FormBuilder, private userService: UserService) {

    this.userOUServiceSubscription = this.userService.openedUserSubject.subscribe(
      (user: User) => {

        if (user) {
          this.IdUser = user.Id;

          this.userForm.setValue({
            nom: user.nom,
            prenom: user.prenom,
            mail: user.mail
          })
        } else {
          this.shitchAddMode();
        }

      }
    )
  }

  onSubmit() {

    const newUser: User = {
      ...this.userForm.value,
      Id: ""
    };

    // console.log(newUser);

    if (this.isUpdating) {
      newUser.Id = this.IdUser;
      this.userService.updateUser(newUser);
    } else {
      this.userService.addUser(newUser);

    }
  }

  ngOnDestroy() {
    this.userOUServiceSubscription.unsubscribe();
  }


  shitchAddMode() {
    this.userForm = this.fb.group({
      nom: [null, Validators.required],
      prenom: [null, Validators.required],
      mail: [null, Validators.email]
    });
    this.IdUser = null;
  }

  get isUpdating() {
    return !(this.IdUser?.trim() == '' || this.IdUser == null);
  }



}
