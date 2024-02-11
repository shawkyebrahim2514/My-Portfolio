import { CSSProperties, useMemo } from 'react';
import Text from '../../../components/Text'
import { SanityEducationPage } from '../../../Types';

export default function EducationInformation({ location, date }: Readonly<Pick<SanityEducationPage["education"], 'location' | 'date'>>) {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        width: "100%",
    }), []);

    return (
        <div style={containerStyle}>
            <Text variant={"body"}>
                {`From ${date.start} - to ${date.end}`}
            </Text>
            <Text variant={"body"}>
                {`${location}`}
            </Text>
        </div>
    )
}