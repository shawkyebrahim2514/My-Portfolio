import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Text from '../Text'

export default function Header({ title, subtitle, icon }) {
    const theme = useContext(Context);
    const headerStyle = useMemo(() => {
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
        }
    }, []);
    const hrStyle = useMemo(() => {
        return {
            width: "100%",
            height: "1px",
            backgroundColor: theme.colors.main.full,
            border: "none",
        }
    }, [theme]);

    return (
        <header style={headerStyle}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                color: theme.colors.main.full,
            }}>
                {icon}
                <Text variant={"h3"}>
                    {title}
                </Text>
            </div>
            {subtitle &&
                <Text variant={"h3"}>{subtitle}</Text>}
            <hr style={hrStyle} />
        </header>
    )
}
