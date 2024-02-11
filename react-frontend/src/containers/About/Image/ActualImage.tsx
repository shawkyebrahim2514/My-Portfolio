import { CSSProperties, useMemo } from 'react';
import { SanityAboutPage } from '../../../Types';

export default function ActualImage({ personImage }: Readonly<Pick<SanityAboutPage, 'personImage'>>) {
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
            <img src={personImage}
                alt="Shawky Ebrahim"
                style={imageStyle} />
        </div>
    )
}
