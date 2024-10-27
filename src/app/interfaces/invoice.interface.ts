export interface Invoice {
    invoiceId: number | null
    invoiceNumber: string | null;
    invoiceSeq: number | null;
    supplierName: string | null;
    invoiceDate: string;
    currencyId: number;
    exchangeRate: number;
    paymentWayId: number;
    statusId: number;
    amount: number;
    totalAmountJOD: number;
    userId: number;
  }
  