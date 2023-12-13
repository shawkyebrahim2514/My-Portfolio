import { createContext, useContext, useMemo, useState } from 'react';
import { type Links } from '../Types';

type ContextType = {
    links: Links,
    setLinks: React.Dispatch<React.SetStateAction<Links>>
}

const Context = createContext<ContextType | null>(null);

type contextProps = {
    readonly children: React.ReactNode
}

export default function NavigationControllerContext({ children }: contextProps) {
    const [links, setLinks] = useState<Links>({
        "about": true,
        "skills": false,
        "education": false,
        "experience": false,
        "projects": false,
        "contacts": false,
    });

    const contextValue = useMemo(() => {
        return {
            links,
            setLinks
        }
    }, [links]);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

function useNavigationControllerContext() {
    const result = useContext(Context);
    if (result == null) {
        throw Error("Error happened while creating the NavigationControllerContext!")
    }
    return { ...result }
}

export { useNavigationControllerContext };