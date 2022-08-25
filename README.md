# etherscan-abi

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> ⏬🚀 Fetch the most up-to-date ABI of a verified Smart Contract from Etherscan in seconds!

## Install

```bash
npm install etherscan-abi
```

```bash
yarn add etherscan-abi
```

## Usage

- Fetch the ABI of a contract from an address and save it to `abis/ContractName.json`:

```bash
npx etherscan-abi 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984
```

- You can optionally provide a `target` directory path, an Etherscan `apiKey` (to bypass the default query rate limit):

```bash
npx etherscan-abi --target abis/uniswap/ --apiKey ... 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984
```

[build-img]: https://github.com/rubilmax/etherscan-abi/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/rubilmax/etherscan-abi/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/etherscan-abi
[downloads-url]: https://www.npmtrends.com/etherscan-abi
[npm-img]: https://img.shields.io/npm/v/etherscan-abi
[npm-url]: https://www.npmjs.com/package/etherscan-abi
[issues-img]: https://img.shields.io/github/issues/rubilmax/etherscan-abi
[issues-url]: https://github.com/rubilmax/etherscan-abi/issues
[codecov-img]: https://codecov.io/gh/rubilmax/etherscan-abi/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/rubilmax/etherscan-abi
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
