import { useQuery } from '@tanstack/react-query';
import { notificationMethods } from '../../api';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const result = await notificationMethods.list();
      return result.data;
    },
  });
};
