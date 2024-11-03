import { useMediaQuery } from 'react-responsive';
import Salutation from './Salutation';
import Name from './Name';
import SeekingPhrase from './SeekingPhrase';
import Position from './Position';
import Description from './Description';
import ResumeButton from './ResumeButton';
import { memo } from 'react';
import { SanityAboutPage } from '../../../Types';
import { useThemeContext } from '../../../contexts/ThemeContext';

function Content({
    seeking,
    personName,
    description,
    resume,
    position,
    salutation,
}: Readonly<Omit<SanityAboutPage, 'personImage'>>) {
    const isMediumScreen = useMediaQuery({ query: '(max-width: 1124px)' });
    const { theme } = useThemeContext();

    return (
        <div style={{
            color: theme.colors.base[700],
            textAlign: isMediumScreen ? "center" : "left",
        }}>
            <Salutation salutation={salutation} />
            <Name personName={personName} />
            <SeekingPhrase seeking={seeking} />
            <Position position={position} />
            <Description description={description} />
            <ResumeButton resume={resume} />
        </div>
    )
}

export default memo(Content);
