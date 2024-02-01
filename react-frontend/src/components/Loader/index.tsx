import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components'

const loaderKeyframe = keyframes`
    to {
        transform: rotate(1turn)
    }
`;

const Spinner = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 8px solid;
    border-color: #ffffff47;
    border-right-color: #fff;
    animation: ${loaderKeyframe} 1s infinite linear;
`;

export default function Loader() {
    const containerStyle = useMemo(() => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    }), []);

    return (
        <div style={containerStyle}>
            <Spinner />
        </div>
    )
}