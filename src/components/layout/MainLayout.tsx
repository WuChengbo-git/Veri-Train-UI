/**
 * MainLayout - 主布局组件
 */

import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Badge, Dropdown, Avatar, Button, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useGlobalStore } from '@/stores';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  // 全局状态
  const { sidebarCollapsed, toggleSidebar, unreadCount, user } = useGlobalStore();

  // 菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'ダッシュボード',
    },
    {
      key: '/models',
      icon: <RobotOutlined />,
      label: 'モデル',
    },
    {
      key: '/datasets',
      icon: <DatabaseOutlined />,
      label: 'データセット',
    },
    {
      key: '/experiments',
      icon: <ExperimentOutlined />,
      label: '実験',
    },
    {
      key: '/evaluation',
      icon: <BarChartOutlined />,
      label: '評価',
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: 'レポート',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '設定',
    },
  ];

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'プロフィール',
    },
    {
      key: 'logout',
      label: 'ログアウト',
    },
  ];

  // 菜单点击处理
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  // 用户菜单点击处理
  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      // 处理登出
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    } else if (key === 'profile') {
      navigate('/settings');
    }
  };

  // 获取当前激活的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    // 匹配第一级路径
    const match = path.match(/^\/([^\/]+)/);
    return match ? `/${match[1]}` : '/dashboard';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={240}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorder}`,
        }}
      >
        {/* Logo区域 */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${token.colorBorder}`,
            fontSize: sidebarCollapsed ? 16 : 20,
            fontWeight: 'bold',
            color: token.colorPrimary,
          }}
        >
          {sidebarCollapsed ? 'VT' : 'Veri-Train'}
        </div>

        {/* 菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        {/* 顶部导航栏 */}
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            style={{
              fontSize: 16,
              width: 48,
              height: 48,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* 通知 */}
            <Badge count={unreadCount} offset={[-4, 4]}>
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 18 }} />}
                onClick={() => {
                  // 打开通知面板
                }}
                style={{ width: 40, height: 40 }}
              />
            </Badge>

            {/* 用户头像 */}
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} src={user?.avatar} />
                {!sidebarCollapsed && (
                  <span style={{ fontSize: 14 }}>{user?.name || 'ユーザー'}</span>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
