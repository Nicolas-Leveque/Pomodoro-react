import Timer from './components/Timer.jsx'
import { useState} from "react";
import SettingsContext from "./SettingsContext.js";

function App() {
    const [ focusMinutes, setFocusMinutes ] = useState(25);
    const [ pauseMinutes, setPauseMinutes ] = useState(5);
    const [ showSettings, setShowSettings ] =useState(false);
    return (
        <main>
            <SettingsContext.Provider value={{
                showSettings,
                setShowSettings,
                focusMinutes,
                setFocusMinutes,
                pauseMinutes,
                setPauseMinutes
            }}>
                <Timer />
            </SettingsContext.Provider>

        </main>
  )
}

export default App;
