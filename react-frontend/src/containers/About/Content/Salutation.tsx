import { memo } from 'react';
import Text from '../../../components/Text';
import { aboutPageContent } from '../../../Texts';

function Salutation() {
    return (
        <Text variant="body" style={{
            fontSize: "2.2rem",
        }}>
            {aboutPageContent.salutation}
        </Text>
    )
}

export default memo(Salutation);