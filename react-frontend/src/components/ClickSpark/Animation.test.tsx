import { fireEvent, render, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ClickSpark from './index';
import ShapeGridBackground from '../ShapeGridBackground';

let reducedMotion: boolean | null = false;
vi.mock('@react-spring/web', () => ({ useReducedMotion: () => reducedMotion }));

let frames: Map<number, FrameRequestCallback>;
let sequence: number;
const context: Partial<CanvasRenderingContext2D> = {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
};

function tick(time: number) {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback(time));
}

beforeEach(() => {
    reducedMotion = false;
    sequence = 0;
    frames = new Map();
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
        context as CanvasRenderingContext2D
    );
    vi.stubGlobal(
        'requestAnimationFrame',
        vi.fn((callback: FrameRequestCallback) => {
            frames.set(++sequence, callback);
            return sequence;
        })
    );
    vi.stubGlobal(
        'cancelAnimationFrame',
        vi.fn((id: number) => frames.delete(id))
    );
});

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
});

describe('Decorative animation scheduling', () => {
    it('schedules sparks only after a click and stops after the burst expires', () => {
        render(<ClickSpark />);
        expect(frames.size).toBe(0);
        fireEvent.click(window, { clientX: 20, clientY: 30 });
        expect(frames.size).toBe(1);
        tick(performance.now());
        expect(context.stroke).toHaveBeenCalled();
        expect(frames.size).toBe(1);
        tick(performance.now() + 501);
        expect(frames.size).toBe(0);
    });

    it.each([true, null])(
        'keeps the grid static when motion preference is reduced or unresolved (%s)',
        (preference) => {
            reducedMotion = preference;
            render(
                <>
                    <ClickSpark />
                    <ShapeGridBackground />
                </>
            );
            expect(context.clearRect).toHaveBeenCalled();
            fireEvent.click(window);
            fireEvent.resize(window);
            expect(frames.size).toBe(0);
        }
    );

    it('cancels work while hidden, discards transient sparks and resumes only the grid', () => {
        render(
            <>
                <ClickSpark />
                <ShapeGridBackground />
            </>
        );
        fireEvent.click(window);
        expect(frames.size).toBe(2);
        vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
        fireEvent(document, new Event('visibilitychange'));
        expect(frames.size).toBe(0);
        fireEvent.click(window);
        expect(frames.size).toBe(0);
        vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
        fireEvent(document, new Event('visibilitychange'));
        expect(frames.size).toBe(1);
    });

    it('cancels scheduled frames when the components unmount', () => {
        const view = render(
            <>
                <ClickSpark />
                <ShapeGridBackground />
            </>
        );
        fireEvent.click(window);
        view.unmount();
        expect(frames.size).toBe(0);
    });
});
