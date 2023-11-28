import { useContext } from 'react'
import { Context } from '../../contexts/ThemeContext';

export default function HeaderSymbol() {
    const theme = useContext(Context);

    return (
        <div style={{
            width: "20px",
            height: "20px",
            ...theme.bluryStyle.main,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <div style={{
                width: "70%",
                height: "70%",
                borderRadius: "50%",
                backgroundColor: theme.colors.main.full,
            }} />
        </div>
    )
}
