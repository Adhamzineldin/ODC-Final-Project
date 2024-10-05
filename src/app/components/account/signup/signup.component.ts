import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from "../../../../services/product/auth.service";
import {User} from "../../../../services/models/userModel";
import {FormsModule} from "@angular/forms";
import {AppComponent} from "../../../app.component";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
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
    } else if (this.password.length < 7) {
      alert('Password must be at least 7 characters long!');
      return;
    }

    const userData: User = {
      userId: 0,
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: new Date(),
      isActive: true,
      isVerified: false,
      roles: ['user'],
      cart: [],
      orders: [],
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        const randomInt = Math.floor(Math.random() * 1000000);
        const code = randomInt.toString();
        this.authService.sendCodeToEmail(this.email, code).subscribe();
        // Redirect to verification route after successful registration
        this.router.navigate(['/verification'], {state: {email: this.email, code}});
      },
      error: (error) => {
        console.error('Error registering user:', error);
        alert('Registration failed! ' + error.message);
      }
    });
  }


  protected readonly AppComponent = AppComponent;
}
