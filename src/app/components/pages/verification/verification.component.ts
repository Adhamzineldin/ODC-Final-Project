import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../../services/product/auth.service";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
  imports: [
    FormsModule
  ],
  standalone: true
})
export class VerificationComponent {
  email: string = '';
  verificationCode: string = '';
  code: string = '';

   constructor(private authService: AuthService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.email = navigation.extras.state['email'];
      this.code = navigation.extras.state['code'];
    }
  }

   onVerify() {
    if (this.verificationCode === this.code) {
      this.authService.verifyEmail(this.email).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.router.navigate(['/login']);
          }
        },
        (error) => {
          console.log('Error verifying email', error);
        }
      );
    }
    else {
      console.log('Invalid verification code');
    }
  }


  resentCode() {
     const newCode = (Math.random() * 1000000).toString();
    this.authService.sendCodeToEmail(this.email, newCode);

  }
}
