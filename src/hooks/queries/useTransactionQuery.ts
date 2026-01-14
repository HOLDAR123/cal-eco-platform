import { useQuery } from '@tanstack/react-query';
import { transactionMethods } from '../../api';

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const result = await transactionMethods.list();
      return result.data;
    },
  });
};
