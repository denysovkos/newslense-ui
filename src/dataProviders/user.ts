import { create } from 'zustand';
import {addFeed, deleteFeed, updateFeed} from './feeds.ts';

export interface IRssFeed {
    id: string;
    label: string;
    url: string;
}

export interface IUserData {
    id: string;
    username: string;
    email: string | null;
    createDate: string;
    roles: unknown[];
    settings: {
        openAiToken: string;
    };
    rssFeeds: IRssFeed[];
}

export interface IUserStore {
    userData: IUserData | null;
    hasLoaded: boolean;
    loadUser: (email: string, token: string) => Promise<void>;
    // Feeds
    addFeed: (feed: Omit<IRssFeed, 'id'>, token: string) => Promise<void>;
    updateFeed: (feed: IRssFeed, token: string) => Promise<void>;
    removeFeed: (feedId: string, token: string) => Promise<void>;
}

const loadUser = async (email: string, token: string): Promise<IUserData> => {
    const res = await fetch(`http://localhost:5150/User/${email}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/plain',
        },
    });

    if (!res.ok) throw new Error('Failed to load user feeds');

    return res.json();
};

export const useUserStore = create<IUserStore>((set, get) => ({
    userData: null,
    hasLoaded: false,

    loadUser: async (email, token) => {
        const data = await loadUser(email, token);
        set({ userData: data, hasLoaded: true });
    },

    addFeed: async (feed, token) => {
        await addFeed(feed, token);
        const current = get().userData;
        if (!current) return;
        await get().loadUser(current.email as string, token);
    },

    updateFeed: async (feed, token) => {
        await updateFeed(feed, token);
        const current = get().userData;
        if (!current) return;
        const updated = current.rssFeeds.some(f => f.id === feed.id)
            ? current.rssFeeds.map(f => (f.id === feed.id ? feed : f))
            : [...current.rssFeeds, feed];
        set({ userData: { ...current, rssFeeds: updated } });
    },

    removeFeed: async (feedId, token) => {
        await deleteFeed(feedId, token);
        const current = get().userData;
        if (!current) return;
        set({
            userData: {
                ...current,
                rssFeeds: current.rssFeeds.filter(f => f.id !== feedId),
            },
        });
    },
}));
