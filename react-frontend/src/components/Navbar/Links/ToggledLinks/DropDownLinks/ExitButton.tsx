import { useCallback, useMemo } from 'react'
import Button from '../../../../Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useThemeContext } from '../../../../../contexts/ThemeContext';

type ExitButtonProps = {
    readonly setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ExitButton({ setIsMenuOpen }: ExitButtonProps) {
    const { theme } = useThemeContext();
    const buttonStyle = useMemo(() => ({
        width: 'fit-content',
        margin: '0 auto',
        cursor: 'pointer',
        borderRadius: '50%',
        padding: '0.7rem',
        color: theme.colors.base[600],
    }), [theme.colors]);
    const buttonClickHandler = useCallback(() => {
        setIsMenuOpen(false);
    }, [setIsMenuOpen]);

    return (
        <Button
            style={buttonStyle}
            icon={<FontAwesomeIcon icon={faCircleXmark} transform="grow-12" />}
            onClick={buttonClickHandler} />
    )
}
