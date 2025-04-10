
/**
 * Utility functions for working with estimates
 */

import { Estimate } from "@/models/Estimate";

/**
 * Generates a formatted estimate number based on client initials, current date, and a sequence number
 * Format: XX-YYYYMMDD-XX (Client initials-Date-Sequential number)
 * 
 * @param clientName The full name of the client
 * @param existingEstimates Array of existing estimates to determine the next sequence number
 * @returns Formatted estimate number
 */
export const generateEstimateNumber = (
  clientName: string,
  existingEstimates: Estimate[] = []
): string => {
  // Extract client initials (up to 2 characters)
  const initials = clientName
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
    .padEnd(2, 'X'); // Ensure we have at least 2 characters
  
  // Format the current date as YYYYMMDD
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  
  // Determine the next sequence number (0-99)
  // Get today's estimates that match the same client and date pattern
  const todayPattern = `${initials}-${dateStr}`;
  const todayEstimates = existingEstimates.filter(est => 
    est.id.startsWith(todayPattern)
  );
  
  // Extract the sequence numbers and find the highest
  const seqNumbers = todayEstimates.map(est => {
    const parts = est.id.split('-');
    return parts.length === 3 ? parseInt(parts[2], 10) : -1;
  });
  
  const highestSeq = seqNumbers.length > 0 
    ? Math.max(...seqNumbers) 
    : -1;
  
  // Next sequence number (0-99)
  const nextSeq = (highestSeq + 1) % 100;
  const seqStr = nextSeq.toString().padStart(2, '0');
  
  // Return the formatted estimate number
  return `${initials}-${dateStr}-${seqStr}`;
};
