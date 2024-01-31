import { useCallback, useMemo } from 'react'
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

export default function Header({ title, link, subtitle }: HeaderProps) {
    const { theme } = useThemeContext();
    const headerConatinerStyle = useMemo(() => {
        return {
            display: "grid",
            gridAutoFlow: "column",
            alignItems: "baseline",
            justifyContent: "flex-start",
            gap: "1rem",
        }
    }, []);

    const headerTextStyle = useMemo(() => {
        return {
            color: theme.colors.main.full,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: link ? "pointer" : "default",
        }
    }, [link, theme.colors.main.full]);

    const headerOnCLickHandler = useCallback(() => {
        link && window.open(link, "_blank");
    }, [link]);

    return (
        <header style={headerConatinerStyle}>
            <HeaderSymbol />
            <div>
                <Text
                    variant={"h3"}
                    onClick={headerOnCLickHandler}
                    style={headerTextStyle}
                >
                    {title}
                    {link && (<ExternalLinkIcon />)}
                </Text>
                {subtitle &&
                    <SubtitleText>
                        {subtitle}
                    </SubtitleText>
                }
            </div>
        </header>
    )
}

function ExternalLinkIcon() {
    return (
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={"sm"} />
    )
}

function SubtitleText({ children }: { readonly children: React.ReactNode }) {
    return (
        <Text variant={"h4"}>
            {children}
        </Text>
    )
}
