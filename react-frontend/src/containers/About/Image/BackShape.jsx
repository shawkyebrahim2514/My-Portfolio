import { useContext } from 'react'
import { Context } from '../../../contexts/ThemeContext';

export default function BackShape() {
    const theme = useContext(Context);

    return (
        <div style={{
            width: "inherit",
            height: "inherit",
            position: "absolute",
            backgroundColor: theme.colors.main.full,
            borderRadius: "50%",
            zIndex: "1",
            top: "10px",
            left: "10px",
        }} />
    )
}
