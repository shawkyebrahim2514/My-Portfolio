import { useEffect } from "react";
import PortfolioLinks from "../../PortfolioLinks";
import BlurBackground from "../../../../BlurBackground";
import ExitButton from "./ExitButton";
import { cx } from "../../../../../utils/cx";
import styles from "./DropDownLinks.module.css";

type DropDownLinksProps = {
    readonly isMenuOpen: boolean,
    readonly setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DropDownLinks({ isMenuOpen, setIsMenuOpen }: DropDownLinksProps) {
    const linkButtonOnClickHandler = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        if (!isMenuOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isMenuOpen, setIsMenuOpen]);

    return (
        <div
            id="mobile-menu"
            className={cx(styles.overlay, isMenuOpen && styles.overlayOpen)}
            inert={!isMenuOpen}>
            <BlurBackground backgroundColor={'var(--color-base-400)'} />
            <ExitButton setIsMenuOpen={setIsMenuOpen} />
            <div className={styles.panel}>
                <PortfolioLinks
                    linkButtonOnClickHandler={linkButtonOnClickHandler} />
            </div>
        </div>
    )
}