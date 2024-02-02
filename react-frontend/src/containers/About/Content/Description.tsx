import { memo } from 'react';
import Text from '../../../components/Text';
import { aboutPageContent } from '../../../Texts';

function Description() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
            marginTop: "1rem",
            gap: "0.5rem",
        }}>
            {aboutPageContent.description.split("\n").map((paragraph, index) => (
                <Text variant="body" key={paragraph.substring(0, 5)} style={{
                    fontSize: "1.1rem",
                }}>
                    {paragraph}
                </Text>
            ))}
        </div>
    )
}

export default memo(Description);