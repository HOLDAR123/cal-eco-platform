import { useEffect, useContext } from "react";
import { ACCESS_TOKEN_LOCAL_STORAGE } from "../constants/common";
import { AuthContext, IUser } from "../contexts/AuthContext";
import { useAuthMe, useUserMe } from "./queries";
import { useLogout as useLogoutMutation } from "./mutations";
import { AuthResponseData } from "../api/auth/dto/auth.dto";

const useAuth = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(AuthContext);

  const { data: authData } = useAuthMe();
  const { data: userData } = useUserMe();
  const logoutMutation = useLogoutMutation();

  const login = (data: AuthResponseData | { authToken?: string; [key: string]: unknown }) => {
    const authToken = 'authToken' in data ? data.authToken : '';
    const id = 'id' in data ? data.id : (data as { [key: string]: unknown }).id;
    const address = 'address' in data ? data.address : (data as { [key: string]: unknown }).address;
    const referral_code = 'referral_code' in data ? data.referral_code : (data as { [key: string]: unknown }).referral_code;
    
    const userData: IUser = {
      _id: String(id || ''),
      firstName: '',
      lastName: '',
      email: typeof address === 'string' ? address : '',
      username: typeof referral_code === 'string' ? referral_code : undefined,
    };
    setUser(userData);
    if (authToken) {
      setIsAuthenticated(true);
      localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE, authToken);
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (authData) {
      const userData: IUser = {
        _id: String(authData.id),
        firstName: '',
        lastName: '',
        email: authData.address,
        username: authData.referral_code,
      };
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, [authData, setUser, setIsAuthenticated]);

  useEffect(() => {
    if (userData) {
      const user: IUser = {
        _id: String(userData.id),
        firstName: '',
        lastName: '',
        email: userData.address,
        username: userData.referral_code,
      };
      setUser(user);
      setIsAuthenticated(true);
    }
  }, [userData, setUser, setIsAuthenticated]);

  return { user, login, logout, isAuthenticated };
};

export default useAuth;
