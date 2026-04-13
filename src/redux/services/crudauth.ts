import { baseApi } from "./baseApi";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  code: number;
  message: string;
  token?: string;
  accessToken?: string;
  data?: {
    admin?: {
      _id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    token?: string;
    accessToken?: string;
  };
  [key: string]: unknown;
}

const getTokenFromResponse = (response: LoginResponse): string | null => {
  const token =
    response?.token ??
    response?.accessToken ??
    response?.data?.token ??
    response?.data?.accessToken;

  return typeof token === "string" ? token : null;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = getTokenFromResponse(data);

          if (token) {
            localStorage.setItem("token", token);
          }
        } catch {
          // Ignore token writes on login failures.
        }
      },
    }),
    logout: builder.mutation<unknown, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          localStorage.removeItem("token");
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
