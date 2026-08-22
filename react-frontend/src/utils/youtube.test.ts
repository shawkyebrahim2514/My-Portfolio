import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RichContentNode, RichCuratedVideo, RichYouTube } from '../Types';
import { enrichYouTubeBlocks } from './youtube';

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('enrichYouTubeBlocks', () => {
    it('enriches Curated Videos and videos nested in their companion content', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    title: 'Resolved title',
                    author_name: 'Resolved channel',
                    author_url: 'https://www.youtube.com/@resolved',
                    thumbnail_url: 'https://example.com/thumbnail.jpg',
                }),
            })
        );

        const nestedVideo: RichYouTube = {
            _type: 'youtube',
            _key: 'nested',
            url: 'https://youtu.be/9bZkp7q19f0',
        };
        const curatedVideo: RichCuratedVideo = {
            _type: 'curatedVideo',
            _key: 'curated',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            companionContent: [
                {
                    _type: 'expandableDetails',
                    _key: 'details',
                    summary: 'Related video',
                    body: [nestedVideo],
                },
            ],
        };
        const body: RichContentNode[] = [curatedVideo];

        await enrichYouTubeBlocks(body);

        expect(curatedVideo.videoId).toBe('dQw4w9WgXcQ');
        expect(curatedVideo.videoTitle).toBe('Resolved title');
        expect(nestedVideo.videoId).toBe('9bZkp7q19f0');
        expect(nestedVideo.channelTitle).toBe('Resolved channel');
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
