import './App.css';
import {Route, Router, Routes} from "react-router-dom";
import Join from "./student/Join";
import Test from "./student/test";
import TopBar from "./component/TopNav";

function App() {
    return (
        <Routes>
            <Route path="/join" element={<Join/>}/>
            <Route path="/test" element={<TopBar/>}/>

        </Routes>

    );
}

export default App;
