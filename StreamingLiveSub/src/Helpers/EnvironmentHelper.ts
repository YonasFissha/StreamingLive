import React from 'react'

export class EnvironmentHelper {
    static AccessManagementApiUrl = "";
    static StreamingLiveApiUrl = "";
    static ChatApiUrl = "";
    static AdminUrl = "";
    static ContentRoot = "";

    static init = () => {
        console.log('environment');
        console.log(process.env.REACT_APP_STAGE);
        console.log(process.env);
        switch (process.env.REACT_APP_STAGE) {
            case "staging": EnvironmentHelper.initStaging(); break;
            case "prod": EnvironmentHelper.initProd(); break;
            default: EnvironmentHelper.initDev(); break;
        }
    }

    static initDev = () => {
        EnvironmentHelper.AccessManagementApiUrl = process.env.REACT_APP_ACCESSMANAGEMENT_API_URL || "";
        EnvironmentHelper.StreamingLiveApiUrl = process.env.REACT_APP_STREAMINGLIVE_API_URL || "";
        EnvironmentHelper.ChatApiUrl = process.env.REACT_APP_CHAT_API || "";
        EnvironmentHelper.AdminUrl = process.env.REACT_APP_ADMIN_URL || "";
        EnvironmentHelper.ContentRoot = process.env.REACT_APP_CONTENT_ROOT || "";
    }

    //NOTE: None of these values are secret.
    static initStaging = () => {
        EnvironmentHelper.AccessManagementApiUrl = "https://vfj29fb54h.execute-api.us-east-2.amazonaws.com/Staging";
        EnvironmentHelper.StreamingLiveApiUrl = "https://ozok30w9g5.execute-api.us-east-2.amazonaws.com/Staging";
        EnvironmentHelper.ChatApiUrl = "wss://83yfhgzin0.execute-api.us-east-2.amazonaws.com/Staging";
        EnvironmentHelper.AdminUrl = "https://admin.staging.streaminglive.church";
        EnvironmentHelper.ContentRoot = "";
    }

    //NOTE: None of these values are secret.
    static initProd = () => {
        console.log('init prod');
        EnvironmentHelper.AccessManagementApiUrl = "https://3dcjx8bln0.execute-api.us-east-2.amazonaws.com/Prod";
        EnvironmentHelper.StreamingLiveApiUrl = "https://u1xzhc2hy5.execute-api.us-east-2.amazonaws.com/Prod";
        EnvironmentHelper.ChatApiUrl = "wss://5y8rp319uf.execute-api.us-east-2.amazonaws.com/Prod";
        EnvironmentHelper.AdminUrl = "https://admin.streaminglive.church";
        EnvironmentHelper.ContentRoot = "";
    }

}

