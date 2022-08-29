import axios from "axios";
import { ethers } from "ethers";

import {
  getImplementationAddress,
  EIP1967ImplementationNotFound,
} from "@openzeppelin/upgrades-core";

import chainIds from "./constants/chainIds";
import rpcs from "./constants/rpcs.json";
import { Config, EtherscanConfig, EtherscanSourceCodeResponse, isEtherscanError } from "./types";

export const fetchAbiAt = async (address: string, { rpcUrl, network, apiKey }: Config) => {
  network ??= process.env.NETWORK || "mainnet";

  const chainId = network.startsWith("0x")
    ? parseInt(network, 16)
    : /^\d+$/.test(network)
    ? Number(network)
    : chainIds[network.toLowerCase()];

  rpcUrl ??=
    process.env.RPC_URL ||
    // @ts-ignore
    rpcs[chainId.toString()]?.rpcs[0];

  if (rpcUrl) {
    console.log(rpcUrl, address);
    try {
      address = await getImplementationAddress(
        new ethers.providers.JsonRpcProvider(rpcUrl),
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

export const getEtherscanBaseUrl = (chainId: number) => {
  if (process.env.ETHERSCAN_BASE_URL) return process.env.ETHERSCAN_BASE_URL;

  switch (chainId) {
    case 1:
      return "https://api.etherscan.io";
    case 3:
      return "https://api-ropsten.etherscan.io";
    case 4:
      return "https://api-rinkeby.etherscan.io";
    case 5:
      return "https://api-goerli.etherscan.io";
    case 10:
      return "https://api-optimistic.etherscan.io";
    case 25:
      return "https://api.cronoscan.com/";
    case 42:
      return "https://api-kovan.etherscan.io";
    case 56:
      return "https://api.bscscan.com/";
    case 69:
      return "https://api-kovan-optimistic.etherscan.io";
    case 97:
      return "https://api-testnet.bscscan.com/";
    case 100:
      return "https://api.gnosisscan.io/";
    case 137:
      return "https://api.polygonscan.com/";
    case 250:
      return "https://api.ftmscan.com/";
    case 420:
      return "https://api-goerli-optimistic.etherscan.io";
    case 4002:
      return "https://api-testnet.ftmscan.com/";
    case 42161:
      return "https://api.arbiscan.io/";
    case 43114:
      return "https://api.snowtrace.io/";
    case 80001:
      return "https://api-testnet.polygonscan.com/";
    default:
  }

  throw new Error(
    "Unsupported network: please specify a network scan base URL via the ETHERSCAN_BASE_URL environment variable"
  );
};

export const getEtherscanUrl = (
  chainId: number,
  module: string,
  params: Record<string, string>,
  apiKey?: string
) => {
  apiKey ??= process.env.ETHERSCAN_API_KEY || "";

  const query = Object.keys(params).reduce((accum, key) => {
    const value = params[key];
    if (value != null) {
      accum += `&${key}=${value}`;
    }
    return accum;
  }, "");

  return `${getEtherscanBaseUrl(chainId)}/api?module=${module}${query}${apiKey}`;
};
