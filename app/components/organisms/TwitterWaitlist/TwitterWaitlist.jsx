import React, { useState, useEffect } from 'react';
import styles from './TwitterWaitlist.module.css';

const TwitterWaitlist = () => {
    const [twitterHandle, setTwitterHandle] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [position, setPosition] = useState(null);
    const [waitlistCount, setWaitlistCount] = useState(0);

    // Fetch the current waitlist count when component mounts
    useEffect(() => {
        const fetchWaitlistCount = async () => {
            try {
                const response = await fetch('/api/waitlist');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setWaitlistCount(data.count);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch waitlist count:', err);
            }
        };

        fetchWaitlistCount();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!twitterHandle) {
            setError('Please enter your X handle');
            return;
        }

        // Format Twitter handle (remove @ if present)
        let formattedHandle = twitterHandle.trim();
        if (formattedHandle.startsWith('@')) {
            formattedHandle = formattedHandle.substring(1);
        }

        try {
            setIsLoading(true);

            // Submit to our waitlist API
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    twitterHandle: formattedHandle,
                    email: email || null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to join waitlist');
            }

            // Update position and success state
            setPosition(data.position);
            setSubmitted(true);

        } catch (err) {
            setError(err.message || 'Failed to join waitlist. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.waitlistContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Join the waitlist</h2>
                <p className={styles.subtitle}>
                    {waitlistCount > 0
                        ? `Join ${waitlistCount} others excited for lunar.gallery`
                        : 'Be the first to explore lunar.gallery when it launches'}
                </p>
            </div>

            {!submitted ? (
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="twitter" className={styles.label}>
                                X Handle <span className={styles.required}>*</span>
                            </label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.twitterPrefix}>@</span>
                                <input
                                    id="twitter"
                                    type="text"
                                    value={twitterHandle}
                                    onChange={(e) => setTwitterHandle(e.target.value)}
                                    placeholder="username"
                                    className={`${styles.input} ${styles.twitterInput}`}
                                />
                            </div>
                        </div>
                        {error && <p className={styles.errorText}>{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        {isLoading ? 'Joining...' : 'Join Waitlist'}
                    </button>

                    <p className={styles.footnote}>
                        We'll reach out when lunar.gallery is ready!
                    </p>
                </form>
            ) : (
                <div className={styles.successContainer}>
                    <svg className={styles.checkmark} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <h3 className={styles.successTitle}>You're in!</h3>
                    <p className={styles.successText}>We'll reach out via X when lunar.gallery launches.</p>
                </div>
            )}
        </div>
    );
};

export default TwitterWaitlist;