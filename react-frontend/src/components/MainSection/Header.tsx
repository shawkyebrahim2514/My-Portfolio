import { useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Text from '../Text';
import HeaderSymbol from './HeaderSymbol';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

type HeaderProps = {
    readonly title: string,
    readonly link?: string,
    readonly subtitle?: string,
}

export default function Header({ title, link, subtitle } : HeaderProps) {
    const { theme } = useThemeContext();
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
                <Text
                    variant={"h3"}
                    onClick={() => { window.open(link, "_blank") }}
                    style={{
                        color: theme.colors.main.full,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: link ? "pointer" : "default",
                    }}>
                    {title}
                    {link && (<FontAwesomeIcon icon={faArrowUpRightFromSquare} size={"sm"} />)}
                </Text>
                {subtitle &&
                    <Text variant={"h4"}>{subtitle}</Text>
                }
            </div>
        </header>
    )
}
