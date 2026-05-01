import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  passwordMatchValidator,
  minimumAgeValidator,
  emailTakenValidator
} from '../../validators/validator';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private router: Router, private auth: Auth) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      email: ['', [Validators.required, Validators.email], [emailTakenValidator()]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', Validators.required],
      birthDate: ['', [Validators.required, minimumAgeValidator(18)]],
      terminos: [false, Validators.requiredTrue],
    }, { validators: passwordMatchValidator() });
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
  get birthDate() { return this.form.get('birthDate'); }
  get terminos() { return this.form.get('terminos'); }
  get passwordMismatch() { return this.form.errors?.['passwordMismatch']; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    
    setTimeout(() => {
      this.loading = false;
      const savedUser = this.auth.register({
        id: Date.now(),
        name: this.name?.value ?? '',
        email: this.email?.value ?? '',
        password: this.password?.value ?? ''
      });

      if (savedUser) {
        this.auth.setSession({
          id: Date.now(),
          name: this.name?.value ?? '',
          email: this.email?.value ?? '',
          password: this.password?.value ?? ''
        });
        this.form.reset();
        this.router.navigate(['/success']);
      } else {
        alert('Registration failed. Please try again.');
      }
    }, 1000);
  }
}
