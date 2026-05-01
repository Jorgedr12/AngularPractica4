import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export function passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const password = group.get('password')?.value;
        const confirm = group.get('confirmPassword')?.value;
        if (password && confirm && password !== confirm) {
            return { passwordMismatch: true };
        }
        return null;
    };
}

export function minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        const birth = new Date(control.value);
        const limit = new Date();
        limit.setFullYear(limit.getFullYear() - minAge);
        if (birth > limit) {
            return { tooYoung: true };
        }
        return null;
    };
}

export function emailTakenValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const data = localStorage.getItem('users');
        const users: { email: string }[] = data ? JSON.parse(data) : [];
        const taken = users.some(u => u.email === control.value);
        if (taken) {
            return of({ emailTaken: true }).pipe(delay(500));
        }
        return of(null).pipe(delay(500));
    };
}