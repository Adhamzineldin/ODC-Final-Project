import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../services/product/auth.service";
import {CurrencyPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Cart} from "../../../../services/models/userModel";
import {Product} from "../../../../services/models/productModel";
import {AppComponent} from "../../../app.component";
import {Router, RouterLink} from "@angular/router"; // Assuming a Product model is defined

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

  constructor(private authService: AuthService, private router: Router) {
  }

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
              this.cartItems.push({product, quantity: cartItem.quantity});
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

  getProductImageUrl(product: Product): string {
    return this.getLink(product.images); // Use the getLink function for generating the image URL
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
      this.authService.updateOrder(userId, newOrder).subscribe({
        next: async (response) => {
          console.log(response.message); // Handle successful response
          this.clearCart(); // Clear the cart after checkout

          // Generate email content after the order has been created
          const emailContent = this.generateEmailContent(newOrder, response.orderNumber);
          console.log('Email content:', emailContent);
          // Assuming response contains orderNumber
          this.authService.sendEmail(userId, await emailContent).subscribe(
            (emailResponse) => {
              console.log('Email sent successfully:', emailResponse);
            },
            (emailError) => {
              console.error('Failed to send email:', emailError);
            }
          );

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


  async generateEmailContent(orderData: any, orderNumber: string): Promise<string> {
    const orderDate = orderData.orderDate ? new Date(orderData.orderDate).toLocaleDateString() : new Date().toLocaleString();
    const orderStatus = orderData.orderStatus || 'Pending';
    const total = orderData.total ? orderData.total.toFixed(2) : '0.00';

    let productsHtml = '';

    console.log('orderData', orderData);

    // Fetch product details for each product in the order
    if (Array.isArray(orderData.products) && orderData.products.length > 0) {
      const productPromises = orderData.products.map(async (product: any) => {
        try {
          console.log('product', product);
          // Fetching product details using AuthService and converting observable to promise
          const productDetails = await this.authService.getProductDetails(product.product).toPromise(); // Get JSON response

          if (productDetails) {
            return `
                        <li class="product-item" style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #e0e0e0;">
                            <img src="${this.getLink(productDetails.images)}" alt="${productDetails.title}" class="product-image"
                                style="width: 100px; height: 100px; margin-right: 10px;"/>
                            <span>${productDetails.title}</span>
                            <span style="margin-left: 10px;">Quantity: ${product.quantity}</span>
                            <span style="margin-left: 10px;">$${(productDetails.price * product.quantity).toFixed(2)}</span>
                        </li>`;
          } else {
            return `<li class="product-item">Product details not found.</li>`;
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
          return `<li class="product-item">Error retrieving product details.</li>`;
        }
      });

      // Wait for all product details to be fetched
      const productsDetailsHtml = await Promise.all(productPromises);
      productsHtml = productsDetailsHtml.join('');
    }

    return `
        <div class="order-container" style="max-width: 800px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); font-family: 'Arial', sans-serif;">
            <h2 style="text-align: center; color: #333;">Order Details</h2>
            <div class="order-info" style="margin-bottom: 20px;">
                <p style="font-size: 1rem; color: #555;"><strong>Date Ordered:</strong> <span>${orderDate}</span></p>
                <p style="font-size: 1rem; color: #555;"><strong>Status:</strong> <span>${orderStatus}</span></p>
            </div>
            <div class="products-section" style="margin-bottom: 20px;">
                <h3 style="text-align: center; color: #333;">Products</h3>
                <ul style="list-style-type: none; padding: 0;">
                    ${productsHtml}
                </ul>
                <p class="total-price" style="font-size: 1.2rem; font-weight: bold; text-align: right; color: #333;">
                    <strong>Total Price:</strong> $${total}
                </p>
            </div>
            <button class="download-btn" style="display: block; width: 100%; padding: 12px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; transition: background-color 0.3s;">End Of Receipt</button>
        </div>`;
  }


  // Method to clear the cart
  clearCart() {
    this.cartItems = []; // Reset cart items
    this.updateCart();
  }
}
