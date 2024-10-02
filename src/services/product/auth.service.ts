// auth.service.ts
import {Injectable} from "@angular/core";
import {User} from "../models/userModel";
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import {AppComponent} from "../../app/app.component";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private user: User | null;
    private nodemailer: any
    constructor(private http: HttpClient) {

        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    getCurrentUser() {
        return this.user; // Return user data
    }

    isLoggedIn() {
        return !!this.user; // Return true if user is logged in
    }

    // Method to set user when logged in
    setUser(userData: User | null) {
          this.user = userData;
          localStorage.setItem('user', JSON.stringify(userData)); // Store user data
    }

   register(userData: User): Observable<any> {
      return this.http.post(`${AppComponent.api}/users`, userData);
    }
    verifyEmail(email: string): Observable<any> {
    return this.http.post(`${AppComponent.api}/verify-email`, { email });
  }

  sendCodeToEmail(email: string, code: string): Observable<any> {
    const payload = { email, code };
    return this.http.post(`${AppComponent.api}/email/send-verification-code`, payload);
  }

      // Add other authentication methods as needed
  }
