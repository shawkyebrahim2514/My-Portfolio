import { useContext } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Text from '../Text'

export default function Logo() {
    const theme = useContext(Context);

    return (
        <div style={{
            color: theme.colors.main.full,
            cursor: "pointer",
            onClick: {/* Handle here the change in the active section to be the About section */}
        }}>
            <Text variant={"h2"} style={{
                fontWeight: "800",
            }}>
                Shawky Ebrahim
            </Text>
        </div>
    )
}
