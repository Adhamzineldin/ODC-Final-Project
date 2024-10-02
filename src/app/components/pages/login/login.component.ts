import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AppComponent} from "../../../app.component";

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

  constructor() {}

    protected readonly AppComponent = AppComponent;
}
