import {Flex, Layout, theme} from 'antd';
import {Outlet} from "react-router";
import {AppHeader} from "./components/header/header.tsx";

const { Content, Footer } = Layout;

const App = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

  return (
      <Layout style={{ minHeight: '100%' }}>
          <AppHeader />
          <Content style={{ padding: '0 48px' }}>
              <Flex
                  style={{
                      background: colorBgContainer,
                      minHeight: 280,
                      padding: 24,
                      margin: '10px 0',
                      borderRadius: borderRadiusLG,
                  }}
              >
                  <Outlet />
              </Flex>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
              News Lens ©{new Date().getFullYear()} Created by K
          </Footer>
      </Layout>
  )
}

export default App
