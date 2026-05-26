export function isSupabaseSchemaCacheMiss(error: unknown) {
  if (!error || typeof error !== "object") return false

  const details = error as { code?: unknown; message?: unknown }
  const message = typeof details.message === "string" ? details.message : ""

  return details.code === "PGRST205" || message.includes("schema cache")
}

export function logUnexpectedSupabaseError(message: string, error: unknown) {
  if (isSupabaseSchemaCacheMiss(error)) return
  console.error(message, error)
}
