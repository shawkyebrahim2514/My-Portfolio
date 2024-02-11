import { memo } from 'react';
import Text from '../../../components/Text';
import { SanityAboutPage } from '../../../Types';

function Salutation({ salutation }: Readonly<Pick<SanityAboutPage, 'salutation'>>) {
    return (
        <Text variant="body" style={{
            fontSize: "2.2rem",
        }}>
            {salutation}
        </Text>
    )
}

export default memo(Salutation);