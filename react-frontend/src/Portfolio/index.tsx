import Navbar from '../components/Navbar';
import Contacts from '../containers/Contacts';
import { CSSProperties, Suspense, lazy } from 'react';
import Loader from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';
import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import { PortfolioPathes } from '../Types';
import backgroundImage from '../assets/background.svg';
import styles from './Portfolio.module.css';

const About = lazy(() => import('../containers/About'));
const Skills = lazy(() => import('../containers/Skills'));
const Education = lazy(() => import('../containers/Education'));
const Experience = lazy(() => import('../containers/Experience'));
const Projects = lazy(() => import('../containers/Projects'));

type PathElementRoutes = Record<PortfolioPathes, React.JSX.Element>

const pathElementRoutes: PathElementRoutes = {
    "": <About />,
    "skills": <Skills />,
    "education": <Education />,
    "experience": <Experience />,
    "projects": <Projects />,
    "contacts": <Contacts />,
}

export default function Portfolio() {
    return (
        <div
            className={styles.page}
            style={{ '--portfolio-bg': `url(${backgroundImage})` } as CSSProperties}>
            <a className={styles.skipLink} href="#main-content">Skip to main content</a>
            <div className={styles.inner}>
                <Suspense fallback={<Loader />}>
                    <BrowserRouter>
                        <header className={styles.banner}>
                            <Navbar />
                        </header>
                        <main id="main-content" tabIndex={-1} className={styles.main}>
                            <ErrorBoundary>
                                <Routes>
                                    {Object.entries(pathElementRoutes).map(([path, element]) => {
                                        return (
                                            <Route
                                                key={path}
                                                path={`/${path}`}
                                                element={element} />
                                        )
                                    })}
                                </Routes>
                            </ErrorBoundary>
                        </main>
                    </BrowserRouter>
                </Suspense>
            </div>
        </div>
    )
}