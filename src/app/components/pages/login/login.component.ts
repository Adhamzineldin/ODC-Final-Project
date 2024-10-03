import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../../app.component';
 // Adjust the path as necessary
import { Router } from '@angular/router';
import {AuthService} from "../../../../services/product/auth.service"; // To navigate after login

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule
  ],
  standalone: true
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Method to handle form submission
   onSubmit() {
    // Call the auth service to log in the user
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.message === "Login successful") {
          console.log('Login successful:', response);
          this.router.navigate(['/']).then();
           window.location.href = '/';
        }
        else {
          alert('Login failed. Please try again.');
        }
      },
      error: (error) => {
        alert('Login failed user name or password is incorrect' );
        // Handle login error (e.g., show an error message)
      }
    });
  }

  protected readonly AppComponent = AppComponent;
}
