import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavComponent} from "./components/nav/nav.component";
import {SingleProductComponent} from "./components/pages/single-product/single-product.component";
import {HomeComponent} from "./components/pages/home/home.component";
import {CategoryComponent} from "./components/pages/category/category.component";
import {LoginComponent} from "./components/account/login/login.component";
import {ProfileComponent} from "./components/account/profile/profile.component";
import {SignupComponent} from "./components/account/signup/signup.component";
import {VerificationComponent} from "./components/account/verification/verification.component";
import {AuthService} from "../services/product/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NavComponent,
    SingleProductComponent,
    HomeComponent,
    CategoryComponent,
    LoginComponent,
    ProfileComponent,
    SignupComponent,
    VerificationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Corrected typo
})
export class AppComponent implements OnInit {
  static title = 'amazon-clone';
  static api = 'http://localhost:3000/api';
  static email = 'mohalya3@gmail.com';
  static emailPassword = 'uike gqor nymo nmdb';
  domain: string = '';
  ipAddress: string = ' ';


  constructor(private authService: AuthService) {
    console.log('AppComponent initialized. Current user:', authService.getCurrentUser());

  }

  ngOnInit(): void {
    // Get the domain
    this.domain = window.location.hostname;
    AppComponent.api = `http://${this.domain}:3000/api`;
    console.log('Current domain:', this.domain);
  }


  static getsUser() {

    return JSON.parse(localStorage.getItem('user') || 'null');

  }


}
