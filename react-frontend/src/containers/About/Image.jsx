import { useContext } from 'react'
import { Context } from '../../contexts/ThemeContext';
import { githubImageURL } from '../../APIs';

export default function Image() {
    const theme = useContext(Context);

    return (
        <div style={{
            width: "320px",
            height: "320px",
            position: "relative",
            marginRight: "10px",
        }}>
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
            <div style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                position: "absolute",
                top: "0",
                left: "0",
                zIndex: "2",
            }}>
                <img src={githubImageURL("shawkyebrahim2514")} alt=""
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }} />
            </div>
        </div>
    )
}
