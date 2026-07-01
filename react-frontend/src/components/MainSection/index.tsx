import Header from './Header';
import Content from './Content';
import { cx } from '../../utils/cx';
import surfaces from '../../styles/surfaces.module.css';

type MainSectionProps = {
    readonly title?: string,
    readonly link?: string,
    readonly subtitle?: string,
    readonly style?: React.CSSProperties,
    readonly children: React.ReactNode,
}

export default function MainSection({ title, link, subtitle, style, children }:
    MainSectionProps
) {
    return (
        <div className={cx(surfaces.container, surfaces.column)} style={style}>
            {title && <Header title={title} link={link} subtitle={subtitle} />}
            <Content>
                {children}
            </Content>
        </div>
    )
}