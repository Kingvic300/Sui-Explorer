
/**
 * A mock wallet address generator.
 */
const generateSuiAddress = (): string =>
  `0x${[...Array(64)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('')}`;

/**
 * WalletService class to encapsulate wallet connection logic.
 * This provides a mock implementation for now, preparing for future SDK integration.
 */
class WalletService {
  /**
   * Simulates connecting to a wallet.
   * @returns A promise that resolves with a mock wallet address.
   */
  public async connect(): Promise<string> {
    // Simulate wallet connection popup and user approval delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const account = generateSuiAddress();
    return account;
  }

  /**
   * Simulates disconnecting from a wallet.
   */
  public disconnect(): void {
    // In a real scenario, this would call the SDK's disconnect method.
    console.log('Wallet disconnected via service.');
  }
}

// Export a singleton instance of the service
export const walletService = new WalletService();
