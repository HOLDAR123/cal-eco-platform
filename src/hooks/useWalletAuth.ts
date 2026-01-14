import { useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useLogin } from './mutations';
import useAuth from './useAuth';
import { enqueueSnackbar } from 'notistack';

export const useWalletAuth = () => {
  const { account, provider } = useWeb3React();
  const { login } = useAuth();
  const loginMutation = useLogin();
  const hasAuthenticated = useRef(false);

  useEffect(() => {
    if (!account || !provider || hasAuthenticated.current) return;

    const authenticateWallet = async () => {
      try {
        hasAuthenticated.current = true;
        const message = `Please sign this message to authenticate with Cal Eco Platform.\n\nAddress: ${account}\n\nThis request will not trigger a blockchain transaction or cost any fees.`;
        
        const signer = provider.getSigner();
        const signature = await signer.signMessage(message);

        const result = await loginMutation.mutateAsync({
          address: account,
          signature: signature,
        });

        login(result as unknown as { authToken: string; [key: string]: unknown });
        enqueueSnackbar('Wallet connected and authenticated successfully!', {
          variant: 'success',
        });
      } catch (error: unknown) {
        hasAuthenticated.current = false;
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage && !errorMessage.includes('User rejected') && !errorMessage.includes('User closed')) {
          enqueueSnackbar('Authentication failed. Please try again.', {
            variant: 'error',
          });
        }
      }
    };

    authenticateWallet();
  }, [account, provider, loginMutation, login]);

  useEffect(() => {
    if (!account) {
      hasAuthenticated.current = false;
    }
  }, [account]);
};
