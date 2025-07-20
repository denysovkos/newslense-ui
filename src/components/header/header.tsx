import { Layout, Space, Typography } from "antd";
import { Link, useLocation } from "react-router";
import { useMemo } from "react";
import { useLoginWithStore } from "../../dataProviders/auth.ts";

const { Header } = Layout;

export const AppHeader = () => {
    const auth = useLoginWithStore((state) => state.auth);
    const user = useLoginWithStore((state) => state.user);
    const isAuthenticated = !!auth?.token;
    const location = useLocation();

    const menuItems = useMemo(() => {
        return isAuthenticated
            ? [
                { key: 'dashboard', label: 'Dashboard', to: '/dashboard' },
                { key: 'verifications', label: 'Verifications', to: '/verifications' },
                { key: 'profile', label: user?.email || 'Profile', to: '/profile' },
            ]
            : [
                { key: 'login', label: 'Login', to: '/login' },
                { key: 'register', label: 'Register', to: '/register' },
            ];
    }, [isAuthenticated, user?.email]);

    return (
        <Header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingInline: 24,
            }}
        >
            <Typography.Title level={3} style={{ color: 'white', margin: 0 }}>
                News Lens
            </Typography.Title>

            <Space size="large">
                {menuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.to);
                    return (
                        <Link
                            key={item.key}
                            to={item.to}
                            style={{
                                color: 'white',
                                textDecoration: isActive ? 'underline' : 'none',
                                fontWeight: isActive ? 600 : 400,
                            }}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </Space>
        </Header>
    );
};
