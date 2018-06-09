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
