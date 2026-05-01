import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private defaultUsers: User[] = [
    {
      id: 1,
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
    },
  ];

  saveUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
    }

  getUsers(): User[] {
    const data = localStorage.getItem('users');

    if(data === null) {
      this.saveUsers(this.defaultUsers);
      return this.defaultUsers;
    }

    return JSON.parse(data) as User[];

  }

  getSession(): User | null {
    const data = localStorage.getItem('currentUser');
    if (data) {
      return JSON.parse(data) as User;
    }
    return null;
  }

  setSession(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  clearSession(): void {
    localStorage.removeItem('currentUser');
  }

  register(user: User): boolean {
    const users = this.getUsers();
    const exists = users.some((u) => u.email === user.email);
    if (exists) {
      throw new Error('User already exists');
    }
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  }
}
