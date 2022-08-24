import axios from "axios";
import { ethers } from "ethers";

import {
  getImplementationAddress,
  EIP1967ImplementationNotFound,
} from "@openzeppelin/upgrades-core";

export interface EtherscanAbiResponse {
  status: string;
  message: string;
  result: string;
}

export const fetchAbiAt = async (
  address: string,
  {
    network = 1,
    apiKey,
    rpcUrl,
  }: { network: ethers.providers.Networkish; apiKey?: string; rpcUrl?: string }
) => {
  apiKey ??= process.env.ETHERSCAN_API_KEY;
  rpcUrl ??= process.env.RPC_URL || "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

  if (rpcUrl) {
    try {
      address = await getImplementationAddress(
        new ethers.providers.JsonRpcBatchProvider(rpcUrl),
        address
      );
    } catch (error: any) {
      if (!(error instanceof EIP1967ImplementationNotFound)) throw error;
    }
  }

  const res = await axios.get<EtherscanAbiResponse>(
    new ethers.providers.EtherscanProvider(network, apiKey).getUrl("contract", {
      action: "getabi",
      address,
    })
  );
  if (res.data.status !== "1") throw new Error(res.data.result);

  return JSON.parse(res.data.result);
};
