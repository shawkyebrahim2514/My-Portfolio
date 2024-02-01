import { useState } from "react";
import BarsIcon from "./BarsIcon";
import DropDownLinks from "./DropDownLinks";

export default function ToggledLinks() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <BarsIcon isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <DropDownLinks isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </>
    )
}