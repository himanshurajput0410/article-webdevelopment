export function useApi<T>(url: string, options?: Parameters<typeof useFetch<T>>[1]) {
  const config = useRuntimeConfig()

  return useFetch<T>(url, {
    baseURL: config.public.apiBase || '/api',
    ...options,
  })
}
