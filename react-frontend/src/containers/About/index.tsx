import { useMediaQuery } from 'react-responsive';
import ContainerWrap from '../../components/ContainerWrap'
import Content from './Content';
import Image from './Image';
import { CSSProperties, useMemo } from 'react';

function About() {
    const isMediumScreen = useMediaQuery({ query: '(max-width: 1124px)' });
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: isMediumScreen ? "column-reverse" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "2rem",
    }), [isMediumScreen]);

    return (
        <div style={containerStyle}>
            <Content />
            <Image />
        </div>
    )
}

export default ContainerWrap(About)
