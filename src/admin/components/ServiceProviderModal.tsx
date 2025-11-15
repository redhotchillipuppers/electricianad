import React, { useState, useEffect } from 'react';
import { User, Building, Phone, Mail, MapPin, Calendar, Save, X, AlertCircle, Briefcase, ListPlus } from 'lucide-react';
import Modal from './Modal';

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
    [key: string]: any;
}

interface ServiceProviderModalProps {
    isOpen: boolean;
    onClose: () => void;
    provider: ServiceProvider | null;
    onSave: (providerId: string, updatedData: Partial<ServiceProvider>) => Promise<void>;
    onViewAssignedJobs?: () => void;
    onViewEligibleJobs?: () => void;
}

const ServiceProviderModal: React.FC<ServiceProviderModalProps> = ({
    isOpen,
    onClose,
    provider,
    onSave,
    onViewAssignedJobs,
    onViewEligibleJobs
}) => {
    const [editedProvider, setEditedProvider] = useState<ServiceProvider | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Reset state when provider changes or modal opens/closes
    useEffect(() => {
        if (provider && isOpen) {
            setEditedProvider({ ...provider });
            setError(null);
            setHasChanges(false);
        }
    }, [provider, isOpen]);

    if (!provider || !editedProvider) return null;

    // Format the creation date
    const formatDate = (dateString: string) => {
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

    // Handle input changes
    const handleInputChange = (field: keyof ServiceProvider, value: string) => {
        setEditedProvider(prev => {
            if (!prev) return null;
            const updated = { ...prev, [field]: value };
            setHasChanges(JSON.stringify(updated) !== JSON.stringify(provider));
            return updated;
        });
        setError(null);
    };

    // Handle service areas changes
    const handleServiceAreasChange = (areas: string[]) => {
        setEditedProvider(prev => {
            if (!prev) return null;
            const updated = { ...prev, serviceAreas: areas };
            setHasChanges(JSON.stringify(updated) !== JSON.stringify(provider));
            return updated;
        });
        setError(null);
    };

    // Handle status change
    const handleStatusChange = (newStatus: ServiceProvider['status']) => {
        setEditedProvider(prev => {
            if (!prev) return null;
            const updated = { ...prev, status: newStatus };
            setHasChanges(JSON.stringify(updated) !== JSON.stringify(provider));
            return updated;
        });
        setError(null);
    };

    // Validate form
    const validateForm = () => {
        if (!editedProvider.firstName.trim()) return 'First name is required';
        if (!editedProvider.lastName.trim()) return 'Last name is required';
        if (!editedProvider.email.trim()) return 'Email is required';
        if (!editedProvider.primaryContactNumber.trim()) return 'Contact number is required';
        if (editedProvider.serviceAreas.length === 0) return 'At least one service area is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editedProvider.email)) return 'Invalid email format';

        return null;
    };

    // Handle save
    const handleSave = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await onSave(provider.id, editedProvider);
            setHasChanges(false);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    // Handle close with unsaved changes warning
    const handleClose = () => {
        if (hasChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', color: '#10B981' };
            case 'rejected': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: '#EF4444' };
            case 'inactive': return { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.3)', color: '#6B7280' };
            default: return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', color: '#F59E0B' };
        }
    };

    // Available service areas
    const availableServiceAreas = [
        'Grimsby', 'Cleethorpes', 'Lincoln', 'Scunthorpe', 'Louth',
        'Boston', 'Skegness', 'Spalding', 'Sleaford', 'Gainsborough',
        'Market Rasen', 'Horncastle', 'Other'
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Edit Provider - ${provider.firstName} ${provider.lastName}`}
            maxWidth="1000px"
            showCloseButton={false}
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <AlertCircle size={18} color="#EF4444" />
                        <span style={{ color: '#EF4444', fontSize: '0.9rem' }}>{error}</span>
                    </div>
                )}

                {/* Personal Information Section */}
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
                        <User size={18} />
                        Personal Information
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '0.5rem'
                            }}>
                                First Name *
                            </label>
                            <input
                                type="text"
                                value={editedProvider.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1E40AF'}
                                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '0.5rem'
                            }}>
                                Last Name *
                            </label>
                            <input
                                type="text"
                                value={editedProvider.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1E40AF'}
                                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>
                    </div>
                </div>

                {/* Company Information Section */}
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
                        <Building size={18} />
                        Company Information
                    </h3>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Company Name (Optional)
                        </label>
                        <input
                            type="text"
                            value={editedProvider.companyName || ''}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#10B981'}
                            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                    </div>
                </div>

                {/* Contact Information Section */}
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
                        <Phone size={18} />
                        Contact Information
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '0.5rem'
                            }}>
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={editedProvider.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '0.5rem'
                            }}>
                                Primary Contact Number *
                            </label>
                            <input
                                type="tel"
                                value={editedProvider.primaryContactNumber}
                                onChange={(e) => handleInputChange('primaryContactNumber', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>
                    </div>
                </div>

                {/* Service Areas Section */}
                <div style={{
                    background: 'rgba(245, 158, 11, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
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
                        <MapPin size={18} />
                        Service Areas *
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        {availableServiceAreas.map((area) => (
                            <label
                                key={area}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <input
                                    type="checkbox"
                                    checked={editedProvider.serviceAreas.includes(area)}
                                    onChange={(e) => {
                                        const newAreas = e.target.checked
                                            ? [...editedProvider.serviceAreas, area]
                                            : editedProvider.serviceAreas.filter(a => a !== area);
                                        handleServiceAreasChange(newAreas);
                                    }}
                                    style={{ margin: 0 }}
                                />
                                <span style={{ fontSize: '0.875rem', color: '#374151' }}>{area}</span>
                            </label>
                        ))}
                    </div>

                    {editedProvider.serviceAreas.length > 0 && (
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem' }}>Selected areas:</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                {editedProvider.serviceAreas.map((area) => (
                                    <span
                                        key={area}
                                        style={{
                                            fontSize: '0.75rem',
                                            backgroundColor: '#F59E0B',
                                            color: 'white',
                                            padding: '0.125rem 0.5rem',
                                            borderRadius: '9999px'
                                        }}
                                    >
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Status & Metadata Section */}
                <div style={{
                    background: 'rgba(107, 114, 128, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    border: '1px solid rgba(107, 114, 128, 0.1)'
                }}>
                    <h3 style={{
                        color: '#6B7280',
                        margin: '0 0 1rem 0',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Calendar size={18} />
                        Status & Information
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem',
                        alignItems: 'center'
                    }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '0.5rem'
                            }}>
                                Status
                            </label>
                            <select
                                value={editedProvider.status}
                                onChange={(e) => handleStatusChange(e.target.value as ServiceProvider['status'])}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'white',
                                    color: getStatusColor(editedProvider.status).color
                                }}
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '0.5rem'
                            }}>
                                Application Date
                            </label>
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#F9FAFB',
                                border: '2px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                color: '#6B7280'
                            }}>
                                {formatDate(provider.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                    {/* Left side - Job buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {onViewAssignedJobs && (
                            <button
                                onClick={onViewAssignedJobs}
                                disabled={saving}
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                    border: '2px solid rgba(139, 92, 246, 0.3)',
                                    borderRadius: '8px',
                                    color: '#8B5CF6',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    opacity: saving ? 0.6 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!saving) {
                                        e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!saving) {
                                        e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                                    }
                                }}
                            >
                                <Briefcase size={16} />
                                Assigned Jobs
                            </button>
                        )}

                        {onViewEligibleJobs && (
                            <button
                                onClick={onViewEligibleJobs}
                                disabled={saving}
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    border: '2px solid rgba(16, 185, 129, 0.3)',
                                    borderRadius: '8px',
                                    color: '#10B981',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    opacity: saving ? 0.6 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!saving) {
                                        e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!saving) {
                                        e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                                    }
                                }}
                            >
                                <ListPlus size={16} />
                                Eligible Jobs
                            </button>
                        )}
                    </div>

                    {/* Right side - Save/Cancel buttons */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleClose}
                        disabled={saving}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'white',
                            border: '2px solid #E5E7EB',
                            borderRadius: '8px',
                            color: '#374151',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.6 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!saving) {
                                e.currentTarget.style.backgroundColor = '#F9FAFB';
                                e.currentTarget.style.borderColor = '#D1D5DB';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!saving) {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#E5E7EB';
                            }
                        }}
                    >
                        <X size={16} />
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving || !hasChanges}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: hasChanges && !saving ? '#1E40AF' : '#E5E7EB',
                            border: '2px solid transparent',
                            borderRadius: '8px',
                            color: hasChanges && !saving ? 'white' : '#9CA3AF',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            cursor: (saving || !hasChanges) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (hasChanges && !saving) {
                                e.currentTarget.style.backgroundColor = '#1E3A8A';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (hasChanges && !saving) {
                                e.currentTarget.style.backgroundColor = '#1E40AF';
                            }
                        }}
                    >
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    </div>
                </div>

                {/* Mobile responsive styles */}
                <style>{`
          @media (max-width: 768px) {
            .provider-modal-content {
              padding: 1rem !important;
            }
            
            .provider-modal-content > div {
              padding: 1rem !important;
            }
            
            .provider-modal-content h3 {
              font-size: 1rem !important;
            }
            
            .provider-modal-content .grid {
              grid-template-columns: 1fr !important;
            }
            
            .provider-modal-content .action-buttons {
              flex-direction: column !important;
            }
            
            .provider-modal-content .action-buttons button {
              width: 100% !important;
            }
          }
        `}</style>
            </div>
        </Modal>
    );
};

export default ServiceProviderModal;