import axios from "axios";
import { ethers } from "ethers";

import {
  getImplementationAddress,
  EIP1967ImplementationNotFound,
} from "@openzeppelin/upgrades-core";

interface EtherscanResponse {
  status: string;
  message: string;
}

interface EtherscanError extends EtherscanResponse {
  result: string;
}

export interface EtherscanSourceCodeResponse extends EtherscanResponse {
  result:
    | {
        SourceCode: string;
        ABI: string;
        ContractName: string;
        CompilerVersion: string;
        OptimizationUsed: string;
        Runs: string;
        ConstructorArguments: string;
        EVMVersion: string;
        Library: string;
        LicenseType: string;
        Proxy: string;
        Implementation: string;
        SwarmSource: string;
      }[];
}

export const isEtherscanError = (data: EtherscanResponse): data is EtherscanError =>
  data.status !== "1";

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

  const etherscan = new ethers.providers.EtherscanProvider(network, apiKey);
  const { data } = await axios.get<EtherscanSourceCodeResponse>(
    etherscan.getUrl("contract", {
      action: "getsourcecode",
      address,
    })
  );
  if (isEtherscanError(data)) throw new Error(data.result);

  try {
    return {
      name: data.result[0].ContractName,
      abi: JSON.parse(data.result[0].ABI),
    };
  } catch {
    throw new Error(data.result[0].ABI);
  }
};
