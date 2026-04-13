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

export interface UpdateOrderPayload {
  id: string;
  body: {
    userInfo: {
      name: string;
      email: string;
      phone: string;
    };
    cartItems: Array<{
      product: string;
      price: number;
      variations: Array<{
        quantity: number;
        size: string;
        color: string;
      }>;
    }>;
    shippingAddress: {
      city: string;
      district: string;
      details: string;
    };
  };
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
    updateOrder: builder.mutation<unknown, UpdateOrderPayload>({
      query: ({ id, body }) => ({
        url: `/api/v1/orders/${id}`,
        method: "PATCH",
        body,
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
  useUpdateOrderMutation,
  useLazyGetOrderByIdQuery,
} = orderApi;
