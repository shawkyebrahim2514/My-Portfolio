import { CSSProperties, memo, useMemo } from 'react';
import BackShape from './BackShape';
import GithubImage from './GithubImage';

function Image() {
    const containerStyle = useMemo((): CSSProperties => ({
        width: "320px",
        height: "320px",
        position: "relative",
        marginRight: "10px",
    }), []);

    return (
        <div style={containerStyle}>
            <BackShape />
            <GithubImage />
        </div>
    )
}

export default memo(Image);