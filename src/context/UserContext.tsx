import { createContext, useState } from 'react'

import { Constants } from '../utils/Constants'

export const UserContext = createContext<any>({
    user: {},
    setUser: (email: string, role: string) => {}
})

export function UserContextProvider ({ children }: any) {
    const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('User') ?? `{"email": "NONE", "ROLE":"${Constants.USER}"}`))
    
    function handleUserChange (email: string, role: string) {
        console.log('setting user', email, role)
        setUser({ email, role }) 
    }
    return (
        <UserContext.Provider value={{ user: user, setUser: handleUserChange }}>
            {children}
        </UserContext.Provider>
    )
}
