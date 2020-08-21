import { Principal } from './'

export class AuthenticatedUser {
    public id: number;
    public churchId: number;
    public permissions: string[];

    public constructor(principal: Principal) {
        this.id = principal.details.id;
        this.churchId = principal.details.churchId;
        this.permissions = principal.details.permissions;
    }

    public checkAccess(contentType: string, action: string) {
        const key = contentType + "__" + action;
        let result = false;
        console.log(key);
        console.log(this.permissions);
        this.permissions.forEach((p: string) => { if (p === key) result = true; });
        return result;
    }



}
