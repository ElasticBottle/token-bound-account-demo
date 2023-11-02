export type SimpleHashResponseType = {
  next?: string;
  previous?: string;
  nfts: {
    contract_address: string;
    token_id: string;
    name: string;
    description: string;
    image_url: string;
    previews: {
      image_medium_url: string;
      image_small_url: string;
      predominant_color: string;
    };
    contract: {
      type: "ERC721" | "ERC1155";
      name: string;
      symbol: string;
    };
    collection: {
      collection_id: string;
      name: string;
      description: string;
      image_url: string;
    };
  }[];
};
