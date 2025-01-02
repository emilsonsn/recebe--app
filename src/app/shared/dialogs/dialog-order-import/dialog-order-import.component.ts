import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderResponse } from '@models/order';
import { OrderService } from '@services/order.service';
import { UserService } from '@services/user.service';
import { SessionQuery } from '@store/session.query';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-order-import',
  templateUrl: './dialog-order-import.component.html',
  styleUrl: './dialog-order-import.component.scss',
})
export class DialogOrderImportComponent {
  public loading: boolean = false;
  public title: string = 'Importar Planilha';

  public profileImageFile: File | null = null;
  public profileImage: string | ArrayBuffer = null;
  public isDragOver: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogOrderImportComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _orderService: OrderService,
    private readonly _sessionQuery: SessionQuery
  ) {}

  ngOnInit() {}

  public onConfirm(): void {
    if (this.loading || !this.profileImageFile) return;

    this._initOrStopLoading();

    this.post(this.profileImageFile);
  }

  public post(file) {
    this._orderService
      .postImport(this.prepareFormData({ file }))
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success('Arquivo importado!');
          this._dialogRef.close(true);
        },
        error: (error) => {
          this._toastr.error('Ocorreu um erro ao importar o arquivo.');
        },
      });
  }

  // Utils
  public prepareFormData(data) {
    const orderFormData = new FormData();

    Object.keys(data).forEach((key) => {
      orderFormData.append(key, data[key]);
    });

    return orderFormData;
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  // File
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const validExtensions = ['xlsx', 'ods', 'csv', 'xls'];

      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        this._toastr.error('Tipo de arquivo inválido!');
        return;
      }
    }

    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.profileImage = null;
    this.profileImageFile = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = null;
  }

  getFileName() {
    return this.profileImageFile?.name ?? '';
  }
}
