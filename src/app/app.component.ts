import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavComponent } from "./components/pages/nav/nav.component";
import { SingleProductComponent } from "./components/pages/single-product/single-product.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { CategoryComponent } from "./components/pages/category/category.component";
import { LoginComponent } from "./components/pages/login/login.component";
import { ProfileComponent } from "./components/pages/profile/profile.component";
import { SignupComponent } from "./components/pages/signup/signup.component";
import {VerificationComponent} from "./components/pages/verification/verification.component";

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
export class AppComponent {
  static title = 'amazon-clone';
  static api = 'http://localhost:3000/api';
  static email = 'mohalya3@gmail.com';
  static emailPassword = 'uike gqor nymo nmdb';


}
