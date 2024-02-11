import Button from '../../../components/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react';
import { SanityAboutPage } from '../../../Types';

function ResumeButton({ resume }: Readonly<Pick<SanityAboutPage, 'resume'>>) {
    return (
        <Button
            icon={<FontAwesomeIcon icon={faFileLines} />}
            text={resume.text}
            pointer={true}
            onClick={() => {
                window.open(resume.link, "_blank")
            }}
            style={{
                marginTop: "1rem",
            }} />
    )
}

export default memo(ResumeButton);