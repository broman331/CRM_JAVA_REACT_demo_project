import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from './auth-api';
import { toast } from 'sonner';

export const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);

        const data = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string
        };

        try {
            await authApi.register(data);
            toast.success('Account created! Please sign in.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="First Name" name="firstName" placeholder="John" required />
                            <Input label="Last Name" name="lastName" placeholder="Doe" required />
                        </div>
                        <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
                        <Input label="Password" name="password" type="password" placeholder="••••••••" required />
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-light">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
