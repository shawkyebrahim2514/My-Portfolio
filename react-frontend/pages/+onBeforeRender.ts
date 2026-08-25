// Shared shell data for every page. Runs at build/request time (not in the
// browser). Cached so prerender hits Sanity once for the logo, not once per route.
import type { OnBeforeRenderAsync } from 'vike/types'
import { getNavbarData } from '../src/APIs'
import type { SanityNavbarData } from '../src/Types'

const FALLBACK_NAVBAR: SanityNavbarData = { logo: 'SE' }

let navbarPromise: Promise<SanityNavbarData> | null = null

function loadNavbar() {
    navbarPromise ??= getNavbarData()
        .then((navbar) => navbar ?? FALLBACK_NAVBAR)
        .catch(() => FALLBACK_NAVBAR)
    return navbarPromise
}

export const onBeforeRender: OnBeforeRenderAsync = async () => {
    return {
        pageContext: {
            navbar: await loadNavbar(),
        },
    }
}
