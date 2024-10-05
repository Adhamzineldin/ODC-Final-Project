import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../../services/product/auth.service";
import {DatePipe, NgForOf} from "@angular/common";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {AppComponent} from "../../../app.component";
import {response} from "express";
import {ActivatedRoute, RouterLink} from "@angular/router";

interface OrderData {
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  products: { name: string; price: number; quantity: number; imageUrl: string, productId:Number }[]; // Updated for product display
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [NgForOf, DatePipe, RouterLink],
  standalone: true
})
export class OrderComponent implements OnInit {
  orderData: OrderData = {
    orderNumber: '',
    orderDate: '',
    orderStatus: '',
    products: []
  };

  totalPrice: number = 0;

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
     this.route.params.subscribe(params => {
      const orderNumber = params['orderNumber']; // Change 'orderNumber' to the actual parameter name
      this.loadOrderDetails(orderNumber); // Fetch order details based on the order number
    });
  }

  // Load order details based on the order number
  loadOrderDetails(orderNumber: string) {
    this.authService.getOrderDetails(orderNumber).subscribe(
      (response) => {
        const order = response.order;

        if (order) {
          this.orderData.orderNumber = order.orderNumber;
          this.orderData.orderDate = order.createdAt;
          this.orderData.orderStatus = order.status;

          if (Array.isArray(order.products) && order.products.length > 0) {
            const productRequests = order.products.map((item: { product: number; quantity: number }) => {
              return this.authService.getProductDetails(item.product).toPromise()
                .then(product => (
                  {
                  name: product.title,
                  price: product.price,
                  quantity: item.quantity,
                    productId: product.productId,
                  imageUrl: this.getLink(product.images) // Add product image URL
                }));
            });

            Promise.all(productRequests).then(products => {
              this.orderData.products = products;
              this.calculateTotalPrice();
            }).catch(error => {
              console.error('Error fetching product details:', error);
            });
          } else {
            console.error('Products array is empty or not an array:', order.products);
          }
        } else {
          console.error('No order found in the response.');
        }
      },
      (error) => {
        console.error('Error loading order details:', error);
      }
    );
  }

  // Calculate total price of all products in the order
  calculateTotalPrice() {
    this.totalPrice = this.orderData.products.reduce((total, product) => total + (product.price * product.quantity), 0);
  }

  downloadReceipt(): void {
    const receiptContent = `
      Order Number: ${this.orderData.orderNumber}
      Date Ordered: ${this.orderData.orderDate}
      Status: ${this.orderData.orderStatus}

      Products:
      ${this.orderData.products.map(product => `${product.name} - $${product.price.toFixed(2)} x ${product.quantity}`).join('\n')}

      Total Price: $${this.totalPrice.toFixed(2)}
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Receipt_${this.orderData.orderNumber}.txt`;
    link.click();
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





}
