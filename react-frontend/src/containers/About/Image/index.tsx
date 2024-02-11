import { CSSProperties, memo, useMemo } from 'react';
import BackShape from './BackShape';
import ActualImage from './ActualImage';
import { SanityAboutPage } from '../../../Types';

function Image({ personImage }: Readonly<Pick<SanityAboutPage, 'personImage'>>) {
    const containerStyle = useMemo((): CSSProperties => ({
        width: "320px",
        height: "320px",
        position: "relative",
        marginRight: "10px",
    }), []);

    return (
        <div style={containerStyle}>
            <BackShape />
            <ActualImage personImage={personImage} />
        </div>
    )
}

export default memo(Image);