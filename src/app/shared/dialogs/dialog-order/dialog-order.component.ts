import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderResponse } from '@models/order';
import { User } from '@models/user';
import { ConstructionService } from '@services/construction.service';
import { OrderService } from '@services/order.service';
import { RequestService } from '@services/request.service';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import { SessionQuery } from '@store/session.query';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  finalize,
  map,
  ReplaySubject,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-dialog-order',
  templateUrl: './dialog-order.component.html',
  styleUrl: './dialog-order.component.scss',
})
export class DialogOrderComponent {
  public form: FormGroup;
  protected _onDestroy = new Subject<void>();
  public loading: boolean = false;
  public title: string = 'Novo Pedido';
  public isNewOrder: boolean = true;

  // Search de Users
  protected userSelect: User[] = [];
  protected userCtrl: FormControl<any> = new FormControl<any>(null);
  protected userFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogOrderComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _orderService: OrderService,
    private readonly _userService: UserService,
    private readonly _sessionQuery: SessionQuery
  ) {
    this.getUsersFromBack();
  }

  ngOnInit() {
    this.form = this._fb.group({
      type: [null, Validators.required],
      order_id: [null, Validators.required],
      reference_id: [null, Validators.required],
      sequence_id: [null],
      integrator_id: [null],
      shipping_id: [null],
      marketplace: [null],
      account: [null],
      invoice_number: [null],
      invoice_series: [null],
      order_date: [null, Validators.required],
      release_date: [null],
      sale_value: [null, Validators.required],
      refund_sale: [null, [Validators.required]],
      commission: [null, [Validators.required]],
      refund_commission: [null, [Validators.required]],
      shipping_fee: [null, [Validators.required]],
      refund_shipping_fee: [null, [Validators.required]],
      campaigns: [null, [Validators.required]],
      refund_campaigns: [null, [Validators.required]],
      taxes: [null, [Validators.required]],
      refund_taxes: [null, [Validators.required]],
      other_credits: [null, [Validators.required]],
      other_debits: [null, [Validators.required]],
      net_result: [null, [Validators.required]],
      sync_date: [null],
      user_id: [null],
    });

    if (this._data) {
      this.isNewOrder = false;
      this.title = 'Editar Pedido';

      this.form.patchValue(this._data);
    }
  }

  public onConfirm(): void {
    if (!this.form.valid) return;

    this._initOrStopLoading();

    if (this.isNewOrder) {
      this.post({
        ...this.form.getRawValue(),
        release_date : this.form.get('release_date').value ? dayjs(this.form.get('release_date').value).format('YYYY-MM-DD') : null,
        order_date : this.form.get('order_date').value ? dayjs(this.form.get('order_date').value).format('YYYY-MM-DD') : null,
        sync_date : this.form.get('sync_date').value ? dayjs(this.form.get('sync_date').value).format('YYYY-MM-DD') : null,
      });
    } else {
      this.patch(this._data?.id, {
        ...this.form.getRawValue(),
        release_date : dayjs(this.form.get('release_date').value).format('YYYY-MM-DD'),
        order_date : dayjs(this.form.get('order_date').value).format('YYYY-MM-DD'),
        sync_date : dayjs(this.form.get('sync_date').value).format('YYYY-MM-DD'),
      });
    }
  }

  public post(order: OrderResponse) {
    this._orderService
      .post(order)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success('Solicitação cadastrada com sucesso!');
          this._dialogRef.close(true);
        },
        error: (error) => {
          this._toastr.error('Ocorreu um erro ao cadastrar a solicitação.');
        },
      });
  }

  public patch(request_id: number, order: OrderResponse | FormData) {
    this._orderService
      .patch(request_id, order)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success('Solicitação atualizada com sucesso!');
          this._dialogRef.close(true);
        },
        error: (error) => {
          this._toastr.error('Ocorreu um erro ao cadastrar a solicitação.');
        },
      });
  }

  // Utils
  public prepareFormData(request: Request) {
    const orderFormData = new FormData();

    Object.keys(request).forEach((key) => {
      orderFormData.append(key, request[key]);
    });

    return orderFormData;
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  // Getters
  public getUsersFromBack() {
    this._userService.getUsers().subscribe((res) => {
      this.userSelect = res.data;
      this.filteredUsers.next(this.userSelect.slice());

      this.prepareFilterTechnicalCtrl();
    });
  }

  // Filters
  protected prepareFilterTechnicalCtrl() {
    this.userFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.userSelect.slice();
          } else {
            search = search.toLowerCase();
            return this.userSelect.filter((user) =>
              user.name.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredUsers.next(filtered);
      });
  }
}
