import { ResourceList } from '../features/resources/ResourceList'
import type { ResourceKey } from '../features/resources/resource.data'

export function ResourceListPage({ resource }: { resource: ResourceKey }) {
  return <ResourceList resource={resource} />
}
