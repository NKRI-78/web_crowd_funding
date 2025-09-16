import React from "react";
import Transaction from "../notif/transaction/Transaction";

interface Props {
  h?: string;
}

const DashboardTransaction: React.FC<Props> = (props) => {
  return <Transaction />;
};

export default DashboardTransaction;
