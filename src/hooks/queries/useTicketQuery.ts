import { useQuery } from '@tanstack/react-query';
import { ticketMethods } from '../../api';

export const useTickets = () => {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const result = await ticketMethods.list();
      return result.data;
    },
  });
};

export const useTicketMessages = (ticketId: number) => {
  return useQuery({
    queryKey: ['tickets', ticketId, 'messages'],
    queryFn: async () => {
      const result = await ticketMethods.messages(ticketId);
      return result.data;
    },
    enabled: !!ticketId,
  });
};
