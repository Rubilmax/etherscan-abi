#!/usr/bin/env node
import colors from "colors/safe";
import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";
import dotenv from "dotenv";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

import { fetchAbiAt } from "./fetch";

dotenv.config();

const optionDefinitions = [
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Display this usage guide.",
  },
  {
    name: "contract",
    type: String,
    multiple: true,
    description: "The addresses of contract to fetch ABIs of.",
    typeLabel: "<address>",
    defaultOption: true,
    defaultValue: [],
  },
  {
    name: "target",
    alias: "t",
    type: String,
    description: "The path to the directory inside which to save ABIs.",
    typeLabel: "<path>",
    defaultValue: "abis",
  },
  {
    name: "network",
    alias: "n",
    type: String,
    description: "The network on which to fetch ABIs.",
    typeLabel: "<network>",
    defaultValue: "mainnet",
  },
  {
    name: "apiKey",
    alias: "k",
    type: String,
    description: "The Etherscan API Key to use to fetch ABIs.",
    typeLabel: "<string>",
    defaultValue: undefined,
  },
  {
    name: "rpcUrl",
    alias: "r",
    type: String,
    description:
      "The RPC URL to use to query for implementation address (only used in case of proxies).",
    typeLabel: "<url>",
    defaultValue: undefined,
  },
];

const options = commandLineArgs(optionDefinitions) as {
  help: boolean;
  contract: string[];
  target: string;
  network: ethers.providers.Networkish;
};

const help = commandLineUsage([
  {
    header: "Etherscan ABI Fetcher",
    content:
      "⏬🚀 Fetch the most up-to-date ABI of a verified Smart Contract from Etherscan in seconds!",
  },
  {
    header: "Options",
    optionList: optionDefinitions,
  },
  {
    content: "Project home: {underline https://github.com/rubilmax/etherscan-abi}",
  },
]);

const fetchAbis = () => {
  if (options.contract.length === 0) {
    console.error(colors.red("No contract address specified."));
    return console.log(help);
  }

  if (!fs.existsSync(options.target)) fs.mkdirSync(options.target, { recursive: true });

  return Promise.all(
    options.contract.map(async (address) => {
      try {
        const { name, abi } = await fetchAbiAt(address, options);

        const targetPath = path.join(options.target, `${name}.json`);
        fs.writeFileSync(targetPath, JSON.stringify(abi, null, 2));

        console.log(
          colors.green(
            `Successfully saved ABI for ${colors.bold(address)} at ${colors.bold(targetPath)}`
          )
        );
      } catch (error: any) {
        console.log(
          colors.red(
            `Error while fetching ABI for ${colors.bold(address)}: ${colors.bold(error.message)}`
          )
        );
      }
    })
  );
};

if (options.help) console.log(help);
else void fetchAbis();
