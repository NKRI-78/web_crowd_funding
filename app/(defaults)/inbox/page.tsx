import React from "react";

import type { Metadata } from "next";
import Inbox from "@/app/components/notif/inbox/Inbox";

export const metadata: Metadata = {
  title: "Inbox | CapBridge",
  description: "Inbox",
};

const InboxPage: React.FC = () => {
  return <Inbox />;
};

export default InboxPage;
