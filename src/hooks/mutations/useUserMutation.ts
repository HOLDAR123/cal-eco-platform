import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userMethods } from '../../api';
import { UpdateUserDto } from '../../api/user/dto/user.dto';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateUserDto) => userMethods.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
