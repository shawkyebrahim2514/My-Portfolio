import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Header from './Header';
import Content from './Content';

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
    const { theme } = useThemeContext();
    const containerStyle = useMemo((): CSSProperties => {
        return {
            ...theme.container,
            flexDirection: "column",
            ...style,
        }
    }, [theme, style]);

    return (
        <div style={containerStyle}>
            {title && <Header title={title} link={link} subtitle={subtitle} />}
            <Content>
                {children}
            </Content>
        </div>
    )
}