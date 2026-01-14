import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketMethods } from '../../api';
import { CreateTicketDto, AddMessageDto } from '../../api/ticket/dto/ticket.dto';

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTicketDto) => ticketMethods.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useAddTicketMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: number; data: AddMessageDto }) =>
      ticketMethods.addMessage(ticketId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};
