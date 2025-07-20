import { create } from 'zustand';
import {Config} from "../config.ts";

export interface IFeedItem {
    title: string;
    link: string;
    content: string;
    description: string;
    publishingDate?: string; // ISO 8601 string (DateTime? in C#)
}

export interface IFeedData {
    title: string;
    description: string;
    link: string;
    items: IFeedItem[];
}

interface FeedDetailsState {
    feed: IFeedData | null;
    isLoading: boolean;
    error: string | null;
    loadFeed: (feedId: string, token: string) => Promise<void>;
}

export async function addFeed(feed: { label: string; url: string }, token: string): Promise<void> {
    const res = await fetch(`${Config.baseUrl}/RssFeed`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(feed),
    });

    if (!res.ok) throw new Error('Failed to update feed');
}

export async function updateFeed(feed: { id: string; label: string; url: string }, token: string): Promise<void> {
    const res = await fetch(`${Config.baseUrl}/RssFeed/${feed.id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(feed),
    });

    if (!res.ok) throw new Error('Failed to update feed');
}

export async function deleteFeed(feedId: string, token: string): Promise<void> {
    const res = await fetch(`${Config.baseUrl}/RssFeed/${feedId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
        },
    });

    if (!res.ok) throw new Error('Failed to delete feed');
}

export async function getFeedDetails(feedId: string, token: string): Promise<IFeedData> {
    const res = await fetch(`${Config.baseUrl}/RssFeed/${feedId}/news`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
        },
    });

    if (!res.ok) throw new Error('Failed to update feed');

    return await res.json();
}

export const useFeedDetailsStore = create<FeedDetailsState>((set) => ({
    feed: null,
    isLoading: false,
    error: null,

    loadFeed: async (feedId, token) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getFeedDetails(feedId, token);
            set({ feed: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false, feed: null });
        }
    },
}));
