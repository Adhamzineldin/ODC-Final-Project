import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../../services/product/auth.service";
import { CurrencyPipe, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { Cart } from "../../../../services/models/userModel";
import { Product } from "../../../../services/models/productModel";
import {AppComponent} from "../../../app.component";
import {RouterLink} from "@angular/router"; // Assuming a Product model is defined

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [
    CurrencyPipe,
    NgIf,
    NgForOf,
    NgOptimizedImage,
    RouterLink
  ],
  standalone: true
})
export class CartComponent implements OnInit {
  cartItems: { product: Product, quantity: number }[] = [];
  totalPrice: number = 0;
  private router: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadCartItems();
  }

  // Load cart items from the backend and fetch product details
  loadCartItems() {
    this.authService.getCart().subscribe(
      (response: { message: string, cart: { product: number, quantity: number }[] }) => {
        const cartResponse = response.cart; // Access the cart array

        // For each cart item, fetch the product details
        cartResponse.forEach(cartItem => {
          this.authService.getProductDetails(cartItem.product).subscribe(
            (product: Product) => {
              // Add the product and its quantity to the cartItems array
              this.cartItems.push({ product, quantity: cartItem.quantity });
              this.calculateTotalPrice(); // Recalculate total price after adding each item
            },
            (error) => {
              console.error(`Error loading product details for productId ${cartItem.product}:`, error);
            }
          );
        });
      },
      (error) => {
        console.error('Error loading cart items:', error);
      }
    );
  }

  // Increase quantity of a product
  increaseQuantity(cartItem: { product: Product, quantity: number }) {
    // Check if the product stock is greater than the current quantity
    if (cartItem.quantity < cartItem.product.stock) {
        cartItem.quantity += 1; // Increase quantity if stock allows
        this.updateCart(); // Update the cart
        this.calculateTotalPrice(); // Recalculate total price
    } else {
        alert(`Cannot increase quantity. Only ${cartItem.product.stock} left in stock.`);

    }
}

  // Decrease quantity of a product
  decreaseQuantity(cartItem: { product: Product, quantity: number }) {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      this.updateCart();
      this.calculateTotalPrice();
    }
  }

  // Remove a product from the cart
  removeProduct(cartItem: { product: Product, quantity: number }) {
    this.cartItems = this.cartItems.filter(item => item !== cartItem);
    this.updateCart();
    this.calculateTotalPrice();
  }

  // Calculate total price of all products
  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce(
      (total, cartItem) => total + (cartItem.product.price * cartItem.quantity || 0), // Ensure price is available
      0
    );
  }

  updateCart() {
  const updatedCart = this.cartItems.map(cartItem => ({
    productId: cartItem.product.productId,
    quantity: cartItem.quantity
  }));

  this.authService.updateUserCart(updatedCart).subscribe(
    (response) => {
      console.log('Cart updated successfully:', response);
    },
    (error) => {
      console.error('Error updating cart:', error);
    }
  );
}


  getLink(filename: any): string {
  let fileUrl = '';
  filename = filename[0];
  // Check if filename is defined and a string
  if (typeof filename === 'string' && filename.length > 0) {
    if (filename.startsWith('/')) {
      fileUrl = `${AppComponent.api}/images${filename}`;  // Ensure no double slashes
    } else {
      fileUrl = filename;  // Use the external URL directly
    }
  } else {
    console.warn('Invalid filename provided:', filename); // Log if filename is invalid
  }
  return fileUrl;
 }



 checkout() {
    const userId = this.authService.getCurrentUser()?.userId; // Get the current user's ID

    // Structure the order based on the cartItems
    const newOrder = {
        products: this.cartItems.map(item => ({
            product: item.product.productId, // Product ID from the item
            quantity: item.quantity // Quantity from the item
        })),
        total: this.totalPrice, // Calculate total
        status: 'pending', // Set initial status
    };

    if (userId) {
        // Create an order and update the user's orders array
        this.authService.updateOrder(userId, newOrder ).subscribe({
            next: (response) => {
                console.log(response.message); // Handle successful response
                this.clearCart(); // Clear the cart after checkout
                this.updateCart();
                this.router.navigate(['/profile']); // Navigate to order view
            },
            error: (error) => {
                console.error('Failed to update order:', error); // Handle error response
            }
        });
    } else {
        console.error('User not logged in'); // Handle case when user is not logged in
    }
}

  // Method to clear the cart
  clearCart() {
    this.cartItems = []; // Clear the cart items
    this.totalPrice = 0; // Reset total price
  }















}
