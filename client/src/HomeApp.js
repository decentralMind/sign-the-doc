import React from "react";
import { BrowserRouter as Router, Route, Link, NavLink, Switch } from "react-router-dom";
import { MainProvider } from './context/MainProvider';
import { SignInfoProvider } from './context/SignInfoProvider';
import './Main.css'

// COMPONENTS
import DeployDoc from './deployDoc/DeployDoc';
import signDoc from './signDoc/SignDoc';
import DocInfo from './docInfo/DocInfo';
import Status from './deployDoc/Status';

import githubLogo from './githubSmall.png';

function Home() {
    return (
        <div>
            <br />
            <h4>Main Concept:</h4>
            <p>Deploy Hash of the document/file on Ethereum blockchain and let anyone or only authroised signers(address) to sign the hash of the document thus completing document signature process.</p>

            <h4>Do you want to</h4>
            <ul >
                <li><Link to="/deploy">Create And Deploy Document?</Link></li>
                <li><Link to="/sign">Sign Document?</Link></li>
                <li><Link to="/info">Get Document Info?</Link></li>
            </ul>

            <br />
            <div>
                <h4>Contract deployed at:</h4>
                <p>Rinkeby:<a href="https://ropsten.etherscan.io/address/0xf82438a3ba0764ce51b58c484f644905da177b1c" target="_blank" rel="noopener noreferrer">0xf82438a3ba0764ce51b58c484f644905da177b1c</a></p>
                <p>Ropsten:<a href="https://ropsten.etherscan.io/address/0x1CB4E004b2a81045097416C0c6CF42aA0C608e4a" target="_blank" rel="noopener noreferrer"> 0x1CB4E004b2a81045097416C0c6CF42aA0C608e4a</a></p>
                <p>Kovan:<a href="https://kovan.etherscan.io/address/0xeba2cef3320c34e7873afa6905e17add8011910f" target="_blank" rel="noopener noreferrer">0x4df4c113f15ad7d20642a4cba34071fb3c55c581</a></p>
            </div>

            <br />
            <p>Creator: decentralMind@gmail.com</p>
            <a href="https://github.com/decentralMind/sign-the-doc" target="_blank" rel="noopener noreferrer">
                <img src={githubLogo} alt="github logo"/>
            </a>
        </div>
    );
}

const Page404 = ({ location }) => (
    <div>
        <p>No match found for <code>{location.pathname}</code></p>
    </div>
);

/*
<Router basename={process.env.PUBLIC_URL}>
"build": "react-scripts build && cp build/index.html build/404.html",
*/

const HomeApp = () => {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <MainProvider>
                <SignInfoProvider>
                    <div>
                        <header>
                            <h4 className="LogoMargin">Sign-The-Doc</h4>
                            <ul className="NavMenu" >
                                <li><NavLink className="MainLinks" to="/" exact activeClassName="ActiveLink" >Home |</NavLink></li>
                                <li><NavLink className="MainLinks" to="/deploy" activeClassName="ActiveLink">Deploy Document |</NavLink></li>
                                <li><NavLink className="MainLinks" to="/sign" activeClassName="ActiveLink">Sign Document |</NavLink> </li>
                                <li><NavLink className="MainLinks" to="/info" activeClassName="ActiveLink">Get Document Info </NavLink></li>
                            </ul>
                        </header>
                        <Switch>
                            <Route path="/" exact component={Home} />
                            <Route path="/deploy" exact component={DeployDoc} />
                            <Route path="/sign" exact component={signDoc} />
                            <Route path="/info" exact component={DocInfo} />
                            <Route path="/status" exact component={Status} />
                            <Route component={Page404} />
                        </Switch>
                        <br />
                    </div>
                </SignInfoProvider>
            </MainProvider>
        </Router>
    );
}

export default HomeApp;
