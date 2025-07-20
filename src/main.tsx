import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router';
import { router } from './router';
import AuthProvider from "react-auth-kit";
import createStore from 'react-auth-kit/createStore';
import {refreshToken} from "./dataProviders/auth.ts";

const store = createStore({
    authName:'_auth',
    authType:'localstorage',
    refresh: refreshToken
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider store={store}>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
