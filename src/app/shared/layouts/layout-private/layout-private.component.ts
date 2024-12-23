import {Component, ElementRef, Renderer2} from '@angular/core';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {Subscription} from "rxjs";
import {User} from "@models/user";
import {UserService} from "@services/user.service";
import {ApiResponse} from "@models/application";
import { SessionService } from '@store/session.service';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-layout-private',
  templateUrl: './layout-private.component.html',
  styleUrl: './layout-private.component.scss'
})
export class LayoutPrivateComponent {

  public permitedMenuItem: IMenuItem[] = [];

  public menuItem: IMenuItem[] = [
    // {
    //   label: 'Home',
    //   icon: 'fa-solid fa-house',
    //   route: '/painel/home',
    //   active: true
    // },
    {
      label: 'Pedidos',
      icon: 'fa-solid fa-file',
      route: '/painel/orders'
    },
    {
      label: 'Usuários',
      icon: 'fa-solid fa-users',
      route: '/painel/users'
    },
  ]

  protected isMobile: boolean = window.innerWidth >= 1000;
  private resizeSubscription: Subscription;
  user: User;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private readonly _sidebarService: SidebarService,
    private readonly _userService: UserService,
    private readonly _sessionService: SessionService,
    private readonly _sessionQuery : SessionQuery
  ) { }


  ngOnInit(): void {

    document.getElementById('template').addEventListener('click', () => {
      this._sidebarService.retractSidebar();
    });

    this._sessionQuery.user$.subscribe(user => {
      if(user) {
        this.user = user;
      }
    })

  }


  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

}
