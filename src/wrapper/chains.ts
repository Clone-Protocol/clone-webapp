import { Chain, arbitrum } from "wagmi/chains";
import { ethers } from "ethers";

interface ChainConfig {
  chain: Chain;
  contractAddresses: {
    pepe: string;
    pepe1M: string;
  };
}

function stringToAddress(string: string): `0x${string}` {
  return ethers.utils.getAddress(string) as `0x${string}`;
}


/**
 * Get chain configs defined by environment variables.
 */
export function getSupportedChainConfigs(): ChainConfig[] {
  const chainConfigs: ChainConfig[] = [];
  if (
    process.env.NEXT_PUBLIC_1MWRAPPED_PEPE_TOKEN_ADDR &&
    process.env.NEXT_PUBLIC_PEPE_TOKEN_ADDR
  ) {
    chainConfigs.push({
      chain: arbitrum,
      contractAddresses: {
        pepe: process.env.NEXT_PUBLIC_PEPE_TOKEN_ADDR,
        pepe1M: process.env.NEXT_PUBLIC_1MWRAPPED_PEPE_TOKEN_ADDR,
      },
    });
  }
  return chainConfigs;
}

/**
 * Get chains using supported chain configs.
 */
export function getSupportedChains(): Chain[] {
  return getSupportedChainConfigs().map((chainConfig) => chainConfig.chain);
}

/**
 * Get the first chain config from supported chains.
 */
export function getDefaultSupportedChainConfig(): ChainConfig {
  const chainConfigs = getSupportedChainConfigs();
  if (chainConfigs.length === 0) {
    throw new Error("Supported chain config is not found");
  } else {
    return chainConfigs[0];
  }
}

/**
 * Return config of specified chain if it supported, otherwise return config of default supported chain.
 */
export function chainToSupportedChainConfig(
  chain: Chain | undefined
): ChainConfig {
  for (const config of getSupportedChainConfigs()) {
    if (config.chain.id === chain?.id) {
      return config;
    }
  }
  return getDefaultSupportedChainConfig();
}

/**
 * Return id of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainId(
  chain: Chain | undefined
): number | undefined {
  return chainToSupportedChainConfig(chain).chain.id;
}

/**
 * Return native currency symbol of specified chain if it supported, otherwise return value from default supported chain.
 */
export function chainToSupportedChainNativeCurrencySymbol(
  chain: Chain | undefined
): string | undefined {
  return chainToSupportedChainConfig(chain).chain.nativeCurrency.symbol;
}

export function getPEPEContractAddress(
  chain: Chain | undefined
): `0x${string}` {
  return stringToAddress(
    chainToSupportedChainConfig(chain).contractAddresses.pepe
  );
}

export function getPEPE1MContractAddress(
  chain: Chain | undefined
): `0x${string}` {
  return stringToAddress(
    chainToSupportedChainConfig(chain).contractAddresses.pepe1M
  );
}
