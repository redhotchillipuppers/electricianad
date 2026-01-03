import React, { useState, useEffect, useMemo } from 'react';
import {
  LogOut,
  User,
  Mail,
  Briefcase,
  MapPin,
  Phone,
  FileText,
  Clock,
  Calendar,
  Zap,
  CheckCircle,
  ChevronDown,
  Settings
} from 'lucide-react';
import { getCurrentProviderUser, signOutProvider, ProviderUser } from '../utils/providerAuth';
import { getFirebase, collection, getDocs, query, where, doc, updateDoc } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import RequestJobButton from '../components/RequestJobButton';
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
  serviceArea?: string;
  fileUrl?: string;
  createdAt?: string;
  assignedProviderId?: string;
  assignedProviderName?: string;
  assignedAt?: string;
  assignmentNotes?: string;
  completionStatus?: 'pending' | 'completed';
  completedAt?: string;
  completedBy?: string;
}

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<ProviderUser | null>(null);
  const [assignedQuotes, setAssignedQuotes] = useState<QuoteRequest[]>([]);
  const [eligibleJobs, setEligibleJobs] = useState<QuoteRequest[]>([]);
  const [requestedJobs, setRequestedJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [serviceAreasOpen, setServiceAreasOpen] = useState(false);
  const [selectedServiceAreas, setSelectedServiceAreas] = useState<string[]>([]);
  const [updatingAreas, setUpdatingAreas] = useState(false);

  // Service Areas - Based on coverage areas
  const availableServiceAreas = [
    "Grimsby",
    "Cleethorpes",
    "Lincoln",
    "Scunthorpe",
    "Louth",
    "Boston",
    "Skegness",
    "Spalding",
    "Sleaford",
    "Gainsborough",
    "Market Rasen",
    "Horncastle",
    "Other"
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current provider user
        const user = await getCurrentProviderUser();
        setCurrentUser(user);

        // Initialize selected service areas from user data
        if (user && user.serviceAreas && Array.isArray(user.serviceAreas)) {
          setSelectedServiceAreas(user.serviceAreas);
        }

        if (user && user.providerId) {
          const { db } = getFirebase();
          const quotesRef = collection(db, 'quotes');

          // Load assigned quotes
          const assignedQuery = query(quotesRef, where('assignedProviderId', '==', user.providerId));
          const assignedSnapshot = await getDocs(assignedQuery);

          const assignedData = assignedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as QuoteRequest[];

          setAssignedQuotes(assignedData);

          // Load eligible jobs (unassigned quotes only)
          // Query for quotes where assignedProviderId is null
          const unassignedQuery = query(quotesRef, where('assignedProviderId', '==', null));
          const unassignedSnapshot = await getDocs(unassignedQuery);

          const eligibleData = unassignedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as QuoteRequest[];

          setEligibleJobs(eligibleData);

          // Load requested jobs (provider's job requests)
          const requestsRef = collection(db, 'jobRequests');
          const requestsQuery = query(requestsRef, where('providerId', '==', user.providerId));
          const requestsSnapshot = await getDocs(requestsQuery);

          const requestsData = requestsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as JobRequest[];

          setRequestedJobs(requestsData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutProvider();
      navigate('/provider-login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleCompleteJob = async (quoteId: string) => {
    if (!currentUser || !currentUser.providerId) {
      alert('Unable to complete job: User information not available');
      return;
    }

    const confirmMessage = 'Are you sure you want to mark this job as completed?';
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const { db } = getFirebase();
      const quoteRef = doc(db, 'quotes', quoteId);

      await updateDoc(quoteRef, {
        completionStatus: 'completed',
        completedAt: new Date().toISOString(),
        completedBy: currentUser.providerId
      });

      // Update local state
      setAssignedQuotes(prev =>
        prev.map(quote =>
          quote.id === quoteId
            ? {
                ...quote,
                completionStatus: 'completed' as const,
                completedAt: new Date().toISOString(),
                completedBy: currentUser.providerId
              }
            : quote
        )
      );

      alert('Job marked as completed successfully!');
    } catch (error) {
      console.error('Error completing job:', error);
      alert('Failed to mark job as completed. Please try again.');
    }
  };

  const handleServiceAreaToggle = (area: string) => {
    setSelectedServiceAreas(prev => {
      if (prev.includes(area)) {
        return prev.filter(a => a !== area);
      } else {
        return [...prev, area];
      }
    });
  };

  const loadEligibleJobs = async (providerId: string) => {
    const { db } = getFirebase();
    const quotesRef = collection(db, 'quotes');

    // Load eligible jobs (unassigned quotes only)
    const unassignedQuery = query(quotesRef, where('assignedProviderId', '==', null));
    const unassignedSnapshot = await getDocs(unassignedQuery);

    const allUnassignedJobs = unassignedSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as QuoteRequest[];

    // Filter jobs based on provider's service areas
    // Only show jobs where the serviceArea matches one of the provider's selected areas
    const filteredJobs = allUnassignedJobs.filter(job => {
      if (!job.serviceArea) return false; // Skip jobs without service area
      return selectedServiceAreas.includes(job.serviceArea);
    });

    setEligibleJobs(filteredJobs);
  };

  const handleUpdateServiceAreas = async () => {
    if (!currentUser || !currentUser.providerId) {
      alert('Unable to update service areas: User information not available');
      return;
    }

    if (selectedServiceAreas.length === 0) {
      alert('Please select at least one service area');
      return;
    }

    setUpdatingAreas(true);
    try {
      const { db } = getFirebase();
      const providerRef = doc(db, 'serviceProviders', currentUser.providerId);

      await updateDoc(providerRef, {
        serviceAreas: selectedServiceAreas
      });

      // Update local user state
      setCurrentUser(prev => prev ? { ...prev, serviceAreas: selectedServiceAreas } : null);

      // Reload eligible jobs to reflect the updated service areas
      await loadEligibleJobs(currentUser.providerId);

      alert('Service areas updated successfully!');
      setServiceAreasOpen(false);
    } catch (error) {
      console.error('Error updating service areas:', error);
      alert('Failed to update service areas. Please try again.');
    } finally {
      setUpdatingAreas(false);
    }
  };

  // Filter quotes based on hideCompleted state
  const filteredQuotes = useMemo(() => {
    if (hideCompleted) {
      return assignedQuotes.filter(quote => quote.completionStatus !== 'completed');
    }
    return assignedQuotes;
  }, [assignedQuotes, hideCompleted]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
            Loading dashboard...
          </p>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '2rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Background Pattern */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={24} color="white" />
            </div>
            <div>
              <h1 style={{
                color: 'white',
                fontSize: '1.75rem',
                fontWeight: '700',
                margin: '0 0 0.25rem 0'
              }}>
                Welcome, {currentUser?.firstName}!
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.9rem',
                margin: 0
              }}>
                Provider Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              color: '#fca5a5',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* Provider Info Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '700',
            margin: '0 0 1.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <User size={20} />
            Your Information
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <User size={18} color="rgba(255, 255, 255, 0.5)" />
              <div>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}>
                  Full Name
                </p>
                <p style={{ color: 'white', fontSize: '0.95rem', margin: 0, fontWeight: '600' }}>
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Mail size={18} color="rgba(255, 255, 255, 0.5)" />
              <div>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}>
                  Email
                </p>
                <p style={{ color: 'white', fontSize: '0.95rem', margin: 0, fontWeight: '600' }}>
                  {currentUser?.email}
                </p>
              </div>
            </div>

            {currentUser?.companyName && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Briefcase size={18} color="rgba(255, 255, 255, 0.5)" />
                <div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}>
                    Company
                  </p>
                  <p style={{ color: 'white', fontSize: '0.95rem', margin: 0, fontWeight: '600' }}>
                    {currentUser.companyName}
                  </p>
                </div>
              </div>
            )}

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Clock size={18} color="rgba(255, 255, 255, 0.5)" />
              <div>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}>
                  Status
                </p>
                <p style={{ color: '#10b981', fontSize: '0.95rem', margin: 0, fontWeight: '600' }}>
                  {currentUser?.status === 'active' ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Areas Management Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          position: 'relative',
          zIndex: 20
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '700',
            margin: '0 0 1.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Settings size={20} />
            Manage Service Areas
          </h2>

          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            margin: '0 0 1rem 0'
          }}>
            Select the areas where you provide services to see relevant job opportunities
          </p>

          <div style={{ position: 'relative', zIndex: 25 }}>
            <button
              type="button"
              onClick={() => setServiceAreasOpen(!serviceAreasOpen)}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <span style={{ color: selectedServiceAreas.length > 0 ? '#fff' : 'rgba(255, 255, 255, 0.4)' }}>
                {selectedServiceAreas.length > 0
                  ? `${selectedServiceAreas.length} area${selectedServiceAreas.length > 1 ? 's' : ''} selected`
                  : 'Select service areas'
                }
              </span>
              <ChevronDown size={16} style={{
                transform: serviceAreasOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }} />
            </button>

            {serviceAreasOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                maxHeight: '250px',
                overflowY: 'auto',
                zIndex: 100,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
              }}>
                {availableServiceAreas.map((area) => (
                  <label
                    key={area}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#1a1a2e',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={selectedServiceAreas.includes(area)}
                      onChange={() => handleServiceAreaToggle(area)}
                      style={{
                        marginRight: '0.75rem',
                        accentColor: '#667eea',
                        transform: 'scale(1.1)'
                      }}
                    />
                    <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{area}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedServiceAreas.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                Selected areas:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {selectedServiceAreas.map((area) => (
                  <span
                    key={area}
                    style={{
                      fontSize: '0.875rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontWeight: '500'
                    }}
                  >
                    {area}
                  </span>
                ))}
              </div>

              <button
                onClick={handleUpdateServiceAreas}
                disabled={updatingAreas}
                style={{
                  background: updatingAreas
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: updatingAreas ? 'rgba(255, 255, 255, 0.5)' : '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: updatingAreas ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: updatingAreas ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!updatingAreas) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!updatingAreas) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                  }
                }}
              >
                {updatingAreas ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Settings size={16} />
                    Update Service Areas
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Eligible Jobs Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '700',
            margin: '0 0 1.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Briefcase size={20} />
            Eligible Jobs ({eligibleJobs.length})
          </h2>

          {eligibleJobs.length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center'
            }}>
              <Briefcase size={48} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
                No eligible jobs available
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem', margin: 0 }}>
                Check back later for new opportunities
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {eligibleJobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <h3 style={{
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        margin: '0 0 0.5rem 0'
                      }}>
                        Job Request
                      </h3>
                      {job.postcode && (
                        <p style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.85rem',
                          margin: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <MapPin size={14} />
                          General Area: {job.postcode.split(' ')[0] || job.postcode}
                        </p>
                      )}
                    </div>

                    {job.createdAt && (
                      <div style={{
                        background: 'rgba(255, 211, 0, 0.1)',
                        border: '1px solid rgba(255, 211, 0, 0.3)',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Calendar size={14} color="#FFD300" />
                        <span style={{ color: '#FFD300', fontSize: '0.8rem', fontWeight: '600' }}>
                          Posted {formatDate(job.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {job.description && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      padding: '1rem'
                    }}>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.75rem',
                        margin: '0 0 0.5rem 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: '600'
                      }}>
                        Job Description
                      </p>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {job.description}
                      </p>
                    </div>
                  )}

                  {/* Request Job Button */}
                  {currentUser && (
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <RequestJobButton
                        quoteId={job.id}
                        quoteName={job.name}
                        quotePostcode={job.postcode || ''}
                        quoteCreatedAt={job.createdAt || ''}
                        currentUser={currentUser}
                        onRequestCreated={handleJobRequestCreated}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Requested Jobs Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '700',
            margin: '0 0 1.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Send size={20} />
            My Job Requests ({requestedJobs.length})
          </h2>

          {requestedJobs.length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center'
            }}>
              <Send size={48} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
                No job requests yet
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem', margin: 0 }}>
                Request jobs from the "Eligible Jobs" section above
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {requestedJobs.map((request) => {
                const statusColors = {
                  pending: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24' },
                  approved: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#10b981' },
                  rejected: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171' },
                  'auto-approved': { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa' },
                  expired: { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.3)', text: '#9ca3af' }
                };
                const statusColor = statusColors[request.status] || statusColors.pending;

                return (
                  <div
                    key={request.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <div>
                        <h3 style={{
                          color: 'white',
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          margin: '0 0 0.5rem 0'
                        }}>
                          {request.quoteName}
                        </h3>
                        <p style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.85rem',
                          margin: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <MapPin size={14} />
                          {request.quotePostcode}
                        </p>
                      </div>

                      <div style={{
                        background: statusColor.bg,
                        border: `1px solid ${statusColor.border}`,
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem'
                      }}>
                        <span style={{ color: statusColor.text, fontSize: '0.8rem', fontWeight: '600', textTransform: 'capitalize' }}>
                          {request.status === 'auto-approved' ? 'Auto-Approved' : request.status}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Clock size={14} color="rgba(255, 255, 255, 0.5)" />
                        <div>
                          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem', margin: '0 0 0.25rem 0' }}>
                            Requested
                          </p>
                          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', margin: 0 }}>
                            {formatDate(request.requestedAt)}
                          </p>
                        </div>
                      </div>

                      {request.reviewedAt && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {request.status === 'approved' || request.status === 'auto-approved' ? (
                            <CheckCircle size={14} color="#10b981" />
                          ) : (
                            <XCircle size={14} color="#f87171" />
                          )}
                          <div>
                            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem', margin: '0 0 0.25rem 0' }}>
                              Reviewed
                            </p>
                            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', margin: 0 }}>
                              {formatDate(request.reviewedAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {request.rejectionReason && (
                      <div style={{
                        marginTop: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '0.75rem'
                      }}>
                        <p style={{ color: '#f87171', fontSize: '0.8rem', margin: 0 }}>
                          <strong>Rejection Reason:</strong> {request.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Assigned Work Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '700',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FileText size={20} />
              Assigned Work ({filteredQuotes.length})
            </h2>

            {/* Hide Completed Checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
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
                  accentColor: '#667eea'
                }}
              />
              <span style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Hide Completed
              </span>
            </label>
          </div>

          {filteredQuotes.length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center'
            }}>
              <FileText size={48} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
                {assignedQuotes.length === 0 ? 'No assigned work yet' : 'No jobs to display'}
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem', margin: 0 }}>
                {assignedQuotes.length === 0 ? 'Check back later for new assignments' : 'All jobs are completed'}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <h3 style={{
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        margin: '0 0 0.5rem 0'
                      }}>
                        {quote.name}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <p style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.85rem',
                          margin: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <Mail size={14} />
                          {quote.email}
                        </p>
                        {quote.phone && (
                          <p style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.85rem',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <Phone size={14} />
                            {quote.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {quote.assignedAt && (
                      <div style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Calendar size={14} color="#667eea" />
                        <span style={{ color: '#667eea', fontSize: '0.8rem', fontWeight: '600' }}>
                          Assigned {formatDate(quote.assignedAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {quote.description && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.75rem',
                        margin: '0 0 0.5rem 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: '600'
                      }}>
                        Description
                      </p>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {quote.description}
                      </p>
                    </div>
                  )}

                  {(quote.houseFlatNumber || quote.streetName || quote.postcode) && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.75rem',
                        margin: '0 0 0.5rem 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <MapPin size={14} />
                        Location
                      </p>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        margin: 0
                      }}>
                        {[quote.houseFlatNumber, quote.streetName, quote.postcode].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  )}

                  {quote.assignmentNotes && (
                    <div style={{
                      background: 'rgba(255, 211, 0, 0.05)',
                      border: '1px solid rgba(255, 211, 0, 0.2)',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <p style={{
                        color: 'rgba(255, 211, 0, 0.8)',
                        fontSize: '0.75rem',
                        margin: '0 0 0.5rem 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: '600'
                      }}>
                        Assignment Notes
                      </p>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {quote.assignmentNotes}
                      </p>
                    </div>
                  )}

                  {/* Completion Status and Button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    {quote.completionStatus === 'completed' ? (
                      <div style={{
                        flex: 1,
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <CheckCircle size={18} color="#10b981" />
                        <div>
                          <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '600' }}>
                            Completed
                          </span>
                          {quote.completedAt && (
                            <p style={{
                              color: 'rgba(16, 185, 129, 0.7)',
                              fontSize: '0.75rem',
                              margin: '0.25rem 0 0 0'
                            }}>
                              {formatDate(quote.completedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCompleteJob(quote.id)}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.75rem 1.5rem',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                        }}
                      >
                        <CheckCircle size={18} />
                        Mark as Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
