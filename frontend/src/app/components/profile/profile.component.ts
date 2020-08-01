import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { ResponseModel, UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  myUser: any;

  constructor(private authService: SocialAuthService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.userService.userData$
      .pipe(
        map((user: ResponseModel | SocialUser) => {
          if(user instanceof SocialUser) {
            return {
              ...user,
                email: 'test@test.com'
            };
          }else {
            return user;
          }
        })
      ).subscribe((data: ResponseModel | SocialUser) => {
        this.myUser = data;
      })
  }

  logout() {
    this.userService.logout();
  }

}
