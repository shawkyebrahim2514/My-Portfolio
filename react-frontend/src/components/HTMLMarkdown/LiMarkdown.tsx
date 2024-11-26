/** @jsxImportSource @emotion/react */

import { Interpolation, Theme } from "@emotion/react"
import { useMemo } from "react"

const LiMarkdown = ({ ...props }: React.HTMLAttributes<HTMLLIElement>) => {
    const elementStyle = useMemo((): Interpolation<Theme> => ({
        listStyleType: "none",
        position: "relative",
        "&::before": {
            content: '">"',
            position: "absolute",
            top: 0,
            left: -15,
            fontWeight: 600
        }
    }), [])
    
    return (<li {...props} css={elementStyle}>
        {props.children}
    </li>)
}

export default LiMarkdown