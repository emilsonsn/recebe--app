import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { OrderResponse } from '@models/order';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private sessionEndpoint: string = 'order';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public get(pageControl?: PageControl, filters?): Observable<ApiResponsePageable<OrderResponse>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<OrderResponse>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  // Não existe getById no endpoint
  public getById(id : number) : Observable<ApiResponse<OrderResponse>> {
    return this._http.get<ApiResponse<OrderResponse>>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public post(order: OrderResponse | FormData): Observable<ApiResponse<OrderResponse>> {
    return this._http.post<ApiResponse<OrderResponse>>(`${environment.api}/${this.sessionEndpoint}/create`, order);
  }

  public postImport(fileCSV : any): Observable<ApiResponse<OrderResponse>> {
    return this._http.post<ApiResponse<OrderResponse>>(`${environment.api}/${this.sessionEndpoint}/import`, fileCSV);
  }

  public patch(id: number, order: any): Observable<ApiResponse<OrderResponse>> {
    return this._http.post<ApiResponse<OrderResponse>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, order);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }


}
