import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";
import {Review, Product} from "../../../../services/models/productModel";
import {ProductService} from "../../../../services/product/product.service";
import {AppComponent} from "../../../app.component";
import {FormsModule} from "@angular/forms";
import { AuthService } from '../../../../services/product/auth.service';



@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    FormsModule
  ],
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {
  title = 'Single Product';
  ORDERED_KEYS = [
    "title",
    "category",
    "price",
    "rating",
    "description",
    "stock",
    "availabilityStatus",
    "brand",
    "tags",
    "dimensions",
    "warrantyInformation",
    "shippingInformation",
    "returnPolicy"
  ];
   newReview = {
        comment: '',
        rating: 1,
        reviewerName: '',
        reviewerEmail: ''
    };

  product: Product | null = null; // Use the Product model
  errorMessage: string = '';

  constructor(
    private productService: ProductService, // Use the ProductService
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log(this.authService.getCurrentUser());
    this.displayProductDetails();
    const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
            this.newReview.reviewerName = currentUser.firstName + ' ' + currentUser.lastName;
            this.newReview.reviewerEmail = currentUser.email;
        }
  }

  displayProductDetails(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.productService.fetchProduct(productId).subscribe(
          (product) => {
            this.product = product; // Assign the fetched product

            if (product) {
              this.title = product.title;
              const container = this.renderer.selectRootElement('#product-details', true);
              this.renderer.setProperty(container, 'innerHTML', '');

              const backButton = this.createBackButton();
              this.renderer.appendChild(container, backButton);

              const titleElement = this.createTitleElement(product.title);
              this.renderer.appendChild(container, titleElement);

              if (product.images && product.images.length > 0) {
                const imageContainer = this.createImageContainer(product.images);
                this.renderer.appendChild(container, imageContainer);
              }

              const priceRatingContainer = this.createPriceRatingContainer(product);
              this.renderer.appendChild(container, priceRatingContainer);

              if (product.description) {
                const descriptionElement = this.createDescriptionElement(product.description);
                this.renderer.appendChild(container, descriptionElement);
              }
              const addToCartButton = this.renderer.createElement('button');
    this.renderer.addClass(addToCartButton, 'add-to-cart-btn'); // Use your CSS class name
    addToCartButton.textContent = 'Add to Cart';

    // Add click event listener
    this.renderer.listen(addToCartButton, 'click', () => this.addToCart(product.productId));

    // Append the button to the container
    this.renderer.appendChild(container, addToCartButton);

              const detailsGrid = this.createDetailsGrid(product);
              this.renderer.appendChild(container, detailsGrid);

              const reviewForm = this.createReviewForm();
              this.renderer.appendChild(container, reviewForm);

              if (product.reviews && product.reviews.length > 0) {
                const reviewsContainer = this.createReviewsContainer(product.reviews);
                this.renderer.appendChild(container, reviewsContainer);
              }
            } else {

            }
          },
          (error) => {
            console.error('Error fetching product:', error);
            this.displayErrorMessage(this.renderer.selectRootElement('#product-details', true));
          }
        );
      }
    });
  }

  private createBackButton(): HTMLElement {
    const backButton = this.renderer.createElement('button');
    this.renderer.setAttribute(backButton, 'id', 'back-button');
    this.renderer.addClass(backButton, 'btn');
    this.renderer.addClass(backButton, 'btn-primary');
    this.renderer.setProperty(backButton, 'textContent', 'Back');
    this.renderer.listen(backButton, 'click', () => {
      window.history.back();
    });
    return backButton;
  }

  private createTitleElement(title: string): HTMLElement {
    const titleElement = this.renderer.createElement('h1');
    this.renderer.addClass(titleElement, 'product-title');
    this.renderer.setProperty(titleElement, 'textContent', title);
    return titleElement;
  }
   private getLink(filename: any): string {
    let fileUrl = '';
    if (filename.startsWith('/')) {
        fileUrl = `${AppComponent.api}/images${filename}`;  // Adjusted the path to avoid double slashes
      } else {
        fileUrl = filename;  // Use the external URL directly
      }
    return fileUrl;
  }


  private createImageContainer(images: string[]): HTMLElement {
    const imageContainer = this.renderer.createElement('div');
    this.renderer.addClass(imageContainer, 'product-images');
    images.forEach((imageUrl: string) => {
      const imgElement = this.renderer.createElement('img');
      this.renderer.setAttribute(imgElement, 'src', this.getLink(imageUrl));
      this.renderer.setAttribute(imgElement, 'alt', this.product?.title || 'Product Image');
      this.renderer.addClass(imgElement, 'product-image');
      this.renderer.appendChild(imageContainer, imgElement);
    });
    return imageContainer;
  }

  private createPriceRatingContainer(product: Product): HTMLElement {
    const priceRatingContainer = this.renderer.createElement('div');
    this.renderer.addClass(priceRatingContainer, 'product-price-rating');

    const priceElement = this.renderer.createElement('span');
    this.renderer.addClass(priceElement, 'product-price');
    this.renderer.setProperty(priceElement, 'textContent', `E£ ${product.price}`);
    this.renderer.appendChild(priceRatingContainer, priceElement);

    if (product.rating) {
      const ratingContainer = this.renderer.createElement('div');
      this.renderer.addClass(ratingContainer, 'product-rating');

      const ratingText = this.renderer.createElement('strong');
      this.renderer.setProperty(ratingText, 'textContent', `${product.rating}/5`);
      this.renderer.appendChild(ratingContainer, ratingText);

      const starsElement = this.renderer.createElement('span');
      let starsText = '⭐️'.repeat(Math.floor(product.rating)) + '✰'.repeat(5 - Math.floor(product.rating));
      this.renderer.setProperty(starsElement, 'textContent', starsText);
      this.renderer.appendChild(ratingContainer, starsElement);

      this.renderer.appendChild(priceRatingContainer, ratingContainer);
    }

    return priceRatingContainer;
  }

  private createDescriptionElement(description: string): HTMLElement {
    const descriptionElement = this.renderer.createElement('p');
    this.renderer.addClass(descriptionElement, 'product-description');
    this.renderer.setProperty(descriptionElement, 'textContent', description);
    return descriptionElement;
  }

  private createDetailsGrid(product: Product): HTMLElement {
    const detailsGrid = this.renderer.createElement('div');
    this.renderer.addClass(detailsGrid, 'product-details-grid');

    for (const key of this.ORDERED_KEYS) {
      const value = product[key as keyof Product];

      if (value) {
        const detailItem = this.renderer.createElement('div');
        this.renderer.addClass(detailItem, 'product-detail-item');

        const keyElement = this.renderer.createElement('h4');
        this.renderer.setProperty(keyElement, 'textContent', key.charAt(0).toUpperCase() + key.slice(1));
        this.renderer.appendChild(detailItem, keyElement);

        if (key === 'dimensions') {
          const dimensionsList = this.createDimensionsList(value as any);
          this.renderer.appendChild(detailItem, dimensionsList);
        } else {
          const valueElement = this.renderer.createElement('span');
          this.renderer.setProperty(valueElement, 'textContent', value);
          this.renderer.appendChild(detailItem, valueElement);
        }

        this.renderer.appendChild(detailsGrid, detailItem);
      }
    }

    return detailsGrid;
  }

  private createDimensionsList(dimensions: { [key: string]: number }): HTMLElement {
    const dimensionsList = this.renderer.createElement('ul');
    this.renderer.addClass(dimensionsList, 'dimensions-list');

    Object.entries(dimensions).forEach(([dimensionKey, dimensionValue]) => {
      const dimensionItem = this.renderer.createElement('li');
      this.renderer.setProperty(dimensionItem, 'textContent', `${dimensionKey}: ${dimensionValue} cm`);
      this.renderer.appendChild(dimensionsList, dimensionItem);
    });

    return dimensionsList;
  }

  private createReviewsContainer(reviews: Review[]): HTMLElement {

    const reviewsContainer = this.renderer.createElement('div');
     if (reviews && reviews.length > 0) {

      this.renderer.addClass(reviewsContainer, 'reviews-container');

      const reviewsTitle = this.renderer.createElement('h3');
      this.renderer.setProperty(reviewsTitle, 'textContent', 'Customer Reviews');
      this.renderer.appendChild(reviewsContainer, reviewsTitle);

      reviews.forEach((review:any) => {
        const reviewItem = this.renderer.createElement('div');
        this.renderer.addClass(reviewItem, 'review-item');

        const reviewerName = this.renderer.createElement('h5');
        this.renderer.setProperty(reviewerName, 'textContent', review.reviewerName || 'Anonymous');
        this.renderer.appendChild(reviewItem, reviewerName);

        const reviewRating = this.renderer.createElement('p');
        this.renderer.setProperty(reviewRating, 'innerHTML', `Rating: ${'⭐'.repeat(review.rating)} (${review.rating}/5)`);
        this.renderer.appendChild(reviewItem, reviewRating);

        const reviewComment = this.renderer.createElement('p');
        this.renderer.setProperty(reviewComment, 'textContent', review.comment);
        this.renderer.appendChild(reviewItem, reviewComment);

        const reviewDate = this.renderer.createElement('p');
        const formattedDate = new Date(review.date).toLocaleDateString();
        this.renderer.setProperty(reviewDate, 'textContent', `Date: ${formattedDate}`);
        this.renderer.appendChild(reviewItem, reviewDate);

        this.renderer.appendChild(reviewsContainer, reviewItem);
      });


    }

      return reviewsContainer;
  }

  private displayErrorMessage(container: HTMLElement): void {
    this.errorMessage = 'Product not found';
    const errorElement = this.renderer.createElement('p');
    this.renderer.setProperty(errorElement, 'textContent', this.errorMessage);
    this.renderer.appendChild(container, errorElement);
  }



  // ... existing code ...

