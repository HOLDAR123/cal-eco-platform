import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { urlToJson } from "../services/common.service";
import { useRegister } from "../hooks/mutations";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

const GoogleRedirect = () => {
  const { login } = useAuth();
  const registerMutation = useRegister();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const payload = urlToJson(location.search);
        const response = await registerMutation.mutateAsync({
          address: payload.email || '',
          signature: payload.token || '',
        });
        login(response as unknown as { authToken: string; [key: string]: unknown });
        navigate("/");
      } catch (e: unknown) {
        const error = e as { response?: { data?: { message?: string } } };
        console.log(e);
        toast.error(error?.response?.data?.message || "Something went wrong!");
        navigate("/");
      }
    })();
  }, [location.search, login, navigate, registerMutation]);

  return <div>Hello World redirect</div>;
};

export default GoogleRedirect;
