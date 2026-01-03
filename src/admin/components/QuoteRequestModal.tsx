import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Calendar, FileText, Image as ImageIcon, Trash2, CheckCircle, UserPlus, ExternalLink, Loader2, Send, ThumbsUp, ThumbsDown, Users, Briefcase, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { getFileType, getFileIcon, getFileTypeLabel, getFileName } from '../utils/fileHelpers';
import { getFirebase, collection, getDocs, query, where, doc, updateDoc, increment, getDoc } from '../../firebase/firebase';
import { JobRequest } from '../../types/jobRequests';

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
    assignedProviderName?: string;
    assignedAt?: string;
    assignmentNotes?: string;
    assignmentStatus?: 'unassigned' | 'assigned';
    completionStatus?: 'pending' | 'completed';
    completedAt?: string;
    completedBy?: string;
    [key: string]: any;
}

interface QuoteRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    quote: QuoteRequest | null;
    onDelete?: (quoteId: string) => Promise<void>;
}

const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({ isOpen, onClose, quote, onDelete }) => {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [jobRequests, setJobRequests] = useState<(JobRequest & { providerActiveJobs?: number; matchesServiceArea?: boolean })[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [approvingRequest, setApprovingRequest] = useState<string | null>(null);

    // Reset states when modal closes or quote changes
    useEffect(() => {
        if (!isOpen || !quote) {
            setDeleting(false);
            setError(null);
            setImageLoading(true);
            setImageError(false);
            setJobRequests([]);
        } else {
            // Reset image states when quote changes
            setImageLoading(true);
            setImageError(false);
        }
    }, [isOpen, quote?.id]);

    // Load job requests for this quote
    useEffect(() => {
        if (!isOpen || !quote) return;

        const loadJobRequests = async () => {
            try {
                setLoadingRequests(true);
                const { db } = getFirebase();

                // Get all job requests for this quote
                const requestsQuery = query(
                    collection(db, 'jobRequests'),
                    where('quoteId', '==', quote.id)
                );
                const requestsSnapshot = await getDocs(requestsQuery);

                // Get provider details and calculate metrics
                const requestsWithMetrics = await Promise.all(
                    requestsSnapshot.docs.map(async (requestDoc) => {
                        const requestData = { id: requestDoc.id, ...requestDoc.data() } as JobRequest;

                        // Get provider's active jobs count
                        const quotesQuery = query(
                            collection(db, 'quotes'),
                            where('assignedProviderId', '==', requestData.providerId),
                            where('completionStatus', '!=', 'completed')
                        );
                        const quotesSnapshot = await getDocs(quotesQuery);
                        const activeJobsCount = quotesSnapshot.size;

                        // Check service area match
                        const providerDoc = await getDoc(doc(db, 'serviceProviders', requestData.providerId));
                        const providerData = providerDoc.data();
                        const matchesServiceArea = checkServiceAreaMatch(quote.postcode, providerData?.serviceAreas || []);

                        return {
                            ...requestData,
                            providerActiveJobs: activeJobsCount,
                            matchesServiceArea
                        };
                    })
                );

                // Sort by status (pending first) then by request date
                requestsWithMetrics.sort((a, b) => {
                    if (a.status === 'pending' && b.status !== 'pending') return -1;
                    if (a.status !== 'pending' && b.status === 'pending') return 1;
                    return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
                });

                setJobRequests(requestsWithMetrics);
            } catch (error) {
                console.error('Error loading job requests:', error);
            } finally {
                setLoadingRequests(false);
            }
        };

        loadJobRequests();
    }, [isOpen, quote?.id]);

    if (!quote) return null;

    // Helper function to check service area match
    const checkServiceAreaMatch = (postcode?: string, serviceAreas?: string[]): boolean => {
        if (!postcode || !serviceAreas || serviceAreas.length === 0) return false;

        // Extract postcode area (e.g., "LN1 3AA" -> "LN")
        const postcodeArea = postcode.match(/^[A-Z]{1,2}/)?.[0] || '';

        // Postcode to service area mapping
        const postcodeToServiceArea: Record<string, string[]> = {
            'LN': ['Lincoln', 'Lincolnshire'],
            'DN': ['Grimsby', 'Cleethorpes', 'Scunthorpe', 'Gainsborough'],
            'PE': ['Boston', 'Skegness', 'Spalding', 'Sleaford'],
            'NG': ['Lincoln', 'Sleaford']
        };

        const relevantAreas = postcodeToServiceArea[postcodeArea] || [];

        // Check if provider's service areas overlap with relevant areas
        return serviceAreas.some(area =>
            relevantAreas.some(relevantArea =>
                area.toLowerCase().includes(relevantArea.toLowerCase()) ||
                relevantArea.toLowerCase().includes(area.toLowerCase())
            )
        ) || serviceAreas.includes('Other');
    };

    // Handle delete
    const handleDelete = async () => {
        if (!onDelete) return;

        const confirmMessage = `Are you sure you want to delete the quote request from ${quote.name}? This action cannot be undone.`;

        if (!window.confirm(confirmMessage)) {
            return;
        }

        setDeleting(true);
        setError(null);

        try {
            await onDelete(quote.id);
            // Modal will be closed by the parent component after successful deletion
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete quote request');
            setDeleting(false);
        }
    };

    // Handle approve job request
    const handleApproveRequest = async (requestId: string) => {
        if (!quote) return;

        const confirmMessage = 'Approve this job request? This will NOT automatically assign the job - you can still choose to assign it manually later.';

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            setApprovingRequest(requestId);
            const { db } = getFirebase();

            // Get current admin user email (you may need to get this from auth context)
            const currentAdminEmail = 'admin'; // TODO: Get from auth context

            // Update job request status
            await updateDoc(doc(db, 'jobRequests', requestId), {
                status: 'approved',
                reviewedBy: currentAdminEmail,
                reviewedAt: new Date().toISOString()
            });

            // Update local state
            setJobRequests(prev =>
                prev.map(req =>
                    req.id === requestId
                        ? { ...req, status: 'approved' as const, reviewedBy: currentAdminEmail, reviewedAt: new Date().toISOString() }
                        : req
                )
            );

            alert('Job request approved successfully!');
        } catch (error) {
            console.error('Error approving request:', error);
            setError('Failed to approve job request. Please try again.');
        } finally {
            setApprovingRequest(null);
        }
    };

    // Handle reject job request
    const handleRejectRequest = async (requestId: string) => {
        if (!quote) return;

        const reason = window.prompt('Enter rejection reason (optional):');

        // User clicked cancel
        if (reason === null) {
            return;
        }

        try {
            setApprovingRequest(requestId);
            const { db } = getFirebase();

            // Get current admin user email
            const currentAdminEmail = 'admin'; // TODO: Get from auth context

            // Update job request status
            const updateData: any = {
                status: 'rejected',
                reviewedBy: currentAdminEmail,
                reviewedAt: new Date().toISOString()
            };

            if (reason && reason.trim()) {
                updateData.rejectionReason = reason.trim();
            }

            await updateDoc(doc(db, 'jobRequests', requestId), updateData);

            // Decrement request count on quote
            await updateDoc(doc(db, 'quotes', quote.id), {
                requestCount: increment(-1)
            });

            // Update local state
            setJobRequests(prev =>
                prev.map(req =>
                    req.id === requestId
                        ? { ...req, status: 'rejected' as const, reviewedBy: currentAdminEmail, reviewedAt: new Date().toISOString(), rejectionReason: reason || undefined }
                        : req
                )
            );

            alert('Job request rejected.');
        } catch (error) {
            console.error('Error rejecting request:', error);
            setError('Failed to reject job request. Please try again.');
        } finally {
            setApprovingRequest(null);
        }
    };

    // Format the creation date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown';
        try {
            return new Date(dateString).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    // Format the full address
    const formatAddress = () => {
        const parts = [quote.houseFlatNumber, quote.streetName, quote.postcode].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'Address not provided';
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Quote Request - ${quote.name}`}
            maxWidth="900px"
        >
            <div style={{ padding: '2rem' }}>
                {/* Error Message */}
                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        color: '#EF4444',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                {/* Contact Information Section */}
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
                        <Phone size={18} />
                        Contact Information
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Mail size={16} color="#6B7280" />
                            <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                                <strong>Email:</strong> {quote.email}
                            </span>
                        </div>

                        {quote.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={16} color="#6B7280" />
                                <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                                    <strong>Phone:</strong> {quote.phone}
                                </span>
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={16} color="#6B7280" />
                            <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                                <strong>Preferred Contact:</strong> {quote.contactMethod}
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={16} color="#6B7280" />
                            <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                                <strong>Submitted:</strong> {formatDate(quote.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Address Section */}
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
                        <MapPin size={18} />
                        Service Address
                    </h3>
                    <p style={{
                        color: '#374151',
                        margin: 0,
                        fontSize: '0.95rem',
                        lineHeight: '1.5'
                    }}>
                        {formatAddress()}
                    </p>
                </div>

                {/* Job Requests Section */}
                {loadingRequests ? (
                    <div style={{
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '12px',
                        padding: '2rem',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        textAlign: 'center'
                    }}>
                        <Loader2 size={24} color="#667eea" style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                        <p style={{ color: '#667eea', marginTop: '0.5rem' }}>Loading job requests...</p>
                    </div>
                ) : jobRequests.length > 0 ? (
                    <div style={{
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(102, 126, 234, 0.1)'
                    }}>
                        <h3 style={{
                            color: '#667eea',
                            margin: '0 0 1rem 0',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Send size={18} />
                            Provider Job Requests ({jobRequests.length})
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {jobRequests.map((request) => {
                                const statusColors = {
                                    pending: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#f59e0b' },
                                    approved: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#10b981' },
                                    rejected: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
                                    'auto-approved': { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6' },
                                    expired: { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.3)', text: '#6b7280' }
                                };
                                const statusColor = statusColors[request.status] || statusColors.pending;

                                return (
                                    <div
                                        key={request.id}
                                        style={{
                                            background: 'white',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            borderRadius: '8px',
                                            padding: '1rem'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '0.75rem',
                                            flexWrap: 'wrap',
                                            gap: '0.75rem'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{
                                                    color: '#111827',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    margin: '0 0 0.25rem 0'
                                                }}>
                                                    {request.providerName}
                                                    {request.providerCompanyName && (
                                                        <span style={{ color: '#6b7280', fontWeight: 'normal', fontSize: '0.9rem' }}>
                                                            {' '}({request.providerCompanyName})
                                                        </span>
                                                    )}
                                                </h4>
                                                <p style={{
                                                    color: '#6b7280',
                                                    fontSize: '0.85rem',
                                                    margin: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}>
                                                    <Clock size={12} />
                                                    Requested {formatDate(request.requestedAt)}
                                                </p>
                                            </div>

                                            <div style={{
                                                background: statusColor.bg,
                                                border: `1px solid ${statusColor.border}`,
                                                borderRadius: '6px',
                                                padding: '0.375rem 0.75rem'
                                            }}>
                                                <span style={{
                                                    color: statusColor.text,
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {request.status === 'auto-approved' ? 'Auto-Approved' : request.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Provider Metrics */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                            gap: '0.5rem',
                                            marginBottom: '0.75rem'
                                        }}>
                                            <div style={{
                                                background: 'rgba(0, 0, 0, 0.03)',
                                                borderRadius: '6px',
                                                padding: '0.5rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.375rem'
                                            }}>
                                                <Briefcase size={14} color="#6b7280" />
                                                <span style={{ fontSize: '0.8rem', color: '#374151' }}>
                                                    <strong>{request.providerActiveJobs || 0}</strong> active jobs
                                                </span>
                                            </div>

                                            <div style={{
                                                background: request.matchesServiceArea ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                borderRadius: '6px',
                                                padding: '0.5rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.375rem'
                                            }}>
                                                {request.matchesServiceArea ? (
                                                    <>
                                                        <CheckCircle size={14} color="#10b981" />
                                                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>
                                                            Service area match
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle size={14} color="#ef4444" />
                                                        <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '600' }}>
                                                            No service area match
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {request.status === 'pending' && (
                                            <div style={{
                                                display: 'flex',
                                                gap: '0.5rem',
                                                marginTop: '0.75rem'
                                            }}>
                                                <button
                                                    onClick={() => handleApproveRequest(request.id!)}
                                                    disabled={approvingRequest === request.id}
                                                    style={{
                                                        flex: 1,
                                                        background: '#10b981',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        padding: '0.5rem 1rem',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600',
                                                        cursor: approvingRequest === request.id ? 'not-allowed' : 'pointer',
                                                        opacity: approvingRequest === request.id ? 0.6 : 1,
                                                        transition: 'all 0.2s ease',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.375rem'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (approvingRequest !== request.id) {
                                                            e.currentTarget.style.background = '#059669';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = '#10b981';
                                                    }}
                                                >
                                                    {approvingRequest === request.id ? (
                                                        <>
                                                            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                                            Approving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ThumbsUp size={14} />
                                                            Approve
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => handleRejectRequest(request.id!)}
                                                    disabled={approvingRequest === request.id}
                                                    style={{
                                                        flex: 1,
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        padding: '0.5rem 1rem',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600',
                                                        cursor: approvingRequest === request.id ? 'not-allowed' : 'pointer',
                                                        opacity: approvingRequest === request.id ? 0.6 : 1,
                                                        transition: 'all 0.2s ease',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.375rem'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (approvingRequest !== request.id) {
                                                            e.currentTarget.style.background = '#dc2626';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = '#ef4444';
                                                    }}
                                                >
                                                    <ThumbsDown size={14} />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : null}

                {/* Assignment & Completion Status Section */}
                {(quote.assignmentStatus === 'assigned' || quote.completionStatus === 'completed') && (
                    <div style={{
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(102, 126, 234, 0.1)'
                    }}>
                        <h3 style={{
                            color: '#667eea',
                            margin: '0 0 1rem 0',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <UserPlus size={18} />
                            Assignment & Status
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {/* Assignment Info */}
                            {quote.assignmentStatus === 'assigned' && quote.assignedProviderName && (
                                <div style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    borderRadius: '8px',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid rgba(16, 185, 129, 0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <UserPlus size={16} color="#10B981" />
                                        <span style={{ fontSize: '0.9rem', color: '#10B981', fontWeight: '600' }}>
                                            Assigned to: {quote.assignedProviderName}
                                        </span>
                                    </div>
                                    {quote.assignedAt && (
                                        <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 0 1.5rem' }}>
                                            {formatDate(quote.assignedAt)}
                                        </p>
                                    )}
                                    {quote.assignmentNotes && (
                                        <p style={{
                                            fontSize: '0.85rem',
                                            color: '#374151',
                                            margin: '0.5rem 0 0 1.5rem',
                                            fontStyle: 'italic'
                                        }}>
                                            "{quote.assignmentNotes}"
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Completion Info */}
                            {quote.completionStatus === 'completed' && (
                                <div style={{
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    borderRadius: '8px',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid rgba(102, 126, 234, 0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <CheckCircle size={16} color="#667eea" />
                                        <span style={{ fontSize: '0.9rem', color: '#667eea', fontWeight: '600' }}>
                                            Job Completed
                                        </span>
                                    </div>
                                    {quote.completedAt && (
                                        <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 0 1.5rem' }}>
                                            {formatDate(quote.completedAt)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Description Section */}
                {quote.description && (
                    <div style={{
                        background: 'rgba(139, 92, 246, 0.05)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(139, 92, 246, 0.1)'
                    }}>
                        <h3 style={{
                            color: '#8B5CF6',
                            margin: '0 0 1rem 0',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <FileText size={18} />
                            Work Description
                        </h3>
                        <div style={{
                            color: '#374151',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}>
                            {quote.description}
                        </div>
                    </div>
                )}

                {/* Attached File Section */}
                {quote.fileUrl && (
                    <div style={{
                        background: 'rgba(245, 158, 11, 0.05)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid rgba(245, 158, 11, 0.1)'
                    }}>
                        <h3 style={{
                            color: '#F59E0B',
                            margin: '0 0 1rem 0',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <ImageIcon size={18} />
                            Attached {getFileTypeLabel(quote.fileUrl)}
                        </h3>

                        {getFileType(quote.fileUrl) === 'image' ? (
                            <div style={{ textAlign: 'center', position: 'relative' }}>
                                {/* Loading Spinner */}
                                {imageLoading && !imageError && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 1
                                    }}>
                                        <Loader2
                                            size={40}
                                            color="#F59E0B"
                                            style={{
                                                animation: 'spin 1s linear infinite'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Image */}
                                {!imageError && (
                                    <img
                                        src={quote.fileUrl}
                                        alt="Quote attachment"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '500px',
                                            borderRadius: '12px',
                                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                                            objectFit: 'contain',
                                            opacity: imageLoading ? 0.3 : 1,
                                            transition: 'opacity 0.3s ease',
                                            border: '1px solid rgba(245, 158, 11, 0.2)'
                                        }}
                                        onLoad={() => setImageLoading(false)}
                                        onError={() => {
                                            setImageLoading(false);
                                            setImageError(true);
                                        }}
                                    />
                                )}

                                {/* Error Fallback */}
                                {imageError && (
                                    <div style={{
                                        padding: '3rem 2rem',
                                        textAlign: 'center',
                                        color: '#6B7280',
                                        border: '2px dashed rgba(245, 158, 11, 0.3)',
                                        borderRadius: '12px',
                                        background: 'rgba(245, 158, 11, 0.05)'
                                    }}>
                                        <ImageIcon size={48} color="#F59E0B" style={{ margin: '0 auto 1rem auto' }} />
                                        <p style={{ margin: '0 0 1rem 0', color: '#374151', fontWeight: '500' }}>
                                            Image could not be loaded
                                        </p>
                                        <a
                                            href={quote.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.75rem 1.5rem',
                                                backgroundColor: '#F59E0B',
                                                color: 'white',
                                                textDecoration: 'none',
                                                borderRadius: '8px',
                                                fontSize: '0.9rem',
                                                fontWeight: '500',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#D97706';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#F59E0B';
                                            }}
                                        >
                                            <ExternalLink size={16} />
                                            Open File in New Tab
                                        </a>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {!imageLoading && !imageError && (
                                    <div style={{
                                        marginTop: '1rem',
                                        display: 'flex',
                                        gap: '0.75rem',
                                        justifyContent: 'center',
                                        flexWrap: 'wrap'
                                    }}>
                                        <a
                                            href={quote.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.75rem 1.25rem',
                                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                                borderRadius: '8px',
                                                color: '#667eea',
                                                textDecoration: 'none',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <ExternalLink size={16} />
                                            View Full Size
                                        </a>
                                        <a
                                            href={quote.fileUrl}
                                            download
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.75rem 1.25rem',
                                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                                borderRadius: '8px',
                                                color: '#10B981',
                                                textDecoration: 'none',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <FileText size={16} />
                                            Download
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{
                                padding: '2rem',
                                textAlign: 'center',
                                border: '2px dashed rgba(245, 158, 11, 0.3)',
                                borderRadius: '12px',
                                background: 'rgba(245, 158, 11, 0.05)'
                            }}>
                                <div style={{
                                    fontSize: '3rem',
                                    marginBottom: '1rem'
                                }}>
                                    {getFileIcon(quote.fileUrl)}
                                </div>
                                <p style={{
                                    margin: '0 0 0.25rem 0',
                                    color: '#F59E0B',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {getFileTypeLabel(quote.fileUrl)}
                                </p>
                                <p style={{
                                    margin: '0 0 1.5rem 0',
                                    color: '#6B7280',
                                    fontSize: '0.9rem',
                                    wordBreak: 'break-word'
                                }}>
                                    {getFileName(quote.fileUrl)}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap'
                                }}>
                                    <a
                                        href={quote.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: '#F59E0B',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#D97706';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#F59E0B';
                                        }}
                                    >
                                        <ExternalLink size={16} />
                                        Open File
                                    </a>
                                    <a
                                        href={quote.fileUrl}
                                        download
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                            border: '1px solid rgba(245, 158, 11, 0.3)',
                                            color: '#F59E0B',
                                            textDecoration: 'none',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                                        }}
                                    >
                                        <FileText size={16} />
                                        Download
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                {onDelete && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        paddingTop: '1.5rem',
                        marginTop: '1.5rem',
                        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                    }}>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '2px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: '#EF4444',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                cursor: deleting ? 'not-allowed' : 'pointer',
                                opacity: deleting ? 0.6 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (!deleting) {
                                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!deleting) {
                                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                }
                            }}
                        >
                            <Trash2 size={16} />
                            {deleting ? 'Deleting...' : 'Delete Quote Request'}
                        </button>
                    </div>
                )}

                {/* Mobile responsive styles */}
                <style>{`
          @media (max-width: 768px) {
            .quote-modal-content {
              padding: 1rem !important;
            }
            
            .quote-modal-content > div {
              padding: 1rem !important;
            }
            
            .quote-modal-content h3 {
              font-size: 1rem !important;
            }
          }
        `}</style>
            </div>
        </Modal>
    );
};

export default QuoteRequestModal;