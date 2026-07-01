import Button from '../../Button'
import { PortfolioPathes } from '../../../Types';
import { memo } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { cx } from '../../../utils/cx';
import styles from './LinkButton.module.css';

type LinkButtonProps = {
    readonly path: PortfolioPathes,
    readonly pageName: string,
    readonly onClick?: () => void
}

function LinkButton({ path, pageName, onClick }: LinkButtonProps) {
    const navigate = useNavigate();
    const active = useMatch(`/${path}`) !== null;

    return (
        <Button
            variant="ghost"
            className={cx(styles.link, active && styles.active)}
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