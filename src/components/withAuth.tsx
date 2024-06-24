import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const { user, isLoading } = useUser();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading && !user) {
                router.push('/api/auth/login');
            }
        }, [user, isLoading, router]);

        if (isLoading || !user) {
            return <div>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
