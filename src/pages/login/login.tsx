import {Button, Form, Input, Card, Flex, message} from 'antd';
import {useLoginWithStore} from "../../dataProviders/auth.ts";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import {useNavigate} from "react-router";

export default function LoginPage() {
    const signIn = useSignIn();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: { email: string; password: string }) => {
        const loginUser = useLoginWithStore.getState().fetch;

        try {
            await loginUser(values); // calls login and populates Zustand store

            const { user, auth } = useLoginWithStore.getState();

            signIn({
                auth: {
                    token: auth?.token as string,
                    type: 'Bearer',
                },
                refresh: auth?.refreshToken,
                userState: user,
            });

            navigate('/dashboard')
        } catch (e) {
            messageApi.error((e as Error).message)
        }
    };

    return (
        <Flex
            style={{ width: '100vw' }}
            justify="center"
            align="center"
        >
            {contextHolder}
            <Card title="Login" style={{ width: 360 }}>
                <Form
                    name="login"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Invalid email!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    );
}
