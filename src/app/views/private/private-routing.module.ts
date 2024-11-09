import { CollaboratorModule } from './collaborator/collaborator.module';
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
        path: 'collaborator',
        loadChildren: () => import('./collaborator/collaborator.module').then(m => m.CollaboratorModule),
        canActivate: [permissionGuard],
        data: {
          page: 'collaborator'
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




