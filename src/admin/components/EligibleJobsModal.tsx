import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { getFirebase, collection, getDocs, doc, updateDoc } from '../../firebase/firebase';

interface ServiceProvider {
    id: string;
    firstName: string;
    lastName: string;
    serviceAreas: string[];
}

interface QuoteRequest {
    id: string;
    name: string;
    email: string;
    phone?: string;
    contactMethod: string;
    description?: string;
    houseFlatNumber?: string;
    streetName?: string;
    postcode?: string;
    fileUrl?: string;
    createdAt?: string;
    assignedProviderId?: string;
    serviceArea?: string;
    [key: string]: any;
}

interface EligibleJobsModalProps {
    isOpen: boolean;
    onClose: () => void;
    provider: ServiceProvider | null;
    onJobAssigned?: () => void;
}

const EligibleJobsModal: React.FC<EligibleJobsModalProps> = ({
    isOpen,
    onClose,
    provider,
    onJobAssigned
}) => {
    const [eligibleJobs, setEligibleJobs] = useState<QuoteRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load eligible jobs when modal opens
    useEffect(() => {
        if (isOpen && provider) {
            loadEligibleJobs();
        }
    }, [isOpen, provider]);

    const loadEligibleJobs = async () => {
        if (!provider) return;

        setLoading(true);
        setError(null);

        try {
            const { db } = getFirebase();
            const quotesSnapshot = await getDocs(collection(db, 'quotes'));
            const allJobs = quotesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as QuoteRequest[];

            // Filter for unassigned jobs in provider's service areas
            const eligible = allJobs.filter(job => {
                // Job must not be assigned
                if (job.assignedProviderId) return false;

                // If job has a service area, it must match provider's areas
                if (job.serviceArea) {
                    return provider.serviceAreas.includes(job.serviceArea);
                }

                // If job has postcode, try to match by area (simplified matching)
                // For now, we'll show all unassigned jobs
                return true;
            });

            setEligibleJobs(eligible);
        } catch (err) {
            console.error('Error loading eligible jobs:', err);
            setError('Failed to load eligible jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignJob = async (jobId: string) => {
        if (!provider) return;

        setAssigning(jobId);
        setError(null);

        try {
            const { db } = getFirebase();
            await updateDoc(doc(db, 'quotes', jobId), {
                assignedProviderId: provider.id,
                assignedAt: new Date().toISOString()
            });

            // Remove the job from the eligible list
            setEligibleJobs(prev => prev.filter(job => job.id !== jobId));

            // Notify parent component
            if (onJobAssigned) {
                onJobAssigned();
            }
        } catch (err) {
            console.error('Error assigning job:', err);
            setError('Failed to assign job');
        } finally {
            setAssigning(null);
        }
    };

    if (!provider) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Eligible Jobs for ${provider.firstName} ${provider.lastName}`}
            maxWidth="900px"
        >
            <div style={{ padding: '1.5rem' }}>
                {/* Provider Service Areas Info */}
                <div style={{
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#10B981',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>
                        <MapPin size={16} />
                        Service Areas: {provider.serviceAreas.join(', ')}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <AlertCircle size={18} color="#EF4444" />
                        <span style={{ color: '#EF4444', fontSize: '0.9rem' }}>{error}</span>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: '#6B7280'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid rgba(16, 185, 129, 0.3)',
                            borderTop: '3px solid #10B981',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1rem auto'
                        }} />
                        Loading eligible jobs...
                    </div>
                )}

                {/* Jobs List */}
                {!loading && (
                    <div>
                        {eligibleJobs.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                color: '#6B7280'
                            }}>
                                <FileText size={48} color="#D1D5DB" style={{ margin: '0 auto 1rem auto' }} />
                                <p style={{ margin: 0, fontSize: '1rem' }}>No eligible jobs available</p>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                                    All jobs in this area are either assigned or there are no unassigned jobs.
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gap: '1rem'
                            }}>
                                {eligibleJobs.map((job) => (
                                    <div
                                        key={job.id}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            borderRadius: '12px',
                                            padding: '1.25rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            gap: '1rem'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                {/* Customer Name */}
                                                <h4 style={{
                                                    margin: '0 0 0.75rem 0',
                                                    fontSize: '1.1rem',
                                                    fontWeight: '600',
                                                    color: '#1F2937'
                                                }}>
                                                    {job.name}
                                                </h4>

                                                {/* Contact Info */}
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                    gap: '0.5rem',
                                                    marginBottom: '0.75rem'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        color: '#6B7280',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        <Mail size={14} />
                                                        {job.email}
                                                    </div>
                                                    {job.phone && (
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            color: '#6B7280',
                                                            fontSize: '0.875rem'
                                                        }}>
                                                            <Phone size={14} />
                                                            {job.phone}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Address */}
                                                {(job.streetName || job.postcode) && (
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        color: '#6B7280',
                                                        fontSize: '0.875rem',
                                                        marginBottom: '0.75rem'
                                                    }}>
                                                        <MapPin size={14} />
                                                        {job.houseFlatNumber} {job.streetName}, {job.postcode}
                                                    </div>
                                                )}

                                                {/* Description */}
                                                {job.description && (
                                                    <p style={{
                                                        margin: '0.75rem 0 0 0',
                                                        color: '#374151',
                                                        fontSize: '0.875rem',
                                                        lineHeight: '1.5',
                                                        background: 'rgba(139, 92, 246, 0.05)',
                                                        padding: '0.75rem',
                                                        borderRadius: '8px',
                                                        borderLeft: '3px solid #8B5CF6'
                                                    }}>
                                                        {job.description}
                                                    </p>
                                                )}

                                                {/* Service Area Tag */}
                                                {job.serviceArea && (
                                                    <div style={{ marginTop: '0.75rem' }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '0.25rem 0.75rem',
                                                            background: 'rgba(245, 158, 11, 0.1)',
                                                            border: '1px solid rgba(245, 158, 11, 0.3)',
                                                            borderRadius: '12px',
                                                            color: '#F59E0B',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {job.serviceArea}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Assign Button */}
                                            <button
                                                onClick={() => handleAssignJob(job.id)}
                                                disabled={assigning === job.id}
                                                style={{
                                                    padding: '0.75rem 1.25rem',
                                                    background: assigning === job.id
                                                        ? 'rgba(16, 185, 129, 0.1)'
                                                        : 'rgba(16, 185, 129, 0.1)',
                                                    border: '2px solid rgba(16, 185, 129, 0.3)',
                                                    borderRadius: '8px',
                                                    color: '#10B981',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    cursor: assigning === job.id ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'all 0.2s',
                                                    whiteSpace: 'nowrap'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (assigning !== job.id) {
                                                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (assigning !== job.id) {
                                                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }
                                                }}
                                            >
                                                {assigning === job.id ? (
                                                    <>
                                                        <div style={{
                                                            width: '14px',
                                                            height: '14px',
                                                            border: '2px solid rgba(16, 185, 129, 0.3)',
                                                            borderTop: '2px solid #10B981',
                                                            borderRadius: '50%',
                                                            animation: 'spin 1s linear infinite'
                                                        }} />
                                                        Assigning...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={16} />
                                                        Assign Job
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Animation styles */}
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </Modal>
    );
};

export default EligibleJobsModal;
