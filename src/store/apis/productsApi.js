import { createApi } from "@reduxjs/toolkit/query/react";
import api from "../../config/axios";

const axiosBaseQuery =
  () =>
  async ({ url, method = "get", params, data }) => {
    try {
      const result = await api({
        url,
        method,
        params,
        data,
      });

      return { data: result.data };
    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Products", "Product", "Categories"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => ({
        url: "/products",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Products", id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    getCategories: builder.query({
      query: () => ({
        url: "/categories",
      }),
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
} = productsApi;
