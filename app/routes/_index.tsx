import type { MetaFunction } from "@remix-run/node";
import {
  Form,
  useSubmit,
  useSearchParams,
  useLoaderData,
  ClientLoaderFunctionArgs,
  useNavigation,
} from "@remix-run/react";
import { config } from "../config";
import { createPublicClient, http, formatUnits, zeroAddress } from "viem";
import { abi } from "~/abis/abi1";
import { abi as abi2 } from "~/abis/abi2";
import { Spinner } from "~/components/Spinner";

export const meta: MetaFunction = () => {
  return [
    { title: "veNFT" },
    { name: "description", content: "Lookup veNFT data!" },
  ];
};

async function getCoinPrice(token: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${token}`
    )
      .then((resp) => resp.json())
      .then(({ pairs }) => pairs[0].priceUsd * 1);
    return res;
  } catch (e) {
    return 0;
  }
}

export async function clientLoader({
  request,
}: ClientLoaderFunctionArgs): Promise<null | {
  id: string;
  balance: string;
  amount: string;
  end: bigint;
  owner: string;
  price: number;
}> {
  const url = new URL(request.url);
  const venft = url.searchParams.get("venft");
  const id = url.searchParams.get("id");
  let client;
  if (venft && id) {
    const { chain, address, abi: venftAbi, underlying } = config[venft];
    client = createPublicClient({
      chain,
      transport: http(),
    });
    const [balance, decimals, owner] = await client.multicall({
      allowFailure: false,
      contracts: [
        {
          address,
          abi: abi,
          functionName: "balanceOfNFT",
          args: [BigInt(id)],
        },
        {
          address,
          abi: abi,
          functionName: "decimals",
        },
        {
          address,
          abi: abi,
          functionName: "ownerOf",
          args: [BigInt(id)],
        },
      ],
    });
    const price = await getCoinPrice(underlying);
    if (venftAbi === abi2) {
      const [data] = await client.multicall({
        allowFailure: false,
        contracts: [
          {
            address,
            abi: abi2,
            functionName: "locked",
            args: [BigInt(id)],
          },
        ],
      });
      return {
        id: id,
        balance: formatUnits(balance, decimals),
        amount: formatUnits(data.amount, decimals),
        end: data.end,
        owner,
        price,
      };
    }
    if (venftAbi === abi) {
      const [data] = await client.multicall({
        allowFailure: false,
        contracts: [
          {
            address,
            abi,
            functionName: "locked",
            args: [BigInt(id)],
          },
        ],
      });

      return {
        id: id,
        balance: formatUnits(balance, decimals),
        amount: formatUnits(data[0], decimals),
        end: data[1],
        owner,
        price,
      };
    }
  }
  return null;
}

export default function Index() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const venft = searchParams.get("venft");
  const data = useLoaderData<typeof clientLoader>();
  const groupedByChain = Object.entries(config).reduce((acc, [key, value]) => {
    if (!acc[value.chain.name]) {
      acc[value.chain.name] = [];
    }
    acc[value.chain.name].push(key);
    return acc;
  }, {} as Record<string, string[]>);
  console.log(navigation.state);
  return (
    <div className="mx-5">
      <h1 className="text-3xl my-5">
        Lookup {venft ? `${venft} ` : "veNFT"} data
      </h1>
      <Form method="get" action="/" className="grid gap-y-6">
        <div className="flex flex-wrap gap-3">
          {Object.entries(groupedByChain).map(([chainName, value]) => (
            <fieldset
              key={chainName}
              className="border border-gray-500 border-solid p-3 rounded-md"
            >
              <legend className="bg-black text-white px-3">{chainName}</legend>
              {value.map((key) => (
                <div key={key} className="flex items-center gap-x-1">
                  <input
                    id={key}
                    type="radio"
                    name="venft"
                    value={key}
                    defaultChecked={venft === key}
                    onChange={(e) => submit(e.currentTarget.form)}
                  />
                  <label htmlFor={key}>{key}</label>
                </div>
              ))}
            </fieldset>
          ))}
        </div>
        <div>
          <label htmlFor="id" className="flex gap-x-1 items-center">
            <span className="">NFT ID:</span>
            <input
              name="id"
              type="number"
              className="border border-gray-500 rounded-md px-2 py-2"
              onChange={(e) => submit(e.currentTarget.form)}
              defaultValue={data?.id || ""}
            />
          </label>
        </div>
        {!data && navigation.state === "loading" ? <Spinner /> : null}
        {data ? (
          <div
            className={`${
              navigation.state === "loading" ? "animate-pulse" : ""
            } relative border-solid rounded-lg border-black border-2 py-3 px-3`}
          >
            {navigation.state === "loading" ? (
              <div className="absolute bg-gray-500/50 animate-pulse left-0 top-0 right-0 bottom-0 flex items-center justify-center">
                <Spinner />
              </div>
            ) : null}
            <div className="space-y-3 sm:space-y-1">
              <div className="flex flex-col sm:flex-row">
                <span className="font-bold w-40 inline-block text-base">
                  {venft} ID:
                </span>{" "}
                <span>{data.id}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="font-bold w-40 inline-block text-base">
                  Owner:
                </span>{" "}
                <span>
                  {data.owner === zeroAddress ? (
                    <span className="break-all">{data.owner}</span>
                  ) : (
                    <a
                      href={`https://debank.com/profile/${data.owner}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-blue-500 break-all"
                    >
                      {data.owner}
                    </a>
                  )}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="font-bold w-40 inline-block text-base">
                  {venft?.replace("ve", "")} Locked:
                </span>{" "}
                <span>{(+data.amount).toLocaleString()}</span>
                {data.price && data.amount !== "0" ? (
                  <span>(${(data.price * +data.amount).toLocaleString()})</span>
                ) : null}
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="font-bold  w-40 inline-block">
                  {venft} Balance:
                </span>{" "}
                <span>{(+data.balance).toLocaleString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="font-bold  w-40 inline-block">Unlock:</span>{" "}
                <span>
                  {data.end !== 0n
                    ? new Date(Number(data.end) * 1000).toUTCString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </Form>
      <footer className="text-center text-black/50 text-xs">
        Built by{" "}
        <a
          href="https://github.com/oxSaturn/venft-lookup"
          className="underline text-blue-500"
        >
          oxSaturn
        </a>
      </footer>
    </div>
  );
}
