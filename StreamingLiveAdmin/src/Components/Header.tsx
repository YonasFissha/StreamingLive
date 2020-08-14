import React from 'react';

export const Header: React.FC = () => {

    /*
     @if (StreamingLiveCore.AppUser.Current!=null && StreamingLiveCore.AppUser.Current.IsAuthenticated)
            {
                            <a href="javascript:toggleUserMenu();"><i class="fas fa-user"></i> &nbsp; @StreamingLiveCore.AppUser.Current.UserData.DisplayName (@StreamingLiveCore.AppUser.CurrentSite.KeyName) <i class="fas fa-caret-down"></i></a>
                        }
            else
            {
                            <a href="/cp/">Login</a>
                        }
    */
    const userLink = <></>

    return (
        <>
            <nav className="navbar navbar-expand navbar-dark fixed-top bg-dark">
                <a className="navbar-brand" href="/" style={{ paddingTop: 0, paddingBottom: 0 }}><img src="/images/logo.png" id="logo" /></a>
                <div className="collapse navbar-collapse" id="navbar">
                    <ul className="navbar-nav mr-auto"></ul>
                    <div className="navbar-nav ml-auto">{userLink}</div>
                </div>
            </nav>
            <div id="userMenu" style={{ display: 'none' }}></div>
            <div style={{ height: 66 }}></div>
        </>
    );
}
