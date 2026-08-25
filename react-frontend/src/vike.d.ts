import type { SanityNavbarData } from './Types'

declare global {
    namespace Vike {
        interface PageContext {
            navbar: SanityNavbarData
        }
    }
}

export {}
