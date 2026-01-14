import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stakingMethods } from '../../api';
import { CreateStakingDto, ClaimStakingDto, SellStakingDto } from '../../api/staking/dto/staking.dto';

export const useCreateStaking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStakingDto) => stakingMethods.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staking'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useClaimStaking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ClaimStakingDto) => stakingMethods.claim(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staking'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useSellStaking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SellStakingDto) => stakingMethods.sell(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staking'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
