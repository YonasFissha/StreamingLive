import React from 'react';
import { ConfigHelper, ConfigurationInterface, ServiceInterface, Header, VideoContainer, InteractionContainer } from './components';
import { ServicesHelper, ChatHelper, ChatUserInterface, ChatStateInterface, TabInterface, ApiHelper, UserHelper, EnvironmentHelper } from './helpers';

export const Home: React.FC = () => {
  const [cssUrl, setCssUrl] = React.useState('about:blank');
  const [config, setConfig] = React.useState<ConfigurationInterface>({} as ConfigurationInterface);
  const [currentService, setCurrentService] = React.useState<ServiceInterface | null>(null);
  const [chatUser, setChatUser] = React.useState<ChatUserInterface>({ displayName: 'Anonymous', guid: '', isHost: false });
  const [chatState, setChatState] = React.useState<ChatStateInterface>();

  const loadConfig = React.useCallback((firstLoad: boolean) => {
    const keyName = window.location.hostname.split('.')[0];
    setCssUrl(EnvironmentHelper.ContentRoot + '/data/' + keyName + '/data.css?nocache=' + (new Date()).getTime());
    ConfigHelper.getQs('preview').then(v => {
      if (v === "1") setCssUrl(EnvironmentHelper.StreamingLiveApiUrl + '/preview/css/' + keyName);
    });

    ConfigHelper.load(keyName).then(data => {
      var d: ConfigurationInterface = data;
      checkHost(d);
      setConfig(d);
      if (firstLoad) initChat();
    });
  }, []);

  const checkHost = (d: ConfigurationInterface) => {
    if (UserHelper.isHost) {
      var tab: TabInterface = { type: "hostchat", text: "Host Chat", icon: "fas fa-users", data: "", url: "" }
      d.tabs.push(tab);
    }
  }

  const initChat = () => {
    setTimeout(function () {
      ChatHelper.init((state: ChatStateInterface) => { setChatState(state); setConfig(ConfigHelper.current); });
      setChatState(ChatHelper.state);
    }, 500);
  }

  const handleNameUpdate = (displayName: string) => {
    var u = { ...chatUser };
    u.displayName = displayName;
    setChatUser(u);
    ChatHelper.setName(displayName);
  }

  const handleLoginChange = () => {
    setChatUser(ChatHelper.user);
    loadConfig(false);
  }

  React.useEffect(() => {
    ChatHelper.socketConnected = false;

    const chatUser = ChatHelper.getUser();
    if (ApiHelper.jwt !== "") {
      chatUser.displayName = UserHelper.user?.displayName || "Anonymous";
      chatUser.isHost = true;
      ChatHelper.user = chatUser;
    }
    setChatUser(ChatHelper.user);
    ServicesHelper.initTimer((cs) => { setCurrentService(cs) });
    loadConfig(true)
    setCurrentService(ServicesHelper.currentService);
  }, [loadConfig, ApiHelper.jwt]);




  return (
    <>
      <link rel="stylesheet" href={cssUrl} />
      <div id="liveContainer">
        <Header homeUrl={config.logo?.url} logoUrl={config.logo?.image} buttons={config.buttons} user={chatUser} nameUpdateFunction={handleNameUpdate} loginChangeFunction={handleLoginChange} />
        <div id="body">
          <VideoContainer currentService={currentService} />
          <InteractionContainer tabs={config.tabs} chatState={chatState} />
        </div>
      </div>
    </>
  );
}
