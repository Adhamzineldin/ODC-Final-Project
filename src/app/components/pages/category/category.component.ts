import { Component, Input } from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ProductService} from "../../../../services/product/product.service";
import {AppComponent} from "../../../app.component";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  @Input() categoryTitle: string = '';
  @Input() products: any[] = [];
  imageUrl: SafeUrl | undefined;

  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer
  ) {}



   getStars(rating: number): string {
    const filledStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return filledStars + emptyStars;
  }

  getLink(filename: any): string {
    let fileUrl = '';
    if (filename.startsWith('/')) {
        fileUrl = `${AppComponent.api}/images${filename}`;  // Adjusted the path to avoid double slashes
      } else {
        fileUrl = filename;  // Use the external URL directly
      }
    return fileUrl;
  }



}
