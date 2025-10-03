// src/types/data.ts

export interface RsvpEntry {
    thờigian: string;
    họvàtên: string;
    kháchcủaai: string;
    sốkhách: number;
    trạngtháithamgia: string;
    lờinhắn: string;
}

export interface GuestbookEntry {
    thờigian: string;
    tênngườigửi: string;
    lờichúc: string;
}

export interface SummaryData {
    totalRsvps: number;
    totalAttending: number;
    totalDeclined: number;
    totalGuestsAttending: number;
    totalPredictedGuests: number;
    lastUpdated: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}