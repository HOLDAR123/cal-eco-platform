import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawalMethods } from '../../api';
import { CreateWithdrawalDto } from '../../api/withdrawal/dto/withdrawal.dto';

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateWithdrawalDto) => withdrawalMethods.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useCancelWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => withdrawalMethods.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
    },
  });
};
