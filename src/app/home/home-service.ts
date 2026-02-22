import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient){}

  getExpenses(){
    return this.http.get(environment.apiUrl + '/api/expenses/?ordering=-created_at');
  }

  postExpenses(data : any){
    return this.http.post(environment.apiUrl + '/api/expenses/', data);
  }
}
