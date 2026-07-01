import Button from '../../../../Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './ExitButton.module.css';

type ExitButtonProps = {
    readonly setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ExitButton({ setIsMenuOpen }: ExitButtonProps) {
    const buttonClickHandler = () => {
        setIsMenuOpen(false);
    };

    return (
        <Button
            className={styles.exit}
            pointer={true}
            icon={<FontAwesomeIcon icon={faCircleXmark} transform="grow-12" />}
            onClick={buttonClickHandler} />
    )
}
