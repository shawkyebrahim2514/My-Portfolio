/**
 * Minimal classnames helper — joins truthy class strings.
 * Usage: cx(styles.icon, size === 'lg' && styles.lg, pointer && styles.pointer)
 */
export function cx(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(' ');
}
