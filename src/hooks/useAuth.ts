import { loginState } from "@/recoil/loginState";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { User } from "@/components/login/types";
import { login } from "@/app/apis/auth/apis";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

export function useAuth() {
  const [loginInputMessage, setLoginInputMessage] = useState(false);
  const [isLogin, setIsLogin] = useRecoilState<boolean>(loginState);
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["refresh_token"]);

  const { mutate } = useMutation(
    (user: User) => login(user.id, user.password),
    {
      onSuccess: (response) => {
        console.log(response.data.token.access_token);
        localStorage.setItem("access_token", response.data.token.access);
        setCookie("refresh_token", response.data.token.refresh);
        setLoginInputMessage(false);
        setIsLogin(true);
        router.replace("/");
        // localStorage.setItem('access_token',loginData.)
      },
      onError: (error) => {
        console.log(error);
        setLoginInputMessage(true);
      },
    }
  );
  const logout = () => {
    removeCookie("refresh_token");
    localStorage.removeItem("access_token");
    setIsLogin(false);
  };
  return { loginInputMessage, mutate, logout };
}