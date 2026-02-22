import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { authGuard } from './guards/auth-guard';
import { AddExpense } from './home/add-expense/add-expense';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Home,
        canActivate: [authGuard]
    },
    {
        path: 'create-expense',
        component: AddExpense,
        canActivate: [authGuard]
    }
];
