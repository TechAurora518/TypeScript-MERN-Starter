import React, { RefObject, createRef } from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import ErrorPage from "./pages/ErrorPage";
import Consent from "./pages/Consent";
import Profile from "./pages/Profile";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
interface Props {}

interface States {}

export default class App extends React.Component<Props, States> {
    private contextRef: RefObject<any>;
    constructor(props: Props) {
        super(props);
        this.contextRef = createRef();
    }
    render(): React.ReactElement<any> {
        const notFoundError: Error = {
            name: "404 Not Found",
            message: `not found for ${window.location.href} `
        };
        return (
            <div ref={this.contextRef}>
                <Route render={ (props) => <NavBar {...props} containerRef={this.contextRef}/> } />
                <Switch>
                    <Route exact path="/" render={ (props) => <Home {...props} /> } />
                    <Route path="/login" render={ (props) => <LogIn {...props} /> } />
                    <Route path="/signup" render={ (props) => <SignUp {...props} /> } />
                    <Route path="/consent" render={ (props) => <Consent {...props} /> } />
                    <Route path="/profile" render={ (props) => <Profile {...props} /> } />
                    <Route path="/article/create" render={ (props) => <CreateArticle {...props} /> } />
                    <Route path="/article/edit/:id" render={ (props) => <EditArticle {...props} /> } />
                    {/* add more routes here */}
                    <Route render={ (props) => <ErrorPage {...props} error={notFoundError} /> } />
                </Switch>
                <Footer />
            </div>
        );
    }
}