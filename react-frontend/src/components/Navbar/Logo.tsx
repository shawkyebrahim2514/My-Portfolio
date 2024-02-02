import { useCallback } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Text from '../Text'
import { useNavigationControllerContext } from '../../contexts/NavigationControllerContext';
import { Links } from '../../Types';
import { navbarContent } from '../../Texts';

export default function Logo() {
    const { theme } = useThemeContext();
    const { setLinks } = useNavigationControllerContext();
    const changeLinksHandler = useCallback(() => {
        setLinks((oldLinks) => (
            Object.fromEntries(
                Object.entries(oldLinks).map(([oldLinkName, oldLinkActive]) => (
                    [oldLinkName, oldLinkName === "about"]
                ))
            ) as Links
        ))
    }, [setLinks]);
    const onKeyDownHandler = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            changeLinksHandler();
        }
    }, [changeLinksHandler]);

    return (
        <div
            style={{
                color: theme.colors.main.full,
                cursor: "pointer",
            }}
            onClick={changeLinksHandler}
            onKeyDown={onKeyDownHandler} >
            <Text variant={"h2"} style={{
                fontWeight: "800",
            }}>
                {navbarContent.logoText}
            </Text>
        </div>
    )
}