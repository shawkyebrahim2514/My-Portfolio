import Button from '../../Button'
import { PortfolioPathes } from '../../../Types';
import { memo, useMemo } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import styles from './LinkButton.module.css';

type LinkButtonProps = {
    readonly path: PortfolioPathes,
    readonly pageName: string,
    readonly onClick?: () => void
}

function LinkButton({ path, pageName, onClick }: LinkButtonProps) {
    const navigate = useNavigate();
    const active = useMatch(`/${path}`);
    // Active/inactive colours depend on the current route, so they stay as
    // token-based inline styles; the ghost variant strips the default border/shadow.
    const linkButtonStyle = useMemo(() => {
        const linkActive = active !== null;
        return {
            backgroundColor: linkActive ? 'var(--color-base-200)' : 'transparent',
            color: linkActive ? 'var(--color-base-800)' : 'var(--color-base-400)',
            opacity: linkActive ? 1 : 0.9,
        };
    }, [active]);

    return (
        <Button
            variant="ghost"
            className={styles.link}
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