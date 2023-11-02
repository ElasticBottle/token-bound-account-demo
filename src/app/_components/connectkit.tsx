"use client";

import { ConnectKitProvider } from "connectkit";
import React from "react";
import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "~/lib/wagmi";

export const ConnectKitProviderClient = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
};
