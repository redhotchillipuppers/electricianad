import React, { useState, useEffect } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';
import { getFirebase, collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, increment } from '../../firebase/firebase';
import { ProviderUser } from '../utils/providerAuth';
import { JobRequest } from '../../types/jobRequests';

interface RequestJobButtonProps {
  quoteId: string;
  quoteName: string;
  quotePostcode: string;
  quoteCreatedAt: string;
  currentUser: ProviderUser;
  onRequestCreated?: () => void;
}

const RequestJobButton: React.FC<RequestJobButtonProps> = ({
  quoteId,
  quoteName,
  quotePostcode,
  quoteCreatedAt,
  currentUser,
  onRequestCreated
}) => {
  const [requesting, setRequesting] = useState(false);
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const MAX_PENDING_REQUESTS = 5;

  useEffect(() => {
    checkExistingRequest();
    loadPendingRequestsCount();
  }, [quoteId, currentUser.providerId]);

  // Check if provider already requested this job
  const checkExistingRequest = async () => {
    try {
      const { db } = getFirebase();
      const requestsRef = collection(db, 'jobRequests');
      const q = query(
        requestsRef,
        where('quoteId', '==', quoteId),
        where('providerId', '==', currentUser.providerId)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existingRequest = snapshot.docs[0].data();
        // Only mark as requested if it's still pending or approved
        if (existingRequest.status === 'pending' || existingRequest.status === 'approved') {
          setAlreadyRequested(true);
        }
      }
    } catch (err) {
      console.error('Error checking existing request:', err);
    }
  };

  // Count pending requests for this provider
  const loadPendingRequestsCount = async () => {
    try {
      const { db } = getFirebase();
      const requestsRef = collection(db, 'jobRequests');
      const q = query(
        requestsRef,
        where('providerId', '==', currentUser.providerId),
        where('status', '==', 'pending')
      );

      const snapshot = await getDocs(q);
      setPendingRequestsCount(snapshot.size);
    } catch (err) {
      console.error('Error loading pending requests count:', err);
    }
  };

  const handleRequestJob = async () => {
    // Check if limit reached
    if (pendingRequestsCount >= MAX_PENDING_REQUESTS) {
      setError(`You have reached the maximum of ${MAX_PENDING_REQUESTS} pending job requests.`);
      setTimeout(() => setError(null), 5000);
      return;
    }

    // Confirm request
    if (!window.confirm(`Request this job?\n\nCustomer: ${quoteName}\nLocation: ${quotePostcode}\n\nYou currently have ${pendingRequestsCount} pending requests.`)) {
      return;
    }

    try {
      setRequesting(true);
      setError(null);

      const { db } = getFirebase();

      // Get provider details
      const providerDoc = await getDoc(doc(db, 'serviceProviders', currentUser.providerId!));
      const providerData = providerDoc.data();

      // Create job request
      const requestData: Omit<JobRequest, 'id'> = {
        quoteId,
        quoteName,
        quotePostcode,
        quoteCreatedAt,
        providerId: currentUser.providerId!,
        providerName: `${currentUser.firstName} ${currentUser.lastName}`,
        providerCompanyName: currentUser.companyName || providerData?.companyName,
        requestedAt: new Date().toISOString(),
        status: 'pending'
      };

      await addDoc(collection(db, 'jobRequests'), requestData);

      // Update quote with request count
      const quoteRef = doc(db, 'quotes', quoteId);
      await updateDoc(quoteRef, {
        requestCount: increment(1),
        hasActiveRequests: true
      });

      setAlreadyRequested(true);
      setPendingRequestsCount(prev => prev + 1);

      // Callback to refresh parent component
      if (onRequestCreated) {
        onRequestCreated();
      }

      alert('Job request submitted successfully! You will be notified when an admin reviews your request.');
    } catch (err) {
      console.error('Error requesting job:', err);
      setError('Failed to submit job request. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setRequesting(false);
    }
  };

  // If already requested, show check icon
  if (alreadyRequested) {
    return (
      <button
        disabled
        style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          color: '#10b981',
          fontSize: '0.85rem',
          fontWeight: '600',
          cursor: 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.7
        }}
      >
        <Check size={16} />
        Requested
      </button>
    );
  }

  // If at limit, show disabled button
  if (pendingRequestsCount >= MAX_PENDING_REQUESTS) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
        <button
          disabled
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: '#f87171',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: 0.7
          }}
        >
          <AlertCircle size={16} />
          Limit Reached
        </button>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>
          {MAX_PENDING_REQUESTS}/{MAX_PENDING_REQUESTS} pending
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
      <button
        onClick={handleRequestJob}
        disabled={requesting}
        style={{
          background: requesting ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          color: '#818cf8',
          fontSize: '0.85rem',
          fontWeight: '600',
          cursor: requesting ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseEnter={(e) => {
          if (!requesting) {
            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (!requesting) {
            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
          }
        }}
      >
        {requesting ? (
          <>
            <div style={{
              width: '14px',
              height: '14px',
              border: '2px solid rgba(129, 140, 248, 0.3)',
              borderTop: '2px solid #818cf8',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Requesting...
          </>
        ) : (
          <>
            <Send size={16} />
            Request Job
          </>
        )}
      </button>
      <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>
        {pendingRequestsCount}/{MAX_PENDING_REQUESTS} pending
      </span>

      {error && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.5rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px',
          color: '#f87171',
          fontSize: '0.75rem',
          maxWidth: '200px',
          textAlign: 'right'
        }}>
          {error}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RequestJobButton;
