import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/product/auth.service';
import { Order, User } from '../../../../services/models/userModel';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CurrencyPipe, DatePipe, NgForOf, NgIf, NgStyle } from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    NgForOf,
    NgIf,
    NgStyle,
    ReactiveFormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  orders: Order[] = [];
  changePasswordForm: FormGroup;
  state: string = '';
  color: string = 'green';  // Default color
  selectedTab: string = 'orders'; // Default tab

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(7)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadOrders();
  }

  loadUserProfile() {
    this.user = this.authService.getCurrentUser();
  }

  loadOrders() {
  if (this.user) {
    this.authService.getOrders(this.user.userId).subscribe({
      next: (orders) => {
        console.log('Orders:', orders);
        // Reverse the orders array before assigning it to this.orders
        this.orders = orders.orders.reverse(); // Reversing the array
      },
      error: () => {
        console.error('An error occurred while loading orders');
      }
    });
  }
}


  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  onChangePassword() {
    if (this.changePasswordForm.invalid) {
      this.setState('Please fill in all fields correctly', 'red');
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.setState('Passwords do not match', 'red');
      return;
    }

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: (response) => {
        if (response.message === 'Password updated successfully') {
          this.setState('Password updated successfully', 'green');
        } else {
          this.setState(response.message, 'red');
        }
      },
      error: () => {
        this.setState('An error occurred while updating the password.', 'red');
      }
    });
  }

  // Set the state message and corresponding color
  setState(message: string, color: string) {
    console.log(`State: ${message}, Color: ${color}`);
    this.state = message;
    this.color = color;
  }
}
