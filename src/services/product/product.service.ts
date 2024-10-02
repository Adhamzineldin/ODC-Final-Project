import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AppComponent} from "../../app/app.component"; // Adjust the path as necessary



import {Product, CategoryResponse, Review} from '../models/productModel';
@Injectable({
  providedIn: 'root'
})


export class ProductService {
  private apiUrl = AppComponent.api; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Method to get all categories
  getCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/products/categories`);
  }

  // Method to get products by category
  getProductsByCategory(categoryName: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/categories/${categoryName}`);
  }

  fetchProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/product/${productId}`);
  }

  addReview(productId: string | undefined, review: {
    reviewerName: string;
    reviewerEmail: string;
    rating: number;
    comment: string
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${productId}/reviews`, review);
  }




}
