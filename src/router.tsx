import { createBrowserRouter } from "react-router";
import App from "./App";
import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import {ProtectedRoute} from "./protectedRoute.tsx";
import {Dashboard} from "./pages/dashboard/dashboard.tsx";
import {Profile} from "./pages/profile/profile.tsx";
import {Home} from "./pages/home/home.tsx";
import {Verifications} from "./pages/verifications/verifications.tsx";
import {FeedDetails} from "./pages/feedDetails/feedDetails.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Home /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            {
                path: "dashboard",
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },
            {
              path: "/dashboard/:feedId",
                element: (
                    <ProtectedRoute>
                        <FeedDetails />
                    </ProtectedRoute>
                )
            },
            {
                path: "verifications",
                element: (
                    <ProtectedRoute>
                        <Verifications />
                    </ProtectedRoute>
                ),
            },
            {
                path: "verifications/:id",
                element: (
                    <ProtectedRoute>
                        <Verifications />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
