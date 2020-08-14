export interface ChurchInterface { id?: number }
export interface PermissionInterface { contentType?: string, action?: string }
export interface RegisterInterface { churchName?: string, firstName?: string, lastName?: string, email?: string, password?: string }
export interface UserMappingInterface { church?: ChurchInterface, personId?: number }
export interface UserInterface { apiKey: string, name: string }

export class ApiHelper {
    //*** What's a good way to toggle this based on environment?
    static baseUrl = 'https://api.livecs.org';
    //static baseUrl = 'http://localhost:50494';
    static apiKey = '';

    static getUrl(path: string) {
        if (path.indexOf("://") > -1) return path;
        else return this.baseUrl + path;
    }

    static async apiGet(path: string) {
        const requestOptions = { method: 'GET', headers: { 'Authorization': 'Bearer ' + this.apiKey } };
        return fetch(this.getUrl(path), requestOptions).then(response => response.json())
    }

    static async apiPost(path: string, data: any[] | {}) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + this.apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        return fetch(this.getUrl(path), requestOptions).then(response => response.json())
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

