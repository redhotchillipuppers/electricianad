import React, { useState, useEffect, useMemo } from 'react';
import { User, MapPin, Briefcase, AlertCircle, CheckCircle, X, FileText } from 'lucide-react';
import Modal from './Modal';
import { getFirebase, collection, getDocs, doc, updateDoc, Timestamp } from '../../firebase/firebase';

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
    assignedProviderId?: string | null;
    assignedProviderName?: string | null;
    assignedBy?: string;
    assignedAt?: string;
    assignmentNotes?: string;
    assignmentStatus?: 'unassigned' | 'assigned' | 'completed';
    [key: string]: any;
}

interface ServiceProvider {
    id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    email: string;
    primaryContactNumber: string;
    serviceAreas: string[];
    status: 'pending' | 'approved' | 'rejected' | 'inactive';
    createdAt: string;
    activeQuoteCount?: number;
}

interface AssignQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    quote: QuoteRequest | null;
    currentUserEmail: string;
    onAssignmentComplete: () => void;
}

const AssignQuoteModal: React.FC<AssignQuoteModalProps> = ({
    isOpen,
    onClose,
    quote,
    currentUserEmail,
    onAssignmentComplete
}) => {
    const [providers, setProviders] = useState<ServiceProvider[]>([]);
    const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
    const [assignmentNotes, setAssignmentNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Load providers when modal opens
    useEffect(() => {
        if (isOpen && quote) {
            loadProviders();
            // Pre-fill notes if reassigning
            if (quote.assignmentNotes) {
                setAssignmentNotes(quote.assignmentNotes);
            }
            if (quote.assignedProviderId) {
                setSelectedProviderId(quote.assignedProviderId);
            }
        } else {
            // Reset state when modal closes
            setSelectedProviderId(null);
            setAssignmentNotes('');
            setError(null);
            setSuccess(false);
        }
    }, [isOpen, quote]);

    const loadProviders = async () => {
        setLoading(true);
        setError(null);
        try {
            const { db } = getFirebase();

            // Load all approved providers
            const providersSnapshot = await getDocs(collection(db, 'serviceProviders'));
            const providersData = providersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ServiceProvider[];

            // Load all quotes to count active assignments per provider
            const quotesSnapshot = await getDocs(collection(db, 'quotes'));
            const quotesData = quotesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as QuoteRequest[];

            // Count active quotes per provider
            const providerQuoteCounts: Record<string, number> = {};
            quotesData.forEach(q => {
                if (q.assignedProviderId && q.assignmentStatus === 'assigned') {
                    providerQuoteCounts[q.assignedProviderId] = (providerQuoteCounts[q.assignedProviderId] || 0) + 1;
                }
            });

            // Add quote counts to providers
            const providersWithCounts = providersData.map(p => ({
                ...p,
                activeQuoteCount: providerQuoteCounts[p.id] || 0
            }));

            setProviders(providersWithCounts);
        } catch (err) {
            console.error('Error loading providers:', err);
            setError('Failed to load service providers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Extract postcode area from quote (e.g., "LN1 3AA" -> "LN")
    const getPostcodeArea = (postcode?: string): string | null => {
        if (!postcode) return null;
        const match = postcode.match(/^[A-Z]{1,2}/i);
        return match ? match[0].toUpperCase() : null;
    };

    // Map postcode areas to service area towns
    const postcodeToServiceArea: Record<string, string[]> = {
        'LN': ['Lincoln', 'Lincolnshire'],
        'DN': ['Grimsby', 'Cleethorpes', 'Scunthorpe', 'Gainsborough'],
        'PE': ['Boston', 'Skegness', 'Spalding', 'Sleaford'],
        'NG': ['Lincoln', 'Sleaford']
    };

    // Filter and sort providers
    const filteredAndSortedProviders = useMemo(() => {
        if (!quote) return [];

        const postcodeArea = getPostcodeArea(quote.postcode);

        // Filter: approved status and matching service area
        let filtered = providers.filter(p => {
            // Must be approved
            if (p.status !== 'approved') return false;

            // If no postcode, show all approved providers
            if (!postcodeArea) return true;

            // Check if provider's service areas match the postcode area
            const relevantAreas = postcodeToServiceArea[postcodeArea] || [];
            return p.serviceAreas.some(area =>
                relevantAreas.includes(area) || area === 'Other'
            );
        });

        // Sort by workload (least busy first)
        filtered.sort((a, b) => {
            const countA = a.activeQuoteCount || 0;
            const countB = b.activeQuoteCount || 0;
            return countA - countB;
        });

        return filtered;
    }, [providers, quote]);

    // Handle assignment submission
    const handleAssign = async () => {
        if (!selectedProviderId || !quote) return;

        const selectedProvider = providers.find(p => p.id === selectedProviderId);
        if (!selectedProvider) return;

        setSubmitting(true);
        setError(null);

        try {
            const { db } = getFirebase();

            // Update quote with assignment
            const quoteRef = doc(db, 'quotes', quote.id);
            await updateDoc(quoteRef, {
                assignedProviderId: selectedProviderId,
                assignedProviderName: `${selectedProvider.firstName} ${selectedProvider.lastName}`,
                assignedBy: currentUserEmail,
                assignedAt: new Date().toISOString(),
                assignmentNotes: assignmentNotes.trim() || '',
                assignmentStatus: 'assigned'
            });

            setSuccess(true);

            // Wait a moment to show success message
            setTimeout(() => {
                onAssignmentComplete();
                onClose();
            }, 1000);

        } catch (err) {
            console.error('Error assigning quote:', err);
            setError('Failed to assign quote. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle unassignment
    const handleUnassign = async () => {
        if (!quote || !quote.assignedProviderId) return;

        if (!window.confirm('Are you sure you want to unassign this quote?')) {
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const { db } = getFirebase();

            // Update quote to remove assignment
            const quoteRef = doc(db, 'quotes', quote.id);
            await updateDoc(quoteRef, {
                assignedProviderId: null,
                assignedProviderName: null,
                assignedBy: null,
                assignedAt: null,
                assignmentNotes: null,
                assignmentStatus: 'unassigned'
            });

            setSuccess(true);

            // Wait a moment to show success message
            setTimeout(() => {
                onAssignmentComplete();
                onClose();
            }, 1000);

        } catch (err) {
            console.error('Error unassigning quote:', err);
            setError('Failed to unassign quote. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!quote) return null;

    const isReassigning = !!quote.assignedProviderId;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isReassigning ? `Reassign Quote - ${quote.name}` : `Assign Quote - ${quote.name}`}
            maxWidth="1100px"
        >
            <div style={{ padding: '2rem' }}>
                {/* Success Message */}
                {success && (
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <CheckCircle size={18} color="#10B981" />
                        <span style={{ color: '#10B981', fontSize: '0.9rem', fontWeight: '600' }}>
                            {isReassigning ? 'Quote reassigned successfully!' : 'Quote assigned successfully!'}
                        </span>
                    </div>
                )}

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

                {/* Quote Summary */}
                <div style={{
                    background: 'rgba(30, 64, 175, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(30, 64, 175, 0.1)'
                }}>
                    <h3 style={{
                        color: '#1E40AF',
                        margin: '0 0 1rem 0',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <FileText size={18} />
                        Quote Details
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0 0 0.25rem 0' }}>Customer</p>
                            <p style={{ fontSize: '0.95rem', color: '#374151', margin: 0, fontWeight: '600' }}>{quote.name}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0 0 0.25rem 0' }}>Location</p>
                            <p style={{ fontSize: '0.95rem', color: '#374151', margin: 0 }}>
                                {[quote.houseFlatNumber, quote.streetName, quote.postcode].filter(Boolean).join(', ') || 'Not provided'}
                            </p>
                        </div>
                        {quote.description && (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0 0 0.25rem 0' }}>Description</p>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: '#374151',
                                    margin: 0,
                                    maxHeight: '60px',
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

                    {/* Current Assignment Info */}
                    {isReassigning && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'rgba(245, 158, 11, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(245, 158, 11, 0.2)'
                        }}>
                            <p style={{ fontSize: '0.85rem', color: '#92400E', margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                                Currently assigned to: {quote.assignedProviderName}
                            </p>
                            {quote.assignmentNotes && (
                                <p style={{ fontSize: '0.8rem', color: '#78350F', margin: 0 }}>
                                    Notes: {quote.assignmentNotes}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Available Providers */}
                <div style={{
                    background: 'rgba(16, 185, 129, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.1)'
                }}>
                    <h3 style={{
                        color: '#10B981',
                        margin: '0 0 1rem 0',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <User size={18} />
                        Available Service Providers
                        {filteredAndSortedProviders.length > 0 && (
                            <span style={{
                                fontSize: '0.85rem',
                                color: '#6B7280',
                                fontWeight: '400',
                                marginLeft: '0.5rem'
                            }}>
                                ({filteredAndSortedProviders.length} matching providers)
                            </span>
                        )}
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                            Loading providers...
                        </div>
                    ) : filteredAndSortedProviders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                            No approved providers available for this area.
                        </div>
                    ) : (
                        <div style={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1rem'
                        }}>
                            {filteredAndSortedProviders.map((provider) => (
                                <div
                                    key={provider.id}
                                    onClick={() => !submitting && setSelectedProviderId(provider.id)}
                                    style={{
                                        padding: '1rem',
                                        border: selectedProviderId === provider.id
                                            ? '2px solid #10B981'
                                            : '2px solid rgba(0, 0, 0, 0.1)',
                                        borderRadius: '10px',
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        background: selectedProviderId === provider.id
                                            ? 'rgba(16, 185, 129, 0.05)'
                                            : 'white',
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        opacity: submitting ? 0.6 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!submitting && selectedProviderId !== provider.id) {
                                            e.currentTarget.style.borderColor = '#10B981';
                                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.02)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!submitting && selectedProviderId !== provider.id) {
                                            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                                            e.currentTarget.style.background = 'white';
                                        }
                                    }}
                                >
                                    {/* Selection Indicator */}
                                    {selectedProviderId === provider.id && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '0.5rem',
                                            right: '0.5rem',
                                            background: '#10B981',
                                            borderRadius: '50%',
                                            padding: '0.25rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <CheckCircle size={16} color="white" />
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <h4 style={{
                                            margin: '0 0 0.25rem 0',
                                            fontSize: '1rem',
                                            color: '#1F2937',
                                            fontWeight: '600'
                                        }}>
                                            {provider.firstName} {provider.lastName}
                                        </h4>
                                        {provider.companyName && (
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.85rem',
                                                color: '#6B7280',
                                                fontStyle: 'italic'
                                            }}>
                                                {provider.companyName}
                                            </p>
                                        )}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.85rem',
                                        color: '#6B7280'
                                    }}>
                                        <MapPin size={14} />
                                        <span>{provider.serviceAreas.join(', ')}</span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.85rem'
                                    }}>
                                        <Briefcase size={14} color="#6B7280" />
                                        <span style={{ color: '#374151', fontWeight: '500' }}>
                                            {provider.activeQuoteCount || 0} active {provider.activeQuoteCount === 1 ? 'quote' : 'quotes'}
                                        </span>
                                        {(provider.activeQuoteCount || 0) === 0 && (
                                            <span style={{
                                                fontSize: '0.7rem',
                                                background: '#10B981',
                                                color: 'white',
                                                padding: '0.125rem 0.5rem',
                                                borderRadius: '9999px',
                                                fontWeight: '600'
                                            }}>
                                                Available
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Assignment Notes */}
                <div style={{
                    background: 'rgba(139, 92, 246, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    border: '1px solid rgba(139, 92, 246, 0.1)'
                }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#8B5CF6',
                        marginBottom: '0.75rem'
                    }}>
                        Assignment Notes (Optional)
                    </label>
                    <textarea
                        value={assignmentNotes}
                        onChange={(e) => setAssignmentNotes(e.target.value)}
                        disabled={submitting}
                        placeholder="Add any notes about this assignment..."
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #E5E7EB',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            opacity: submitting ? 0.6 : 1
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                    />
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                    <div>
                        {isReassigning && (
                            <button
                                onClick={handleUnassign}
                                disabled={submitting}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    border: '2px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '8px',
                                    color: '#DC2626',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    opacity: submitting ? 0.6 : 1,
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!submitting) {
                                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!submitting) {
                                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                    }
                                }}
                            >
                                Unassign Quote
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={onClose}
                            disabled={submitting}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'white',
                                border: '2px solid #E5E7EB',
                                borderRadius: '8px',
                                color: '#374151',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.6 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (!submitting) {
                                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!submitting) {
                                    e.currentTarget.style.backgroundColor = 'white';
                                }
                            }}
                        >
                            <X size={16} />
                            Cancel
                        </button>

                        <button
                            onClick={handleAssign}
                            disabled={!selectedProviderId || submitting}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: selectedProviderId && !submitting ? '#10B981' : '#E5E7EB',
                                border: '2px solid transparent',
                                borderRadius: '8px',
                                color: selectedProviderId && !submitting ? 'white' : '#9CA3AF',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: (!selectedProviderId || submitting) ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedProviderId && !submitting) {
                                    e.currentTarget.style.backgroundColor = '#059669';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedProviderId && !submitting) {
                                    e.currentTarget.style.backgroundColor = '#10B981';
                                }
                            }}
                        >
                            <CheckCircle size={16} />
                            {submitting ? 'Assigning...' : isReassigning ? 'Reassign Quote' : 'Assign Quote'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AssignQuoteModal;