submitReview(): void {
    // Ensure the reviewer's name and email are set
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
        this.newReview.reviewerName = currentUser.firstName + ' ' + currentUser.lastName;
        this.newReview.reviewerEmail = currentUser.email; // Set from the current user
    } else {
        alert('User is not logged in. Please log in to submit a review.');
        return; // Exit if user is not logged in
    }

    if (this.newReview.comment.trim()) {
        this.productService.addReview(this.product?.productId.toString(), this.newReview).subscribe(
            (response) => {
                console.log('Review submitted successfully:', response);
                // Clear the inputs after submission
                this.newReview.comment = ''; // Clear the textarea after submission
                this.newReview.rating = 1; // Reset rating
                this.displayProductDetails(); // Refresh the product details to show new review
            },
            (error) => {
                console.error('Error submitting review:', error);
                alert('There was an error submitting your review. Please try again later.');
            }
        );
    } else {
        alert('Please enter a review before submitting.');
    }
}



private createReviewForm(): HTMLElement {
  const reviewFormContainer = this.renderer.createElement('div');
  this.renderer.addClass(reviewFormContainer, 'add-review');

  const titleElement = this.renderer.createElement('h3');
  this.renderer.setProperty(titleElement, 'textContent', 'Add Your Review');
  this.renderer.appendChild(reviewFormContainer, titleElement);

  const textarea = this.renderer.createElement('textarea');
  this.renderer.addClass(textarea, 'review-textarea');
  this.renderer.setAttribute(textarea, 'placeholder', 'Write your review here...');
  this.renderer.setProperty(textarea, 'rows', '4');
  this.renderer.listen(textarea, 'input', (event) => {
    this.newReview.comment = event.target.value;
  });
  this.renderer.appendChild(reviewFormContainer, textarea);

  const ratingLabel = this.renderer.createElement('label');
  this.renderer.setProperty(ratingLabel, 'textContent', 'Rating:');
  this.renderer.appendChild(reviewFormContainer, ratingLabel);

  const ratingSelect = this.renderer.createElement('select');
  this.renderer.addClass(ratingSelect, 'review-rating-select');
  this.renderer.listen(ratingSelect, 'change', (event) => {
    this.newReview.rating = parseInt(event.target.value);
  });

  for (let star = 1; star <= 5; star++) {
    const option = this.renderer.createElement('option');
    this.renderer.setProperty(option, 'value', star);
    this.renderer.setProperty(option, 'textContent', `${star} ⭐`);
    this.renderer.appendChild(ratingSelect, option);
  }

  this.renderer.appendChild(reviewFormContainer, ratingSelect);

  const submitButton = this.renderer.createElement('button');
  this.renderer.addClass(submitButton, 'btn');
  this.renderer.addClass(submitButton, 'btn-primary');
  this.renderer.setProperty(submitButton, 'textContent', 'Submit Review');
  this.renderer.listen(submitButton, 'click', () => {
    this.submitReview();
  });
  this.renderer.appendChild(reviewFormContainer, submitButton);

  return reviewFormContainer;
}



  // Function to add item to the cart
  addToCart(productId: number): void {
    if (this.authService.isLoggedIn()) {
      this.authService.addProductToCart(productId).subscribe(
        (response) => {
          console.log('Product added to cart:', response);
          alert('Product added to cart successfully');
        },
        (error) => {
          console.error('Error adding product to cart:', error);
          alert(error.message);
        }
      );
    }
    else {
      alert('Please log in to add items to the cart');
    }
  }


}
