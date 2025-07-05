import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectEmployeeComponent } from './pages/project-employee/project-employee.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './pages/auth/guard/auth.guard';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthLayoutComponent } from './pages/auth/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
   // {path: 'admin', component: AdminLayoutComponent},
   {
        path: 'admin-dashboard',
        component: AdminLayoutComponent,
        children: [
            { path: '', component: AdminDashboardComponent }
        ]
    },
    { path:'',redirectTo: 'login',pathMatch: 'full'},
    {
        path:'',
        component: AuthLayoutComponent,
        children:[
            {path: 'login',component: LoginComponent},
            {path: 'registration', component: RegistrationComponent},
        ]
    },
    {
        path:'',
        component:LayoutComponent,
        canActivate: [authGuard],
        children:[
            {path:'dashboard',component:DashboardComponent},
            {path:'employee',component:EmployeeComponent},
            {path:'projects',component:ProjectComponent},
            {path:'project-employee',component:ProjectEmployeeComponent }
        ]
    },
    { path: '**', component: NotFoundComponent}
   
];
