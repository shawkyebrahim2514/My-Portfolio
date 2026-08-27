import { memo } from 'react'
import Button from '../../../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeFork } from '@fortawesome/free-solid-svg-icons';

function ProjectButton({ projectLink }: {projectLink: string}) {
    return (
        <Button
            icon={<FontAwesomeIcon icon={faCodeFork} />}
            text={"Project"}
            size='md'
            onClick={() => { window.open(projectLink, "_blank") }}
            pointer={true}
            clarityEvent="projectRepo"
            clarityUpgrade="projectRepo"
        />
    )
}

export default memo(ProjectButton);