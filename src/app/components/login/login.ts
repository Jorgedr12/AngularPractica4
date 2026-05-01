import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword: any;

  constructor(private fb: FormBuilder, private router: Router, private auth: Auth) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.error = '';
    this.loading = true;

    const user = this.auth.login(this.email?.value, this.password?.value);


    if (!user) {
      this.loading = false;
      this.error = 'Invalid email or password';
      return;
    }

    setTimeout(() => {
      this.loading = false;

      this.auth.setSession(user);
      this.router.navigate(['/success']);
    }, 1500);
  }
}
