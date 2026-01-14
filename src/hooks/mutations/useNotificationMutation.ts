import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationMethods } from '../../api';

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => notificationMethods.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
