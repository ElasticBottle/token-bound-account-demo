import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Grid,
  Heading,
  Image,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { api } from "~/trpc/react";
import { TokenBoundModal } from "./token-bound-modal";

export const AccountSelection = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  if (!isConnected) {
    throw new Error("AccountSelection should only be rendered when connected");
  }
  const [page, setPage] = useState("");
  const { isLoading, data } = api.nft.getUserNft.useQuery(
    {
      address: address ?? "",
      chainId: chain?.id ?? 1,
      next: page,
    },
    {
      enabled: !!address && !!chain?.id,
    },
  );
  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner />
      </Center>
    );
  }
  const nfts = data?.nfts.filter((nft) => nft.contract.type === "ERC721");
  console.log("nfts", nfts);
  return (
    <Stack p={10} alignItems={"center"} gap={10}>
      <Heading>Choose your Avatar</Heading>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(5, 1fr)",
        }}
        gap={10}
      >
        {nfts?.map((nft) => {
          if (!nft.name && !nft.previews.image_small_url) {
            return;
          }
          return (
            <TokenBoundModal
              key={nft.contract_address + nft.token_id}
              nft={nft}
            >
              <Card
                h="80"
                w="64"
                bg={nft.previews.predominant_color}
                alignItems={"center"}
              >
                <CardHeader className="truncate" w="64">
                  {nft.name ?? nft.collection.name}
                </CardHeader>
                <CardBody>
                  <Image
                    src={nft.previews.image_small_url}
                    alt={nft.name}
                    width={200}
                    height={200}
                    rounded={"md"}
                  />
                </CardBody>
              </Card>
            </TokenBoundModal>
          );
        })}
      </Grid>

      <Flex justifyContent={"space-between"} w="full" maxW="4xl" mx="auto">
        {data?.previous && (
          <Button
            onClick={() => {
              setPage(data.previous ?? "");
            }}
          >
            Previous
          </Button>
        )}
        {data?.next && (
          <Flex w="full" justifyContent={"end"}>
            <Button
              onClick={() => {
                setPage(data.next ?? "");
              }}
            >
              Next
            </Button>
          </Flex>
        )}
      </Flex>
    </Stack>
  );
};
