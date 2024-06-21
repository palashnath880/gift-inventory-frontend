import Home from "./Home";
import Allocation from "./reports/Allocation";
import Customer from "./reports/Customer";
import Department from "./reports/Department";
import Redeemed from "./reports/Redeemed";
import Stock from "./stock/Stock";
import StockEntry from "./stock/StockEntry";
import StockTransfer from "./stock/StockTransfer";

const Admin: any = {};

Admin.Home = Home;
Admin.DepartmentReport = Department;
Admin.CustomerReport = Customer;
Admin.AllocationReport = Allocation;
Admin.RedeemedReport = Redeemed;
Admin.Stock = Stock;
Admin.StockEntry = StockEntry;
Admin.StockTransfer = StockTransfer;

export { Admin };
