export type VoucherCode = {
  voucher_code: string;
  id: number;
  amount: number;
  exp_days: number;
};

export type SKUCode = {
  name: string;
  id: number;
  gift_type: string | null;
};

export type Branch = {
  name: string;
  id: number;
};

export type Customer = {
  id: number;
  name: string;
  phoneNo: string;
  email: string;
  type: string;
  project: string;
  csc: string;
  remarks: string;
};

export type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  branch: string;
};

export type ApprovalFormInputs = {
  description: string;
  voucher: null | VoucherCode;
  voucherCode?: string;
  voucherAmount?: number;
  customer: null | Customer;
  approverOne: null | Employee;
  approverTwo: null | Employee;
  approver_1?: number;
  approver_2?: number | null;
  customer_id?: number;
};
