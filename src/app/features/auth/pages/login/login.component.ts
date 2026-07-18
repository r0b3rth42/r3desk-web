import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/auth/auth.service';


@Component({
 selector:'app-login',
 standalone:true,
 templateUrl:'./login.component.html',
 styleUrl:'./login.component.css'
})
export class LoginComponent {


private authService = inject(AuthService);


login(){

 this.authService.login();

}

}