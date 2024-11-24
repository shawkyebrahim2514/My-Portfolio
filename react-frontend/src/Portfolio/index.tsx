/** @jsxImportSource @emotion/react */

import { useThemeContext } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import Contacts from '../containers/Contacts';
import { Suspense, lazy } from 'react';
import Loader from '../components/Loader';
import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import { PortfolioPathes } from '../Types';
import { css } from '@emotion/react';

const About = lazy(() => import('../containers/About'));
const Skills = lazy(() => import('../containers/Skills'));
const Education = lazy(() => import('../containers/Education'));
const Experience = lazy(() => import('../containers/Experience'));
const Projects = lazy(() => import('../containers/Projects'));

type PathElementRoutes = Record<PortfolioPathes, JSX.Element>

const pathElementRoutes: PathElementRoutes = {
    "": <About />,
    "skills": <Skills />,
    "education": <Education />,
    "experience": <Experience />,
    "projects": <Projects />,
    "contacts": <Contacts />
}

export default function Portfolio() {
    const { theme } = useThemeContext();

    return (
        <div css={css({
            backgroundColor: theme.colors.base[100],
            minHeight: "100vh",
            color: theme.colors.base[700],
            backgroundImage: theme.backgroundImage,
            '& *::selection': {
                backgroundColor: theme.colors.base[700],
                color: theme.colors.base[100]
            }
        })}>
            <div style={{
                maxWidth: "1255px",
                margin: "0 auto",
                padding: "0 1rem",
            }}>
                <Suspense fallback={<Loader />}>
                    <BrowserRouter>
                        <Navbar />
                        <Routes>
                            <Route path='/' element={<About />} />
                            {Object.entries(pathElementRoutes).map(([path, element]) => {
                                return (
                                    <Route
                                        key={path}
                                        path={`/${path}`}
                                        element={element} />
                                )
                            })}
                        </Routes>
                    </BrowserRouter>
                </Suspense>
            </div>
        </div>
    )
}