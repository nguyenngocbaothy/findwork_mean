export interface Category {
    _id: String;
    name: String;
}

export interface User {
    success: string;
    user: {
        email: string;
        listjonUser: [string];
        name: string;
        token: string;
        _id: string;
    };
}

export interface Employer {
    success: string;
    employer: {
        email: string;
        address?: string;
        phone?: number;
        name: string;
        token: string;
        job: [string];
    };
}
