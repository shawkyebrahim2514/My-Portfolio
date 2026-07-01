import Navbar from '../components/Navbar';
import Contacts from '../containers/Contacts';
import { CSSProperties, Suspense, lazy } from 'react';
import Loader from '../components/Loader';
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
const MarkdownEditor = lazy(() => import('../containers/MarkdownEditor'));

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
            <div className={styles.inner}>
                <Suspense fallback={<Loader />}>
                    <BrowserRouter>
                        <Navbar />
                        <Routes>
                            {Object.entries(pathElementRoutes).map(([path, element]) => {
                                return (
                                    <Route
                                        key={path}
                                        path={`/${path}`}
                                        element={element} />
                                )
                            })}
                            {/* Markdown editor is a dev-only authoring tool, not shipped in production routing. */}
                            {import.meta.env.DEV && (
                                <Route path="/markdown" element={<MarkdownEditor />} />
                            )}
                        </Routes>
                    </BrowserRouter>
                </Suspense>
            </div>
        </div>
    )
}