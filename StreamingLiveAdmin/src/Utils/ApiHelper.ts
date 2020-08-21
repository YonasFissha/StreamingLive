export interface LinkInterface { id?: number, churchId?: number, url?: string, text?: string, sort?: number }
export interface TabInterface { id?: number, churchId?: number, url?: string, text?: string, sort?: number, tabType: string, tabData: string, icon: string }
export interface PageInterface { id?: number, churchId?: number, name?: string, lastModified?: Date }
export interface ServiceInterface { id?: number, churchId?: number, serviceTime?: Date, earlyStart?: number, duration: number, chatBefore: number, chatAfter: number, provider: string, providerKey: string, videoUrl: string, timezoneOffset: number, recurring: boolean }
export interface SettingInterface { id?: number, churchId?: number, keyName?: string, homePageUrl?: string, logoUrl?: string, primaryColor?: string, contrastColor?: string, registrationDate?: Date }


//AccessManagment
export interface ApplicationInterface { name: string, permissions: RolePermissionInterface[] }
export interface ChurchInterface { id?: number, name: string, registrationDate?: Date, apps?: ApplicationInterface[] }
export interface LoginResponseInterface { user: UserInterface, churches: ChurchInterface[], token: string }
export interface RegisterInterface { churchName?: string, displayName?: string, email?: string, password?: string }
export interface RoleInterface { id?: number, churchId?: number, appName?: string, name?: string }
export interface RolePermissionInterface { id?: number, churchId?: number, roleId?: number, appName?: string, contentType?: string, contentId?: number, action?: string }
export interface RoleMemberInterface { id?: number, churchId?: number, roleId?: number, userId?: number }
export interface UserInterface { id?: number, email?: string, authGuid?: string, displayName?: string, registrationDate?: Date, lastLogin?: Date, password?: string }

export class ApiHelper {
    static baseUrl = process.env.REACT_APP_STREAMINGLIVE_API_URL;
    static jwt = '';

    static getUrl(path: string) {
        if (path.indexOf("://") > -1) return path;
        else return this.baseUrl + path;
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
        return fetch(this.baseUrl + path, requestOptions);
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

