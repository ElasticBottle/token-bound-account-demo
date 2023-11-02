import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type SimpleHashResponseType } from "~/types/simple-hash";

const chainIdToSimpleHashName = {
  80001: "polygon-mumbai",
  5: "ethereum-goerli",
  420: "optimism-goerli",
  84531: "base-goerli",
  59140: "linea-testnet",
  137: "polygon",
  1: "ethereum",
  10: "optimism",
  8453: "base",
  59144: "linea",
};

export const nftRouter = createTRPCRouter({
  getUserNft: publicProcedure
    .input(
      z.object({
        address: z.string(),
        chainId: z.number(),
        next: z.string().optional(),
      }),
    )
    .query(async ({ input }): Promise<SimpleHashResponseType> => {
      if (input.next) {
        const metadata = await fetch(input.next, {
          headers: {
            "X-API-KEY": env.SIMPLE_HASH_API_KEY,
          },
        });
        return metadata.json();
      }
      const baseUrl = new URL("https://api.simplehash.com/api/v0/nfts/owners");
      baseUrl.searchParams.set(
        "chains",
        chainIdToSimpleHashName[input.chainId as 80001],
      );
      baseUrl.searchParams.set("wallet_addresses", input.address);
      baseUrl.searchParams.set("limit", "10");
      const metadata = await fetch(baseUrl.href, {
        headers: {
          "X-API-KEY": env.SIMPLE_HASH_API_KEY,
        },
      });
      return metadata.json();
    }),
});
