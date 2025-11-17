import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Mail, Phone, FileText, Loader, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { getFirebase, collection, getDocs, query, where } from '../../firebase/firebase';

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
    assignedProviderId?: string | null;
    assignedProviderName?: string | null;
    assignedAt?: string;
    assignmentStatus?: 'unassigned' | 'assigned';
    completionStatus?: 'pending' | 'completed';
    completedAt?: string;
    createdAt?: string;
    [key: string]: any;
}

interface ServiceProvider {
    id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    email: string;
}

interface AssignedWorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    provider: ServiceProvider | null;
}

const AssignedWorkModal: React.FC<AssignedWorkModalProps> = ({ isOpen, onClose, provider }) => {
    const [assignedQuotes, setAssignedQuotes] = useState<QuoteRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hideCompleted, setHideCompleted] = useState(false);

    // Fetch assigned quotes when modal opens
    useEffect(() => {
        if (isOpen && provider) {
            fetchAssignedQuotes();
        }
    }, [isOpen, provider]);

    const fetchAssignedQuotes = async () => {
        if (!provider) return;

        setLoading(true);
        setError(null);

        try {
            const { db } = getFirebase();
            const quotesSnapshot = await getDocs(collection(db, 'quotes'));
            const quotesData = quotesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as QuoteRequest[];

            // Filter quotes assigned to this provider
            const filtered = quotesData.filter(
                q => q.assignedProviderId === provider.id && q.assignmentStatus === 'assigned'
            );

            // Sort by assignment date (most recent first)
            filtered.sort((a, b) => {
                const dateA = a.assignedAt ? new Date(a.assignedAt).getTime() : 0;
                const dateB = b.assignedAt ? new Date(b.assignedAt).getTime() : 0;
                return dateB - dateA;
            });

            setAssignedQuotes(filtered);
        } catch (err) {
            console.error('Error fetching assigned quotes:', err);
            setError('Failed to load assigned work. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!provider) return null;

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown';
        try {
            return new Date(dateString).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Format address
    const formatAddress = (quote: QuoteRequest) => {
        const parts = [quote.houseFlatNumber, quote.streetName, quote.postcode].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'Address not provided';
    };

    const providerName = provider.companyName || `${provider.firstName} ${provider.lastName}`;

    // Filter quotes based on hideCompleted checkbox
    const filteredQuotes = hideCompleted
        ? assignedQuotes.filter(q => q.completionStatus !== 'completed')
        : assignedQuotes;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Assigned Work - ${providerName}`}
            maxWidth="1000px"
        >
            <div style={{ padding: '2rem' }}>
                {/* Loading State */}
                {loading && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '3rem',
                        gap: '1rem'
                    }}>
                        <Loader size={32} color="#1E40AF" style={{ animation: 'spin 1s linear infinite' }} />
                        <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Loading assigned work...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
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

                {/* Empty State */}
                {!loading && !error && assignedQuotes.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: '#6B7280'
                    }}>
                        <Briefcase size={48} color="#D1D5DB" style={{ margin: '0 auto 1rem auto' }} />
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                            No Assigned Work
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                            This provider currently has no assigned quotes.
                        </p>
                    </div>
                )}

                {/* Quote List */}
                {!loading && !error && assignedQuotes.length > 0 && (
                    <>
                        {/* Hide Completed Checkbox */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    background: hideCompleted ? 'rgba(30, 64, 175, 0.1)' : '#F9FAFB',
                                    border: hideCompleted ? '1px solid rgba(30, 64, 175, 0.3)' : '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    color: '#374151',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!hideCompleted) {
                                        e.currentTarget.style.background = '#F3F4F6';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!hideCompleted) {
                                        e.currentTarget.style.background = '#F9FAFB';
                                    }
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={hideCompleted}
                                    onChange={(e) => setHideCompleted(e.target.checked)}
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        cursor: 'pointer',
                                        accentColor: '#1E40AF'
                                    }}
                                />
                                <span>Hide Completed</span>
                            </label>
                        </div>

                        {/* Summary Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            color: 'white'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '1rem'
                            }}>
                                <div>
                                    <h3 style={{
                                        margin: '0 0 0.25rem 0',
                                        fontSize: '1.5rem',
                                        fontWeight: '700'
                                    }}>
                                        {filteredQuotes.length} Active {filteredQuotes.length === 1 ? 'Quote' : 'Quotes'}
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                                        Currently assigned to {providerName}
                                        {hideCompleted && assignedQuotes.length > filteredQuotes.length && (
                                            <span style={{ marginLeft: '0.5rem', opacity: 0.8 }}>
                                                ({assignedQuotes.length - filteredQuotes.length} hidden)
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <Briefcase size={40} style={{ opacity: 0.8 }} />
                            </div>
                        </div>

                        {/* Quotes Grid */}
                        <div style={{
                            display: 'grid',
                            gap: '1rem',
                            maxHeight: '500px',
                            overflowY: 'auto',
                            paddingRight: '0.5rem'
                        }}>
                            {filteredQuotes.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem',
                                    color: '#6B7280',
                                    background: 'white',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '12px'
                                }}>
                                    <Briefcase size={48} color="#D1D5DB" style={{ margin: '0 auto 1rem auto' }} />
                                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                        All quotes are completed
                                    </p>
                                </div>
                            ) : (
                                filteredQuotes.map((quote) => (
                                <div
                                    key={quote.id}
                                    style={{
                                        background: 'white',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        transition: 'all 0.2s',
                                        cursor: 'default'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                        e.currentTarget.style.borderColor = '#1E40AF';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = '#E5E7EB';
                                    }}
                                >
                                    {/* Quote Header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '1rem',
                                        flexWrap: 'wrap',
                                        gap: '0.5rem'
                                    }}>
                                        <div>
                                            <h4 style={{
                                                margin: '0 0 0.25rem 0',
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                color: '#111827'
                                            }}>
                                                {quote.name}
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                {quote.assignedAt && (
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        color: '#6B7280',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        <Calendar size={12} />
                                                        Assigned {formatDate(quote.assignedAt)}
                                                    </div>
                                                )}
                                                {quote.completionStatus === 'completed' && quote.completedAt && (
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        color: '#8B5CF6',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        <Calendar size={12} />
                                                        Completed {formatDate(quote.completedAt)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span style={{
                                            background: quote.completionStatus === 'completed'
                                                ? 'rgba(139, 92, 246, 0.1)'
                                                : 'rgba(30, 64, 175, 0.1)',
                                            border: quote.completionStatus === 'completed'
                                                ? '1px solid rgba(139, 92, 246, 0.3)'
                                                : '1px solid rgba(30, 64, 175, 0.3)',
                                            color: quote.completionStatus === 'completed' ? '#8B5CF6' : '#1E40AF',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {quote.completionStatus === 'completed' ? 'COMPLETED' : 'ASSIGNED'}
                                        </span>
                                    </div>

                                    {/* Quote Details */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '0.75rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.875rem',
                                            color: '#374151'
                                        }}>
                                            <Mail size={14} color="#6B7280" />
                                            <span>{quote.email}</span>
                                        </div>

                                        {quote.phone && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.875rem',
                                                color: '#374151'
                                            }}>
                                                <Phone size={14} color="#6B7280" />
                                                <span>{quote.phone}</span>
                                            </div>
                                        )}

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.875rem',
                                            color: '#374151'
                                        }}>
                                            <MapPin size={14} color="#6B7280" />
                                            <span style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {formatAddress(quote)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {quote.description && (
                                        <div style={{
                                            background: '#F9FAFB',
                                            borderRadius: '8px',
                                            padding: '0.75rem',
                                            marginTop: '0.75rem'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <FileText size={14} color="#6B7280" />
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    color: '#6B7280',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    Description
                                                </span>
                                            </div>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.875rem',
                                                color: '#374151',
                                                lineHeight: '1.5',
                                                maxHeight: '3em',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                {quote.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                ))
                            )}
                        </div>
                    </>
                )}

                {/* Loading animation */}
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    /* Custom scrollbar */
                    div::-webkit-scrollbar {
                        width: 8px;
                    }

                    div::-webkit-scrollbar-track {
                        background: #F3F4F6;
                        border-radius: 4px;
                    }

                    div::-webkit-scrollbar-thumb {
                        background: #D1D5DB;
                        border-radius: 4px;
                    }

                    div::-webkit-scrollbar-thumb:hover {
                        background: #9CA3AF;
                    }

                    @media (max-width: 768px) {
                        .assigned-work-modal-content {
                            padding: 1rem !important;
                        }
                    }
                `}</style>
            </div>
        </Modal>
    );
};

export default AssignedWorkModal;
