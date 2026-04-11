'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
    HomeOutlined,
    PictureOutlined,
    AppstoreOutlined,
    BranchesOutlined,
    ProjectOutlined,
    ShopOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    TagsOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        setLoggingOut(true);

        try {
            await fetch('/api/admin/logout', {
                method: 'POST',
            });
        } finally {
            router.push('/admin/login');
            router.refresh();
            setLoggingOut(false);
        }
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const menuItems = [
        {
            key: '/admin',
            icon: <HomeOutlined />,
            label: <Link href="/admin">Dashboard</Link>,
        },
        {
            key: '/admin/home-sliders',
            icon: <PictureOutlined />,
            label: <Link href="/admin/home-sliders">Home Sliders</Link>,
        },
        {
            key: '/admin/brands',
            icon: <TagsOutlined />,
            label: <Link href="/admin/brands">Brands</Link>,
        },
        {
            key: '/admin/collections',
            icon: <AppstoreOutlined />,
            label: <Link href="/admin/collections">Collections</Link>,
        },
        {
            key: '/admin/projects',
            icon: <ProjectOutlined />,
            label: <Link href="/admin/projects">Projects</Link>,
        },
        {
            key: '/admin/product-focus',
            icon: <BranchesOutlined />,
            label: <Link href="/admin/product-focus">Product Focus</Link>,
        },
        {
            key: '/admin/product-main',
            icon: <ShopOutlined />,
            label: <Link href="/admin/product-main">Product Main</Link>,
        },
        {
            key: '/admin/product-items',
            icon: <AppstoreOutlined />,
            label: <Link href="/admin/product-items">Product Items</Link>,
        },
    ];

    return (
        <Layout className="min-h-screen">
            <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
                <div
                    className={`flex h-16 items-center justify-center font-bold text-white ${
                        collapsed ? 'text-base' : 'text-xl'
                    }`}
                >
                    {collapsed ? 'AMO' : 'AMO Admin'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header className="bg-white p-0">
                    <div className="flex h-16 items-center justify-between pr-4">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="h-16 w-16 text-base"
                        />
                        <div>
                            <Button
                                icon={<LogoutOutlined />}
                                onClick={handleLogout}
                                loading={loggingOut}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </Header>
                <Content className="m-4 min-h-[280px] rounded-xl bg-white p-6 md:m-6">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}