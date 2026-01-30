import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from '../Axios/axios.js';
import TokenContext from '../context/TokenContext.js';
import { toast } from 'react-toastify';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await axios.post("/user/login", formData);
            tokenDispatch({ type: "SET_TOKEN", payload: result.data.token });
            userDispatch({ type: "SET_USER", payload: result.data.user });
            localStorage.setItem("authToken", JSON.stringify(result.data.token));
            toast.success(result.data.message);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    if (userToken) return <Navigate to="/" />;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Welcome Back</h1>
                <p className="auth-subtitle">Login to manage your tasks</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="form-footer">
                        <Link to="/forgot-password" className="link">Forgot Password?</Link>
                    </div>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="auth-footer">
                        Don't have an account? <Link to="/register" className="link-primary">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;