import { memo } from 'react';
import Text from '../../../components/Text';
import { SanityAboutPage } from '../../../Types';

function SeekingPhrase({ seeking }: Readonly<Pick<SanityAboutPage, 'seeking'>>) {
    return (
        <Text variant="h2">
            {seeking}
        </Text>
    )
}

export default memo(SeekingPhrase);