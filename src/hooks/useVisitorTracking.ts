import { useEffect, useState } from 'react';

const DEVICE_ID_KEY = 'wedding_device_id';

export function useVisitorTracking() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Get or create device ID
        let deviceId = localStorage.getItem(DEVICE_ID_KEY);
        if (!deviceId) {
          deviceId = Math.random().toString(36).substring(2, 15);
          localStorage.setItem(DEVICE_ID_KEY, deviceId);
        }

        // Track visit through API
        const response = await fetch('http://localhost:3041/api/stats/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deviceId }),
        });

        if (!response.ok) {
          throw new Error('Failed to track visit');
        }
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, []); // Run once when component mounts
}

export async function getVisitorStats() {
  try {
    const response = await fetch('http://localhost:3041/api/stats/get');
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to get stats:', error);
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      todayViews: 0,
      todayUniqueVisitors: 0,
      last7Days: [],
      recentVisits: []
    };
  }
} 