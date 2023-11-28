import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Header from './Header';
import Content from './Content';

export default function MainSection({ title, subtitle, style, children }) {
    const theme = useContext(Context);
    const containerStyle = useMemo(() => {
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1rem",
            ...theme.bluryStyle.main,
            placeItems: "stretch",
            ...style,
            borderRadius: theme.borderRadius,
            boxShadow: theme.boxShadow,
        }
    }, [theme]);
    return (
        <div style={containerStyle}>
            {title &&
                <Header title={title} subtitle={subtitle} />
            }
            <Content>
                {children}
            </Content>
        </div>
    )
}
