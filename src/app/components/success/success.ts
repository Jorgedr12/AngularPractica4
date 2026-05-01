import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { User } from '../../models/user';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './success.html',
})
export class Success implements OnInit {
  user: User | null = null;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.user = this.auth.getSession();
  }
}