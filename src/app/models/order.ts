export interface OrderResponse {
  id? : number;
  type: string;
  order_id: string;
  reference_id: string;
  order_date: Date | string;
  sale_value: number;
  refund_sale: number;
  commission: number;
  refund_commission: number;
  shipping_fee: number;
  refund_shipping_fee: number;
  campaigns: number;
  refund_campaigns: number;
  taxes: number;
  refund_taxes: number;
  other_credits: number;
  other_debits: number;
  net_result: number;
  sequence_id?: string;
  integrator_id?: string;
  shipping_id?: string;
  marketplace?: string;
  account?: string;
  invoice_number?: string;
  invoice_series?: string;
  release_date?: Date;
  sync_date?: Date;
  user_id?: number;
  status? : string;
}

/*
slug: "type",
slug: "order_id",
slug: "marketplace",
slug: "account",
slug: "order_date",
slug: "release_date",
slug: "sale_value",
slug: "refund_sale",
slug: "net_result",
slug: "no-idea
slug: "status",
*/
