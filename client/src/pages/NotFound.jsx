import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
    <div style={{ textAlign: 'center', marginTop: '10vh' }}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" style={{ color: '#1976d2', textDecoration: 'underline' }}>
            Go to Home
        </Link>
    </div>
);

export default NotFound;