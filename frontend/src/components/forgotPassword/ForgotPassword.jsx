import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../Axios/axios';
import { toast } from 'react-toastify';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/auth/forgot-password', { email });
            toast.success(res.data.message);
            setSent(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="success-icon">✓</div>
                    <h2>Check Your Email</h2>
                    <p>We've sent password reset instructions to {email}</p>
                    <Link to="/login" className="btn-submit" style={{ display: 'inline-block', textAlign: 'center', marginTop: '20px', textDecoration: 'none' }}>
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Forgot Password?</h1>
                <p className="auth-subtitle">Enter your email to reset your password</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <p className="auth-footer">
                        Remember your password? <Link to="/login" className="link-primary">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;