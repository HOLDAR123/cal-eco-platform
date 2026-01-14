import { useQuery } from '@tanstack/react-query';
import { userMethods } from '../../api';
import { ACCESS_TOKEN_LOCAL_STORAGE } from '../../constants/common';
import axios from 'axios';

export const useUserMe = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      try {
        const result = await userMethods.getMe();
        return result.data;
      } catch (error) {
        if (axios.isAxiosError(error) && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE),
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          return false;
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};
