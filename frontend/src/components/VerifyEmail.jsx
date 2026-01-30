import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../Axios/axios';

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await axios.get(`/user/verify-email/${token}`);
                setStatus('success');
                setMessage(res.data.message);
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed');
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="verify-email-container">
            <div className="verify-email-card">
                {status === 'verifying' && (
                    <>
                        <div className="spinner"></div>
                        <h2>Verifying your email...</h2>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div className="success-icon">✓</div>
                        <h2>Email Verified!</h2>
                        <p>{message}</p>
                        <p>Redirecting to login...</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="error-icon">✕</div>
                        <h2>Verification Failed</h2>
                        <p>{message}</p>
                        <button onClick={() => navigate('/login')}>Go to Login</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;