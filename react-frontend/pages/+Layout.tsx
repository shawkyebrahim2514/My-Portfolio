// Global layout: the app shell that used to be rendered by src/App.tsx +
// src/Portfolio/index.tsx (ThemeContext, skip-link, sticky Navbar header,
// ErrorBoundary'd main) minus react-router-dom's BrowserRouter/Routes —
// Vike's file-system routing replaces that. Applies to every page since it
// lives at pages/+Layout.tsx (see https://vike.dev/Layout).
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import ThemeContext from '../src/contexts/ThemeContext';
import Navbar from '../src/components/Navbar';
import Loader from '../src/components/Loader';
import ErrorBoundary from '../src/components/ErrorBoundary';
import ShapeGridBackground from '../src/components/ShapeGridBackground';
import ClickSpark from '../src/components/ClickSpark';
import '../src/styles/tokens.css';
import '../src/index.css';
import styles from './Layout.module.css';

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <ThemeContext>
            <div className={styles.page}>
                <ShapeGridBackground />
                <ClickSpark />
                <a className={styles.skipLink} href="#main-content">Skip to main content</a>
                <div className={styles.inner}>
                    <Suspense fallback={<Loader />}>
                        <header className={styles.banner}>
                            <Navbar />
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
