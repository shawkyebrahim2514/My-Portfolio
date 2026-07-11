// Global layout: the app shell that used to be rendered by src/App.tsx +
// src/Portfolio/index.tsx (ThemeContext, skip-link, sticky Navbar header,
// ErrorBoundary'd main) minus react-router-dom's BrowserRouter/Routes —
// Vike's file-system routing replaces that. Applies to every page since it
// lives at pages/+Layout.tsx (see https://vike.dev/Layout).
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { usePageContext } from 'vike-react/usePageContext';
import ThemeContext from '../src/contexts/ThemeContext';
import Navbar from '../src/components/Navbar';
import Loader from '../src/components/Loader';
import ErrorBoundary from '../src/components/ErrorBoundary';
import ShapeGridBackground from '../src/components/ShapeGridBackground';
import ClickSpark from '../src/components/ClickSpark';
import { themeStyle, kindAmbient, KIND_ACCENT } from '../src/containers/Hub/kindAccent';
import type { HubEntryKind } from '../src/Types';
import '../src/styles/tokens.css';
import '../src/index.css';
import styles from './Layout.module.css';

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
    // On a Hub entry page the page's data carries the entry kind. We promote
    // that kind's accent to the page's whole `--color-secondary-*` ramp so the
    // entire shell (navbar/footer included) adopts the hue. Every other page
    // has no `entry`, so `themeStyle` is skipped and the warm brand stays.
    const pageContext = usePageContext();
    const entry = (pageContext.data as { entry?: { kind?: HubEntryKind; accentColor?: string } } | undefined)?.entry;
    const kind = entry?.kind;
    const accentColor = entry?.accentColor;
    const themeVars = kind ? themeStyle(kind, accentColor) : undefined;
    const ambient = kind ? kindAmbient(kind, accentColor) : null;

    return (
        <ThemeContext>
            <div className={styles.page} style={themeVars}>
                <ShapeGridBackground hoverColor={ambient?.gridHover} />
                <ClickSpark color={ambient?.spark} />
                <a className={styles.skipLink} href="#main-content">Skip to main content</a>
                <div className={styles.inner}>
                    <Suspense fallback={<Loader />}>
                        <header className={styles.banner}>
                            <Navbar
                                readingProgress
                                progressAccent={kind ? (accentColor ?? KIND_ACCENT[kind]) : undefined}
                            />
                        </header>
                        <main id="main-content" tabIndex={-1} className={styles.main}>
                            <ErrorBoundary>
                                {children}
                            </ErrorBoundary>
                        </main>
                    </Suspense>
                </div>
            </div>
            <Analytics />
        </ThemeContext>
    );
}
