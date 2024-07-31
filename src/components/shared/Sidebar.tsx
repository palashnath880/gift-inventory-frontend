import {
  Add,
  Approval,
  Assessment,
  BarChart,
  Home,
  InsertDriveFile,
  Lock,
  Logout,
  Paid,
  People,
  PermMedia,
  PersonAdd,
  Policy,
  QrCode2,
  Receipt,
  Redeem,
  Remove,
  Send,
  Wc,
} from "@mui/icons-material";
import { Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/logo.webp";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { logOut } from "../../features/auth/authSlice";
import { bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import PasswordChangeDialog from "./PasswordChangeDialog";
import {
  Menu,
  MenuItem,
  Sidebar as ReactSidebar,
  SubMenu,
} from "react-pro-sidebar";
import { NavLink } from "react-router-dom";

interface NavMenuType {
  href: string;
  icon: React.ReactNode;
  label: string;
  group?: boolean;
  menus?: { href: string; icon: React.ReactNode; label: string }[];
}

const NavItem = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <MenuItem component={<NavLink to={href} />} key={href}>
      <Typography variant="body1" className="!flex gap-2 items-center">
        {icon}
        {label}
      </Typography>
    </MenuItem>
  );
};

export default function Sidebar() {
  // change password popup
  const changePwd = usePopupState({ variant: "popover", popupId: "pwdChange" });

  // react-redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // mui theme
  const theme = useTheme();

  // nav menus
  const employeeMenus: NavMenuType[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: <Home fontSize="small" />,
    },
    {
      href: "",
      label: "Customers",
      icon: <Wc fontSize="small" />,
      group: true,
      menus: [
        {
          href: "/customers",
          label: "All Customers",
          icon: <Wc fontSize="small" />,
        },
        {
          href: "/create-customer",
          label: "Create Customer",
          icon: <PersonAdd fontSize="small" />,
        },
      ],
    },
    {
      label: "Gift",
      href: "",
      icon: <Redeem fontSize="small" />,
      group: true,
      menus: [
        {
          href: "/allocated/gift",
          label: "Gift Redeem",
          icon: <Remove fontSize="small" />,
        },
        {
          href: "/gift-stock",
          label: "CSC Stock",
          icon: <BarChart fontSize="small" />,
        },
        // {
        //   href: "/gift-transfer",
        //   label: "Gift Transfer",
        //   icon: <LocalShipping fontSize="small" />,
        // },
        {
          href: "/gift-receive",
          label: "Gift Receive",
          icon: <Add fontSize="small" />,
        },
      ],
    },
    {
      label: "Voucher Redeem",
      href: "/allocated/voucher",
      icon: <Paid fontSize="small" />,
    },
    {
      label: "Approval",
      href: "",
      icon: <Approval fontSize="small" />,
      group: true,
      menus: [
        {
          href: "/my-approval",
          label: "My Approval",
          icon: <Send fontSize="small" />,
        },
        {
          href: "/receive-approval",
          label: "Receive Approval",
          icon: <Receipt fontSize="small" />,
        },
      ],
    },
    {
      href: "/csat-policy",
      label: "CSAT Policy",
      icon: <Policy fontSize="small" />,
    },
    {
      href: "/gallery",
      label: "Gallery",
      icon: <PermMedia fontSize="small" />,
    },
    {
      label: "Reports",
      href: "",
      icon: <InsertDriveFile fontSize="small" />,
      group: true,
      menus: [
        {
          href: "/customers-report",
          label: "Customers Report",
          icon: <Assessment fontSize="small" />,
        },
        {
          href: "/allocation-report",
          label: "Allocation Report",
          icon: "",
        },
        {
          href: "/redemption-report",
          label: "Redemption Report",
          icon: "",
        },
        {
          href: "/approval-report",
          label: "Approval Report",
          icon: "",
        },
        {
          href: "/employee-report",
          label: "Employee Report",
          icon: "",
        },
      ],
    },
  ];

  // admin menus
  const adminMenus: NavMenuType[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: <Home fontSize="small" />,
    },
    {
      href: "/employees",
      label: "Employees",
      icon: <People fontSize="small" />,
    },
    {
      href: "/customers",
      label: "Customers",
      icon: <People fontSize="small" />,
    },
    {
      href: "/gift-sku-code",
      label: "Gift SKU Code",
      icon: <QrCode2 fontSize="small" />,
    },
    {
      href: "",
      label: "Gift Stock",
      icon: <BarChart fontSize="small" />,
      group: true,
      menus: [
        {
          href: "/stock-entry",
          label: "Stock Entry",
          icon: "",
        },
        {
          href: "/stock-transfer",
          label: "Stock Transfer",
          icon: "",
        },
        {
          href: "/own-stock",
          label: "Own Stock",
          icon: "",
        },
        {
          href: "/branch-stock",
          label: "CSC Stock",
          icon: "",
        },
      ],
    },
    {
      href: "",
      label: "Reports",
      icon: <Assessment fontSize="small" />,
      group: true,
      menus: [
        {
          href: "/reports/branch",
          label: "CSC",
          icon: "",
        },
        {
          href: "/customers",
          label: "Customers",
          icon: "",
        },
        {
          href: "/reports/employee",
          label: "Employee",
          icon: "",
        },
        {
          href: "/reports/allocation",
          label: "Allocation / Redemption",
          icon: "",
        },
      ],
    },
  ];

  const menusArr = user?.isAdmin ? adminMenus : employeeMenus;

  return (
    <>
      {/* sidebar */}
      <div className="w-64 !bg-white h-screen relative">
        <div className="absolute top-0 left-0 w-full h-full flex flex-col py-4 scrollbar overflow-y-auto">
          <div className="flex flex-col items-center pb-2">
            <img src={logo} className="w-24 h-auto" />
            <Typography variant="h6" className="!font-bold !text-primary">
              CSAT Portal
            </Typography>
          </div>
          <div className="flex-1 px-4">
            <ReactSidebar
              style={{
                width: "100%",
                minWidth: "100%",
                borderWidth: 0,
              }}
              rootStyles={{
                ["& .ps-sidebar-container"]: {
                  backgroundColor: "transparent",
                },
                ["& .ps-submenu-content"]: {
                  paddingLeft: 15,
                },
              }}
            >
              <Menu
                menuItemStyles={{
                  button: {
                    [`&.active`]: {
                      backgroundColor: theme.palette.primary.main,
                      color: "#f2f2f2",
                    },
                    borderRadius: 7,
                  },
                }}
                rootStyles={{
                  ["& .ps-submenu-expand-icon"]: { display: "flex" },
                  ["& .ps-menu-button"]: {
                    paddingLeft: 10,
                    paddingRight: 10,
                    height: 45,
                  },
                }}
              >
                {menusArr.map((menu, index) => (
                  <>
                    {menu?.group ? (
                      <SubMenu
                        label={
                          <Typography
                            variant="body1"
                            className="!flex gap-2 items-center"
                          >
                            {menu.icon}
                            {menu.label}
                          </Typography>
                        }
                        key={index}
                      >
                        {menu?.menus?.map((item, menuIndex) => (
                          <NavItem key={menuIndex} {...item} />
                        ))}
                      </SubMenu>
                    ) : (
                      <NavItem key={index} {...menu} />
                    )}
                  </>
                ))}
              </Menu>
            </ReactSidebar>
          </div>

          <div className="px-3 mt-4">
            <Divider className="!bg-primary" />
            <div
              {...bindTrigger(changePwd)}
              className="rounded-md mt-4 flex cursor-pointer items-center gap-4 py-3 duration-200 px-2.5 bg-opacity-15 bg-primary text-primary"
            >
              <Lock fontSize="small" />
              <Typography variant="body1">Change Password</Typography>
            </div>
            <div
              onClick={() => dispatch(logOut())}
              className="rounded-md mt-2 flex cursor-pointer items-center gap-4 py-3 duration-200 px-2.5 hover:bg-opacity-15 bg-primary text-white hover:text-primary"
            >
              <Logout fontSize="small" />
              <Typography variant="body1">Logout</Typography>
            </div>
          </div>
        </div>
      </div>

      {/* password change dialog */}
      <PasswordChangeDialog popupState={changePwd} />
    </>
  );
}
