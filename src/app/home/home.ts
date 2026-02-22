import { Component, OnInit } from '@angular/core';
import { HomeService } from './home-service';
import { ExpenseList } from './expense-list/expense-list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ExpenseList, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{

  expenseData: any = null;
  constructor(private homeService: HomeService){}

  ngOnInit(): void {
    this.homeService.getExpenses().subscribe({
      next: (response: any) => {
        this.expenseData = response;
        console.log(response);
      }
    })
  }
}
