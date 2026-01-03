/**
 * Job Request System Type Definitions
 *
 * This file contains TypeScript interfaces for the job request and auto-approval system.
 */

/**
 * Job Request Status
 * - pending: Provider has requested the job, awaiting admin review
 * - approved: Admin has manually approved the request
 * - rejected: Admin has rejected the request
 * - auto-approved: System has automatically approved based on age/criteria
 * - expired: Request has been superseded (job assigned to someone else)
 */
export type JobRequestStatus = 'pending' | 'approved' | 'rejected' | 'auto-approved' | 'expired';

/**
 * Job Request Document
 * Stored in /jobRequests/{requestId}
 */
export interface JobRequest {
  id?: string; // Document ID (set after creation)

  // Quote reference
  quoteId: string;
  quoteName: string; // Cached customer name
  quotePostcode: string; // Cached for display/filtering
  quoteCreatedAt: string; // ISO timestamp - to calculate quote age

  // Provider reference
  providerId: string;
  providerName: string; // Cached full name
  providerCompanyName?: string; // Cached company name

  // Request metadata
  requestedAt: string; // ISO timestamp
  status: JobRequestStatus;

  // Review metadata (when approved/rejected)
  reviewedBy?: string; // Admin email or 'auto-approval-system'
  reviewedAt?: string; // ISO timestamp
  rejectionReason?: string; // Optional admin note for rejection

  // Auto-approval tracking
  autoApproved?: boolean; // Quick flag for filtering
  autoApprovalRun?: string; // Which auto-approval run assigned this
}

/**
 * Auto-Approval Settings Document
 * Stored in /settings/autoApproval
 */
export interface AutoApprovalSettings {
  // Core settings
  enabled: boolean; // Master on/off switch
  ageThresholdHours: number; // How old must quote be for auto-approval (default: 48)
  maxOpenJobsLimit: number; // Max active jobs per provider (default: 10)
  considerServiceArea: boolean; // Whether to check service area match (default: true)

  // Provider selection
  useWorkloadBalancing: boolean; // Prefer providers with fewer jobs (default: true)
  useRatingWeight: boolean; // Future: factor in provider ratings (default: false)

  // Tracking
  lastAutoRunAt?: string; // ISO timestamp of last auto-approval run
  nextScheduledRun?: string; // ISO timestamp of next scheduled run

  // Statistics
  stats?: {
    totalAutoApproved: number; // All-time count
    lastMonthAutoApproved: number; // Rolling 30-day count
    lastWeekAutoApproved: number; // Rolling 7-day count
    lastRunAssignmentCount?: number; // How many assigned in last run
  };
}

/**
 * Default auto-approval settings
 */
export const DEFAULT_AUTO_APPROVAL_SETTINGS: AutoApprovalSettings = {
  enabled: false, // Start disabled for safety
  ageThresholdHours: 48, // 2 days
  maxOpenJobsLimit: 10,
  considerServiceArea: true,
  useWorkloadBalancing: true,
  useRatingWeight: false, // Not implemented yet
  stats: {
    totalAutoApproved: 0,
    lastMonthAutoApproved: 0,
    lastWeekAutoApproved: 0
  }
};

/**
 * Provider Eligibility Check Result
 * Used by auto-approval logic to track eligible providers
 */
export interface ProviderEligibility {
  providerId: string;
  providerName: string;
  companyName?: string;

  // Eligibility flags
  isApproved: boolean; // Provider status is 'approved'
  matchesServiceArea: boolean; // Provider works in quote's area
  underJobLimit: boolean; // Provider has < maxOpenJobsLimit active jobs
  hasRequested: boolean; // Provider has pending request for this job

  // Metrics for sorting
  activeJobsCount: number; // Current workload
  rating?: number; // Future: provider rating (0-5)
  weightedScore?: number; // Future: calculated score for ranking

  // Request reference
  requestId?: string; // jobRequest document ID if hasRequested
  requestedAt?: string; // When they requested
}

/**
 * Enhanced Quote Request interface with job request tracking
 * Extends the existing QuoteRequest with new fields
 */
export interface QuoteRequestWithRequests {
  // ... all existing QuoteRequest fields

  // Job request tracking
  requestCount?: number; // How many providers have requested this job
  hasActiveRequests?: boolean; // Quick filter flag
  autoApprovalEligible?: boolean; // Passed age threshold
  autoApprovalCheckedAt?: string; // Last time auto-approval ran for this quote
}
