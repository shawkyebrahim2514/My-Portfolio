import { useThemeContext } from '../../../../contexts/ThemeContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { memo, useCallback, useMemo } from 'react';

type BarsIconProps = {
    readonly setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function BarsIcon({ setIsMenuOpen }: BarsIconProps) {
    const { theme } = useThemeContext();
    const barsStyle = useMemo(() => ({
        display: "inline-block",
        color: theme.colors.base[400],
        cursor: "pointer",
    }), [theme.colors]);
    const clickHandler = useCallback(() => {
        setIsMenuOpen((oldIsMenuOpen) => !oldIsMenuOpen);
    }, [setIsMenuOpen]);

    return (
        <div
            style={barsStyle}
            onClick={clickHandler} >
            <FontAwesomeIcon icon={faBars} size={"xl"} />
        </div>
    )
}

export default memo(BarsIcon);