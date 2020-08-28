import React from 'react';
import { NavItems, ButtonInterface, UserInterface, ChatName } from '.'
import { ChatHelper, ApiHelper, EnvironmentHelper } from '../helpers';
import { Link } from 'react-router-dom'

interface Props {
    logoUrl: string,
    homeUrl: string,
    user: UserInterface,
    buttons: ButtonInterface[],
    nameUpdateFunction: (displayName: string) => void,
    loginChangeFunction: () => void
}

export const Header: React.FC<Props> = (props) => {
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    const toggleUserMenu = (e: React.MouseEvent) => { e.preventDefault(); setShowUserMenu(!showUserMenu); }

    const login = (e: React.MouseEvent) => {
        e.preventDefault();
        ChatHelper.user.isHost = true;
        setShowUserMenu(false);
        props.loginChangeFunction();
    }

    const updateName = (displayName: string) => {
        setShowUserMenu(false);
        props.nameUpdateFunction(displayName);
    }

    const getLoginLink = () => {
        if (ApiHelper.jwt === '') return (<Link to="/login" className="nav-link">Login</Link>);
        else return (<Link to="/logout" className="nav-link">Logout</Link>);
    }

    const getUserMenu = () => {
        if (showUserMenu) return (
            <div id="userMenu">
                <div>
                    <ul className="nav flex-column d-xl-none">
                        <NavItems buttons={props.buttons} />
                    </ul>
                    <ul className="nav flex-column">
                        <li className="nav-item" ><ChatName user={props.user} updateFunction={updateName} /></li>
                        <li className="nav-item" >{getLoginLink()}</li>
                    </ul>
                </div>
            </div>)
        else return null;
    }

    return (
        <>
            <div id="header">
                <div id="logo">
                    <a href={props.homeUrl} target="_blank" rel="noopener noreferrer">
                        <img src={EnvironmentHelper.ContentRoot + props.logoUrl} alt="logo" />
                    </a>
                </div>
                <div id="liveButtons" className="d-none d-xl-flex" >
                    <div>
                        <ul className="nav nav-fill">
                            <NavItems buttons={props.buttons} />
                        </ul>
                    </div>
                </div>
                <div id="userLink"><div><a href="about:blank" onClick={toggleUserMenu}>{props.user.displayName} <i className="fas fa-chevron-down"></i></a></div></div>
            </div>
            {getUserMenu()}
        </>
    );
}


