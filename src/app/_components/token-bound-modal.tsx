import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Addreth } from "addreth";
import React from "react";
import { useNetwork } from "wagmi";
import { useTokenBoundAccount } from "~/hooks/use-token-bound-account";
import { useTokenBoundClient } from "~/hooks/use-token-bound-client";
import { api } from "~/trpc/react";
import { type SimpleHashResponseType } from "~/types/simple-hash";

export const TokenBoundModal = ({
  nft,
  children,
}: {
  nft: SimpleHashResponseType["nfts"][number];
  children: React.ReactNode;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading, tokenboundAccount } = useTokenBoundAccount(nft);
  const { isLoading: isLoadingClient, tokenBoundClient } =
    useTokenBoundClient();
  const { chain } = useNetwork();
  const { data, isLoading: isLoadingAccountNft } = api.nft.getUserNft.useQuery(
    { address: tokenboundAccount, chainId: chain?.id ?? 1 },
    {
      enabled: !isLoading && !!chain?.id && isOpen,
    },
  );

  const createAccount = async () => {
    if (isLoadingClient || !tokenBoundClient) {
      return;
    }
    await tokenBoundClient.createAccount({
      tokenContract: nft.contract_address as `0x${string}`,
      tokenId: nft.token_id,
    });
  };

  const nfts = data?.nfts;
  return (
    <>
      <Box w="full" _hover={{ cursor: "pointer" }} onClick={onOpen}>
        {children}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>
            {nft.name ?? nft.collection.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack alignItems={"center"}>
              {!isLoading && (
                <Addreth
                  address={tokenboundAccount}
                  ens={false}
                  icon={() => (
                    <Image
                      src={nft.previews.image_small_url}
                      alt={nft.name}
                      width={10}
                      height={10}
                      rounded={"md"}
                    />
                  )}
                  explorer={(address) => {
                    return {
                      accountUrl: `${chain?.blockExplorers?.default.url}/address/${address}`,
                      name: chain?.blockExplorers?.default.name ?? "",
                    };
                  }}
                />
              )}
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
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" onClick={createAccount}>
              Select Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
