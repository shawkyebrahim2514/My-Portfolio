import { useMediaQuery } from 'react-responsive';
import ToggledLinks from "./ToggledLinks";
import NormalLinks from "./NormalLinks";

export default function Links() {
    const isMediumScreen = useMediaQuery({ query: '(max-width: 974px)' });

    return (
        <>
            {isMediumScreen ? (
                <ToggledLinks />
            ) : (
                <NormalLinks />
            )}
        </>
    )
}
