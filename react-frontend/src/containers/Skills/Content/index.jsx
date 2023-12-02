import CenteredSection from '../../../components/CenteredSection'
import ListIcons from './listIcons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from '@fortawesome/free-solid-svg-icons';

export default function index({ list }) {
    return (
        <>
            {list.map(([technologyTitle, technologyIcons]) => {
                return (
                    <CenteredSection
                        key={technologyTitle}
                        icon={<FontAwesomeIcon icon={faCode} size={"xl"} />}
                        title={technologyTitle}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1rem",
                            flexWrap: "wrap",
                        }}>
                            <ListIcons list={technologyIcons} />
                        </div>
                    </CenteredSection>
                )
            })}
        </>
    )
}
