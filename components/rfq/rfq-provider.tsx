"use client";

import { RfqBadge } from "./rfq-badge";
import { RfqDrawer } from "./rfq-drawer";

export function RfqProvider() {
  return (
    <>
      <RfqBadge />
      <RfqDrawer />
    </>
  );
}
