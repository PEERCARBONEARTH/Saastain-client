import AuthLayout from '@/layouts/AuthLayout'
import { NextPageWithLayout } from '@/types/Layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useAuthUtils from '@/hooks/useAuthUtils'



const VerifyEmail: NextPageWithLayout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { token, id } = router.query;
    const { verifyEmail } = useAuthUtils();

    useEffect(() => {
        const VerifyEmail = async () => {
            setLoading(true);
            try {
                console.log(id, "id", token, "token")
                const response = await verifyEmail(token as string, id as string);
                if (response.status === 'success') {
                    router.push('/auth/login');
                } else {
                    console.log(response.msg);
                    setError(response.msg);
                }
                setLoading(false);
            } catch (error) {
                setError(error?.response?.data?.msg);
            } finally {
                setLoading(false);
            }
        }
        const timer = setTimeout(() => {
            VerifyEmail();
        }, 500);
        return () => clearTimeout(timer);
    }, [token, id])


    return (

        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                {!error && (
                    <div>
                        <h1 className="text-3xl font-bold mb-4">Verifying Email...</h1>
                        <p>Please wait while we verify your email</p>
                    </div>

                )}
                { error && (
                    <div>
                <h1 className="text-3xl font-bold mb-4">Error</h1>
                <p>{error}</p>
                </div>
                )}
            </div>
        </div>

    )
}

VerifyEmail.getLayout = (c) => <AuthLayout>{c}</AuthLayout>

export default VerifyEmail