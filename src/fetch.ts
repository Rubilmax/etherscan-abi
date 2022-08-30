import axios from "axios";
import { ethers } from "ethers";

import {
  getImplementationAddress,
  EIP1967ImplementationNotFound,
} from "@openzeppelin/upgrades-core";

import chainIds from "./constants/chainIds";
import rpcs from "./constants/rpcs.json";
import { getEtherscanUrl } from "./etherscan";
import { Config, EtherscanSourceCodeResponse, isEtherscanError } from "./types";

export const fetchAbiAt = async (
  address: string,
  { rpcUrl, network, apiKey, provider }: Config
) => {
  network ??= process.env.NETWORK || "mainnet";

  const chainId = ethers.utils.isHexString(network)
    ? parseInt(network, 16)
    : /^\d+$/.test(network)
    ? Number(network)
    : chainIds[network.toLowerCase()];

  rpcUrl ??=
    process.env.RPC_URL ||
    // @ts-ignore
    rpcs[chainId.toString()]?.rpcs[0];

  if (provider || rpcUrl) {
    try {
      address = await getImplementationAddress(
        provider || new ethers.providers.JsonRpcProvider(rpcUrl),
        address
      );
    } catch (error: any) {
      if (!(error instanceof EIP1967ImplementationNotFound)) throw error;
    }
  }

  const { data } = await axios.get<EtherscanSourceCodeResponse>(
    getEtherscanUrl(
      chainId,
      "contract",
      {
        action: "getsourcecode",
        address,
      },
      apiKey
    )
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

export const getContractAt = async (
  address: string,
  signerOrProvider?: ethers.providers.JsonRpcProvider | ethers.Signer
) => {
  return new ethers.Contract(
    address,
    (
      await fetchAbiAt(address, {
        provider: ethers.providers.Provider.isProvider(signerOrProvider)
          ? signerOrProvider
          : undefined,
      })
    ).abi,
    signerOrProvider
  );
};
