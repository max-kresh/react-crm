import { createContext, useState } from 'react'

import { Constants } from '../utils/Constants'

export const UserContext = createContext<any>({
    user: {},
    setUser: (email: string, role: string) => {},
    isAdmin: () => {},
    isSalesManager: () => {},
    isSalesRep: () => {},
    isUser: () => {}
})

export function UserContextProvider ({ children }: any) {
    const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('User') ?? `{"email": "NONE", "ROLE":"${Constants.USER}"}`))
    
    function handleUserChange (email: string, role: string) {
        console.log('setting user', email, role)
        setUser({ email, role }) 
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

    return (
        <UserContext.Provider value={{ 
                user: user, 
                setUser: handleUserChange,
                isAdmin: isAdmin,
                isSalesManager: isSalesManager,
                isSalesRep: isSalesRep,
                isUser: isUser 
            }}>
            {children}
        </UserContext.Provider>
    )
}
