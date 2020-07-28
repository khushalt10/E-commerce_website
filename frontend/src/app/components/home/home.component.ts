import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from "../../models/product.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  products: ProductModelServer[] = [];

  constructor(private productService: ProductService,  private router: Router) { }

  ngOnInit(): void {
    this.productService.getAllProducts()
    .subscribe((prods: ServerResponse) => {
      this.products = prods.products;
      console.log(this.products);
    })
  }

  selectProduct(id: Number) {
    this.router.navigate(['/product', id]).then();
  }

}
