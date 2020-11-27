import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';


const routes: Routes = [
  { path: "dash", component: DashboardComponent, data: { pageTitle: 'Dashboard' } },
  { path: 'utilisateur', component: UserComponent, data: { pageTitle: 'Gestion des utilisateurs' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
