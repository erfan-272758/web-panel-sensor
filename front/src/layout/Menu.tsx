import { useState } from "react";
import Box from "@mui/material/Box";

import {
  useTranslate,
  MenuItemLink,
  MenuProps,
  useSidebarState,
  DashboardMenuItem,
} from "react-admin";
import devices from "../devices";
import users from "../users";

type MenuName = "menuCatalog" | "menuSales" | "menuCustomers";

const Menu = ({ dense = false }: MenuProps) => {
  const [state, setState] = useState({
    menuCatalog: true,
    menuSales: true,
    menuCustomers: true,
  });
  const translate = useTranslate();
  const [open] = useSidebarState();

  const handleToggle = (menu: MenuName) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };

  return (
    <Box
      sx={{
        width: open ? 200 : 50,
        marginTop: 1,
        marginBottom: 1,
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      <DashboardMenuItem />
      {/* <DashboardMenuItem /> */}
      {/* <SubMenu
        handleToggle={() => handleToggle("menuSales")}
        isOpen={state.menuSales}
        name="pos.menu.sales"
        icon={<orders.icon />}
        dense={dense}
      >
        <MenuItemLink
          to="/commands"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.commands.name`, {
            smart_count: 2,
          })}
          leftIcon={<orders.icon />}
          dense={dense}
        />
        <MenuItemLink
          to="/invoices"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.invoices.name`, {
            smart_count: 2,
          })}
          leftIcon={<invoices.icon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuCatalog")}
        isOpen={state.menuCatalog}
        name="pos.menu.catalog"
        icon={<products.icon />}
        dense={dense}
      >
        <MenuItemLink
          to="/products"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.products.name`, {
            smart_count: 2,
          })}
          leftIcon={<products.icon />}
          dense={dense}
        />
        <MenuItemLink
          to="/categories"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.categories.name`, {
            smart_count: 2,
          })}
          leftIcon={<categories.icon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuCustomers")}
        isOpen={state.menuCustomers}
        name="pos.menu.customers"
        icon={<visitors.icon />}
        dense={dense}
      >
        <MenuItemLink
          to="/customers"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.customers.name`, {
            smart_count: 2,
          })}
          leftIcon={<visitors.icon />}
          dense={dense}
        />
        <MenuItemLink
          to="/segments"
          state={{ _scrollToTop: true }}
          primaryText={translate(`resources.segments.name`, {
            smart_count: 2,
          })}
          leftIcon={<LabelIcon />}
          dense={dense}
        />
      </SubMenu> */}
      <MenuItemLink
        to="/users"
        state={{ _scrollToTop: true }}
        primaryText={translate(`resources.users.name`, {
          smart_count: 2,
        })}
        leftIcon={<users.icon />}
        dense={dense}
      />
      <MenuItemLink
        to="/devices"
        state={{ _scrollToTop: true }}
        primaryText={translate(`resources.devices.name`, {
          smart_count: 2,
        })}
        leftIcon={<devices.icon />}
        dense={dense}
      />
    </Box>
  );
};

export default Menu;
