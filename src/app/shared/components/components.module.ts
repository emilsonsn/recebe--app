import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountManagerComponent} from "@shared/components/account-manager/account-manager.component";
import {LottieComponent} from "ngx-lottie";
import {
  SmallInformationCardComponent
} from "@shared/components/small-information-card/small-information-card.component";
import {MatDivider} from "@angular/material/divider";
import {KanbanComponent} from "@shared/components/kanban/kanban.component";
import {CdkDrag, CdkDragPlaceholder, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import { HeaderPageComponent } from './header-page/header-page.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';

const components: any[] = [
  AccountManagerComponent,
  SmallInformationCardComponent,
  KanbanComponent,
  HeaderPageComponent,
  SearchInputComponent
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    LottieComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDivider,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder
  ],
  exports: components
})
export class ComponentsModule { }
