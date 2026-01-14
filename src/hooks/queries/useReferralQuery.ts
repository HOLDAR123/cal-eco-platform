import { useQuery } from '@tanstack/react-query';
import { referralMethods } from '../../api';

export const useReferrals = () => {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: async () => {
      const result = await referralMethods.list();
      return result.data;
    },
  });
};

export const useReferralEarnings = () => {
  return useQuery({
    queryKey: ['referrals', 'earnings'],
    queryFn: async () => {
      const result = await referralMethods.earnings();
      return result.data;
    },
  });
};
