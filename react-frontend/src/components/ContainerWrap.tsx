import { FC } from "react";
import styles from "./ContainerWrap.module.css";

const ContainerWrap = (Component: FC) => function HOC() {
    return (
        <div className={styles.container}>
            <Component />
        </div>
    );
}

export default ContainerWrap