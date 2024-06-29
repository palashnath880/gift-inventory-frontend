export type User = {
  id: number;
  name: string;
  email: string;
  branch: string;
  branch_id: string;
  isAdmin: boolean;
  role: string;
  roleLabel: string;
  availableBal: number;
  assignedBal: number;
  issuedGift: number;
  availableGift: number;
};

export type SKUCode = {
  name: string;
  id: number;
  gift_type: string | null;
  createdAt: string;
  item_name: string;
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
  employeeId: string;
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
  redeemed_type: "otp" | "manual";
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

export type BranchStock = {
  quantity: number;
  sku_code: string;
  type: string;
  name: string;
  redeem_quantity: number;
  branch_id: number;
};

export type AdminStock = {
  quantity: number;
  sku_code: string;
  type: string;
  name: string;
  redeem_quantity: number;
};

export type AllocateFormInputs = {
  so: string;
  quantity?: number;
  voucherCode?: null | VoucherCode;
  skuCode?: null | SKUCode;
  comment?: string;
};

export type GiftReceivedReportItem = {
  id: string;
  ender_name: string;
  end_date: string;
  status: "open" | "received" | "rejected";
  created_at: string;
  name: string;
  sku_code: string;
  type: string;
  remarks: string;
  quantity: number;
};

export type AllocateItem = {
  branch_name: string;
  created_at: string;
  creator_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  end_date: string;
  gift_quantity: number;
  gift_sku_code: string;
  gift_type: string;
  id: number;
  redeem_by: "otp" | "manual";
  redeemer_name: string;
  so: string;
  status: "open" | "rejected" | "closed";
  voucher_amount: number;
  voucher_code: string;
};

export type CustomerReports = {
  id: number;
  name: string;
  phone_no: string;
  email: string;
  type_name: string;
  project_name: string;
  branch_name: string;
  remarks: string;
  allocate_gift: number;
  redeem_gift: number;
  allocate_approval: number;
  redeem_approval: number;
  allocate_voucher: number;
  redeem_voucher: number;
};

export type AssetsType = {
  name: string;
  id: string;
  createdAt: string;
};

export type EmployeeRole = {
  name: string;
  id: number;
  giftLimit: number;
  amountLimit: number;
  createdAt: string;
};

export type VoucherCode = {
  name: string;
  id: number;
  amount: number;
  expDays: number;
  createdAt: string;
  allowedRoles: string[];
};

export type AllocatedItem = {
  created_at: string;
  creator_id: string;
  cus_email: string;
  cus_phone: string;
  cus_name: string;
  customer_id: string;
  end_date: string | null;
  gift_quantity: number;
  gift_sku_code: string;
  gift_type: string;
  id: number;
  redeem_by: "otp" | "manual";
  redeem_type: "gift" | "voucher";
  so: string;
  comment: string;
  manual_reason: string;
  status: "open" | "rejected" | "closed";
  voucher_amount: number;
  voucher_code: string;
  branch: string;
  allocated_by: string;
  redeemer_name: string;
};
