import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { signOutAdmin, getCurrentAdminUser, AdminUser } from '../utils/adminAuth';
import { getFirebase, collection, getDocs, doc, updateDoc } from '../../firebase/firebase';
import QuoteRequestModal from './QuoteRequestModal';
import ServiceProviderModal from './ServiceProviderModal';
import EligibleJobsModal from './EligibleJobsModal';

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
  [key: string]: any; // For other quote fields
}

const AdminDashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'quotes'>('overview');
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  // Modal states
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showEligibleJobsModal, setShowEligibleJobsModal] = useState(false);
  const [selectedQuoteRequest, setSelectedQuoteRequest] = useState<QuoteRequest | null>(null);

  // Load current user and data
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getCurrentAdminUser();
        setCurrentUser(user);

        // Load service providers
        const { db } = getFirebase();
        const providersSnapshot = await getDocs(collection(db, 'serviceProviders'));
        const providersData = providersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ServiceProvider[];
        setServiceProviders(providersData);

        // Load quote requests
        const quotesSnapshot = await getDocs(collection(db, 'quotes'));
        const quotesData = quotesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as QuoteRequest[];
        setQuoteRequests(quotesData);

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProviderStatus = async (providerId: string, status: 'approved' | 'rejected') => {
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'serviceProviders', providerId), { status });

      // Update local state
      setServiceProviders(prev =>
        prev.map(provider =>
          provider.id === providerId ? { ...provider, status } : provider
        )
      );

      setSelectedProvider(null);
    } catch (error) {
      console.error('Error updating provider status:', error);
    }
  };

  // Handle service provider updates from modal
  const updateServiceProvider = async (providerId: string, updatedData: Partial<ServiceProvider>) => {
    try {
      const { db } = getFirebase();
      await updateDoc(doc(db, 'serviceProviders', providerId), updatedData);

      // Update local state
      setServiceProviders(prev =>
        prev.map(provider =>
          provider.id === providerId ? { ...provider, ...updatedData } : provider
        )
      );
    } catch (error) {
      console.error('Error updating service provider:', error);
      throw new Error('Failed to update service provider');
    }
  };

  // Modal click handlers
  const handleQuoteClick = (quote: QuoteRequest) => {
    setSelectedQuoteRequest(quote);
    setShowQuoteModal(true);
  };

  const handleProviderClick = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setShowProviderModal(true);
  };

  const handleViewAssignedJobs = () => {
    // For now, just show an alert - can implement AssignedJobsModal later
    alert('Assigned Jobs view - To be implemented');
  };

  const handleViewEligibleJobs = () => {
    setShowEligibleJobsModal(true);
  };

  const handleJobAssigned = async () => {
    // Reload quote requests after a job is assigned
    try {
      const { db } = getFirebase();
      const quotesSnapshot = await getDocs(collection(db, 'quotes'));
      const quotesData = quotesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QuoteRequest[];
      setQuoteRequests(quotesData);
    } catch (error) {
      console.error('Error reloading quotes:', error);
    }
  };

  const stats = {
    totalProviders: serviceProviders.length,
    pendingProviders: serviceProviders.filter(p => p.status === 'pending').length,
    approvedProviders: serviceProviders.filter(p => p.status === 'approved').length,
    totalQuotes: quoteRequests.length
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Welcome back, {currentUser?.email}
          </p>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#fca5a5',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <nav style={{
          width: '240px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem 0',
          minHeight: 'calc(100vh - 80px)'
        }}>
          {[
            { id: 'overview', icon: TrendingUp, label: 'Overview' },
            { id: 'providers', icon: Users, label: 'Service Providers' },
            { id: 'quotes', icon: FileText, label: 'Quote Requests' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                background: activeTab === item.id ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                border: 'none',
                borderRight: activeTab === item.id ? '3px solid #667eea' : '3px solid transparent',
                color: activeTab === item.id ? '#8b9aef' : 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: activeTab === item.id ? '600' : '400',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                }
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Overview</h2>

              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {[
                  { label: 'Total Providers', value: stats.totalProviders, icon: Users, color: '#667eea' },
                  { label: 'Pending Reviews', value: stats.pendingProviders, icon: Clock, color: '#f59e0b' },
                  { label: 'Approved Providers', value: stats.approvedProviders, icon: CheckCircle, color: '#10b981' },
                  { label: 'Quote Requests', value: stats.totalQuotes, icon: FileText, color: '#8b5cf6' }
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      width: '40px',
                      height: '40px',
                      background: `rgba(${stat.color === '#667eea' ? '102, 126, 234' :
                        stat.color === '#f59e0b' ? '245, 158, 11' :
                          stat.color === '#10b981' ? '16, 185, 129' : '139, 92, 246'}, 0.2)`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <stat.icon size={20} color={stat.color} />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', margin: 0 }}>
                        {stat.label}
                      </p>
                    </div>
                    <p style={{ color: 'white', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'providers' && (
            <div>
              <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Service Providers</h2>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {serviceProviders.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                    No service providers yet
                  </div>
                ) : (
                  serviceProviders.map((provider, index) => (
                    <div
                      key={provider.id}
                      style={{
                        padding: '1.5rem',
                        borderBottom: index < serviceProviders.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          transition: 'background-color 0.2s ease'
                        }}
                        onClick={() => handleProviderClick(provider)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <h3 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                          {provider.firstName} {provider.lastName}
                          {provider.companyName && <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: '400' }}> - {provider.companyName}</span>}
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Mail size={14} />
                            {provider.email}
                          </span>
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Phone size={14} />
                            {provider.primaryContactNumber}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={14} color="rgba(255, 255, 255, 0.6)" />
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                            {provider.serviceAreas.join(', ')}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: provider.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' :
                            provider.status === 'approved' ? 'rgba(16, 185, 129, 0.2)' :
                              provider.status === 'inactive' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: provider.status === 'pending' ? '#fbbf24' :
                            provider.status === 'approved' ? '#34d399' :
                              provider.status === 'inactive' ? '#9CA3AF' : '#f87171',
                          border: `1px solid ${provider.status === 'pending' ? 'rgba(245, 158, 11, 0.3)' :
                            provider.status === 'approved' ? 'rgba(16, 185, 129, 0.3)' :
                              provider.status === 'inactive' ? 'rgba(107, 114, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                        }}>
                          {provider.status.toUpperCase()}
                        </span>

                        {provider.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateProviderStatus(provider.id, 'approved');
                              }}
                              style={{
                                padding: '0.5rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '8px',
                                color: '#34d399',
                                cursor: 'pointer'
                              }}
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateProviderStatus(provider.id, 'rejected');
                              }}
                              style={{
                                padding: '0.5rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: '#f87171',
                                cursor: 'pointer'
                              }}
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProviderClick(provider);
                          }}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(102, 126, 234, 0.1)',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            borderRadius: '8px',
                            color: '#8b9aef',
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div>
              <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Quote Requests</h2>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {quoteRequests.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                    No quote requests yet
                  </div>
                ) : (
                  quoteRequests.map((quote, index) => (
                    <div
                      key={quote.id}
                      onClick={() => handleQuoteClick(quote)}
                      style={{
                        padding: '1.5rem',
                        borderBottom: index < quoteRequests.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                            {quote.name}
                          </h3>
                          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Mail size={14} />
                              {quote.email}
                            </span>
                            <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                              Contact: {quote.contactMethod}
                            </span>
                          </div>
                          {quote.description && (
                            <p style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.85rem',
                              margin: '0.5rem 0 0 0',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {quote.description}
                            </p>
                          )}
                        </div>
                        <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {quote.fileUrl && (
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: 'rgba(245, 158, 11, 0.2)',
                              color: '#fbbf24',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              📎 FILE
                            </span>
                          )}
                          <span style={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.75rem'
                          }}>
                            Click to view
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <QuoteRequestModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        quote={selectedQuoteRequest}
      />

      <ServiceProviderModal
        isOpen={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        provider={selectedProvider}
        onSave={updateServiceProvider}
        onViewAssignedJobs={handleViewAssignedJobs}
        onViewEligibleJobs={handleViewEligibleJobs}
      />

      <EligibleJobsModal
        isOpen={showEligibleJobsModal}
        onClose={() => setShowEligibleJobsModal(false)}
        provider={selectedProvider}
        onJobAssigned={handleJobAssigned}
      />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;