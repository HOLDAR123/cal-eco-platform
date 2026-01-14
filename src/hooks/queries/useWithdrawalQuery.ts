import { useQuery } from '@tanstack/react-query';
import { withdrawalMethods } from '../../api';

export const useWithdrawals = () => {
  return useQuery({
    queryKey: ['withdrawals'],
    queryFn: async () => {
      const result = await withdrawalMethods.list();
      return result.data;
    },
  });
};
