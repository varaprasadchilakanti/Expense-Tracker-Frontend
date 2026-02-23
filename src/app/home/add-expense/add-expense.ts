import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HomeService } from '../home-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-expense',
  imports: [ReactiveFormsModule],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense {
  form = new FormGroup({
    title: new FormControl(''),
    amount: new FormControl(''),
    category: new FormControl(''),
    date: new FormControl('')
  })

  constructor(private homeService: HomeService, private router: Router){}

  onSubmit(){
    this.homeService.postExpenses(this.form.value).subscribe({
      next: (response: any) =>{
        console.log(response);
        this.router.navigate(['']);
      }
    })
    
  }
}
