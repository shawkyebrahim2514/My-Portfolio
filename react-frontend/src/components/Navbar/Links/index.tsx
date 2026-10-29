import { useEffect, useState } from 'react';
import ToggledLinks from './ToggledLinks';
import NormalLinks from './NormalLinks';
import styles from './Links.module.css';

export default function Links() {
    const [enhanced, setEnhanced] = useState(false);

    useEffect(() => {
        setEnhanced(true);
    }, []);

    return (
        <div className={styles.links} data-enhanced={enhanced || undefined}>
            <div className={styles.desktop}>
                <NormalLinks />
            </div>
            <div className={styles.mobile}>
                <ToggledLinks />
            </div>
        </div>
    );
}
