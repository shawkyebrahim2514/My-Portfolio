import { useContext } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Text from '../Text'

export default function Logo() {
    const theme = useContext(Context);

    return (
        <div>
            <Text variant={"h2"} style={{
                color: theme.colors.main.full,
            }}>
                Shawky Ebrahim
            </Text>
        </div>
    )
}
