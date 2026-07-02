import { Component, ErrorInfo, ReactNode } from 'react';
import SectionError from '../SectionError';

type ErrorBoundaryProps = {
    readonly children: ReactNode;
    readonly fallback?: ReactNode;
};

type ErrorBoundaryState = {
    readonly hasError: boolean;
};

export default class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error, info);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <SectionError message="Something went wrong while loading this page. Please refresh and try again." />
                )
            );
        }
        return this.props.children;
    }
}
