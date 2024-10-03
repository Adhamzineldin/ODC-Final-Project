import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product/product.service';
import { NavComponent } from "../nav/nav.component";
import { CategoryComponent } from "../category/category.component";
import { RouterOutlet } from "@angular/router";
import { NgForOf } from "@angular/common";
import { AppComponent } from "../../../app.component";
import { AuthService } from "../../../../services/product/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    NavComponent,
    CategoryComponent,
    RouterOutlet,
    NgForOf
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: any[] = []; // Holds categories
  productsByCategory: { [key: string]: any[] } = {}; // Holds products for each category

  constructor(private productService: ProductService, private authService: AuthService) {
    authService.setUser(authService.getCurrentUser());
  }

  ngOnInit() {
    this.loadCategories(); // Load categories when the component initializes
  }

  // Function to load categories from the service
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

  // Function to get products by category and cache the results
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
}
