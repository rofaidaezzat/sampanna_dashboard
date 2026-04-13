import { baseApi } from "./baseApi";

export interface OrderListResponse<TOrder = unknown> {
  status: string;
  code: number;
  message: string;
  results?: number;
  pagination?: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: TOrder[];
}

export interface OrderDetailsResponse<TOrder = unknown> {
  status: string;
  code: number;
  message: string;
  data: TOrder;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<OrderListResponse, void>({
      query: () => ({
        url: "/api/v1/orders",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    deleteOrder: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/api/v1/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
    getOrderById: builder.query<OrderDetailsResponse, string>({
      query: (id) => ({
        url: `/api/v1/orders/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
  useLazyGetOrderByIdQuery,
} = orderApi;
