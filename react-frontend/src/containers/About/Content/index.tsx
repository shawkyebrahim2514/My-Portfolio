import { useMediaQuery } from 'react-responsive';
import Salutation from './Salutation';
import Name from './Name';
import SeekingPhrase from './SeekingPhrase';
import Position from './Position';
import Description from './Description';
import ResumeButton from './ResumeButton';
import { memo } from 'react';

function Content() {
    const isMediumScreen = useMediaQuery({ query: '(max-width: 1124px)' });

    return (
        <div style={{
            textAlign: isMediumScreen ? "center" : "left",
        }}>
            <Salutation />
            <Name />
            <SeekingPhrase />
            <Position />
            <Description />
            <ResumeButton />
        </div>
    )
}

export default memo(Content);
