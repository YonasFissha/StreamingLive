import { UserInterface, ChurchInterface, SettingInterface, SwitchAppRequestInterface, ApiHelper, EnvironmentHelper, LoginResponseInterface } from './'
import { UserContextInterface } from '../UserContext';
import { RolePermissionInterface } from './ApiHelper';

export class UserHelper {
    static currentChurch: ChurchInterface;
    static churches: ChurchInterface[];
    static user: UserInterface;
    static currentSettings: SettingInterface;
    static currentPermissions: RolePermissionInterface[];

    static selectChurch = (churchId: number, context: UserContextInterface) => {
        var church = null;
        UserHelper.churches.forEach(c => { if (c.id === churchId) church = c; });
        if (church === null) window.location.reload();
        else {
            UserHelper.currentChurch = church;

            UserHelper.currentChurch.apps.forEach(app => {
                console.log(app);
                if (app.name === "StreamingLive") UserHelper.currentPermissions = app.permissions;
            })

            const data: SwitchAppRequestInterface = { appName: "StreamingLive", churchId: UserHelper.currentChurch.id };
            ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/users/switchApp', data).then((resp: LoginResponseInterface) => {
                ApiHelper.jwt = resp.token;
                ApiHelper.apiGet('/settings').then((settings: SettingInterface[]) => {
                    UserHelper.currentSettings = settings[0];
                    context.setUserName(UserHelper.currentChurch.id.toString());
                });
            });
        }
    }


    static checkAccess(contentType: string, action: string): boolean {
        var result = false;
        if (UserHelper.currentPermissions !== undefined) {
            UserHelper.currentPermissions.forEach(element => {
                if (element.contentType === contentType && element.action === action) result = true;
            });
        }
        return result;
    }

}

