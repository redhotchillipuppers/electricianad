import React, { useState, useEffect, useMemo } from 'react';
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
  Eye,
  ArrowUpDown,
  Filter,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { signOutAdmin, getCurrentAdminUser, AdminUser } from '../utils/adminAuth';
import { getFirebase, collection, getDocs, doc, updateDoc, deleteDoc } from '../../firebase/firebase';
import QuoteRequestModal from './QuoteRequestModal';
import ServiceProviderModal from './ServiceProviderModal';
import AssignQuoteModal from './AssignQuoteModal';
import EligibleJobsModal from './EligibleJobsModal';
import AssignedWorkModal from './AssignedWorkModal';

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
  assignedProviderId?: string | null;
  assignedProviderName?: string | null;
  assignedBy?: string;
  assignedAt?: string;
  assignmentNotes?: string;
  assignmentStatus?: 'unassigned' | 'assigned' | 'completed';
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
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEligibleJobsModal, setShowEligibleJobsModal] = useState(false);
  const [showAssignedWorkModal, setShowAssignedWorkModal] = useState(false);
  const [selectedQuoteRequest, setSelectedQuoteRequest] = useState<QuoteRequest | null>(null);

  // Sorting states
  const [providerSortBy, setProviderSortBy] = useState<'date-new' | 'date-old' | 'alphabetical'>('date-new');
  const [quoteSortBy, setQuoteSortBy] = useState<'date-new' | 'date-old' | 'alphabetical'>('date-new');

  // Filter states
  const [providerFilterBy, setProviderFilterBy] = useState<Array<'pending' | 'approved' | 'rejected' | 'inactive'>>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [quoteFilterBy, setQuoteFilterBy] = useState<Array<'assigned' | 'unassigned' | 'completed'>>([]);
  const [showQuoteFilterDropdown, setShowQuoteFilterDropdown] = useState(false);

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

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showFilterDropdown && !target.closest('[data-filter-dropdown]')) {
        setShowFilterDropdown(false);
      }
      if (showQuoteFilterDropdown && !target.closest('[data-quote-filter-dropdown]')) {
        setShowQuoteFilterDropdown(false);
      }
    };

    if (showFilterDropdown || showQuoteFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilterDropdown, showQuoteFilterDropdown]);

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

  // Handle service provider deletion
  const deleteServiceProvider = async (providerId: string) => {
    try {
      const { db } = getFirebase();
      await deleteDoc(doc(db, 'serviceProviders', providerId));

      // Update local state
      setServiceProviders(prev => prev.filter(provider => provider.id !== providerId));

      // Close the modal
      setShowProviderModal(false);
      setSelectedProvider(null);
    } catch (error) {
      console.error('Error deleting service provider:', error);
      throw new Error('Failed to delete service provider');
    }
  };

  // Handle quote request deletion
  const deleteQuoteRequest = async (quoteId: string) => {
    try {
      const { db } = getFirebase();
      await deleteDoc(doc(db, 'quotes', quoteId));

      // Update local state
      setQuoteRequests(prev => prev.filter(quote => quote.id !== quoteId));

      // Close the modal
      setShowQuoteModal(false);
      setSelectedQuoteRequest(null);
    } catch (error) {
      console.error('Error deleting quote request:', error);
      throw new Error('Failed to delete quote request');
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

  const handleAssignClick = (quote: QuoteRequest) => {
    setSelectedQuoteRequest(quote);
    setShowAssignModal(true);
  };

  const handleAssignmentComplete = async () => {
    // Reload quotes to reflect the assignment
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

  const handleViewAssignedJobs = () => {
    setShowAssignedWorkModal(true);
  };

  const handleViewEligibleJobs = () => {
    setShowEligibleJobsModal(true);
  };

  const handleJobAssigned = async () => {
    // Reload quotes after a job is assigned
    await handleAssignmentComplete();
  };

  // Toggle filter selection
  const toggleFilterStatus = (status: 'pending' | 'approved' | 'rejected' | 'inactive') => {
    setProviderFilterBy(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Toggle quote filter selection
  const toggleQuoteFilterStatus = (status: 'assigned' | 'unassigned' | 'completed') => {
    setQuoteFilterBy(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Sorted and filtered service providers
  const sortedProviders = useMemo(() => {
    // First apply filter
    let providers = [...serviceProviders];

    // If filter array has selections, filter to only those statuses
    if (providerFilterBy.length > 0) {
      providers = providers.filter(p => providerFilterBy.includes(p.status));
    }

    // Then apply sort
    switch (providerSortBy) {
      case 'date-new':
        return providers.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // newest first
        });
      case 'date-old':
        return providers.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateA - dateB; // oldest first
        });
      case 'alphabetical':
        return providers.sort((a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
      default:
        return providers;
    }
  }, [serviceProviders, providerSortBy, providerFilterBy]);

  // Sorted and filtered quote requests
  const sortedQuotes = useMemo(() => {
    // First apply filter
    let quotes = [...quoteRequests];

    // If filter array has selections, filter to only those statuses
    if (quoteFilterBy.length > 0) {
      quotes = quotes.filter(q => {
        // Determine the current status of the quote
        let status: 'assigned' | 'unassigned' | 'completed';

        if (q.assignmentStatus === 'completed') {
          status = 'completed';
        } else if (q.assignmentStatus === 'assigned' && q.assignedProviderId) {
          status = 'assigned';
        } else {
          status = 'unassigned';
        }

        return quoteFilterBy.includes(status);
      });
    }

    // Then apply sort
    switch (quoteSortBy) {
      case 'date-new':
        return quotes.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // newest first
        });
      case 'date-old':
        return quotes.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateA - dateB; // oldest first
        });
      case 'alphabetical':
        return quotes.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return nameA.localeCompare(nameB);
        });
      default:
        return quotes;
    }
  }, [quoteRequests, quoteSortBy, quoteFilterBy]);

  const stats = {
    totalProviders: serviceProviders.length,
    pendingProviders: serviceProviders.filter(p => p.status === 'pending').length,
    approvedProviders: serviceProviders.filter(p => p.status === 'approved').length,
    totalQuotes: quoteRequests.length,
    unassignedQuotes: quoteRequests.filter(q => !q.assignedProviderId || q.assignmentStatus !== 'assigned').length
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
                  { label: 'Total Providers', value: stats.totalProviders, icon: Users, color: '#667eea', targetTab: 'providers' as const },
                  { label: 'Pending Reviews', value: stats.pendingProviders, icon: Clock, color: '#f59e0b', targetTab: 'providers' as const, filterStatus: 'pending' as const },
                  { label: 'Approved Providers', value: stats.approvedProviders, icon: CheckCircle, color: '#10b981', targetTab: 'providers' as const, filterStatus: 'approved' as const },
                  { label: 'Quote Requests', value: stats.totalQuotes, icon: FileText, color: '#8b5cf6', targetTab: 'quotes' as const },
                  { label: 'Unassigned Quotes', value: stats.unassignedQuotes, icon: AlertCircle, color: '#ef4444', targetTab: 'quotes' as const, quoteFilterStatus: 'unassigned' as const }
                ].map((stat, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setActiveTab(stat.targetTab);
                      // Handle provider filters
                      if (stat.filterStatus) {
                        setProviderFilterBy([stat.filterStatus]);
                      } else if (stat.targetTab === 'providers') {
                        setProviderFilterBy([]);
                      }
                      // Handle quote filters
                      if ((stat as any).quoteFilterStatus) {
                        setQuoteFilterBy([(stat as any).quoteFilterStatus]);
                      } else if (stat.targetTab === 'quotes') {
                        setQuoteFilterBy([]);
                      }
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
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
                          stat.color === '#10b981' ? '16, 185, 129' :
                            stat.color === '#ef4444' ? '239, 68, 68' : '139, 92, 246'}, 0.2)`,
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>Service Providers</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Filter Dropdown */}
                  <div style={{ position: 'relative' }} data-filter-dropdown>
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: providerFilterBy.length > 0 ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: providerFilterBy.length > 0 ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <Filter size={16} color={providerFilterBy.length > 0 ? '#8b9aef' : 'rgba(255, 255, 255, 0.6)'} />
                      <span>Filter {providerFilterBy.length > 0 && `(${providerFilterBy.length})`}</span>
                    </button>

                    {showFilterDropdown && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 0.5rem)',
                          right: 0,
                          background: 'rgba(26, 26, 46, 0.98)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '1rem',
                          zIndex: 1000,
                          minWidth: '200px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                        }}
                      >
                        <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', fontWeight: '600' }}>
                            Filter by Status
                          </span>
                          {providerFilterBy.length > 0 && (
                            <button
                              onClick={() => setProviderFilterBy([])}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#8b9aef',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                padding: '0.25rem 0.5rem'
                              }}
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {[
                          { value: 'pending' as const, label: 'Pending', color: '#fbbf24' },
                          { value: 'approved' as const, label: 'Approved', color: '#34d399' },
                          { value: 'rejected' as const, label: 'Rejected', color: '#f87171' },
                          { value: 'inactive' as const, label: 'Inactive', color: '#9CA3AF' }
                        ].map((option) => (
                          <label
                            key={option.value}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.5rem',
                              cursor: 'pointer',
                              borderRadius: '6px',
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={providerFilterBy.includes(option.value)}
                              onChange={() => toggleFilterStatus(option.value)}
                              style={{
                                width: '16px',
                                height: '16px',
                                cursor: 'pointer',
                                accentColor: option.color
                              }}
                            />
                            <span style={{ color: 'white', fontSize: '0.9rem' }}>
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowUpDown size={16} color="rgba(255, 255, 255, 0.6)" />
                    <select
                      value={providerSortBy}
                      onChange={(e) => setProviderSortBy(e.target.value as any)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="date-new" style={{ background: '#1a1a2e', color: 'white' }}>Newest First</option>
                      <option value="date-old" style={{ background: '#1a1a2e', color: 'white' }}>Oldest First</option>
                      <option value="alphabetical" style={{ background: '#1a1a2e', color: 'white' }}>Alphabetical (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {sortedProviders.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                    No service providers yet
                  </div>
                ) : (
                  sortedProviders.map((provider, index) => (
                    <div
                      key={provider.id}
                      style={{
                        padding: '1.5rem',
                        borderBottom: index < sortedProviders.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>Quote Requests</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Filter Dropdown */}
                  <div style={{ position: 'relative' }} data-quote-filter-dropdown>
                    <button
                      onClick={() => setShowQuoteFilterDropdown(!showQuoteFilterDropdown)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: quoteFilterBy.length > 0 ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: quoteFilterBy.length > 0 ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <Filter size={16} color={quoteFilterBy.length > 0 ? '#8b9aef' : 'rgba(255, 255, 255, 0.6)'} />
                      <span>Filter {quoteFilterBy.length > 0 && `(${quoteFilterBy.length})`}</span>
                    </button>

                    {showQuoteFilterDropdown && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 0.5rem)',
                          right: 0,
                          background: 'rgba(26, 26, 46, 0.98)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '1rem',
                          zIndex: 1000,
                          minWidth: '200px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                        }}
                      >
                        <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', fontWeight: '600' }}>
                            Filter by Status
                          </span>
                          {quoteFilterBy.length > 0 && (
                            <button
                              onClick={() => setQuoteFilterBy([])}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#8b9aef',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                padding: '0.25rem 0.5rem'
                              }}
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {[
                          { value: 'assigned' as const, label: 'Assigned', color: '#34d399' },
                          { value: 'unassigned' as const, label: 'Unassigned', color: '#f87171' },
                          { value: 'completed' as const, label: 'Completed', color: '#8b5cf6' }
                        ].map((option) => (
                          <label
                            key={option.value}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.5rem',
                              cursor: 'pointer',
                              borderRadius: '6px',
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={quoteFilterBy.includes(option.value)}
                              onChange={() => toggleQuoteFilterStatus(option.value)}
                              style={{
                                width: '16px',
                                height: '16px',
                                cursor: 'pointer',
                                accentColor: option.color
                              }}
                            />
                            <span style={{ color: 'white', fontSize: '0.9rem' }}>
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowUpDown size={16} color="rgba(255, 255, 255, 0.6)" />
                    <select
                      value={quoteSortBy}
                      onChange={(e) => setQuoteSortBy(e.target.value as any)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="date-new" style={{ background: '#1a1a2e', color: 'white' }}>Newest First</option>
                      <option value="date-old" style={{ background: '#1a1a2e', color: 'white' }}>Oldest First</option>
                      <option value="alphabetical" style={{ background: '#1a1a2e', color: 'white' }}>Alphabetical (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {sortedQuotes.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                    No quote requests yet
                  </div>
                ) : (
                  sortedQuotes.map((quote, index) => (
                    <div
                      key={quote.id}
                      style={{
                        padding: '1.5rem',
                        borderBottom: index < sortedQuotes.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <div
                          style={{
                            flex: 1,
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            transition: 'background-color 0.2s ease'
                          }}
                          onClick={() => handleQuoteClick(quote)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <h3 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                            {quote.name}
                          </h3>
                          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
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

                          {/* Assignment Status */}
                          {quote.assignmentStatus === 'assigned' && quote.assignedProviderName && (
                            <div style={{
                              marginTop: '0.75rem',
                              padding: '0.5rem 0.75rem',
                              background: 'rgba(16, 185, 129, 0.1)',
                              borderRadius: '6px',
                              border: '1px solid rgba(16, 185, 129, 0.2)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <UserPlus size={14} color="#34d399" />
                                <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: '500' }}>
                                  Assigned to: {quote.assignedProviderName}
                                </span>
                              </div>
                              {quote.assignedAt && (
                                <span style={{ fontSize: '0.75rem', color: 'rgba(52, 211, 153, 0.7)', marginLeft: '1.25rem' }}>
                                  {new Date(quote.assignedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                          {/* File Indicator */}
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

                          {/* Assignment Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignClick(quote);
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              background: quote.assignmentStatus === 'assigned'
                                ? 'rgba(102, 126, 234, 0.1)'
                                : 'rgba(16, 185, 129, 0.1)',
                              border: quote.assignmentStatus === 'assigned'
                                ? '1px solid rgba(102, 126, 234, 0.3)'
                                : '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '8px',
                              color: quote.assignmentStatus === 'assigned' ? '#8b9aef' : '#34d399',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.2s ease',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                              if (quote.assignmentStatus === 'assigned') {
                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                              } else {
                                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (quote.assignmentStatus === 'assigned') {
                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                              } else {
                                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                              }
                            }}
                          >
                            <UserPlus size={14} />
                            {quote.assignmentStatus === 'assigned' ? 'Reassign' : 'Assign'}
                          </button>

                          {/* View Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuoteClick(quote);
                            }}
                            style={{
                              padding: '0.5rem',
                              background: 'rgba(102, 126, 234, 0.1)',
                              border: '1px solid rgba(102, 126, 234, 0.3)',
                              borderRadius: '8px',
                              color: '#8b9aef',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.75rem'
                            }}
                          >
                            <Eye size={14} />
                          </button>
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
        onDelete={deleteQuoteRequest}
      />

      <ServiceProviderModal
        isOpen={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        provider={selectedProvider}
        onSave={updateServiceProvider}
        onDelete={deleteServiceProvider}
        onViewAssignedJobs={handleViewAssignedJobs}
        onViewEligibleJobs={handleViewEligibleJobs}
      />

      <EligibleJobsModal
        isOpen={showEligibleJobsModal}
        onClose={() => setShowEligibleJobsModal(false)}
        provider={selectedProvider}
        onJobAssigned={handleJobAssigned}
      />

      <AssignedWorkModal
        isOpen={showAssignedWorkModal}
        onClose={() => setShowAssignedWorkModal(false)}
        provider={selectedProvider}
      />

      <AssignQuoteModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        quote={selectedQuoteRequest}
        currentUserEmail={currentUser?.email || ''}
        onAssignmentComplete={handleAssignmentComplete}
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