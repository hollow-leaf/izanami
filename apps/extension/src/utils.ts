function isEthereumAddress(address: string): boolean {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethereumAddressRegex.test(address);
  }

export function extractEthereumAddress(content: string): string | null {
    const ethereumAddressRegex = /0x[a-fA-F0-9]{40}/;
    const match = content.match(ethereumAddressRegex);
    return match ? match[0] : null;
  }
  