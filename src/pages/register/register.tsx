import { Button, Card, Flex, Form, Input, message } from 'antd';
import {type IRegisterData, register} from "../../dataProviders/auth.ts";
import {useNavigate} from "react-router";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: IRegisterData) => {
        try {
            await register(values)
            messageApi.info("User created successfully.")

            navigate('/login')
        } catch (e) {
            messageApi.error(`User already exists.`)
        }
    };

    return (
        <Flex style={{ width: '100vw' }} justify="center" align="center">
            {contextHolder}
            <Card title="Register" style={{ width: 400 }}>
                <Form layout="vertical" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Enter your username' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Enter your email' },
                            { type: 'email', message: 'Invalid email format' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Enter password' },
                            { min: 4, max: 16, message: '4–16 characters required' },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    return value === getFieldValue('password')
                                        ? Promise.resolve()
                                        : Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    );
}
