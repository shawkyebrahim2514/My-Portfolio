import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Text from '../Text';
import HeaderSymbol from './HeaderSymbol';

export default function Header({ title, subtitle }) {
    const theme = useContext(Context);
    const headerStyle = useMemo(() => {
        return {
            display: "flex",
            alignItems: "baseline",
            justifyContent: "flex-start",
            gap: "1rem",
        }
    }, []);
    return (
        <header style={headerStyle}>
            <HeaderSymbol />
            <div>
                <Text variant={"h3"} style={{ color: theme.colors.main.full }}>
                    {title}
                </Text>
                {subtitle &&
                    <Text variant={"h4"}>{subtitle}</Text>
                }
            </div>
        </header>
    )
}
