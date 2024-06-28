import Employees from "./Employees";
import GiftSKUCode from "./GiftSKUCode";
import Home from "./Home";
import EmployeeReport from "./reports/Employee";
import Customers from "./reports/customer/Customers";
import Branch from "./reports/Branch";
import RedemptionReport from "./reports/Redemption";
import BranchStock from "./stock/BranchStock";
import Stock from "./stock/Stock";
import StockEntry from "./stock/StockEntry";
import StockTransfer from "./stock/StockTransfer";
import CustomerReport from "./reports/customer/CustomerReport";
import AllocationReport from "./reports/Allocation";

const Admin: any = {};

Admin.Home = Home;
Admin.BranchReport = Branch;
Admin.Customers = Customers;
Admin.CustomerReport = CustomerReport;
Admin.EmployeeReport = EmployeeReport;
Admin.RedemptionReport = RedemptionReport;
Admin.AllocationReport = AllocationReport;
Admin.Stock = Stock;
Admin.StockEntry = StockEntry;
Admin.StockTransfer = StockTransfer;
Admin.Employees = Employees;
Admin.GiftSKUCode = GiftSKUCode;
Admin.BranchStock = BranchStock;

export { Admin };
