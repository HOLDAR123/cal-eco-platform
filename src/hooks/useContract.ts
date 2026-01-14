/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from "react";

import { AddressZero } from "@ethersproject/constants";
import { Contract, ContractInterface } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { Signer } from "@ethersproject/abstract-signer";
import { Provider } from "@ethersproject/providers";
import { useSignerOrProvider } from "./useSignerOrProvider";

function getContract<T = Contract>(address: string, abi: ContractInterface, provider: Signer | Provider) {
  return <T>(<unknown>new Contract(address, abi, provider));
}

// heavily inspired by uniswaps interface, thanks Noah, great work!
export function useContract<Contract>(address: string, abi: ContractInterface) {
  const signerOrProvider = useSignerOrProvider();

  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  const contract = signerOrProvider
    ? useMemo(
        () => getContract<Contract>(address, abi, signerOrProvider),
        [address, abi, signerOrProvider]
      )
    : undefined;

  return contract;
}
