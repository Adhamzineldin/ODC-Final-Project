import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/pages/home/home.component';
import {LoginComponent} from './components/account/login/login.component';
import {SignupComponent} from './components/account/signup/signup.component';
import {ProfileComponent} from './components/account/profile/profile.component';
import {SingleProductComponent} from "./components/pages/single-product/single-product.component";
import {VerificationComponent} from "./components/account/verification/verification.component";
import {CartComponent} from "./components/account/cart/cart.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {OrderComponent} from "./components/account/order/order.component";
import {MainComponent} from "./components/admin/main/main.component";
import {ForgotPasswordComponent} from "./components/account/forgot-password/forgot-password.component";


export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'product/:id', component: SingleProductComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'verification', component: VerificationComponent},
  {path: 'cart', component: CartComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'order/:orderNumber', component: OrderComponent},
  {path: 'admin', component: MainComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
