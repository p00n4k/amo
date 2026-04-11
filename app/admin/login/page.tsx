'use client';

import { useState } from 'react';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

const { Title, Text } = Typography;

type LoginFormValues = {
    username: string;
    password: string;
};

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(values: LoginFormValues) {
        setSubmitting(true);
        setErrorMessage('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            if (!response.ok) {
                setErrorMessage(result.error || 'Unable to sign in.');
                return;
            }

            const nextPath = searchParams.get('next') || '/admin';
            router.push(nextPath);
            router.refresh();
        } catch {
            setErrorMessage('Unable to sign in right now.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-white to-blue-100 px-6 py-12">
            <Card className="w-full max-w-[420px] rounded-[20px] shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
                <div className="mb-6">
                    <Text type="secondary" className="tracking-[0.18em] uppercase">
                        AMO Admin
                    </Text>
                    <Title level={2} className="mt-2 mb-2">
                        Sign in
                    </Title>
                    <Text type="secondary">Use your admin account stored in MySQL to access the dashboard.</Text>
                </div>

                {errorMessage ? (
                    <Alert
                        type="error"
                        message={errorMessage}
                        showIcon
                        className="mb-4"
                    />
                ) : null}

                <Form<LoginFormValues> layout="vertical" onFinish={handleSubmit} autoComplete="off">
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username.' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="admin" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password.' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
                        Sign in
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
