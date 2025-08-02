import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Calendar, FileText, Image as ImageIcon } from 'lucide-react';
import Modal from './Modal';

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
    [key: string]: any;
}

interface QuoteRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    quote: QuoteRequest | null;
}

const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({ isOpen, onClose, quote }) => {
    if (!quote) return null;

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

    // Check if file is an image
    const isImageFile = (url?: string) => {
        if (!url) return false;
        const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
        return imageExtensions.test(url) || url.includes('image');
    };

    // Get file name from URL
    const getFileName = (url?: string) => {
        if (!url) return 'Unknown file';
        try {
            const urlParts = url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            // Remove any URL parameters
            return fileName.split('?')[0] || 'Download file';
        } catch {
            return 'Download file';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Quote Request - ${quote.name}`}
            maxWidth="900px"
        >
            <div style={{ padding: '2rem' }}>
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
                            Attached File
                        </h3>

                        {isImageFile(quote.fileUrl) ? (
                            <div style={{ textAlign: 'center' }}>
                                <img
                                    src={quote.fileUrl}
                                    alt="Quote attachment"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '400px',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        objectFit: 'contain'
                                    }}
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                            parent.innerHTML = `
                        <div style="
                          padding: 2rem;
                          text-align: center;
                          color: #6B7280;
                          border: 2px dashed #D1D5DB;
                          border-radius: 8px;
                        ">
                          <p>Image could not be loaded</p>
                          <a href="${quote.fileUrl}" target="_blank" rel="noopener noreferrer" style="
                            color: #1E40AF;
                            text-decoration: underline;
                          ">
                            Download file instead
                          </a>
                        </div>
                      `;
                                        }
                                    }}
                                />
                                <p style={{
                                    marginTop: '0.5rem',
                                    fontSize: '0.875rem',
                                    color: '#6B7280'
                                }}>
                                    <a
                                        href={quote.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: '#1E40AF',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        View full size
                                    </a>
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                padding: '1.5rem',
                                textAlign: 'center',
                                border: '2px dashed #D1D5DB',
                                borderRadius: '8px',
                                background: 'rgba(249, 250, 251, 0.5)'
                            }}>
                                <FileText size={32} color="#6B7280" style={{ margin: '0 auto 0.5rem auto' }} />
                                <p style={{
                                    margin: '0 0 0.5rem 0',
                                    color: '#374151',
                                    fontSize: '0.9rem'
                                }}>
                                    {getFileName(quote.fileUrl)}
                                </p>
                                <a
                                    href={quote.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-block',
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#1E40AF',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#1E3A8A';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#1E40AF';
                                    }}
                                >
                                    Download File
                                </a>
                            </div>
                        )}
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