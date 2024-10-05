import {Component, Input} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ProductService} from "../../../../services/product/product.service";
import {AppComponent} from "../../../app.component";
import {AuthService} from "../../../../services/product/auth.service";

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
  isAdmin: boolean | undefined = false;


  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    console.log('isAdmin:', this.isAdmin);
  }


  getStars(rating: number): string {
    const filledStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return filledStars + emptyStars;
  }

  getLink(filename: any): string {
    let fileUrl = '';

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

  deleteProduct(productId: number): void {
    this.authService.deleteProduct(productId).subscribe({
      next: (response) => {
        window.location.reload();
      },
      error: (err) => {
        console.error('Failed to delete product:', err);
        alert('Error deleting product. Please try again later.');
      }
    });
  }


}
