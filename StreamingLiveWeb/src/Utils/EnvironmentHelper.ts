import React from 'react'

export class EnvironmentHelper {
    static AccessManagementApiUrl = "";
    static StreamingLiveApiUrl = "";
    static AdminUrl = "";

    static init = () => {
        switch (process.env.REACT_APP_STAGE) {
            case "staging": EnvironmentHelper.initStaging(); break;
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
        EnvironmentHelper.AccessManagementApiUrl = "https://vfj29fb54h.execute-api.us-east-2.amazonaws.com/Staging";
        EnvironmentHelper.StreamingLiveApiUrl = "https://ozok30w9g5.execute-api.us-east-2.amazonaws.com/Staging";
        EnvironmentHelper.AdminUrl = "https://admin.staging.streaminglive.church";
    }

}

