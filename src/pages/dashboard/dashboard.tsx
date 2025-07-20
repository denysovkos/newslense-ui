import {
    Button,
    Modal,
    Space,
    Table,
    Typography,
    Form,
    Input,
    message,
} from 'antd';
import { Link } from 'react-router';
import { useLoginWithStore } from '../../dataProviders/auth.ts';
import { useEffect, useState } from 'react';
import {type IRssFeed, useUserStore} from '../../dataProviders/user.ts';

const { Title } = Typography;

export const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeed, setEditingFeed] = useState<IRssFeed | null>(null);
    const [form] = Form.useForm();

    const token = useLoginWithStore((state) => state.auth?.token);
    const email = useLoginWithStore((state) => state.user?.email);

    const {
        userData,
        hasLoaded,
        loadUser,
        updateFeed,
        removeFeed,
        addFeed
    } = useUserStore();

    const rssFeeds = userData?.rssFeeds ?? [];

    useEffect(() => {
        if (!hasLoaded && email && token) {
            loadUser(email, token).catch(console.error);
        }
    }, [hasLoaded, email, token, loadUser]);

    const openNewModal = () => {
        setEditingFeed(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const openEditModal = (record: IRssFeed) => {
        setEditingFeed(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        const values = form.getFieldsValue();
        if (!token) return;
        try {
            if (!editingFeed?.id) {
                await addFeed(values, token);
            } else {
                await updateFeed(
                    {
                        id: editingFeed?.id,
                        ...values,
                    },
                    token
                );
            }
            setIsModalOpen(false);
            form.resetFields();
            message.success('Feed saved');
        } catch (err) {
            console.error(err);
            message.error('Failed to save feed');
        }
    };

    const handleRemove = async (feed: IRssFeed) => {
        if (!token) return;
        try {
            await removeFeed(feed.id, token);
            message.success('Feed removed');
        } catch (err) {
            console.error(err);
            message.error('Failed to remove feed');
        }
    };

    const columns = [
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
            render: (_: unknown, record: IRssFeed) => (
                <Link to={`/dashboard/${record.id}`}>{record.label}</Link>
            ),
        },
        { title: 'URL', dataIndex: 'url', key: 'url' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: IRssFeed) => (
                <Space>
                    <Button type="link" onClick={() => openEditModal(record)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleRemove(record)}>
                        Remove
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        RSS Feeds
                    </Title>
                    <Button type="primary" onClick={openNewModal}>
                        + New Feed
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={rssFeeds}
                    rowKey="id"
                    bordered
                    pagination={false}
                />
            </Space>

            <Modal
                open={isModalOpen}
                title={editingFeed ? 'Edit Feed' : 'New Feed'}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnHidden
            >
                <Form layout="vertical" form={form} onFinish={handleSave}>
                    <Form.Item name="label" label="Label" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="url" label="URL" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <Button onClick={() => setIsModalOpen(false)}>Discard</Button>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
};
