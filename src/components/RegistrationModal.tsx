import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

type RegistrationModalProps = {
    eventName: string;
    onClose: () => void;
    onSuccess: () => void;
};

const RegistrationModal: React.FC<RegistrationModalProps> = ({ eventName, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        regNumber: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation: 11 digits
        const digitsOnly = formData.regNumber.replace(/\D/g, '');
        if (digitsOnly.length !== 11) {
            setError('Registration number must be exactly 11 digits (excluding AP prefix).');
            setLoading(false);
            return;
        }

        const fullRegNumber = `AP${digitsOnly}`;

        try {
            const { error: submitError } = await supabase
                .from('quick_registrations')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        registration_number: fullRegNumber,
                        event_name: eventName,
                    },
                ]);

            if (submitError) throw submitError;

            onSuccess();
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 11000,
            background: 'rgba(11,10,26,0.95)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)',
                padding: '32px', borderRadius: '16px', maxWidth: '480px', width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#eae8ff' }}>Register for {eventName}</h2>
                <p style={{ color: 'rgba(234, 232, 255, 0.7)', marginBottom: '24px' }}>Please provide your details to participate.</p>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)', color: '#f87171',
                        padding: '12px', borderRadius: '8px', marginBottom: '16px',
                        fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#38bdf8' }}>Full Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#38bdf8' }}>Email</label>
                            <input
                                required
                                type="email"
                                placeholder="email@srm.edu"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#38bdf8' }}>Phone</label>
                            <input
                                required
                                type="tel"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#38bdf8' }}>Registration Number (11 Digits)</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0 12px' }}>
                            <span style={{ fontWeight: '800', color: '#a855f7', opacity: 0.8 }}>AP</span>
                            <input
                                required
                                type="text"
                                maxLength={11}
                                placeholder="XXXXXXXXXXX"
                                value={formData.regNumber}
                                onChange={e => setFormData({ ...formData, regNumber: e.target.value.replace(/\D/g, '') })}
                                style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 2, padding: '12px',
                                background: 'linear-gradient(90deg, #38bdf8, #a855f7)',
                                border: 'none', color: '#fff', fontWeight: '800', borderRadius: '8px', cursor: 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationModal;
