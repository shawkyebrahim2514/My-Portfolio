import { CSSProperties, useMemo } from 'react';
import { getGithubImageURL } from '../../../APIs';

export default function GithubImage() {
    const imageFrameStyle = useMemo((): CSSProperties => ({
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        overflow: "hidden",
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "2",
    }), []);
    const imageStyle = useMemo((): CSSProperties => ({
        width: "100%",
        height: "100%",
        objectFit: "cover",
    }), []);

    return (
        <div style={imageFrameStyle}>
            <img src={getGithubImageURL("shawkyebrahim2514")}
                alt="Shawky Ebrahim"
                style={imageStyle} />
        </div>
    )
}
