export default defineNuxtPlugin(() => {
  const event = useRequestEvent()
  useAuthStore().setUser(event?.context.auth?.user ?? null)
})
