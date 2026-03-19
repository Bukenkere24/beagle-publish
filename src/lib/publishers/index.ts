import type { PublishAdapter } from './types'
import { blogAdapter } from './blog-adapter'
import { linkedinCopyAdapter } from './linkedin-adapter'

export type { PublishAdapter, Draft, PublishResult } from './types'
export { blogAdapter } from './blog-adapter'
export { linkedinCopyAdapter } from './linkedin-adapter'

/** All registered adapters — add future destinations (twitter, medium) here. */
export const publishAdapters: PublishAdapter[] = [blogAdapter, linkedinCopyAdapter]
