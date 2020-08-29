import React from 'react';
import { UserHelper } from '.'
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";

interface Props { prefix?: String }

export const NavItems: React.FC<Props> = (props) => {

    const location = useLocation()

    const getSelected = (): string => {

        var url = location.pathname;
        var result = 'people';
        if (url.indexOf('/groups') > -1) result = 'groups';
        if (url.indexOf('/attendance') > -1) result = 'attendance';
        if (url.indexOf('/donations') > -1) result = 'donations';
        if (url.indexOf('/forms') > -1) result = 'forms';
        if (url.indexOf('/settings') > -1) result = 'settings';
        console.log(result);
        return result;
    }

    const getClass = (sectionName: string): string => {
        if (sectionName === getSelected()) return 'nav-link active';
        else return 'nav-link';
    }

    const getTab = (key: string, url: string, icon: string, label: string) => {
        return (<li key={key} className="nav-item" id={(props.prefix || '') + key + 'Tab'}><Link className={getClass(key)} to={url}><i className={icon}></i> {label}</Link></li>);
    }

    const getTabs = () => {
        var tabs = [];
        if (UserHelper.checkAccess('Settings', 'Edit')) tabs.push(getTab('settings', '/settings', 'fas fa-video', 'Settings'));
        if (UserHelper.checkAccess('Pages', 'Edit')) tabs.push(getTab('pages', '/pages', 'fas fa-code', 'Pages'));
        if (UserHelper.checkAccess('RoleMembers', 'Edit')) tabs.push(getTab('users', '/users', 'fas fa-user', 'Users'));
        tabs.push(getTab('chat', '/chat', 'fas fa-comments', 'Host Chat'));
        //tabs.push(getTab('traffic', '/traffic', 'fas fa-chart-area', 'Traffic'));
        //tabs.push(getTab('support', 'mailto:support@streaminglive.church', 'fas fa-envelope', 'Support'));
        return tabs;
    }

    return (<>{getTabs()}</>);
}
