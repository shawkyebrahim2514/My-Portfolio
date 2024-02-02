import { memo } from 'react';
import Text from '../../../components/Text';
import { aboutPageContent } from '../../../Texts';

function SeekingPhrase() {
    return (
        <Text variant="h2">
            {aboutPageContent.seeking}
        </Text>
    )
}

export default memo(SeekingPhrase);