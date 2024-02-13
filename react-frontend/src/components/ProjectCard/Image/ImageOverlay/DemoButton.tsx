import Button from '../../../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { ImageProps } from '..';
import { memo } from 'react';

function DemoButton({ demoLink }: Readonly<Pick<ImageProps, "demoLink">>) {
    return (
        <Button
            icon={<FontAwesomeIcon icon={faDesktop} />}
            text={"Demo"}
            onClick={() => { window.open(demoLink, "_blank") }}
            pointer={true}
        />
    )
}

export default memo(DemoButton);