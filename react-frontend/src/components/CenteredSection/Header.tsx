import Text from '../Text'
import styles from './Header.module.css';

type HeaderProps = {
    readonly title: string,
    readonly subtitle?: string,
    readonly icon: React.JSX.Element,
}

export default function Header({ title, subtitle, icon }: HeaderProps) {
    return (
        <header className={styles.header}>
            <HeaderTitle title={title} icon={icon} />
            {subtitle && <Text variant={"h3"}>{subtitle}</Text>}
            <HorizontalLine />
        </header>
    )
}

function HeaderTitle({ title, icon }: Readonly<Pick<HeaderProps, "title" | "icon">>) {
    return (
        <div className={styles.title}>
            {icon}
            <Text variant={"h3"}>
                {title}
            </Text>
        </div>
    )
}

function HorizontalLine() {
    return (
        <hr className={styles.line} />
    )
}