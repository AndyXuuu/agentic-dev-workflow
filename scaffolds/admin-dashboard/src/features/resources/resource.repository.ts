import { resourceRows, type ResourceKey, type ResourceRow } from './resource.data'

const mockLatencyMs = 180

export async function listResourceRows(resource: ResourceKey, signal?: AbortSignal): Promise<ResourceRow[]> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve([...resourceRows[resource]])
    }, mockLatencyMs)
    const abort = () => {
      window.clearTimeout(timeout)
      reject(signal?.reason ?? new DOMException('Request aborted', 'AbortError'))
    }

    if (signal?.aborted) abort()
    else signal?.addEventListener('abort', abort, { once: true })
  })
}
