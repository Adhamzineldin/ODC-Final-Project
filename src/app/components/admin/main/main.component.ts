import { Component, OnInit } from '@angular/core';
import { Product } from "../../../../services/models/productModel";
import { AuthService } from "../../../../services/product/auth.service";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import { FormsModule } from "@angular/forms";
import {AppComponent} from "../../../app.component";
import {CategoryComponent} from "../../pages/category/category.component";
import {ProductService} from "../../../../services/product/product.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    CategoryComponent,
    CurrencyPipe,
    RouterLink
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
  private selectedFiles: any;
  categories: string[] = [];
  productsByCategory: { [key: string]: any[] } = {};


  constructor(private authService: AuthService, private productService:ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
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


  loadCategories() {
    this.productService.getCategories().subscribe(
      (data) => {
        this.categories = data.categories;
        // Optionally load products for all categories on init
        this.categories.forEach(category => this.getProductsByCategory(category));
      },
      (error) => {
        console.error('Error loading categories', error);
      }
    );
  }

  getProductsByCategory(categoryName: string) {
    console.log(`Getting products for category ${categoryName}`);
    if (!this.productsByCategory[categoryName]) { // Check if products are already loaded for this category
      this.productService.getProductsByCategory(categoryName).subscribe(
        (data) => {
          this.productsByCategory[categoryName] = data; // Cache products for the category
        },
        (error) => {
          console.error(`Error loading products for category ${categoryName}`, error);
        }
      );
    }
  }
   getStars(rating: number): string {
    const filledStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return filledStars + emptyStars;
  }




   onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      this.imagePreviews = []; // Clear existing previews
      this.selectedFiles = files; // Store the actual file objects

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });

      // Optionally, store the file names if you need them elsewhere
      this.newProduct.images = files.map(file => file.name);
      console.log(this.newProduct);
    }
  }

  addProduct(): void {
    const formData = new FormData();

    // Append properties while ensuring they are not undefined
    formData.append('title', this.newProduct.title || ''); // Provide a default value if undefined
    formData.append('description', this.newProduct.description || ''); // Provide a default value if undefined
    formData.append('category', this.newProduct.category || ''); // Provide a default value if undefined
    formData.append('price', this.newProduct.price.toString()); // Ensure this is always defined
    formData.append('stock', this.newProduct.stock.toString()); // Ensure this is always defined

    // Append each selected file to FormData
    if (this.selectedFiles) {
        this.selectedFiles.forEach((file: any) => {
            if (file) { // Ensure the file is not undefined
                formData.append('images', file); // Append actual file objects
            }
        });
    }

    this.authService.addProduct(formData).subscribe({
      next: (response) => {
        alert('Product added successfully');
        this.loadProducts();
        this.resetNewProduct();
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
        this.loadProducts(); // Reload products after deletion
      },
      error: (err) => {
        console.error('Failed to delete product:', err);
        alert('Error deleting product. Please try again later.');
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
