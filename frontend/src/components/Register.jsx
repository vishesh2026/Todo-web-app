import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from '../Axios/axios.js';
import TokenContext from '../context/TokenContext.js';
import { toast } from 'react-toastify';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await axios.post("/user/register", formData);
            tokenDispatch({ type: "SET_TOKEN", payload: result.data.token });
            userDispatch({ type: "SET_USER", payload: result.data.user });
            localStorage.setItem("authToken", JSON.stringify(result.data.token));
            toast.success(result.data.message);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (userToken) return <Navigate to="/" />;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p className="auth-subtitle">Start organizing your tasks today</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>
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
                        <small>Must include uppercase, lowercase, number, and special character</small>
                    </div>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                    <p className="auth-footer">
                        Already have an account? <Link to="/login" className="link-primary">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;