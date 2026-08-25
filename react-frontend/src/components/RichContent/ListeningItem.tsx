import { memo } from 'react';
import type { RichListeningItem } from '../../Types';
import YouTube from './YouTube';

// Listening List clip: reuse the YouTube play facade, but keep authored
// title + credit so YouTube's uploader metadata never leads the card.
function ListeningItem({ value }: { value: RichListeningItem }) {
    return (
        <YouTube
            value={{
                _type: 'youtube',
                _key: value._key,
                url: value.url,
                videoId: value.videoId,
                thumbnail: value.thumbnail,
                videoTitle: value.title,
                channelTitle: value.credit,
                caption: value.note,
            }}
            variant="stack"
        />
    );
}

export default memo(ListeningItem);
