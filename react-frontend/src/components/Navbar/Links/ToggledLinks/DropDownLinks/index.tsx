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

    return (
        <div className={cx(styles.overlay, isMenuOpen && styles.overlayOpen)}>
            <BlurBackground backgroundColor={'var(--color-base-400)'} />
            <ExitButton setIsMenuOpen={setIsMenuOpen} />
            <div className={styles.panel}>
                <PortfolioLinks
                    linkButtonOnClickHandler={linkButtonOnClickHandler} />
            </div>
        </div>
    )
}