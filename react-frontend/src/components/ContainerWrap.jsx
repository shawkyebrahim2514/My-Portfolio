import React from 'react'

const ContainerWrap = (Component, args) => function HOC() {
    console.log(args);
	return (
		<div style={{
            minHeight: "100vh",
            display: "grid",
            alignItems: "center",
            paddingTop: "100px",
            paddingBottom: "30px",
        }}>
			<Component />
		</div>
	)
}

export default ContainerWrap