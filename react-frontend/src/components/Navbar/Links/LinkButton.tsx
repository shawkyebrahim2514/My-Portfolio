import Button from '../../Button'
import { PortfolioPathes } from '../../../Types';
import { memo, useCallback } from 'react';
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
    const linkButtonStyle = useCallback((linkActive: boolean) => ({
        backgroundColor: linkActive ? theme.colors.dark1 : theme.colors.dark3
    }), [theme.colors]);

    return (
        <Button
            style={linkButtonStyle(active !== null)}
            pointer={true}
            onClick={() => {
                navigate(`/${path}`);
                if (onClick) onClick();
            }}
            text={pageName} />
    )
}

export default memo(LinkButton);