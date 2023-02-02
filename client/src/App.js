import {Route, Switch} from "react-router-dom";
import "./App.css";
import {ChatPage} from "./Pages/ChatPage";
import {HomePage} from "./Pages/HomePage";

function App() {


    return (<div className="App">
        <Switch>
            <Route path="/" component={HomePage} exact/>
            <Route path="/chats" component={ChatPage}/>
        </Switch>
    </div>);
}

export default App;
