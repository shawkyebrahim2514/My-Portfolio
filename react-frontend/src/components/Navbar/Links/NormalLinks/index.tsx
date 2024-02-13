import { useMemo } from 'react';
import PortfolioLinks from '../PortfolioLinks';

export default function NormalLinks() {
    const linksContainerStyle = useMemo(() => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
    }), []);

    return (
        <div style={linksContainerStyle}>
            <PortfolioLinks />
        </div>
    )
}