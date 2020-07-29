import { Injectable } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ProductModelServer, ServerResponse } from '../models/product.model';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient,
              private router: Router) { }

//to fetch All products from backend
  getAllProducts(numberOfResults = 10): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.SERVER_URL+'/products',{
      params: {
        limit: numberOfResults.toString()
      }
    });
  }

  //Get Single Product from server
  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.SERVER_URL + '/products' + id);
  }

  //get product from one category
  getProductFromCategory(catName: string): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(this.SERVER_URL + '/products/category/' + catName);
  }

 }
