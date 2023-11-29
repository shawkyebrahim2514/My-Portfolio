import { createContext, useMemo, useState } from 'react';
const Context = createContext();

export default function NavigationControllerContext({ children }) {
    const [links, setLinks] = useState({
        "About": true,
        "Skills": false,
        "Education": false,
        "Experience": false,
        "Projects": false,
        "Contacts": false,
    });
    const contextValue = useMemo(() => [links, setLinks], [links, setLinks]);
    
    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

export { Context as navigationControllerContext };