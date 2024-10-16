// Auth
export interface User {
    fname: string,
    lname: string,
    email: string,
    uid: number,
}
export interface Auth {
    status: number,
    user: User | undefined | null
}

export interface AuthContextProps extends Auth {
    setAuthContext: React.Dispatch<React.SetStateAction<Auth>>
}