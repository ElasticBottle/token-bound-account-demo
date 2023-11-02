import { TokenboundClient } from "@tokenbound/sdk";
import { useEffect, useState } from "react";
import { useNetwork, useWalletClient } from "wagmi";

export const useTokenBoundClient = () => {
  const { data: walletClient, isLoading } = useWalletClient();
  const { chain } = useNetwork();
  const [tokenBoundClient, setTokenBoundClient] = useState<TokenboundClient>();
  useEffect(() => {
    if (isLoading || !walletClient || !chain?.id) return;

    const tokenboundClient = new TokenboundClient({
      walletClient,
      chainId: chain.id,
    });
    setTokenBoundClient(tokenboundClient);
  }, [chain?.id, isLoading, walletClient]);

  return {
    tokenBoundClient,
    isLoading,
  };
};
