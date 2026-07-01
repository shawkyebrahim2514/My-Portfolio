import { CSSProperties, ReactNode, KeyboardEvent } from 'react';

const variantTags = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    body: 'p',
} as const;

type TextProps = {
    readonly variant?: keyof typeof variantTags;
    readonly style?: CSSProperties;
    readonly onClick?: () => void;
    readonly children: ReactNode;
};

export default function Text({ variant = 'body', style, onClick, children }: TextProps) {
    const Tag = variantTags[variant];

    // Only expose keyboard/focus affordances when the node is actually interactive.
    const interactiveProps = onClick
        ? {
              role: 'button' as const,
              tabIndex: 0,
              onClick,
              onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onClick();
                  }
              },
          }
        : {};

    return (
        <Tag style={style} {...interactiveProps}>
            {children}
        </Tag>
    );
}
