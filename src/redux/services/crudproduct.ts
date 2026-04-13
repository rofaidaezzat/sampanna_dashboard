import { baseApi } from "./baseApi";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface ProductListResponse {
  status: string;
  code: number;
  message: string;
  results: number;
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: Product[];
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<unknown, FormData>({
      query: (body) => ({
        url: "/api/v1/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<
      unknown,
      { id: string; body: FormData | Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/api/v1/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getAllProducts: builder.query<ProductListResponse, void>({
      query: () => ({
        url: "/api/v1/products",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
} = productApi;
