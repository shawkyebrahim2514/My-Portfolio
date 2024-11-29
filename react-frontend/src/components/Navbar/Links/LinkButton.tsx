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
            border: "none",
            backgroundColor: linkActive ? theme.colors.base[200] : "",
            color: linkActive ? theme.colors.base[800] : theme.colors.base[400],
            opacity: linkActive ? "1" : "0.9",
            fontWeight: "500",
        }
    }, [theme.colors.base, active]);

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