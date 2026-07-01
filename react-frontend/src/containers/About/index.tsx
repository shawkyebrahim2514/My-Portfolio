import ContainerWrap from '../../components/ContainerWrap'
import Content from './Content';
import Image from './Image';
import { SanityAboutPage } from '../../Types';
import { getAboutPage } from '../../APIs';
import Loader from '../../components/Loader';
import SectionError from '../../components/SectionError';
import { useSanityQuery } from '../../hooks/useSanityQuery';
import styles from './About.module.css';

function About() {
    const { data: aboutPage, error } = useSanityQuery<SanityAboutPage>(getAboutPage);

    if (error) return <SectionError />;
    if (!aboutPage) return <Loader />;

    return (
        <div className={styles.container}>
            <Content
                description={aboutPage.description}
            />
            <Image personImage={aboutPage.personImage} />
        </div>
    )
}

export default ContainerWrap(About)
