import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuoteRequest {
    serviceType: string;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export interface backendInterface {
    getAllQuotes(): Promise<Array<QuoteRequest>>;
    submitQuoteRequest(id: string, name: string, email: string, phone: string, serviceType: string, message: string): Promise<void>;
}
