import { useThemeContext } from './contexts/ThemeContext';
import About from './containers/About';
import Navbar from './components/Navbar';
import Skills from './containers/Skills';
import Education from './containers/Education';
import Experience from './containers/Experience';
import Projects from './containers/Projects';
import Contacts from './containers/Contacts';
import { useNavigationControllerContext } from './contexts/NavigationControllerContext';

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
                {links.about && <About />}
                {links.skills && <Skills />}
                {links.education && <Education />}
                {links.experience && <Experience />}
                {links.projects && <Projects />}
                {links.contacts && <Contacts />}
            </div>
        </div>
    )
}
