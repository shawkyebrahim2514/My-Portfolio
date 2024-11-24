import { CSSProperties, useCallback, useMemo } from 'react'
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
    const headerConatinerStyle = useMemo((): CSSProperties => {
        return {
            display: "inline-block",
            alignItems: "center",
            gap: "0.5rem",
        }
    }, []);

    const headerTextStyle = useMemo((): CSSProperties => {
        return {
            // color: theme.colors.base[600],
            display: "inline",
            marginRight: "0.5rem",
            cursor: link ? "pointer" : "default",
        }
    }, [link, theme.colors]);

    const headerOnCLickHandler = useCallback(() => {
        link && window.open(link, "_blank");
    }, [link]);

    return (
        <header>
            <div style={headerConatinerStyle}>
                <Text
                    variant={"h3"}
                    onClick={headerOnCLickHandler}
                    style={headerTextStyle}>
                    {title}
                </Text>
                {link && (
                    <Text
                        variant={"h3"}
                        onClick={headerOnCLickHandler}
                        style={{
                            display: "inline-block",
                            cursor: link ? "pointer" : "default",
                            }}>
                        <ExternalLinkIcon />
                    </Text>
                )}
            </div>
            {subtitle &&
                <SubtitleText>
                    {subtitle}
                </SubtitleText>
            }
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
