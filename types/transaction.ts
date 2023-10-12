export interface Transaction {
    created_on:              string;
    deleted:                 number;
    id:                      number;
    user_id:                 number;
    user_name:               string;
    place_id:                number;
    place_name:              string;
    purchase_id:             number;
    purchase_account_number: string;
    purchase_type: string;
    code: string;
    employee_id:             number;
    employee_name:           string;
    image:                   null;
    remarks:                 null;
    date:                    Date;
    voucher_id:              null;
    voucher_code:            null;
    total_price:             number;
    service_type:            string;
    home_address:            null;
    status:                  string;
}