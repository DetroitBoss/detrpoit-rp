import { TransactionType } from "./../enums/transactionType.enum";
export interface Transaction {
  type: TransactionType;
  amount: number;
  target?: string;
  id?: number;
  shop?: string;
  category?: string;
}
