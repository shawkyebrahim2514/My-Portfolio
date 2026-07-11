// Ambient site-wide background: a drifting hexagon grid rendered on a fixed
// full-viewport <canvas>, with a subtle "trail" of highlighted cells that
// follows the pointer. Ported from React Bits' ShapeGrid (pure canvas, no
// extra dependency) and trimmed to just the hexagon shape/diagonal drift this
// portfolio uses. Replaces the old static background.svg tiled pattern.
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@react-spring/web';
import styles from './ShapeGridBackground.module.css';

type GridOffset = { x: number; y: number };

// Matches the params the user picked from the React Bits playground
// (shape=hexagon&speed=0.25&size=38&hoverTrailAmount=8).
const SQUARE_SIZE = 38;
const SPEED = 0.25;
const HOVER_TRAIL_AMOUNT = 8;
// Keeps the grid readable but light enough not to compete with real content.
const GRID_LINE_ALPHA = 0.45;

export default function ShapeGridBackground({ hoverColor }: Readonly<{ hoverColor?: string }>) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rootStyle = getComputedStyle(document.documentElement);
        const borderColor = rootStyle.getPropertyValue('--color-base-300').trim() || '#bdbdb6';
        const hoverFillColor =
            hoverColor || rootStyle.getPropertyValue('--color-secondary-300').trim() || '#f6c29a';

        const hexHoriz = SQUARE_SIZE * 1.5;
        const hexVert = SQUARE_SIZE * Math.sqrt(3);

        const gridOffset: GridOffset = { x: 0, y: 0 };
        let hoveredCell: GridOffset | null = null;
        const trailCells: GridOffset[] = [];
        const cellOpacities = new Map<string, number>();
        let requestId = 0;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const drawHex = (cx: number, cy: number, size: number) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const vx = cx + size * Math.cos(angle);
                const vy = cy + size * Math.sin(angle);
                if (i === 0) ctx.moveTo(vx, vy);
                else ctx.lineTo(vx, vy);
            }
            ctx.closePath();
        };

        const drawGrid = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 1;

            const colShift = Math.floor(gridOffset.x / hexHoriz);
            const offsetX = ((gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
            const offsetY = ((gridOffset.y % hexVert) + hexVert) % hexVert;

            const cols = Math.ceil(canvas.width / hexHoriz) + 3;
            const rows = Math.ceil(canvas.height / hexVert) + 3;

            for (let col = -2; col < cols; col++) {
                for (let row = -2; row < rows; row++) {
                    const cx = col * hexHoriz + offsetX;
                    const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + offsetY;

                    const cellKey = `${col},${row}`;
                    const alpha = cellOpacities.get(cellKey);
                    if (alpha) {
                        ctx.globalAlpha = alpha;
                        drawHex(cx, cy, SQUARE_SIZE);
                        ctx.fillStyle = hoverFillColor;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                    }

                    drawHex(cx, cy, SQUARE_SIZE);
                    ctx.globalAlpha = GRID_LINE_ALPHA;
                    ctx.strokeStyle = borderColor;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        };

        const updateCellOpacities = () => {
            const targets = new Map<string, number>();

            if (hoveredCell) {
                targets.set(`${hoveredCell.x},${hoveredCell.y}`, 1);
            }
            for (let i = 0; i < trailCells.length; i++) {
                const cell = trailCells[i];
                const key = `${cell.x},${cell.y}`;
                if (!targets.has(key)) {
                    targets.set(key, (trailCells.length - i) / (trailCells.length + 1));
                }
            }

            for (const key of targets.keys()) {
                if (!cellOpacities.has(key)) cellOpacities.set(key, 0);
            }
            for (const [key, opacity] of cellOpacities) {
                const target = targets.get(key) ?? 0;
                const next = opacity + (target - opacity) * 0.15;
                if (next < 0.005) cellOpacities.delete(key);
                else cellOpacities.set(key, next);
            }
        };

        // Users who prefer reduced motion still get the grid + hover trail
        // (a direct response to their own pointer movement), just without
        // the ambient auto-drift.
        const updateAnimation = () => {
            if (!reduceMotion) {
                const wrapX = hexHoriz * 2;
                const wrapY = hexVert;
                gridOffset.x = (gridOffset.x - SPEED + wrapX) % wrapX;
                gridOffset.y = (gridOffset.y - SPEED + wrapY) % wrapY;
            }
            updateCellOpacities();
            drawGrid();
            requestId = requestAnimationFrame(updateAnimation);
        };

        const pushTrail = (cell: GridOffset) => {
            trailCells.unshift({ ...cell });
            if (trailCells.length > HOVER_TRAIL_AMOUNT) trailCells.length = HOVER_TRAIL_AMOUNT;
        };

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const colShift = Math.floor(gridOffset.x / hexHoriz);
            const offsetX = ((gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
            const offsetY = ((gridOffset.y % hexVert) + hexVert) % hexVert;
            const adjustedX = mouseX - offsetX;
            const adjustedY = mouseY - offsetY;

            const col = Math.round(adjustedX / hexHoriz);
            const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;
            const row = Math.round((adjustedY - rowOffset) / hexVert);

            if (!hoveredCell || hoveredCell.x !== col || hoveredCell.y !== row) {
                if (hoveredCell) pushTrail(hoveredCell);
                hoveredCell = { x: col, y: row };
            }
        };

        const handleMouseLeave = () => {
            if (hoveredCell) pushTrail(hoveredCell);
            hoveredCell = null;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        requestId = requestAnimationFrame(updateAnimation);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(requestId);
        };
    }, [reduceMotion, hoverColor]);

    return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
