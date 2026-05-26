const SUPABASE_TIMEOUT_MS = 1500

export function withSupabaseTimeout<T>(request: PromiseLike<T>) {
  return Promise.race<T | null>([
    Promise.resolve(request),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), SUPABASE_TIMEOUT_MS)),
  ])
}
