import { PortfolioPathes } from '../../../Types';
import { memo } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import { cx } from '../../../utils/cx';
import buttonStyles from '../../Button/Button.module.css';
import styles from './LinkButton.module.css';

type LinkButtonProps = {
    readonly path: PortfolioPathes,
    readonly pageName: string,
    readonly onClick?: () => void,
    readonly className?: string,
}

function LinkButton({ path, pageName, onClick, className }: LinkButtonProps) {
    const pageContext = usePageContext();
    const href = `/${path}`;
    // Vike intercepts same-origin <a> clicks automatically (client-side
    // routing) — no special <Link> component needed, see vike.dev/active-links.
    const isActive = pageContext.urlPathname === href;

    return (
        <a
            href={href}
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
            className={cx(
                buttonStyles.button,
                buttonStyles.ghost,
                buttonStyles.md,
                buttonStyles.pointer,
                styles.link,
                isActive && styles.active,
                className
            )}>
            {pageName}
        </a>
    )
}

export default memo(LinkButton);