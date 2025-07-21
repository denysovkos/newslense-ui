import { useLoginWithStore } from "../../dataProviders/auth.ts";
import { useNewsValidationStore } from "../../dataProviders/aiValidator.ts";
import { Alert, Spin, Card, Collapse, Typography, Tag } from "antd";
import { useEffect } from "react";
import Markdown from 'react-markdown'

const { Panel } = Collapse;
const { Paragraph, Title, Text } = Typography;

export const Verifications = () => {
    const token = useLoginWithStore((state) => state.auth?.token);
    const { newsValidations, loadNewsValidations, isLoading, error } = useNewsValidationStore();

    useEffect(() => {
        if (token) loadNewsValidations(token).catch(console.error);
    }, [token]);

    if (isLoading) return <Spin />;
    if (error) return <Alert type="error" message="Failed to load feed." />;
    if (!newsValidations || newsValidations.length === 0)
        return <Alert type="warning" message="No news verifications found." />;

    return (
        <Card title="Protected Verifications" bordered style={{ width: '100%', margin: "0 auto" }}>
            <Collapse accordion>
                {newsValidations.map((item) => (
                    <Panel
                        header={
                            <div>
                                <Text strong>ID:</Text> <Text code>{item.remoteId}</Text>
                                <Text>{item.aiValidationComment.replace('**Executive Summary**', '').slice(0, 150)}...</Text>
                            </div>
                        }
                        key={item.id}
                    >
                        <Paragraph>
                            <Tag color="blue">Feed ID: {item.rssFeedId}</Tag>
                            <Tag color="purple">User ID: {item.userId}</Tag>
                        </Paragraph>

                        {item.rawItemXml && (
                            <Paragraph>
                                <Title level={5}>Raw XML</Title>
                                <pre style={{ background: "#f5f5f5", padding: "10px", overflowX: "auto" }}>
                  {item.rawItemXml}
                </pre>
                            </Paragraph>
                        )}

                        <Paragraph>
                            <Markdown>
                                {item.aiValidationComment}
                            </Markdown>
                        </Paragraph>
                    </Panel>
                ))}
            </Collapse>
        </Card>
    );
};
