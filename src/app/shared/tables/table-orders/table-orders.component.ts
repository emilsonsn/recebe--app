import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Order, PageControl } from '@models/application';
import { OrderResponse } from '@models/order';
import { RequestOrderStatus } from '@models/requestOrder';
import { OrderService } from '@services/order.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-table-orders',
  templateUrl: './table-orders.component.html',
  styleUrl: './table-orders.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TableOrdersComponent {
  protected expanded: any;
  private subscription: Subscription;
  protected orderStatus = RequestOrderStatus;

  @Input()
  filters;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Output()
  public onViewOrder = new EventEmitter<any>();

  @Output()
  public onEditOrder = new EventEmitter<any>();

  @Output()
  public onDeleteOrder = new EventEmitter<OrderResponse>();

  public columns = [
    {
      slug: 'type',
      order: false,
      title: 'Tipo',
      classes: '',
    },
    {
      slug: 'order_id',
      order: false,
      title: 'ID Pedido',
      classes: '',
    },
    {
      slug: 'marketplace',
      order: false,
      title: 'Marketplace',
      classes: '',
    },
    {
      slug: 'account',
      order: false,
      title: 'Conta',
      classes: '',
    },
    {
      slug: 'order_date',
      order: false,
      title: 'Data Pedido',
      classes: '',
    },
    {
      slug: 'release_date',
      order: false,
      title: 'Data Repasse',
      classes: '',
    },
    {
      slug: 'sale_value',
      order: false,
      title: 'Venda',
      classes: '',
    },
    {
      slug: 'refund_sale',
      order: false,
      title: 'Estorno',
      classes: '',
    },
    {
      slug: 'net_result',
      order: false,
      title: 'Resultado Líquido',
      classes: '',
    },
    {
      slug: 'no-idea',
      order: false,
      title: 'Correção Manual',
      classes: '',
    },
    {
      slug: 'status',
      order: false,
      title: 'Status',
      classes: '',
    },
    {
      slug: 'actions',
      order: false,
      title: 'Ações',
      classes: 'justify-content-end me-5',
    },
  ];

  public orders: OrderResponse[] = [
    {
      type: 'TESTE',
      order_id: '333',
      reference_id: '333',
      order_date: new Date(),
      sale_value: 10,
      refund_sale: 20,
      commission: 30,
      refund_commission: 40,
      shipping_fee: 50,
      refund_shipping_fee: 60,
      campaigns: 70,
      refund_campaigns: 80,
      taxes: 90,
      refund_taxes: 120,
      other_credits: 130,
      other_debits: 140,
      net_result: 150,
    },
    {
      id: 1, // Exemplo de valor numérico
      type: 'pedido', // Exemplo de tipo
      order_id: '12345',
      reference_id: 'ref12345',
      order_date: new Date(), // Pode ser um Date ou uma string
      sale_value: 500.0,
      refund_sale: 50.0,
      commission: 20.0,
      refund_commission: 5.0,
      shipping_fee: 10.0,
      refund_shipping_fee: 2.0,
      campaigns: 1,
      refund_campaigns: 0.5,
      taxes: 25.0,
      refund_taxes: 5.0,
      other_credits: 10.0,
      other_debits: 3.0,
      net_result: 450.0,
      sequence_id: 'seq123', // Opcional
      integrator_id: 'integrator123', // Opcional
      shipping_id: 'shipping123', // Opcional
      marketplace: 'marketplaceXYZ', // Opcional
      account: 'contaABC', // Opcional
      invoice_number: 'inv123456', // Opcional
      invoice_series: 'serie123', // Opcional
      release_date: new Date(), // Opcional
      sync_date: new Date(), // Opcional
      user_id: 5, // Opcional
      status: 'Pendente', // Opcional
    },
  ];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: 'id',
    order: Order.ASC,
  };
  @Input() home!: boolean;

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _orderService: OrderService
  ) {}

  ngOnInit(): void {
    // this.subscription = this._sidebarService.accountIdAlterado$.subscribe(
    //   () => { this._onSearch() }
    // );

    if (this.home) {
      this.columns.pop();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { filters, searchTerm, loading } = changes;

    if (
      searchTerm?.previousValue &&
      searchTerm?.currentValue !== searchTerm?.previousValue
    ) {
      this._onSearch();
    } else if (!loading?.currentValue) {
      this._onSearch();
    } else if (filters?.previousValue && filters?.currentValue) {
      this._onSearch();
    }
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  get getLoading() {
    return !!this.loading;
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm;
    this.pageControl.page = 1;
    this.search();
  }

  search(): void {
    // return;
    this._initOrStopLoading();

    this._orderService
      .get(this.pageControl, this.filters)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe((res) => {
        this.orders = res.data;

        this.pageControl.page = res.current_page - 1;
        this.pageControl.itemCount = res.total;
        this.pageControl.pageCount = res.last_page;
      });
  }

  onClickOrderBy(slug: string, order: boolean) {
    if (!order) {
      return;
    }

    if (this.pageControl.orderField === slug) {
      this.pageControl.order =
        this.pageControl.order === Order.ASC ? Order.DESC : Order.ASC;
    } else {
      this.pageControl.order = Order.ASC;
      this.pageControl.orderField = slug;
    }
    this.pageControl.page = 1;
    this.search();
  }

  pageEvent($event) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.search();
  }

  // Utils
  public toggleExpanded(element) {
    if (this.expanded === element) {
      this.expanded = null;
    } else {
      this.expanded = element;
    }
  }
}
