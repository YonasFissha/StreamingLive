export interface LinkInterface { id?: number, churchId: number, url: string, text: string, sort: number }
export interface PageInterface { id?: number, churchId: number, name: string, lastModified: Date }
export interface ServiceInterface { id?: number, churchId: number, serviceTime: Date, earlyStart: number, duration: number, chatBefore: number, chatAfter: number, provider: string, providerKey: string, videoUrl: string, timezoneOffset: number, recurring: boolean }
export interface StyleInterface { id?: number, churchId: number, homePage: string, logo: string, primaryColor: string, contrastColor: string }
export interface TabInterface { id?: number, churchId: number, url: string, text: string, sort: number, icon: string, tabType: string, tabData: string }

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

    static async apiDelete(path: string) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.apiKey }
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

