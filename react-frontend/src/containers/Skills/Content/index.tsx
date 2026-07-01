import { SanitySkillsPage } from '../../../Types';
import CenteredSection from '../../../components/CenteredSection';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from '@fortawesome/free-solid-svg-icons';
import SkillsIcons from './SkillsIcons';
import styles from './Content.module.css';

export default function Content({ categories }: Readonly<Pick<SanitySkillsPage, "categories">>) {
    return (
        <>
            {categories.map((category) => {
                return (
                    <CenteredSection
                        key={category.title}
                        icon={<HeaderIcon />}
                        title={category.title} >
                        <div className={styles.list}>
                            <SkillsIcons skills={category.skills} />
                        </div>
                    </CenteredSection>
                )
            })}
        </>
    )
}

function HeaderIcon() {
    return (
        <FontAwesomeIcon icon={faCode} size={"xl"} />
    )
}