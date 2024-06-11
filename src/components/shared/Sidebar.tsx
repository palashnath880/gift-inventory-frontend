import {
  Add,
  Approval,
  BarChart,
  ExpandLess,
  ExpandMore,
  Home,
  LocalShipping,
  Logout,
  Paid,
  PermMedia,
  PersonAdd,
  Policy,
  Receipt,
  Redeem,
  Remove,
  Send,
  Star,
  Wc,
} from "@mui/icons-material";
import { Collapse, Divider, List, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.webp";

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
  const [navActive, setNavActive] = useState<boolean>(false);

  useEffect(() => {
    if (navActive) {
      typeof onActive === "function" && onActive(navActive);
    }
  }, [navActive, onActive]);

  return (
    <NavLink
      to={href}
      className={({ isActive }) => {
        setNavActive(isActive);
        return `rounded-md flex items-center gap-4 py-3 duration-200 px-2.5 hover:bg-opacity-15 hover:bg-primary hover:text-primary ${
          isActive && "bg-primary bg-opacity-20"
        }`;
      }}
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
  // nav menus
  const menus: NavMenuType[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: <Home fontSize="small" />,
    },
    {
      href: "/create-customer",
      label: "Create Customer",
      icon: <PersonAdd fontSize="small" />,
    },
    {
      href: "/customers",
      label: "Customers",
      icon: <Wc fontSize="small" />,
    },
    {
      label: "Gift",
      href: "",
      icon: <Redeem fontSize="small" />,
      group: true,
      menus: [
        {
          href: "/redeem/gift",
          label: "Gift Redeem",
          icon: <Remove fontSize="small" />,
        },
        {
          href: "/gift-stock",
          label: "Gift Stock",
          icon: <BarChart fontSize="small" />,
        },
        {
          href: "/gift-transfer",
          label: "Gift Transfer",
          icon: <LocalShipping fontSize="small" />,
        },
        {
          href: "/gift-receive",
          label: "Gift Receive",
          icon: <Add fontSize="small" />,
        },
      ],
    },
    {
      label: "Voucher Redeem",
      href: "redeem/voucher",
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
  ];

  return (
    <div className="w-64 !bg-white h-screen relative">
      <div className="absolute top-0 left-0 w-full h-full flex flex-col py-4 overflow-y-auto">
        <div className="flex flex-col items-center pb-2">
          <img src={logo} className="w-24 h-auto" />
          <Typography variant="h6" className="!font-bold !text-primary">
            Gift Inventory
          </Typography>
        </div>
        <div className="flex-1">
          <List component="div" className="!px-4">
            {menus.map((menu, index) => (
              <NavMenuItem key={index} menu={menu} />
            ))}
          </List>
        </div>
        <div className="px-3">
          <Divider />
          <div className="rounded-md mt-2 flex cursor-pointer items-center gap-4 py-3 duration-200 px-2.5 hover:bg-opacity-15 bg-primary text-white hover:text-primary">
            <Logout fontSize="small" />
            <Typography variant="body1">Logout</Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
