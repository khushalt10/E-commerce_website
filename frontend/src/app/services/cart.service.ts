import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductModelServer, ServerResponse } from "../../models/product.model";
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { environment } from '../../environments/environment';
import { CartModelPublic, CartModelServer } from "../models/cart.model";
import { BehaviorSubject } from "rxjs";
import {NavigationExtras,Router } from '@angular/router';
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private SERVER_URL = environment.SERVER_URL;

  //Data variable to store cart info on the clients local storage
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
      incart: 0,
      id: 0
    }]
  };

  //data variable to store cart info on the server
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [
      {
        numInCart: 0,
        product: undefined
      }
    ]
  };

  //Observables for The components to subscribe
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);


  constructor(private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router) {

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    //Get The info fro localStorage (if any)
    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    //Check if info variable is null or has some data in numInCart
    if(info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      //Local strorage is not empty and has info
      this.cartDataClient = info;

      //loop Through each entry and put it in cartDataServer
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) +> {
          if(this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualProductInfo;
            //TODO create CalculatetOtal function And replace it here
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
          } else {
            //CartDataServer already has some entry in it
            this.cartDataServer.data.push({
              numInCart: p.incart,
              product: actualProductInfo
            });
            //TODO create calculateTotal fucntion and put it here
            this.cartDataClient.total = this.CartDataServer.total;
            localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
          }
          this.cartData$.next({...this.cartDataServer});
        });
      });
    }

  }
}
