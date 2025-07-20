import { useEffect } from "react";
import { useParams } from "react-router";
import {type IFeedItem, useFeedDetailsStore} from "../../dataProviders/feeds";
import { useLoginWithStore } from "../../dataProviders/auth";
import { Card, Typography, Row, Col, Button, Spin, Alert } from "antd";

const { Title, Paragraph } = Typography;

const parseHtmlContent = (input: string, description: string, title: string): { text: string; imageSrc?: string } => {
    input = input ?? description ?? title ?? '';

    const div = document.createElement('div');
    div.innerHTML = input;

    const img = div.querySelector('img');
    let imageSrc: string | undefined = undefined;

    if (img) {
        imageSrc = img.getAttribute('src') ?? undefined;
        img.remove();
    }

    const isHtml = div.childNodes.length > 0 && Array.from(div.childNodes).some(node => node.nodeType === 1 || node.nodeType === 3);
    const text = isHtml ? div.textContent?.trim() ?? '' : (input || description || title)?.trim();

    return { text, imageSrc };
}

export const FeedDetails = () => {
    const { feedId } = useParams();
    const token = useLoginWithStore((state) => state.auth?.token);
    const { feed, isLoading, error, loadFeed } = useFeedDetailsStore();

    useEffect(() => {
        if (feedId && token) {
            loadFeed(feedId, token);
        }
    }, [feedId, token]);

    if (isLoading) return <Spin />;
    if (error) return <Alert type="error" message="Failed to load feed." />;

    return (
        <div>
            <Title level={2}>{feed?.title}</Title>
            <Paragraph>{feed?.description}</Paragraph>

            <Row gutter={[16, 16]}>
                {feed?.items.map((item: IFeedItem) => {
                    const { text, imageSrc } = parseHtmlContent(item.content, item.description, item.title);

                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={item.link}>
                            <Card
                                cover={imageSrc ? <img alt="thumbnail" src={imageSrc} /> : null}
                                title={item.title}
                                actions={[
                                    <Button type="link">Verify</Button>,
                                    <Button type="link" href={item.link} target="_blank">Read</Button>,
                                ]}
                            >
                                <Paragraph ellipsis={{ rows: 3 }}>{text}</Paragraph>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};
