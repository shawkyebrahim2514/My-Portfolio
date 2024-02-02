import { memo } from "react"
import { ImageProps } from ".";

function MainImage({ imgSrc }: Readonly<Pick<ImageProps, "imgSrc">>) {
    return (
        <img
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src={imgSrc}
            alt={imgSrc} />
    )
}

export default memo(MainImage);