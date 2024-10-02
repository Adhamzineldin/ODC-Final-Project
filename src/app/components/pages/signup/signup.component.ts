import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../../../services/product/auth.service";
import {User} from "../../../../services/models/userModel";
import {FormsModule} from "@angular/forms";
import {AppComponent} from "../../../app.component";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';


  constructor(private authService: AuthService, private router: Router) {
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userData: User = {
      id: 0,
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: new Date(),
      isActive: true,
      roles: ['user']
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        const code = (Math.random() * 1000000).toString();
        this.authService.sendCodeToEmail(this.email, code)
        // Redirect to verification route after successful registration
        this.router.navigate(['/verification'], {state: {email: this.email, code}});
      },
      error: (error) => {
        console.error('Error registering user:', error);
        alert('Registration failed! Please try again.');
      }
    });
  }


  protected readonly AppComponent = AppComponent;
}
