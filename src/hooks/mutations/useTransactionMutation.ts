import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionMethods } from '../../api';
import { CreateDepositDto } from '../../api/transaction/dto/transaction.dto';

export const useCreateDeposit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateDepositDto) => transactionMethods.createDeposit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
