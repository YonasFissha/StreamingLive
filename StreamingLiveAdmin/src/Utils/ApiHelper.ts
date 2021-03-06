import { EnvironmentHelper } from "../Components";

export interface LinkInterface { id?: number, churchId?: number, url?: string, text?: string, sort?: number }
export interface TabInterface { id?: number, churchId?: number, url?: string, text?: string, sort?: number, tabType: string, tabData: string, icon: string }
export interface PageInterface { id?: number, churchId?: number, name?: string, lastModified?: Date, content?: string }
export interface ServiceInterface { id?: number, churchId?: number, serviceTime?: Date, earlyStart?: number, duration: number, chatBefore: number, chatAfter: number, provider: string, providerKey: string, videoUrl: string, timezoneOffset: number, recurring: boolean }
export interface SettingInterface { id?: number, churchId?: number, homePageUrl?: string, logoUrl?: string, primaryColor?: string, contrastColor?: string, registrationDate?: Date }


//AccessManagment
export interface ApplicationInterface { name: string, permissions: RolePermissionInterface[] }
export interface ChurchInterface { id?: number, name: string, registrationDate?: Date, subDomain: string, apps?: ApplicationInterface[] }
export interface LoadCreateUserRequestInterface { userEmail: string, fromEmail: string, subject: string, body: string, userName: string }
export interface LoginResponseInterface { user: UserInterface, churches: ChurchInterface[], token: string, errors: string[] }
export interface RegisterInterface { churchName?: string, displayName?: string, email?: string, password?: string }
export interface RoleInterface { id?: number, churchId?: number, appName?: string, name?: string }
export interface RolePermissionInterface { id?: number, churchId?: number, roleId?: number, appName?: string, contentType?: string, contentId?: number, action?: string }
export interface RoleMemberInterface { id?: number, churchId?: number, roleId?: number, userId?: number, user?: UserInterface }
export interface ResetPasswordRequestInterface { userEmail: string, fromEmail: string, subject: string, body: string }
export interface ResetPasswordResponseInterface { emailed: boolean }
export interface SwitchAppRequestInterface { appName: string, churchId: number }
export interface SwitchAppResponseInterface { appName: string, churchId: number }
export interface UserInterface { id?: number, email?: string, authGuid?: string, displayName?: string, registrationDate?: Date, lastLogin?: Date, password?: string }

export class ApiHelper {
    static jwt = '';
    static amJwt = '';

    static getUrl(path: string) {
        if (path.indexOf("://") > -1) return path;
        else return EnvironmentHelper.StreamingLiveApiUrl + path;
    }

    static async apiGet(path: string) {
        const requestOptions = { method: 'GET', headers: { 'Authorization': 'Bearer ' + this.jwt } };
        return fetch(this.getUrl(path), requestOptions).then(response => response.json())
    }

    static async apiPost(path: string, data: any[] | {}) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + this.jwt, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        return fetch(this.getUrl(path), requestOptions).then(response => response.json())
    }

    static async apiDelete(path: string) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.jwt }
        };
        return fetch(this.getUrl(path), requestOptions);
    }

    static async apiPostAnonymous(path: string, data: any[] | {}) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        return fetch(this.getUrl(path), requestOptions).then(response => response.json())
    }

}

