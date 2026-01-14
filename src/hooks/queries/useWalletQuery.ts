import { useQuery } from '@tanstack/react-query';
import { walletMethods } from '../../api';

export const useWallets = () => {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const result = await walletMethods.list();
      return result.data;
    },
  });
};
