import React, { Fragment, useContext, useState, useCallback, useMemo, memo } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../api";
import { toast } from "react-toastify";
import {
  AuthContext,
  ActionTypes,
} from "../../contexts/AuthContext";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = memo(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ChangePasswordFormData>();

  const { toggleModal, updateAuthAction } = useContext(AuthContext);

  const [apiError, setApiError] = useState("");

  const onSubmit = useCallback(async (data: ChangePasswordFormData) => {
    try {
      setApiError("");
      const result = await api.put<{ success: boolean; message?: string }>(`/v1/users/change-password`, data);
      toast.success(result.message || "Done");
      toggleModal();
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      console.log("Error: ", error?.response?.data || e);
      toast.error(error?.response?.data?.message || "Invalid or expired token!");
    }
  }, [toggleModal]);

  const passwordValidation = useMemo(() => ({
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long",
    },
  }), []);

  const confirmPasswordValidation = useMemo(() => ({
    required: "Confirm password is required",
    validate: (value: string) =>
      value === getValues("newPassword") || "Passwords do not match",
  }), [getValues]);

  const FORM_FIELDS = useMemo(() => [
    {
      type: "password",
      fieldName: "currentPassword",
      label: "Old Password",
      validation: passwordValidation,
    },
    {
      type: "password",
      fieldName: "newPassword",
      label: "New Password",
      validation: passwordValidation,
    },
    {
      type: "password",
      fieldName: "confirmPassword",
      label: "Confirm Password",
      validation: confirmPasswordValidation,
    },
  ], [passwordValidation, confirmPasswordValidation]);

  const handleRedirectToLogin = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    toggleModal();
    updateAuthAction(ActionTypes.Login);
  }, [toggleModal, updateAuthAction]);

  return (
    <div className="flex flex-col items-center p-4 border-2 border-solid shadow-lg w-full border-foreground-night-400 bg-custom-gradient bg-blend-hard-light rounded-xl">
      <div className="self-start text-3xl font-semibold leading-10 text-white font-poppins font-weight-600">
        Change password
      </div>

      {apiError ? (
        <p className="text-red-600 text-lg my-2">{apiError}</p>
      ) : (
        <></>
      )}
      <form
        className="w-full mt-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {FORM_FIELDS.map((item, index: number) => {
          const fieldName = item.fieldName as keyof ChangePasswordFormData;
          return (
            <Fragment key={`reset-password-form-${index}`}>
              <input
                className={`flex w-full px-3 py-2 ${
                  index > 0 ? "mt-4" : ""
                } text-white border rounded-lg focus:ring focus:ring-indigo-300 bg-foreground-night-100 border-foreground-night-400`}
                type={item.type}
                placeholder={item.label}
                {...register(fieldName, item.validation)}
              />
              {errors[fieldName] && (
                <p className="mt-1 text-red-600 text-sm ml-1">
                  {errors[fieldName]?.message as string}
                </p>
              )}
            </Fragment>
          );
        })}

        <button
          className="flex items-center mt-4 justify-center self-stretch rounded-lg bg-primary-900-high-emphasis py-2 px-3 hover:bg-primary-900-medium-emphasis w-full text-white text-center font-inter text-lg font-semibold leading-[2.202rem]"
          type="submit"
        >
          Send
        </button>
      </form>
      <p className="mt-2 text-sm leading-10 text-gray-300 font-inter">
        Know Your Password?
        <a
          href="#"
          className="ml-1 font-semibold text-primary-900-high-emphasis"
          onClick={handleRedirectToLogin}
        >
          Sign in
        </a>
      </p>
    </div>
  );
});

ChangePassword.displayName = 'ChangePassword';

export default ChangePassword;
