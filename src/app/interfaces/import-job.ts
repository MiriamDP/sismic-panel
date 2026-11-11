export interface ImportJob {
    id: number,
    status: string,
    start_date: string;
    end_date: string;
}

export interface ImportJobRequest {
    start: Date|string|null;
    end: Date|string|null;
    mag: number|null;
}
