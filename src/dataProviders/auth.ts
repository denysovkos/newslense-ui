import createRefresh from "react-auth-kit/createRefresh";
import {create} from "zustand";
import { persist } from 'zustand/middleware';
import type {IRssFeed} from "./user.ts";
import {Config} from "../config.ts";

interface ILoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    jwt: {
        token: string;
        refreshToken: string;
        tokenExpiration: string; // ISO timestamp
    };
    user: {
        id: string;
        username: string;
        email: string;
        createDate: string; // ISO timestamp
        roles: string[] | null;
        settings: unknown | null;
        rssFeeds: IRssFeed[]; // replace with actual type if available
    };
}

interface IUser {
    id: string;
    username: string;
    email: string;
    createDate: string;
}

interface ILoginState {
    user: IUser | null;
    settings: unknown | null;
    rssFeeds: IRssFeed[];
    auth: IJwt | null;
    fetch: (data: ILoginData) => Promise<void>;
}

interface IJwt {
    token: string;
    refreshToken: string;
    tokenExpiration: string;
}

export interface IRegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const useLoginWithStore = create(
    persist<ILoginState>(
        (set) => ({
            user: null,
            settings: null,
            rssFeeds: [],
            auth: null,
            fetch: async (data: ILoginData) => {
                const res = await login(data);
                set({
                    user: {
                        id: res.user.id,
                        username: res.user.username,
                        email: res.user.email,
                        createDate: res.user.createDate,
                    },
                    settings: res.user.settings,
                    rssFeeds: res.user.rssFeeds,
                    auth: res.jwt,
                });
            },
        }),
        {
            name: 'auth-store',
            // @ts-expect-error we don't need to store everything
            partialize: (state: ILoginState) => ({
                auth: state.auth,
                user: state.user,
            }),
        }
    )
);

export const login = async (data: ILoginData): Promise<LoginResponse> => {
    const response = await fetch(`${Config.baseUrl}/Auth/Login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (!response.ok) {
        const message = await response.text()
        throw new Error(message)
    }

    return await response.json()
}

export const register = async (data: IRegisterData): Promise<string> => {
    const response = await fetch(`${Config.baseUrl}/Auth/Register`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (!response.ok) {
        const message = await response.text()
        throw new Error(message)
    }

    return await response.text()
}

export const refreshToken = createRefresh({
    interval: 10, // The time in sec to refresh the Access token,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    refreshApiCallback: async (param) => {
        try {
            console.log('param >>> ', param);
            const response = await fetch(`${Config.baseUrl}/Auth/Refresh`, {
                method: "POST",
                body: JSON.stringify({
                    "accessToken": param.authToken,
                    "refreshToken": param.refreshToken,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await response.json()
            return {
                isSuccess: true,
                newAuthToken: data.token,
                newAuthTokenExpireIn: 10,
                newRefreshTokenExpiresIn: 60
            }
        }
        catch(error){
            console.error(error)
            return {
                isSuccess: false
            }
        }
    }
})
