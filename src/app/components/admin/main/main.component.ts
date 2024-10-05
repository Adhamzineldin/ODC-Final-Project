import { Component, OnInit } from '@angular/core';
import { Product } from "../../../../services/models/productModel";
import { AuthService } from "../../../../services/product/auth.service";
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {AppComponent} from "../../../app.component";

@Component({
  selector: 'app-admin',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [
    NgIf,
    FormsModule,
    NgForOf
  ],
  standalone: true
})
export class MainComponent implements OnInit {
  selectedTab: string = 'addProduct'; // Default tab
  newProduct: Product = {
    availabilityStatus: "",
    brand: "",
    category: "",
    price: 0,
    productId: 0,
    rating: 0,
    sku: "",
    stock: 0,
    title: "",
    images: [] // Initialize images array
  };
  products: Product[] = [];
  users: any[] = [];
  imagePreviews: string[] = []; // Array to hold image previews

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadUsers();
  }

  loadProducts(): void {
    this.authService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        alert('Error loading products. Please try again later.');
      }
    });
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        alert('Error loading users. Please try again later.');
      }
    });
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      this.imagePreviews = []; // Clear existing previews

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });

      this.newProduct.images = files.map(file => file.name); // Store image names (or implement logic to store the full file)
    }
  }



  addProduct(): void {
    this.authService.addProduct(this.newProduct).subscribe({
      next: (response) => {
        alert('Product added successfully');
        this.loadProducts(); // Reload products after addition
        this.resetNewProduct(); // Reset new product data
      },
      error: (err) => {
        console.error('Failed to add product:', err);
        alert('Error adding product. Please try again later.');
      }
    });
  }

  deleteProduct(productId: number): void {
    this.authService.deleteProduct(productId).subscribe({
      next: (response) => {
        alert('Product deleted successfully');
        this.loadProducts(); // Reload products after deletion
      },
      error: (err) => {
        console.error('Failed to delete product:', err);
        alert('Error deleting product. Please try again later.');
      }
    });
  }

  deactivateUser(userId: string): void {
    this.authService.deactivateUser(userId).subscribe({
      next: (response) => {
        alert('User deactivated successfully');
        this.loadUsers(); // Reload users after deactivation
      },
      error: (err) => {
        console.error('Failed to deactivate user:', err);
        alert('Error deactivating user. Please try again later.');
      }
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab; // Change selected tab
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


  private resetNewProduct(): void {
    this.newProduct = {
      availabilityStatus: "",
      brand: "",
      category: "",
      price: 0,
      productId: 0,
      rating: 0,
      sku: "",
      stock: 0,
      title: "",
      images: []
    };
    this.imagePreviews = []; // Clear image previews
  }
}
