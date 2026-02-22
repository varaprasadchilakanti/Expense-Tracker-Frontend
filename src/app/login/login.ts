import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './login-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private loginService: LoginService, private router: Router){}

  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  onSubmit(){
    this.loginService.postLoginData(this.form.value).subscribe({
      next: (response: any) => {
        console.log(response);
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        this.router.navigate(['']);
      }
    })
  }
}
