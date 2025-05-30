import {Component, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {AppComponent} from "../../app.component";
import {User} from "../../../services/models/userModel";
import {AuthService} from "../../../services/product/auth.service";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    NgIf
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  user = JSON.parse(localStorage.getItem('user') || 'null');
  isAdmin: any;

  constructor(private router: Router) {
  }

  ngOnInit() {
    if (this.getIsLoggedIn()) {
      this.isAdmin = this.user.roles.includes('admin');
    }
  }


  getNavName() {
    if (this.getIsLoggedIn()) {
      return this.user.firstName + ' ' + this.user.lastName;
    }
    return 'Login';

  }

  getIsLoggedIn() {
    return this.user && this.user.isVerified;
  }

  signOut() {
    localStorage.removeItem('user');
    this.user = null;
    window.location.href = '/';


  }

  getAccountRoute() {
    if (this.getIsLoggedIn()) {
      return '/profile';
    } else {
      return '/login';
    }

  }


}
