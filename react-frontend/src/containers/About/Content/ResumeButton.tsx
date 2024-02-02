import Button from '../../../components/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { getResumeURL } from '../../../APIs';
import { aboutPageContent } from '../../../Texts';

export default function ResumeButton() {
    return (
        <Button
            icon={<FontAwesomeIcon icon={faFileLines} />}
            text={aboutPageContent.resume}
            pointer={true}
            onClick={() => {
                window.open(getResumeURL(), "_blank")
            }}
            style={{
                marginTop: "1rem",
            }} />
    )
}