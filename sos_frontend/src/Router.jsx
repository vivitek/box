import { Route, Switch, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";

const Routes = () => {
    return (
        <Switch>
            <Route path="/" component={Home}/>
        </Switch>
    );
}

export default Routes;