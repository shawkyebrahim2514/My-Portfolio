import { useThemeContext } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Contacts from './containers/Contacts';
import { useNavigationControllerContext } from './contexts/NavigationControllerContext';
import { Suspense, lazy } from 'react';
import Loader from './components/Loader';

const About = lazy(() => import('./containers/About'));
const Skills = lazy(() => import('./containers/Skills'));
const Education = lazy(() => import('./containers/Education'));
const Experience = lazy(() => import('./containers/Experience'));
const Projects = lazy(() => import('./containers/Projects'));

export default function Portfolio() {
    const { theme } = useThemeContext();
    const { links } = useNavigationControllerContext();

    return (
        <div style={{
            backgroundColor: theme.colors.dark.full,
            minHeight: "100vh",
            color: theme.colors.contrastText.full,
            backgroundImage: theme.backgroundImage,
        }}>
            <div style={{
                maxWidth: "1255px",
                margin: "0 auto",
                padding: "0 1rem",
            }}>
                <Navbar />
                <Suspense fallback={<Loader />}>
                    {links.about && <About />}
                    {links.skills && <Skills />}
                    {links.education && <Education />}
                    {links.experience && <Experience />}
                    {links.projects && <Projects />}
                    {links.contacts && <Contacts />}
                </Suspense>
            </div>
        </div>
    )
}
