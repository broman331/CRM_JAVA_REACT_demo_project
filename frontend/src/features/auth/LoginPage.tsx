import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from './auth-api';
import { toast } from 'sonner';

export const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = formData.get('email') as string; // Quick hack, better to use state or react-hook-form
        const password = formData.get('password') as string;

        try {
            await authApi.login(email, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:text-primary-light">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
