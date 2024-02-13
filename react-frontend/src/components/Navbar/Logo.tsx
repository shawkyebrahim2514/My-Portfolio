import { useCallback } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Text from '../Text'
import { SanityNavbarData } from '../../Types';
import { useNavigate } from 'react-router-dom';

export default function Logo({ logo }: Readonly<Pick<SanityNavbarData, "logo">>) {
    const { theme } = useThemeContext();
    const navigate = useNavigate();

    const changeLinksHandler = useCallback(() => navigate(''), [navigate]);
    const onKeyDownHandler = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            changeLinksHandler();
        }
    }, [changeLinksHandler]);

    return (
        <div
            style={{
                color: theme.colors.base,
                cursor: "pointer",
            }}
            onClick={changeLinksHandler}
            onKeyDown={onKeyDownHandler} >
            <Text variant={"h2"} style={{
                fontWeight: "800",
            }}>
                {logo}
            </Text>
        </div>
    )
}