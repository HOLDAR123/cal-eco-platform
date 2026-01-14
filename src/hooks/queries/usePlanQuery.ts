import { useQuery } from '@tanstack/react-query';
import { planMethods } from '../../api';

export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const result = await planMethods.list();
      return result.data;
    },
  });
};

export const usePlanDetail = (id: number) => {
  return useQuery({
    queryKey: ['plans', id],
    queryFn: async () => {
      const result = await planMethods.detail(id);
      return result.data;
    },
    enabled: !!id,
  });
};
