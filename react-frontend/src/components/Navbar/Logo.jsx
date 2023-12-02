import { useCallback, useContext } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Text from '../Text'
import { navigationControllerContext } from '../../contexts/NavigationControllerContext';

export default function Logo() {
    const theme = useContext(Context);
    const [, setLinks] = useContext(navigationControllerContext);
    const changeLinksHandler = useCallback(() => {
        setLinks((oldLinks) => (
            Object.fromEntries(
                Object.entries(oldLinks).map(([oldLinkName, oldLinkActive]) => (
                    [oldLinkName, oldLinkName === "About"]
                ))
            )
        ))
    }, []);

    return (
        <div style={{
            color: theme.colors.main.full,
            cursor: "pointer",
        }}
            onClick={changeLinksHandler}
        >
            <Text variant={"h2"} style={{
                fontWeight: "800",
            }}>
                Shawky Ebrahim
            </Text>
        </div>
    )
}
