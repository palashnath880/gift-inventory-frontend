import {
  Add,
  Approval,
  Assessment,
  BarChart,
  ExpandLess,
  ExpandMore,
  Home,
  InsertDriveFile,
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
  Star,
  Wc,
} from "@mui/icons-material";
import { Collapse, Divider, List, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";
import logo from "../../assets/logo.webp";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { logOut } from "../../features/auth/authSlice";

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
  onActive,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onActive?: (isActive: boolean) => void;
}) => {
  // state
  const resolve = useResolvedPath(href);
  const match = useMatch({ path: resolve.pathname });

  useEffect(() => {
    if (typeof onActive === "function") {
      onActive(!!match);
    }
  }, [match]);

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `rounded-md flex items-center gap-4 py-3 duration-200 px-2.5 hover:bg-opacity-15 hover:bg-primary hover:text-primary ${
          isActive && "bg-primary bg-opacity-20"
        }`
      }
    >
      {icon}
      <Typography variant="body1">{label}</Typography>
    </NavLink>
  );
};

const NavMenuItem = ({
  menu: { icon, href, label, group, menus },
}: {
  menu: NavMenuType;
}) => {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {group ? (
        <>
          <li
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md flex items-center cursor-pointer justify-between gap-2 py-3 duration-200 px-2.5 hover:bg-opacity-15 hover:bg-primary hover:text-primary"
          >
            <span className="flex items-center gap-4">
              {icon}
              <Typography variant="body1">{label}</Typography>
            </span>
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </li>

          {/* collapse sub menu  */}
          <Collapse in={isOpen} className="!pl-4">
            <List component="div" disablePadding>
              {menus?.map((submenu, index) => (
                <NavItem
                  href={submenu.href}
                  icon={submenu.icon || <Star fontSize="small" />}
                  label={submenu.label}
                  key={index}
                  onActive={(isActive) => setIsOpen(isActive)}
                />
              ))}
            </List>
          </Collapse>
        </>
      ) : (
        <NavItem href={href} icon={icon} label={label} />
      )}
    </>
  );
};

export default function Sidebar() {
  // react-redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

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
          label: "Branch Stock",
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
          label: "Branch Stock",
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
          href: "/reports",
          label: "Department",
          icon: "",
        },
        {
          href: "/reports/customer",
          label: "Customer",
          icon: "",
        },
        {
          href: "/reports/allocation",
          label: "Allocation",
          icon: "",
        },
        {
          href: "/reports/redeemed",
          label: "Redeemed",
          icon: "",
        },
      ],
    },
  ];

  return (
    <div className="w-64 !bg-white h-screen relative">
      <div className="absolute top-0 left-0 w-full h-full flex flex-col py-4 overflow-y-auto">
        <div className="flex flex-col items-center pb-2">
          <img src={logo} className="w-24 h-auto" />
          <Typography variant="h6" className="!font-bold !text-primary">
            CSAT Portal
          </Typography>
        </div>
        <div className="flex-1">
          <List component="div" className="!px-4">
            {/* employee menus */}
            {!user?.isAdmin && (
              <>
                {employeeMenus.map((menu, index) => (
                  <NavMenuItem key={index} menu={menu} />
                ))}
              </>
            )}

            {/* admin menus */}
            {user?.isAdmin && (
              <>
                {adminMenus.map((menu, index) => (
                  <NavMenuItem key={index} menu={menu} />
                ))}
              </>
            )}
          </List>
        </div>
        <div className="px-3 mt-4">
          <Divider className="!bg-primary" />
          <div
            onClick={() => dispatch(logOut())}
            className="rounded-md mt-4 flex cursor-pointer items-center gap-4 py-3 duration-200 px-2.5 hover:bg-opacity-15 bg-primary text-white hover:text-primary"
          >
            <Logout fontSize="small" />
            <Typography variant="body1">Logout</Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
