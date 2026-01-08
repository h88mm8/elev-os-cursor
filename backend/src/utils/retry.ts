interface RetryOptions {
  maxAttempts?: number
  delay?: number
  backoff?: 'linear' | 'exponential'
  onRetry?: (attempt: number, error: Error) => void
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    onRetry,
  } = options

  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < maxAttempts) {
        if (onRetry) {
          onRetry(attempt, lastError)
        }

        const waitTime =
          backoff === 'exponential'
            ? delay * Math.pow(2, attempt - 1)
            : delay * attempt

        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }
  }

  throw lastError!
}

// Retry específico para requisições HTTP
export async function retryRequest<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return retry(fn, {
    maxAttempts: 3,
    delay: 1000,
    backoff: 'exponential',
    onRetry: (attempt, error) => {
      console.log(`Tentativa ${attempt} falhou:`, error.message)
    },
    ...options,
  })
}

