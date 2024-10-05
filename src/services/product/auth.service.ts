// auth.service.ts
import {Injectable} from "@angular/core";
import {User} from "../models/userModel";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, throwError} from 'rxjs';
import {AppComponent} from "../../app/app.component";
import {Product} from "../models/productModel";

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private user: User | null;
  private nodemailer: any
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {

    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    console.log('AuthService initialized. Current user:', this.user);
  }


  getCurrentUser(): User | null {
    return this.user && this.user.isVerified ? this.user : null;
  }

  getUserEmail(): string {
    return this.user?.email || '';
  }

  // Method to set user when logged in
  setUser(userData: User | null) {
    this.user = userData;
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data
  }

  register(userData: User): Observable<any> {
    // Convert username to lowercase
    userData.username = userData.username.toLowerCase();


    console.log('userData', userData); // Log the modified userData
    return this.http.post(`${AppComponent.api}/users/register`, userData);
  }

  verifyEmail(email: string): Observable<any> {
    return this.http.post<{ message: string }>(`${AppComponent.api}/users/verify-email`, {email}).pipe(
      map(response => {
        // Check for the success condition from the response
        if (response.message === 'success') {
          return {success: true, message: 'Email verification successful'};
        }
        return {success: false, message: 'Email verification failed'}; // Handle failure case
      })
    );
  }

  sendCodeToEmail(email: string, code: string): Observable<any> {
    const payload = {email, code};

    return this.http.post(`${AppComponent.api}/users/send-verification-code`, payload)
      .pipe(
        catchError(error => {
          console.error('Error sending verification code:', error);
          return throwError(error); // Propagate the error
        })
      );
  }


  login(email: string, password: string): Observable<any> {
    email = email.toLowerCase();
    return this.http.post<{ token: string, user: User }>(`${AppComponent.api}/users/login`, {email, password}).pipe(
      map(response => {

        this.setUser(response.user);
        this.storeToken(response.token);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // Logout a user
  logout(): void {
    this.tokenSubject.next(null);
    localStorage.removeItem('authToken');
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Get the token
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Store the token
  private storeToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.tokenSubject.next(token);
  }

  // Handle errors from HTTP requests
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }

  addProductToCart(productId: number): Observable<any> {
    console.log('productId', productId);
    let userId = this.getCurrentUser()?.userId;

    const body = {userId, productId};
    return this.http.post<any>(`${AppComponent.api}/users/add-to-cart`, body);
  }


  getCart(): Observable<any> {
    return this.http.get <any>(`${AppComponent.api}/users/cart/${this.getCurrentUser()?.userId}`);
  }

  getProductDetails(productId: number): Observable<any> {
    return this.http.get<any>(`${AppComponent.api}/products/product/${productId}`);
  }

  updateUserCart(updatedCart: { productId: number, quantity: number }[]) {
    const userId = this.getCurrentUser()?.userId; // Assuming you have a method to get the user's ID
    return this.http.put(`${AppComponent.api}/users/cart/${userId}`, {updatedCart});
  }

  // Change password
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const email = this.getCurrentUser()?.email;
    return this.http.put(`${AppComponent.api}/users/update-password`, {email, oldPassword, newPassword});
  }

  forgotPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${AppComponent.api}/users/forgot-password`, {email: email, newPassword: newPassword});
  }

  updateOrder(userId: number, updatedOrder: any): Observable<any> {
    console.log('updatedOrder', updatedOrder);
    return this.http.put<any>(`${AppComponent.api}/users/orders/${userId}`, {"updatedOrder": updatedOrder});
  }


  getOrders(userId: number | undefined): Observable<any> {
    return this.http.get<any>(`${AppComponent.api}/users/orders/${userId}`);
  }


  getOrderDetails(orderNumber: string) {
    const userId = this.getCurrentUser()?.userId;
    return this.http.get<any>(`${AppComponent.api}/users/orders/order/${userId}?orderNumber=${orderNumber}`);
  }

//   admin
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(AppComponent.api);
  }

  deactivateUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${AppComponent.api}/${userId}/deactivate`);
  }

  addProduct(product: FormData): Observable<Product> {
    console.log('product', product);
    return this.http.post<Product>(`${AppComponent.api}/products`, product);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${AppComponent.api}/products/product/${productId}`);
  }


  getProducts() {
    return this.http.get<Product[]>(`${AppComponent.api}/products`)
  }

  isAdmin() {
    return this.getCurrentUser()?.roles.includes('admin');
  }

  sendEmail(userId: number, emailContent: string) {
    const email = this.getCurrentUser()?.email;
    console.log('sending email');
    return this.http.post(`${AppComponent.api}/users/sendEmail`, {htmlContent: emailContent, email});
  }

  updateProductStock(productId: number, newStock: number): Observable<any> {
    return this.http.put(`${AppComponent.api}/products/${productId}/stock`, {stock: newStock});
  }


}
