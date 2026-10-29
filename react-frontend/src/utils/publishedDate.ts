import type { HubContentLanguage } from '../Types';

export function formatPublishedDate(iso: string, language: HubContentLanguage): string {
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(iso));
}
