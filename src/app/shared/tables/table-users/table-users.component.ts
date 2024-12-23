import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.scss',
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
export class TableUserComponent {

  protected expanded: any;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onUserClick: EventEmitter<User> = new EventEmitter<User>();

  @Output()
  onDeleteUserClick: EventEmitter<number> = new EventEmitter<number>();

  public users: User[] = [];

  public columns = [
    {
      slug: "name",
      order: true,
      title: "Nome",
      align: "start",
    },
    {
      slug: "email",
      order: true,
      title: "E-mail",
      align: "justify-content-center",
    },
    {
      slug: "cpf_cnpj",
      order: true,
      title: "CPF/CNPJ",
      align: "justify-content-center",
    },
    {
      slug: "phone",
      order: true,
      title: "Telefone",
      align: "justify-content-center",
    },
    {
      slug: "status",
      order: true,
      title: "Status",
      align: "justify-content-center",
    },
    {
      slug: "",
      order: true,
      title: "Ações",
      align: "justify-content-end me-4",
    },
  ];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _userService: UserService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { filters, searchTerm, loading } = changes;

    if ( searchTerm?.previousValue && searchTerm?.currentValue !== searchTerm?.previousValue ) {
      this._onSearch();
    }
    else if (!loading?.currentValue) {
      this._onSearch();
    }
    else if(filters?.previousValue && filters?.currentValue) {
			this._onSearch();
		}

  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  get getLoading() {
    return !!this.loading;
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm || '';
    this.pageControl.page = 1;
    this.search();
  }

  search(): void {
    this._initOrStopLoading();

    this._userService
      .getUsers(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe((res) => {
        this.users = res.data;

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

  pageEvent($event: any) {
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
