import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthApiService } from '../../../services/auth-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    username: '',
    password: ''
  });

  login(): void {

    this.errorMessage = '';
    this.loading = true;

    this.authApi.login(this.form.getRawValue())
      .subscribe({
        next: response => {

          localStorage.setItem(
            'access_token',
            response.accessToken
          );

          localStorage.setItem(
            'user',
            JSON.stringify(response.user)
          );

          this.router.navigate(['/dashboard']);
        },

        error: () => {
          this.errorMessage =
            'Usuario o contraseña incorrectos';
        },

        complete: () => {
          this.loading = false;
        }
      });
  }
}
