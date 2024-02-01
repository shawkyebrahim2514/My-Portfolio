import { useThemeContext } from '../../../../contexts/ThemeContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion"
import { useCallback, useMemo } from 'react';

const barsMotion = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
    animate: (isMenuOpen: boolean) => ({
        rotate: isMenuOpen ? 90 : 0,
        opacity: isMenuOpen ? 1 : 0.5,
    }),
}

export default function BarsIcon({ isMenuOpen, setIsMenuOpen }:
    { isMenuOpen: boolean, setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }
) {
    const { theme } = useThemeContext();
    const barsStyle = useMemo(() => ({
        display: "inline-block",
        color: theme.colors.main.full,
        cursor: "pointer",
    }), [theme.colors.main.full]);
    const clickHandler = useCallback(() => {
        setIsMenuOpen((oldIsMenuOpen) => !oldIsMenuOpen);
    }, [setIsMenuOpen]);

    return (
        <motion.div
            style={barsStyle}
            whileHover={barsMotion.whileHover}
            whileTap={barsMotion.whileTap}
            animate={barsMotion.animate(isMenuOpen)}
            onClick={clickHandler} >
            <FontAwesomeIcon icon={faBars} size={"xl"} />
        </motion.div>
    )
}