import { useNavigationControllerContext } from '../../../../contexts/NavigationControllerContext';
import {useMemo } from 'react';
import LinkButton from './LinkButton';

export default function NormalLinks() {
    const { links, setLinks } = useNavigationControllerContext();
    const linksContainerStyle = useMemo(() => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
    }), []);

    return (
        <div style={linksContainerStyle}>
            {Object.entries(links).map(([linkName, linkActive]) => (
                <LinkButton
                    key={linkName}
                    linkName={linkName}
                    linkActive={linkActive}
                    setLinks={setLinks} />
            ))}
        </div>
    )
}