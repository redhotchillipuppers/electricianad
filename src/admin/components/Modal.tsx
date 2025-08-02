import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
    showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = '800px',
    showCloseButton = true
}) => {
    // Handle ESC key press
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
                animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => {
                // Close modal when clicking backdrop
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                    width: '100%',
                    maxWidth,
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideIn 0.3s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.5rem 2rem',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        background: 'linear-gradient(135deg, #1E40AF, #1E3A8A)',
                        color: 'white'
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            fontFamily: 'Electrolize, sans-serif'
                        }}
                    >
                        {title}
                    </h2>

                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Modal Content */}
                <div
                    style={{
                        flex: 1,
                        padding: '0',
                        overflowY: 'auto',
                        // Custom scrollbar styling
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(0, 0, 0, 0.3) transparent'
                    }}
                >
                    {children}
                </div>
            </div>

            {/* Animation keyframes */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        /* Custom scrollbar for webkit browsers */
        div::-webkit-scrollbar {
          width: 6px;
        }
        
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        
        div::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .modal-content {
            margin: 0.5rem;
            max-height: 95vh;
          }
        }
      `}</style>
        </div>
    );
};

export default Modal;