import { ethers } from "ethers";

export interface EtherscanConfig {
  network?: string;
  apiKey?: string;
}

export interface Config extends EtherscanConfig {
  rpcUrl?: string;
  provider?: ethers.providers.JsonRpcProvider;
}

export interface EtherscanResponse {
  status: string;
  message: string;
}

export interface EtherscanError extends EtherscanResponse {
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
