import React from "react";
import { api } from "../api";
import { GoogleOAuthResponse } from "../api/auth/dto/auth.dto";

const GoogleLogin = () => {
  const handleClick = async () => {
    try {
      const response = await api.get<GoogleOAuthResponse>("/v1/auth/google");
      if (response && response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };
  return (
    <div>
      <button onClick={handleClick}>Click</button>
    </div>
  );
};

export default GoogleLogin;
