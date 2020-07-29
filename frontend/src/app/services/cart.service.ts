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
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
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
  addProductToCart(id: number,quantity: number) {
    this.productService.getSingleProduct(id).subscribe(prod => {
      //If Cart is empty
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer[0].product = prod;
        this.cartDataServer[0].numInCart = quantity !== undefined ? quantity : 1;
      //TODO calculate total amount
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
      //TODO DISPLAY A TOAST NOTIFICATION
      }
      // Cart is NOT empty
      else {
        let index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id); //positive or -1 value

        //If the item is already present
        if(index !== -1) {
          if(quantity !== undefined && quantity =< prod.quantity) {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          } else {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }

          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          // TODO DISPLAY A TOAST NOFICATION
        }//end of if
        //if item is not present
        else {
          this.cartDataServer.data.push({
            numInCart: 1,
            Product: prod
          });

          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.id
          });

          //TODO DISPLAY TOAST NOTIFICATION

          //TODO CALACULATE total
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
            this.cartData$.next({...this.cartDataServer});
        }//end of else
      }

    });
  }

  updateCartItems(id: number, increase: boolean) {
    let data = this.cartDataServer.data[index];

    if(increase) {
      data.numInCart < data.product.quantity ? data.numInCart : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      // TODO calculate Total amount
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
    }else {
      data.numInCart--;

      if(data.numInCart < 1) {
        // TODO DELETE THE PRODUCT FROM cartTotal
          this.cartData$.next({...this.cartDataServer});
      }else {
          this.cartData$.next({...this.cartDataServer});
          this.cartDataClient.prodData[index].incart = data.numInCart;
          //TODO CALCULATE TOTAL amountthis.cartDataClient.
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
      }
    }
  }

  DeleteProductFromCart(index) {
    /*    console.log(this.cartDataClient.prodData[index].prodId);
        console.log(this.cartDataServer.data[index].product.id);*/

    if (window.confirm('Are you sure you want to delete the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {prodData: [{incart: 0, id: 0}], total: 0};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          data: [{
            product: undefined,
            numInCart: 0
          }],
          total: 0
        };
        this.cartData$.next({...this.cartDataServer});
      } else {
        this.cartData$.next({...this.cartDataServer});
      }
    }
    // If the user doesn't want to delete the product, hits the CANCEL button
    else {
      return;
    }


  }
  private CalculateTotal() {
   let Total = 0;

   this.cartDataServer.data.forEach(p => {
     const {numInCart} = p;
     const {price} = p.product;
     // @ts-ignore
     Total += numInCart * price;
   });
   this.cartDataServer.total = Total;
   this.cartTotal$.next(this.cartDataServer.total);
 }

 CheckoutFromCart(userId: Number) {

   this.http.post(`${this.SERVER_URL}/orders/payment`, null).subscribe((res: { success: Boolean }) => {
     console.clear();

     if (res.success) {


       this.resetServerData();
       this.http.post(`${this.ServerURL}/orders/new`, {
         userId: userId,
         products: this.cartDataClient.prodData
       }).subscribe((data: OrderConfirmationResponse) => {

         this.orderService.getSingleOrder(data.order_id).then(prods => {
           if (data.success) {
             const navigationExtras: NavigationExtras = {
               state: {
                 message: data.message,
                 products: prods,
                 orderId: data.order_id,
                 total: this.cartDataClient.total
               }
             };
             this.spinner.hide().then();
             this.router.navigate(['/thankyou'], navigationExtras).then(p => {
               this.cartDataClient = {prodData: [{incart: 0, id: 0}], total: 0};
               this.cartTotal$.next(0);
               localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
             });
           }
         });

       })
     } else {
       this.spinner.hide().then();
       this.router.navigateByUrl('/checkout').then();
       this.toast.error(`Sorry, failed to book the order`, "Order Status", {
         timeOut: 1500,
         progressBar: true,
         progressAnimation: 'increasing',
         positionClass: 'toast-top-right'
       })
     }
   })
 }

 private resetServerData() {
  this.cartDataServer = {
    data: [{
      product: undefined,
      numInCart: 0
    }],
    total: 0
  };
  this.cartData$.next({...this.cartDataServer});
}

}
interface OrderConfirmationResponse {
  order_id: Number;
  success: Boolean;
  message: String;
  products: [{
    id: String,
    numInCart: String
  }]
}
