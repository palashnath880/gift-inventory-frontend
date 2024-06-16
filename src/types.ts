export type User = {
  id: number;
  name: string;
  email: string;
  branch: string;
  branch_id: string;
  role: string;
  roleLabel: string;
  availableBal: number;
  assignedBal: number;
  issuedGift: number;
  availableGift: number;
};

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

export type ApprovalItem = {
  appro_1_note: string;
  appro_2_note: string;
  appro_end_by: number;
  appro_end_date: string;
  appro_ender_name: string;
  approver_1: number;
  approver_1_name: string;
  approver_2: number;
  approver_2_name: string;
  created_at: string;
  customer_id: number;
  customer_name: string;
  customer_phone_no: string;
  description: string;
  id: number;
  redeemed_date: string;
  redeemer_id: number;
  redeemer_name: string;
  sender_id: number;
  sender_name: string;
  branch_id: number;
  branch_name: string;
  status: "open" | "approved" | "rejected" | "transferred" | "redeemed";
  voucher_amount: number;
  voucher_code: string;
  transferred_date: string;
};
export type StockType = {
  id: number;
  stock: "entry" | "transfer";
  receiver_branch: number;
  receiver_branch_name: string;
  sender_branch: number;
  sender_branch_name: string;
  // receiver_employee: number;
  sender_employee: number;
  name: string;
  type: string;
  sku_code: string;
  remarks: string;
  quantity: number;
  status: "open" | "received" | "rejected";
  end_date: string;
  end_by: number;
  created_at: string;
};
