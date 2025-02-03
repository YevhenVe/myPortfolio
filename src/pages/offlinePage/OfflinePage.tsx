// components/OfflinePage.tsx
import React from 'react';
import Button from '../../components/button/Button';

type Props = {
    onRetry: () => void;
}

const OfflinePage: React.FC<Props> = ({ onRetry }) => {
    return (
        <div style={styles.container}>
            <h1>📶 App is offline</h1>
            <p style={styles.p}>The application is temporarily unavailable. Check the Internet connection.</p>
            <Button
                label="Try again"
                onClick={onRetry}
                imageRight={''}
                imageLeft={undefined}
            />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center' as const,
        padding: '20px',
        backgroundColor: '#f8f9fa',
    },
    p: {
        marginBottom: '40px',
    },
};

export default OfflinePage;