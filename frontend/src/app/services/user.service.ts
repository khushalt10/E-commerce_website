import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BehaviorSubject } from "rxjs";
import { SocialAuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from "angularx-social-login";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  auth: boolean = false;
  private SERVER_URL: string = environment.SERVER_URL;
  private user;
  authState$ = new BehaviorSubject<boolean>(this.auth);
  userData$ = new BehaviorSubject<SocialUser | ResponseModel>(null);


  constructor(private authService: SocialAuthService,
    private httpClient: HttpClient) {

      authService.authState.subscribe((user: SocialUser) => {
        if(user != null) {
          this.auth = true;
          this.authState$.next(this.auth);
          this.userData$.next(user);
        }
      });
  }
  //LOGIN USING EMAIL AND PASSWORD
  loginUser(email: string, password:string) {
    this.httpClient.post(`${this.SERVER_URL}/auth/login`,{email,password})
    .subscribe((data: ResponseModel) => {
      this.auth = data.auth;
      this.authState$.next(this.auth);
      this.userData$.next(data);
    });
  }

  //GOOGLE LOGIN
  googleLogin() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logout() {
    this.authService.signOut();
    this.auth = false;
    this.authState$.next(this.auth);
  }
}

export interface ResponseModel {
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
}
