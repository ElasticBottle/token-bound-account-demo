import { useEffect, useState } from "react";
import { type SimpleHashResponseType } from "~/types/simple-hash";
import { useTokenBoundClient } from "./use-token-bound-client";

export const useTokenBoundAccount = (
  nft: SimpleHashResponseType["nfts"][number],
) => {
  const { isLoading, tokenBoundClient } = useTokenBoundClient();
  const [tokenboundAccount, setTokenboundAccount] =
    useState<`0x${string}`>("0x");
  useEffect(() => {
    if (isLoading || !tokenBoundClient) return;
    const tokenboundAccount = tokenBoundClient.getAccount({
      tokenContract: nft.contract_address as `0x${string}`,
      tokenId: nft.token_id,
    });
    setTokenboundAccount(tokenboundAccount);
  }, [isLoading, nft.contract_address, nft.token_id, tokenBoundClient]);

  return {
    tokenboundAccount,
    isLoading,
  };
};
