import { PortfolioPathes } from '../../../Types';
import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { cx } from '../../../utils/cx';
import buttonStyles from '../../Button/Button.module.css';
import styles from './LinkButton.module.css';

type LinkButtonProps = {
    readonly path: PortfolioPathes,
    readonly pageName: string,
    readonly onClick?: () => void
}

function LinkButton({ path, pageName, onClick }: LinkButtonProps) {
    return (
        <NavLink
            to={`/${path}`}
            end
            onClick={onClick}
            className={({ isActive }) => cx(
                buttonStyles.button,
                buttonStyles.ghost,
                buttonStyles.md,
                buttonStyles.pointer,
                styles.link,
                isActive && styles.active
            )}>
            {pageName}
        </NavLink>
    )
}

export default memo(LinkButton);