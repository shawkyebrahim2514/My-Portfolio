import { useCallback } from 'react'
import Text from '../Text';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { cx } from '../../utils/cx';
import styles from './Header.module.css';

type HeaderProps = {
    readonly title: string,
    readonly link?: string,
    readonly subtitle?: string,
}

export default function Header({ title, link, subtitle }: HeaderProps) {
    const headerOnCLickHandler = useCallback(() => {
        if (link) {
            window.open(link, "_blank");
        }
    }, [link]);

    return (
        <>
            <div className={styles.headerContainer}>
                <Text
                    variant={"h3"}
                    onClick={link ? headerOnCLickHandler : undefined}
                    style={undefined}>
                    <span className={cx(styles.headerText, link && styles.pointer)}>{title}</span>
                </Text>
                {link && (
                    <Text
                        variant={"h3"}
                        onClick={headerOnCLickHandler}>
                        <span className={cx(styles.linkText, styles.pointer)}>
                            <ExternalLinkIcon />
                        </span>
                    </Text>
                )}
            </div>
            {subtitle &&
                <SubtitleText>
                    {subtitle}
                </SubtitleText>
            }
        </>
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
