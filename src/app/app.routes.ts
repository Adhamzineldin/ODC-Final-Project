import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import {SingleProductComponent} from "./components/pages/single-product/single-product.component";
import {VerificationComponent} from "./components/pages/verification/verification.component";
import {CartComponent} from "./components/pages/cart/cart.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";



export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'product/:id', component: SingleProductComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  {path: 'verification', component: VerificationComponent},
  {path: 'cart', component: CartComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
