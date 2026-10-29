// A radial "spark burst" drawn wherever the user clicks, ported from React
// Bits' ClickSpark and adapted from a per-element wrapper into a single
// page-wide effect: one fixed full-viewport canvas listens for clicks
// anywhere in the document (no wrapping needed around individual buttons),
// mounted once in the root Layout.
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@react-spring/web';
import styles from './ClickSpark.module.css';

type Spark = {
    x: number;
    y: number;
    angle: number;
    startTime: number;
};

const SPARK_COLOR = '--color-secondary-400';
const SPARK_SIZE = 14;
const SPARK_RADIUS = 24;
const SPARK_COUNT = 10;
const DURATION = 500;
const LINE_WIDTH = 3;

// ease-out: fast start, gentle finish — matches the rest of the site's
// transitions (see --transition in tokens.css).
const easeOut = (t: number) => t * (2 - t);

export default function ClickSpark({ color }: Readonly<{ color?: string }>) {
    const reduceMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (reduceMotion) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        let sparks: Spark[] = [];
        let animationId: number | null = null;
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();

        const resolvedColor =
            color ||
            getComputedStyle(document.documentElement).getPropertyValue(SPARK_COLOR).trim() ||
            '#d4986c';

        const draw = (timestamp: number) => {
            animationId = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            sparks = sparks.filter((spark) => {
                const elapsed = timestamp - spark.startTime;
                if (elapsed >= DURATION) return false;

                const eased = easeOut(elapsed / DURATION);
                const distance = eased * SPARK_RADIUS;
                const lineLength = SPARK_SIZE * (1 - eased);

                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
                const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

                ctx.strokeStyle = resolvedColor;
                ctx.lineWidth = LINE_WIDTH;
                ctx.lineCap = 'round';
                ctx.globalAlpha = 1 - eased;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                return true;
            });
            ctx.globalAlpha = 1;

            if (sparks.length > 0) animationId = requestAnimationFrame(draw);
        };

        const handleClick = (event: MouseEvent) => {
            if (document.hidden) return;
            const now = performance.now();
            const newSparks: Spark[] = Array.from({ length: SPARK_COUNT }, (_, i) => ({
                x: event.clientX,
                y: event.clientY,
                angle: (2 * Math.PI * i) / SPARK_COUNT,
                startTime: now,
            }));
            sparks.push(...newSparks);
            if (animationId === null) animationId = requestAnimationFrame(draw);
        };

        const clear = () => {
            if (animationId !== null) cancelAnimationFrame(animationId);
            animationId = null;
            sparks = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
        const handleVisibility = () => {
            if (document.hidden) clear();
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('click', handleClick);
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            clear();
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('click', handleClick);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [color, reduceMotion]);

    return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
