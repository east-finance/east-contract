type SourceFn = (...args: any[]) => any

type RunPollingArgs = {
  sourceFn: SourceFn, 
  predicateFn: (result: any) => boolean,
  pollInterval: number,
  timeout: number,
}

export class PollingTimeoutError extends Error {}

export async function runPolling(namedArgs: RunPollingArgs): Promise<string | number | boolean | PollingTimeoutError> {
  const { sourceFn, predicateFn, pollInterval, timeout } = namedArgs
  return new Promise(resolve => {
    let pollTimerId: NodeJS.Timeout
    let isTimeoutErrorResolved = false
    const errorTimeoutId = setTimeout(() => {
      if (pollTimerId) {
        clearTimeout(pollTimerId)
      }
      isTimeoutErrorResolved = true
      resolve(new PollingTimeoutError('Timeout error.'))
    }, timeout)

    async function temp() {
      const result = await sourceFn();
      if (predicateFn(result)) {
        clearTimeout(errorTimeoutId)
        resolve(result)
        return
      }
      if (isTimeoutErrorResolved) {
        return
      }
      pollTimerId = setTimeout(() => {
        temp()
      }, pollInterval)
    }
    
    temp()
  })
}