import { Component, computed, Signal, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HeaderService } from '@services/header.service';
import { OrderService } from '@services/order.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import dayjs from 'dayjs';
import { ISmallInformationCard } from '@models/cardInformation';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { OrderData } from '@models/dashboard';
import { ApiResponse } from '@models/application';
import { DashboardService } from '@services/dashboard.service';
import { DialogOrderComponent } from '@shared/dialogs/dialog-order/dialog-order.component';
import { OrderResponse } from '@models/order';
import { DialogOrderImportComponent } from '@shared/dialogs/dialog-order-import/dialog-order-import.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  dashboardCards = signal<OrderData>({
    ordersByDay: 0,
    ordersByWeek: 0,
    ordersByMonth: 0,
    ordersByYear: 0,
    pendingOrders: 0,
    awaitingFinanceOrders: 0,
    solicitationPendings: 0,
    solicitationFinished: 0,
  });

  public filters;

  public loading: boolean = false;

  itemsRequests: Signal<ISmallInformationCard[]> = computed<
    ISmallInformationCard[]
  >(() => [
    {
      icon: 'fa-solid fa-clock',
      background: '#FC9108',
      title: this.dashboardCards().pendingOrders,
      category: 'Pedidos',
      description: 'Registros Pendentes',
    },
    {
      icon: 'fa-solid fa-envelope-open',
      // icon_description: 'fa-solid fa-calendar-day',
      // background: '#17a2b8',
      title: this.dashboardCards().awaitingFinanceOrders,
      category: 'Pedidos',
      description: 'Registros Baixados',
    },
    {
      icon: 'fa-solid fa-check-circle',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#28a745',
      title: this.dashboardCards().solicitationFinished,
      category: 'Pedidos',
      description: 'Registros no Total',
    },
  ]);

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _orderService: OrderService,
    private readonly _toastr: ToastrService,
    private readonly _dashboardService: DashboardService
  ) {
    this._headerService.setTitle('Pedidos');
    this._headerService.setSubTitle('');

    _dashboardService
      .getDashboardCards()
      .subscribe((c: ApiResponse<OrderData>) => {
        this.dashboardCards.set(c.data);
      });
  }

  ngOnInit() {}

  public openOrderDialog(data?) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogOrderComponent, {
        data: data ? { ...data } : null,
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
            }, 300);
          }
        },
      });
  }

  public openOrderImportDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '35%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogOrderImportComponent, {
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
            }, 300);
          }
        },
      });
  }

  public openOrderFilterDialog() {

  }

  public onDeleteOrder(order: OrderResponse) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogConfirmComponent, {
        data: { text: `Tem certeza? Essa ação não pode ser revertida!` },
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.deleteOrder(order.id);
          }
        },
      });
  }

  public deleteOrder(id: number) {
    this._initOrStopLoading();

    this._orderService
      .delete(id)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  // Utils

  public _initOrStopLoading() {
    this.loading = !this.loading;
  }

  protected readonly Object = Object;
}
