export interface InvoiceItem {
    invoiceId: number;
    seq: number;
    itemNo: string;
    quantity: number;
    fob: number;
    fobAmount: number;
    netAmount: number;
    totalAmount: number;
    serialNo: string;
    serialCode: string;
    taxTypeId: number;
    taxPercentage: number;
    taxAmount: number;
  }
  