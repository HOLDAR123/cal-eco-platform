import { useMutation, useQueryClient } from '@tanstack/react-query';
import { walletMethods } from '../../api';
import { CreateWalletDto } from '../../api/wallet/dto/wallet.dto';

export const useAddWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateWalletDto) => walletMethods.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
};

export const useRemoveWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => walletMethods.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
};
