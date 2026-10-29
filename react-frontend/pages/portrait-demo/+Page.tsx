import ContainerWrap from '../../src/components/ContainerWrap';
import { About } from '../index/+Page';
import styles from './PortraitDemo.module.css';

function PortraitDemo() {
    return (
        <>
            <aside className={styles.notice} aria-label="Design preview">
                <span>Portrait concept - stock placeholder, not Shawky</span>
                <a href="/">Compare with the current portrait</a>
            </aside>
            <About
                portrait={
                    <figure className={styles.figure}>
                        <div className={styles.scene}>
                            <img
                                src="/images/portrait-demo.webp"
                                alt="Stock model demonstrating the background-free portrait concept"
                                width={486}
                                height={549}
                                fetchPriority="high"
                            />
                        </div>
                        <figcaption className={styles.credit}>
                            Placeholder: <a href="https://pngimg.com/image/6565">PNGimg</a>
                            {' / '}
                            <a href="https://creativecommons.org/licenses/by-nc/4.0/">
                                CC BY-NC 4.0
                            </a>
                            {' (WebP conversion). Non-commercial demo only.'}
                        </figcaption>
                    </figure>
                }
            />
        </>
    );
}

export default ContainerWrap(PortraitDemo);
