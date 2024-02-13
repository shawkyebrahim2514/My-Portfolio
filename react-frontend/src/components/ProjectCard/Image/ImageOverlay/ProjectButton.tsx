import { memo } from 'react'
import Button from '../../../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeFork } from '@fortawesome/free-solid-svg-icons';
import { ImageProps } from '..';

function ProjectButton({ projectLink }: Readonly<Pick<ImageProps, "projectLink">>) {
    return (
        <Button
            icon={<FontAwesomeIcon icon={faCodeFork} />}
            text={"Project"}
            onClick={() => { window.open(projectLink, "_blank") }}
            pointer={true}
        />
    )
}

export default memo(ProjectButton);