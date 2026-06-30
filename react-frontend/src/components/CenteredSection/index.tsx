import Header from './Header';
import { cx } from '../../utils/cx';
import surfaces from '../../styles/surfaces.module.css';

type CenteredSectionProps = {
    readonly title: string,
    readonly subtitle?: string,
    readonly icon: React.JSX.Element,
    readonly children: React.JSX.Element | React.JSX.Element[],
}

export default function CenteredSection({ title, subtitle, icon, children }: CenteredSectionProps) {
    return (
        <div className={cx(surfaces.container, surfaces.column, surfaces.center)}>
            <Header title={title} subtitle={subtitle} icon={icon} />
            {children}
        </div>
    )
}
