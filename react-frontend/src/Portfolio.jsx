import { useContext, useState } from 'react'
import { Context } from './contexts/ThemeContext';
import About from './containers/About';
import Navbar from './components/Navbar';
import Skills from './containers/Skills';
import Education from './containers/Education';
import Experience from './containers/Experience';
import Projects from './containers/Projects';
import Contacts from './containers/Contacts';

export default function Portfolio() {
    const theme = useContext(Context);
    const [links, setLinks] = useState({
        "About": true,
        "Skills": false,
        "Education": false,
        "Experience": false,
        "Projects": false,
        "Contact": false,
    });
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
                <Navbar links={links} setLinks={setLinks} />
                {links["About"] && <About />}
                {links["Skills"] && <Skills />}
                {links["Education"] && <Education />}
                {links["Experience"] && <Experience />}
                {links["Projects"] && <Projects />}
                {links["Contact"] && <Contacts />}
            </div>
        </div>
    )
}
