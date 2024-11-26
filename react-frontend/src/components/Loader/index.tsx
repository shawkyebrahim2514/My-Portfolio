import { useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useThemeContext } from '../../contexts/ThemeContext';

export default function Loader() {
    const { theme } = useThemeContext();

    const containerStyle = useMemo(() => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }), []);

    return (
        <div style={containerStyle}>
            <FontAwesomeIcon
            style={{
                color: theme.colors.base[700],
            }}
            icon={faSpinner} size="2x" spin />
        </div>
    )
}