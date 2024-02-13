import { memo } from "react"
import { PortfolioPathes } from "../../../Types"
import LinkButton from "./LinkButton"

const pathesPages: Record<PortfolioPathes, string> = {
    "": "About",
    "skills": "Skills",
    "education": "Education",
    "experience": "Experience",
    "projects": "Projects",
    "contacts": "Contacts",
}

type PortfolioLinkButtonsProps = {
    readonly linkButtonOnClickHandler?: () => void;
}

function PortfolioLinkButtons({ linkButtonOnClickHandler }: PortfolioLinkButtonsProps) {
    return (
        <>
            {Object.entries(pathesPages).map(([path, pageName]) => {
                return (
                    <LinkButton
                        key={pageName}
                        path={path as PortfolioPathes}
                        pageName={pageName}
                        onClick={linkButtonOnClickHandler}
                    />
                )
            })}
        </>
    )
}

export default memo(PortfolioLinkButtons);
