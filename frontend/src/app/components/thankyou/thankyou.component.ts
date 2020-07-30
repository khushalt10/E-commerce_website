
import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {OrderService} from "../../services/order.service";

@Component({
selector: 'mg-thankyou',
templateUrl: './thankyou.component.html',
styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {
message: string;
orderId: number;
products;
cartTotal;
constructor(private router: Router,
            private orderService: OrderService) {
  const navigation = this.router.getCurrentNavigation();
  const state = navigation.extras.state as {
    message: string,
    products: ProductResponseModel[],
    orderId: number,
    total: number
  };

  this.message = state.message;
  this.orderId = state.orderId;
  this.products = state.products;
  this.cartTotal = state.total;
  console.log(this.products);
}

ngOnInit() {

}

}

interface ProductResponseModel {
id: number;
title: string;
description: string;
price: number;
quantityOrdered: number;
image: string;
}
