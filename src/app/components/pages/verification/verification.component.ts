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
  state: string = '';

   constructor(private authService: AuthService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.email = navigation.extras.state['email'];
      this.code = navigation.extras.state['code'];
      this.code = Math.floor(Number(this.code)).toString();
    }
  }

   onVerify() {
     console.log('Verification code:', this.code);
    if (this.verificationCode === this.code) {
      this.authService.verifyEmail(this.email).subscribe(
        (response) => {
        this.router.navigate(['/login']);
        }
      );
    }
    else {
      this.state = ('Invalid verification code');
    }
  }


  resentCode() {
     const randomInt = Math.floor(Math.random() * 1000000);
        const newCode = randomInt.toString();
        this.code = newCode;
         this.state = 'Sent new code to email';
    this.authService.sendCodeToEmail(this.email, newCode).subscribe();

  }

}
