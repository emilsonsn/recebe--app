import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '@services/user.service';
import {User} from '@models/user';
import dayjs from 'dayjs';
import {Utils} from '@shared/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrl: './dialog-user.component.scss'
})
export class DialogUserComponent {

  // Utils
  public isNewUser: boolean = true;
  public title: string = 'Novo Usuário';
  public loading: boolean = false;
  public utils = Utils;

  // Form
  public form: FormGroup;
  public profileImageFile: File | null = null;
  public profileImage: string | ArrayBuffer = null;
  public isDragOver: boolean = false;
  // public userPositionEnum;
  // public userSectorsEnum;

  // Selects
  public statusSelect: { label: string; value: string }[] = [
    {
      label: 'Ativo',
      value: '1',
    },
    {
      label: 'Inativo',
      value: '0',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { user: User },
    private readonly _dialogRef: MatDialogRef<DialogUserComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _userService: UserService,
    private readonly _toastr : ToastrService,
  ) { }

  ngOnInit(): void {

    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      cpf_cnpj: [null, [Validators.required]],
      birth_date: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      whatsapp: [null, [Validators.required]],
      email: [null, [Validators.required]],
      // is_active : [1] -> Method Illuminate\Validation\Validator::validateDefault does not exist.
    })

    if (this._data?.user) {
      this.isNewUser = false;
      this.title = 'Editar Usuário';
      this.form.patchValue(this._data.user);

      if (this._data.user.photo) {
        this.profileImage = this._data.user.photo;
      }

    }

    // this.updateSectorsUser();
    // this.getPositionsUser();
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid) {
      form.markAllAsTouched();
      this._toastr.error("Formulário inválido!");
      return;
    }

    const formData = new FormData();

    Object.entries(form.controls).forEach(([key, control]) => {
      const value = control.value;

      if (key === 'birth_date') {
        formData.append('birth_date', dayjs(value).format('YYYY-MM-DD'));
      } else {
        formData.append(key, value);
      }
    });

    if(this.profileImageFile) {
      formData.append('photo', this.profileImageFile);
    }

    this._dialogRef.close(formData)
  }

  // Files
  protected onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  protected triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  protected onDragLeave(event: DragEvent): void {
    this.isDragOver = false;
  }

  protected onDrop(event: DragEvent): void {
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

  protected removeImage(event: Event): void {
    event.stopPropagation();
    this.profileImage = null;
  }

  // Utils
  public onCancel(): void {
    this._dialogRef.close();
  }

  // public getPositionsUser() {
  //   this._userService.getPositionsUser()
  //     .subscribe(res => {
  //       this.userPositionEnum = res.data;
  //     })
  // }

  // public updateSectorsUser() {
  //   this._userService.getSectorsUser()
  //     .subscribe(res => {
  //       this.userSectorsEnum = res.data;
  //     })
  // }
}
