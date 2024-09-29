import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [
    FormsModule
  ],
  standalone: true
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';

  constructor() {}


}
