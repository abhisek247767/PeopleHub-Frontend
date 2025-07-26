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
import { SettingComponent } from './settings/settings.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';

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
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'verify-email', component: VerifyEmailComponent},
            {path: 'verify-email', component: ResetPasswordComponent},
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
      { path: 'setting', component: SettingComponent },

    { path: '**', component: NotFoundComponent}

];
