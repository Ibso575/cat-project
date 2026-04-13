import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../config/supabase";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SUPABASE_URL,
    prepareHeaders: async (headers) => {
      const token = (await supabase.auth.getSession()).data.session
        ?.access_token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("apikey", import.meta.env.VITE_SUPABASE_ANON_KEY);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase.from("products").select("*");
        if (error) return { error: error.message };
        return { data };
      },
    }),
    getProductById: builder.query({
      queryFn: async (id) => {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        if (error) return { error: error.message };
        return { data };
      },
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = supabaseApi;
