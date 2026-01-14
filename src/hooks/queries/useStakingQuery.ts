import { useQuery } from '@tanstack/react-query';
import { stakingMethods } from '../../api';

export const useStakingList = () => {
  return useQuery({
    queryKey: ['staking'],
    queryFn: async () => {
      const result = await stakingMethods.list();
      return result.data;
    },
  });
};
