import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../../services/product/auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  codeSent: boolean = false;
  codeChecker: string = '';

  // Mock method to send verification code

  constructor(private authService: AuthService, private router: Router) {
  }

  onSendCode() {
    if (this.email) {
      const randomInt = Math.floor(Math.random() * 1000000);
      const code = randomInt.toString();
      this.authService.sendCodeToEmail(this.email, code).subscribe();
      this.codeChecker = code;
      this.codeSent = true;
    }
  }

  // Mock method to verify code and reset password
  onVerifyCode() {
    if (this.verificationCode && this.newPassword) {

      if (this.verificationCode === this.codeChecker) {
        this.authService.forgotPassword(this.email, this.newPassword).subscribe();
        alert(`Password has been reset successfully for ${this.email}`);
        this.router.navigate(['/login']);
      } else {
        alert('Verification code is incorrect');

      }

    }
  }
}
