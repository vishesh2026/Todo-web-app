import jwt from 'jsonwebtoken';

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization) {
        return res.status(401).json({ message: 'Authorization header required' });
    }
    
    const token = authorization.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export default requireAuth;