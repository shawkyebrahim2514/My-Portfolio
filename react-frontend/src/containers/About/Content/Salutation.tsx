import Text from '../../../components/Text';
import { aboutPageContent } from '../../../Texts';

export default function Salutation() {
    return (
        <Text variant="body" style={{
            fontSize: "2.2rem",
        }}>
            {aboutPageContent.salutation}
        </Text>
    )
}
