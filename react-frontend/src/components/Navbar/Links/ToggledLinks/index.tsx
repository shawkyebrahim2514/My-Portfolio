import { useCallback, useRef, useState } from 'react';
import BarsIcon from './BarsIcon';
import DropDownLinks from './DropDownLinks';

export default function ToggledLinks() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
    }, []);

    return (
        <>
            <BarsIcon isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} buttonRef={toggleRef} />
            <DropDownLinks isMenuOpen={isMenuOpen} onClose={closeMenu} />
        </>
    );
}
