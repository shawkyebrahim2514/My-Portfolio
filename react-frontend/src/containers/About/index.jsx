import { useMediaQuery } from 'react-responsive';
import ContainerWrap from '../../components/ContainerWrap'
import Content from './Content';
import Image from './Image';

function About() {
    const isMediumScreen = useMediaQuery({ query: '(max-width: 1124px)' });

    return (
        <div style={{
            display: "flex",
            flexDirection: isMediumScreen ? "column-reverse" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "2rem",
        }}>
            <Content isMediumScreen={isMediumScreen} />
            <Image />
        </div>
    )
}

export default ContainerWrap(About)
