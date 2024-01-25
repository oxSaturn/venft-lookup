import {
  type Chain,
  fantom,
  base,
  optimism,
  arbitrum,
  avalanche,
  mantle,
} from "viem/chains";
import { type Abi } from "viem";
import { abi } from "./abis/abi1";
import { abi as abi2 } from "./abis/abi2";
export const config: Record<
  string,
  {
    chain: Chain;
    address: `0x${string}`;
    abi: Abi;
    underlying: `0x${string}`; // to get price from dexscreener
  }
> = {
  veFVM: {
    chain: fantom,
    address: "0xae459ee7377fb9f67518047bba5482c2f0963236",
    abi: abi,
    underlying: "0x07BB65fAaC502d4996532F834A1B7ba5dC32Ff96",
  },
  veBVM: {
    chain: base,
    address: "0x91F85d68B413dE823684c891db515B0390a02512",
    abi: abi,
    underlying: "0xd386a121991E51Eab5e3433Bf5B1cF4C8884b47a",
  },
  veVelo: {
    chain: optimism,
    address: "0xFAf8FD17D9840595845582fCB047DF13f006787d",
    abi: abi2,
    underlying: "0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db",
  },
  veAero: {
    chain: base,
    address: "0xebf418fe2512e7e6bd9b87a8f0f294acdc67e6b4",
    abi: abi2,
    underlying: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
  },
  veRAM: {
    chain: arbitrum,
    address: "0xaaa343032aa79ee9a6897dab03bef967c3289a06",
    abi,
    underlying: "0xAAA6C1E32C55A7Bfa8066A6FAE9b42650F262418",
  },
  veEqual: {
    chain: fantom,
    address: "0x8313f3551c4d3984ffbadfb42f780d0c8763ce94",
    abi,
    underlying: "0x3Fd3A0c85B70754eFc07aC9Ac0cbBDCe664865A6",
  },
  vePhar: {
    chain: avalanche,
    address: "0xAAAEa1fB9f3DE3F70E89f37B69Ab11B47eb9Ce6F",
    abi,
    underlying: "0xAAAB9D12A30504559b0C5a9A5977fEE4A6081c6b",
  },
  veCleo: {
    chain: mantle,
    address: "0xAAAEa1fB9f3DE3F70E89f37B69Ab11B47eb9Ce6F",
    abi,
    underlying: "0xC1E0C8C30F251A07a894609616580ad2CEb547F2",
  },
  veScale: {
    chain: base,
    address: "0x28c9c71c776a1203000b56c0cca48bef1cd51c53",
    abi,
    underlying: "0x54016a4848a38f257B6E96331F7404073Fd9c32C",
  },
  veHRA: {
    chain: arbitrum,
    address: "0x44ccA4FB1737F6A5DEb2AC1Bc1F3D4075bBF9db4",
    abi,
    underlying: "0xE594b57E7F11ec1E8Af9f003F74Fa52B7aefdc9F",
  },
  veCHR: {
    chain: arbitrum,
    address: "0x9A01857f33aa382b1d5bb96C3180347862432B0d",
    abi,
    underlying: "0x15b2fb8f08E4Ac1Ce019EADAe02eE92AeDF06851",
  }
};
