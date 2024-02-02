import Button from '../../../Button'
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { Links } from '../../../../Types';
import { memo, useCallback } from 'react';

function LinkButton({ linkName, linkActive, setLinks }: {
    linkName: string, linkActive: boolean, setLinks: React.Dispatch<React.SetStateAction<Links>>
}) {
    const { theme } = useThemeContext();
    const linkButtonStyle = useCallback((linkActive: boolean) => ({
        backgroundColor: linkActive ? theme.colors.main.percent(50) : theme.colors.main.faded
    }), [theme.colors.main]);
    const linkButtonClickHandler = useCallback((linkName: string) => {
        setLinks((oldLinks) => (
            Object.fromEntries(
                Object.entries(oldLinks).map(([oldLinkName]) => (
                    [oldLinkName, oldLinkName === linkName]
                ))
            ) as Links
        ))
    }, [setLinks]);
    return (
        <Button
            style={linkButtonStyle(linkActive)}
            pointer={true}
            onClick={() => linkButtonClickHandler(linkName)}
            text={createLinkButtonText(linkName)} />
    )
}

function createLinkButtonText(linkName: string) {
    return linkName.charAt(0).toUpperCase() + linkName.slice(1);
}

export default memo(LinkButton);