export interface ApiError {
    detail: string;
    errors?: { [field: string]: string[] };
}