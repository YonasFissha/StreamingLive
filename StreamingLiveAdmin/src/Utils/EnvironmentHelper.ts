import React from 'react'

export class EnvironmentHelper {
    static AccessManagementApiUrl = "";
    static StreamingLiveApiUrl = "";
    static WebUrl = "";
    static SubUrl = "";
    static ContentRoot = "";

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
        EnvironmentHelper.WebUrl = process.env.REACT_APP_WEB_URL || "";
        EnvironmentHelper.ContentRoot = process.env.REACT_APP_CONTENT_ROOT || "";
        EnvironmentHelper.SubUrl = process.env.REACT_APP_SUB_URL || "";
    }

    //NOTE: None of these values are secret.
    static initStaging = () => {
        EnvironmentHelper.AccessManagementApiUrl = "https://vfj29fb54h.execute-api.us-east-2.amazonaws.com/Staging";
        EnvironmentHelper.StreamingLiveApiUrl = "https://ozok30w9g5.execute-api.us-east-2.amazonaws.com/Staging";
        EnvironmentHelper.WebUrl = "https://staging.streaminglive.church";
        EnvironmentHelper.ContentRoot = "https://data.staging.streaminglive.church/data/";
        EnvironmentHelper.SubUrl = "https://{key}.staging.streaminglive.church";
    }

    //NOTE: None of these values are secret.
    static initProd = () => {
        EnvironmentHelper.AccessManagementApiUrl = "https://3dcjx8bln0.execute-api.us-east-2.amazonaws.com/Prod";
        EnvironmentHelper.StreamingLiveApiUrl = "https://u1xzhc2hy5.execute-api.us-east-2.amazonaws.com/Prod";
        EnvironmentHelper.WebUrl = "https://streaminglive.church";
        EnvironmentHelper.ContentRoot = "https://data.streaminglive.church/data/";
        EnvironmentHelper.SubUrl = "https://{key}.streaminglive.church";
    }

}

