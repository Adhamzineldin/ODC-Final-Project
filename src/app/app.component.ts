import {Component, Inject, OnInit} from '@angular/core';
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
import {DOCUMENT} from "@angular/common";

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
  usedDomain: string = 'maayn.ddns.net';
  backendPort = '3000';
  frontendPort = '4200';

  ipAddress: string = ' ';


  constructor(@Inject(DOCUMENT) private document: Document, private authService: AuthService) {
    console.log('AppComponent initialized. Current user:', authService.getCurrentUser());
    this.setBaseHref();

  }

  private setBaseHref(): void {
    const base = this.document.querySelector('base');
    this.domain = window.location.hostname;
    if (base) {
      if (this.domain !== "localhost") {
        base.setAttribute('href', `/app${this.frontendPort}/`);
      }
    }
  }


  ngOnInit(): void {
    // Get the domain
    this.domain = window.location.hostname;
    if (this.domain === "localhost") {
      AppComponent.api = `http://localhost:${this.backendPort}/api`;
    } else {
      AppComponent.api = `https://${this.domain}/app${this.backendPort}/api`;
    }
    console.log('Current domain:', this.domain);
  }


  static getsUser() {

    return JSON.parse(localStorage.getItem('user') || 'null');

  }


}
