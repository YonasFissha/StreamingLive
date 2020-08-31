import React from 'react'

export class EnvironmentHelper {
    static AccessManagementApiUrl = "";
    static StreamingLiveApiUrl = "";
    static AdminUrl = "";

    static init = () => {
        switch (process.env.REACT_APP_STAGE) {
            case "staging": EnvironmentHelper.initStaging(); break;
            case "prod": EnvironmentHelper.initProd(); break;
            default: EnvironmentHelper.initDev(); break;
        }
    }

    static initDev = () => {
        EnvironmentHelper.AccessManagementApiUrl = process.env.REACT_APP_ACCESSMANAGEMENT_API_URL || "";
        EnvironmentHelper.StreamingLiveApiUrl = process.env.REACT_APP_STREAMINGLIVE_API_URL || "";
        EnvironmentHelper.AdminUrl = process.env.REACT_APP_ADMIN_URL || "";
    }

    //NOTE: None of these values are secret.
    static initStaging = () => {
        EnvironmentHelper.AccessManagementApiUrl = "https://api.staging.livecs.org";
        EnvironmentHelper.StreamingLiveApiUrl = "https://api.staging.streaminglive.church";
        EnvironmentHelper.AdminUrl = "https://admin.staging.streaminglive.church";
    }

    //NOTE: None of these values are secret.
    static initProd = () => {
        EnvironmentHelper.AccessManagementApiUrl = "https://api.livecs.org";
        EnvironmentHelper.StreamingLiveApiUrl = "https://api.streaminglive.church";
        EnvironmentHelper.AdminUrl = "https://admin.streaminglive.church";
    }

}

