import Dashboard from "./Dashboard"
import Home from "./Home"

const App = () => {
    if(window.location.pathname == "/") return <Home/>
    if(window.location.pathname !== "/") return <Dashboard/>
    return null
}

export default App