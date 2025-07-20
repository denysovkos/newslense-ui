import { Navigate } from 'react-router';
import {useLoginWithStore} from "./dataProviders/auth.ts";
import type {ReactNode} from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const auth = useLoginWithStore(state => state.auth);
    return auth ? children : <Navigate to="/login" replace />;
}
