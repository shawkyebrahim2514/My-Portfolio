import { memo } from "react";
import { CommonTitle } from "../Types";
import SectionTitle from "../components/SectionTitle";

function Content({ title }: Readonly<CommonTitle>) {
    return (
        <SectionTitle
            highlightedText={title.highlightedText}
            text={title.subText} />
    )
}

export default memo(Content);