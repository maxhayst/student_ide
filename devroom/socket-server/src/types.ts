export interface User {
    id: string;
    role: 'student' | 'teacher';
}

export interface SummonData {
    projectId: string;
    fileId: string;
    lineNumber: number;
}

export interface TelemetryData {
    projectId: string;
    metrics: any;
}

export interface LockdownData {
    projectId: string;
    isLocked: boolean;
}

export interface HandRaiseData {
    projectId: string;
    studentId: string;
    studentName?: string;
}
