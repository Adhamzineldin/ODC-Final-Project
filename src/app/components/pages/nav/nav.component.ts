import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {AppComponent} from "../../../app.component";
import {User} from "../../../../services/models/userModel";
import {AuthService} from "../../../../services/product/auth.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  user: User | null;

  constructor(private authService: AuthService) {
    this.user = authService.getCurrentUser();
  }
  getNavName() {
    if (this.authService.isLoggedIn()) {
      return this.authService.getCurrentUser()?.firstName;
    } else {
      return 'Login';
    }
  }

  getAccountRoute() {
    if (this.authService.isLoggedIn()) {
      return '/account';
    } else {
      return '/login';
    }
  }




}
