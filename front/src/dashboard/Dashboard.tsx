import React, { useMemo, CSSProperties, useState, useEffect } from "react";
import { useGetList } from "react-admin";
import {
  useMediaQuery,
  Theme,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { subDays, startOfDay } from "date-fns";

import Welcome from "./Welcome";
import MonthlyRevenue from "./MonthlyRevenue";
import NbNewOrders from "./NbNewOrders";
import PendingOrders from "./PendingOrders";
import PendingReviews from "./PendingReviews";
import NewCustomers from "./NewCustomers";
import OrderChart from "./OrderChart";

import { Order } from "../types";
import localProvider from "../dataProvider/local";
import SensorChart from "./SensorChart";

interface OrderStats {
  revenue: number;
  nbNewOrders: number;
  pendingOrders: Order[];
}

interface State {
  nbNewOrders?: number;
  pendingOrders?: Order[];
  recentOrders?: Order[];
  revenue?: string;
}

const styles = {
  flex: { display: "flex" },
  flexColumn: { display: "flex", flexDirection: "column" },
  leftCol: { flex: 1, marginRight: "0.5em" },
  rightCol: { flex: 1, marginLeft: "0.5em" },
  singleCol: { marginTop: "1em", marginBottom: "1em" },
};

const Spacer = () => <span style={{ width: "1em" }} />;
const VerticalSpacer = () => <span style={{ height: "1em" }} />;

const Dashboard = () => {
  const [favs, setFavs] = useState(localProvider.getFavs());
  useEffect(() => {
    setFavs(localProvider.getFavs());
  });

  return (
    <>
      <Welcome />
      <VerticalSpacer />
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Favorite Charts
          </Typography>
          {favs?.length ? (
            favs.map((fav, i) => (
              <SensorChart {...fav} key={i + fav.sensor?.id} />
            ))
          ) : (
            <Typography>There is not any favorite chart</Typography>
          )}
        </CardContent>
      </Card>
      {/* <div style={styles.singleCol}>
      <OrderChart orders={recentOrders} />
    </div> */}
    </>
  );
};

export default Dashboard;
