import {Config} from "../config.ts";
import {type IFeedItem} from "./feeds.ts";
import {create} from "zustand";

export interface INewsValidation {
    id: string;
    remoteId: string;
    userId: string;
    rssFeedId: string;
    rssFeed: string;
    rawItemXml: string;
    manualUrl: string;
    aiValidationComment: string;
}

interface NewsValidationState {
    newsValidations: INewsValidation[] | null;
    isLoading: boolean;
    error: string | null;
    loadNewsValidations: (token: string) => Promise<void>;
}

export const executeNewsVerification = async (token: string, item: IFeedItem) => {
    const res = await fetch(`${Config.baseUrl}/FeedItemValidation`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });

    if (!res.ok) throw new Error('Failed to run feed validation');
}

export const loadNewsVerifications = async (token: string): Promise<INewsValidation[]> => {
    const res = await fetch(`${Config.baseUrl}/FeedItemValidation`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
        },
    });

    return await res.json()
}

export const useNewsValidationStore = create<NewsValidationState>((set) => ({
    newsValidations: null,
    isLoading: false,
    error: null,

    loadNewsValidations: async (token): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
            const data = await loadNewsVerifications(token);
            set({ newsValidations: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false, newsValidations: null });
        }
    },
}));
