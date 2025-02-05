import { createContext, useState } from 'react'

import { Constants } from '../utils/Constants'

export const UserContext = createContext<any>({
    user: {},
    setUser: (email: string, role: string, organization: string) => {},
    isAdmin: () => {},
    isSalesManager: () => {},
    isSalesRep: () => {},
    isUser: () => {},
    getRole: () => {},
    getEmail: () => {},
    getOrganization: () => {}
})

export function UserContextProvider ({ children }: any) {
    const [user, setUser] = useState<any>(
        JSON.parse(localStorage.getItem('User') ?? 
        `{"email": "NONE", "role":"${Constants.USER}"}, "organization": "NONE"`))
    
    function handleUserChange ({ ...args }) {
        setUser((prev: any) => ({ ...prev, ...args })) 
        const old = localStorage.getItem('User')
        let user_obj = {}
        if (old) {
            user_obj = JSON.parse(old)
        }
        // localStorage.setItem('User', JSON.stringify({ email: email, role: (selected_org as any).role }))
        localStorage.setItem('User', JSON.stringify({ ...user_obj, ...args }))
    }

    function isAdmin () {
        return user.role === Constants.ADMIN
    }

    function isSalesManager () {
        return user.role === Constants.SALES_MANAGER
    }

    function isSalesRep () {
        return user.role === Constants.SALES_REPRESENTATIVE
    }

    function isUser () {
        return user.role === Constants.USER
    }

    function getRole () {
        return user.role
    }

    function getEmail () {
        return user.email
    }

    function getOrganization () {
        return user.organization
    }

    return (
        <UserContext.Provider value={{ 
                user,
                setUser: handleUserChange,
                isAdmin,
                isSalesManager,
                isSalesRep,
                isUser,
                getRole,
                getEmail,
                getOrganization
            }}>
            {children}
        </UserContext.Provider>
    )
}
