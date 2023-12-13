import { CSSProperties, useMemo } from 'react';
import { getGithubImageURL } from '../../../APIs';
import BackShape from './BackShape';

export default function Image() {
    const containerStyle = useMemo((): CSSProperties => ({
        width: "320px",
        height: "320px",
        position: "relative",
        marginRight: "10px",
    }), []);
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

    return (
        <div style={containerStyle}>
            <BackShape />
            <div style={imageFrameStyle}>
                <img src={getGithubImageURL("shawkyebrahim2514")} alt="Shawky Ebrahim"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }} />
            </div>
        </div>
    )
}
