import { baseApi } from "./baseApi";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactListEnvelope {
  status: string;
  code: number;
  message: string;
  data: {
    results: number;
    pagination: {
      currentPage: number;
      limit: number;
      numberOfPages: number;
    };
    data: ContactMessage[];
  };
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContact: builder.query<ContactMessage[], void>({
      query: () => ({
        url: "/api/v1/contact-us",
        method: "GET",
      }),
      transformResponse: (response: ContactListEnvelope) => response.data.data,
      providesTags: ["Contact"],
    }),
  }),
});

export const { useGetContactQuery } = contactApi;
