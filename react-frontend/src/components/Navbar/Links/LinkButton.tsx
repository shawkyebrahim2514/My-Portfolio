import Button from '../../Button'
import { PortfolioPathes } from '../../../Types';
import { memo, useMemo } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../../contexts/ThemeContext';

type LinkButtonProps = {
    readonly path: PortfolioPathes,
    readonly pageName: string,
    readonly onClick?: () => void
}

function LinkButton({ path, pageName, onClick }: LinkButtonProps) {
    const { theme } = useThemeContext();
    const navigate = useNavigate();
    const active = useMatch(`/${path}`);
    const linkButtonStyle = useMemo(() => {
        const linkActive = active !== null;
        return {
            boxShadow: "none",
            border: linkActive ? theme.border : "none",
            backgroundColor: linkActive ? theme.colors.dark1 : "",
            opacity: linkActive ? "1" : "0.7",
        }
    }, [theme.colors, active]);

    return (
        <Button
            style={linkButtonStyle}
            pointer={true}
            size='md'
            onClick={() => {
                navigate(`/${path}`);
                if (onClick) onClick();
            }}
            text={pageName} />
    )
}

export default memo(LinkButton);