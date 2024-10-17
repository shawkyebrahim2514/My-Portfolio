import { CSSProperties, useMemo } from 'react'

function Shadow() {
    const style = useMemo((): CSSProperties => ({
        width: "inherit",
        height: "inherit",
        position: "absolute",
        zIndex: "-2",
        backgroundColor: "white",
        bottom: "-3px",
        left: "3px",
        margin: "auto",
        borderRadius: "inherit", 
    }), []);
    
    return (
        <div style={style} />
    );
}

export default Shadow;