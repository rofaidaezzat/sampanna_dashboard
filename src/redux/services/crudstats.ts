import { baseApi } from "./baseApi";

export interface DashboardStats {
  totalProducts?: number;
  totalOrders?: number;
  totalMessages?: number;
  totalRevenue?: number;
  [key: string]: unknown;
}

export interface StatsResponse {
  status: string;
  code: number;
  message: string;
  data: DashboardStats;
}

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<StatsResponse, void>({
      query: () => ({
        url: "/api/v1/stats",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetStatsQuery } = statsApi;
