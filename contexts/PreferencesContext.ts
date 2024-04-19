import {createContext} from 'react';


type Preferences = {
    classic: boolean,
}

export const defaultPreferences: Preferences = {
    classic: false
}

type PreferencesContext = {
    preferences: Preferences,
    setPreferences: (f: Preferences) => void
}
const PreferencesContext = createContext<PreferencesContext>({
    preferences: defaultPreferences,
    setPreferences: () => {}
});
export default PreferencesContext;
