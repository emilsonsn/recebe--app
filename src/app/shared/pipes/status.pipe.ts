import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '@models/status';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value) {
    switch (value) {
      case Status.Pending:
        return 'Pendente';
      case Status.Resolved:
        return 'Resolvido';
      case Status.RequestFinance:
        return 'Solicitado ao financeiro';
      case Status.RequestManager:
        return 'Solicitado ao gerente'
      case Status.Finished:
        return 'Finalizado';
      case Status.Rejected:
        return 'Rejeitado';
      case Status.Payment:
        return 'Pagamento';
      case Status.Reimbursement:
        return 'Reembolso';

      default:
        return 'Não encontrado';
    }
  }

}
