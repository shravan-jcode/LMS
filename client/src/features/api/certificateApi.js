import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CERTIFICATE_API = "http://localhost:8080/api/v1/certificate";

export const certificateApi = createApi({
  reducerPath: "certificateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CERTIFICATE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    generateCertificate: builder.mutation({
      query: (courseId) => ({
        url: `/generate/${courseId}`,
        method: "POST",
      }),
    }),
    getCertificate: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
    }),
    getAllCertificates: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGenerateCertificateMutation,
  useGetCertificateQuery,
  useGetAllCertificatesQuery,
} = certificateApi;
