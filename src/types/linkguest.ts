// src/types.ts
export interface Guest {
    _id: string;
    name: string;
    guestType: 'bride' | 'groom' | 'general' | 'parent';
    link: string;
    note?: string;
    status: 'pending' | 'sent';
    timestamp: string; // Giữ lại timestamp là optional
    inviteTime: string
}