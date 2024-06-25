import Employees from "./Employees";
import GiftSKUCode from "./GiftSKUCode";
import Home from "./Home";
import AllocationRedemption from "./reports/Allocation";
import Customer from "./reports/Customer";
import Branch from "./reports/Branch";
import Redeemed from "./reports/Redeemed";
import BranchStock from "./stock/BranchStock";
import Stock from "./stock/Stock";
import StockEntry from "./stock/StockEntry";
import StockTransfer from "./stock/StockTransfer";

const Admin: any = {};

Admin.Home = Home;
Admin.BranchReport = Branch;
Admin.CustomerReport = Customer;
Admin.AllocationRedemption = AllocationRedemption;
Admin.RedeemedReport = Redeemed;
Admin.Stock = Stock;
Admin.StockEntry = StockEntry;
Admin.StockTransfer = StockTransfer;
Admin.Employees = Employees;
Admin.GiftSKUCode = GiftSKUCode;
Admin.BranchStock = BranchStock;

export { Admin };
