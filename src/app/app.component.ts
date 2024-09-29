import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavComponent} from "./components/pages/nav/nav.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FinalProject';
}
