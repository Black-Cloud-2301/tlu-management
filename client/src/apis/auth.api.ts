import axios from "axios";
import { LoginResponseType } from "../types/jwt.type";
import { LoginInput } from "../types/login.type";
import { UserResponseType } from "../types/user.type";
import http from "../utils/http";

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export const loginUserFn = async (user: LoginInput) => {
  try {
    const response = await http.post<LoginResponseType>("signin", user);

    if (response.status === 200) {
      localStorage.setItem(
        "access_token",
        JSON.stringify(response.data.access_token)
      );
      localStorage.setItem(
        "refresh_token",
        JSON.stringify(response.data.refresh_token)
      );
    }
    return response;
  } catch (error) {
    //FIXME: need throw error
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      throw error;
    } else {
      throw new Error("Different error than axios");
    }
  }
};

export const getMeFn = async () => {
  const response = await http.get<UserResponseType>("users/me");
  return response.data;
};
