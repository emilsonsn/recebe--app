import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPrivateComponent } from "@shared/layouts/layout-private/layout-private.component";
import { SessionService } from '../../store/session.service';
import { permissionGuard } from '@app/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutPrivateComponent,
    children: [
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule),
        canActivate: [permissionGuard],
        data: {
          page: 'orders'
        }
      },
      {
        path: 'users',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        canActivate: [permissionGuard],
        data: {
          page: 'users'
        }
      },
      {
        path: '**',
        redirectTo: 'orders',
        canMatch: []
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule {

  constructor(
    private readonly _sessionService: SessionService
  ) {}

}




