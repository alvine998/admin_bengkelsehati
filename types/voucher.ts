export interface Voucher {
    id:         number;
    name:       string;
    type:       string;
    max:        number;
    min:        number;
    percentage: number;
    quota:      number;
    code:       string;
    max_used:   number;
    expired_at: Date;
    time_start: string;
    time_end:   string;
    banner:     null;
    created_on: Date;
    updated_on: null;
    deleted:    number;
}