import React from 'react';
import './App.css';
import { ConfigHelper, ConfigurationInterface, ServiceInterface, Header, VideoContainer, InteractionContainer } from './Components';
import { ServicesHelper, ChatHelper, UserInterface, ChatStateInterface, TabInterface } from './Helpers';

const App: React.FC = () => {
  const [cssUrl, setCssUrl] = React.useState('about:blank');
  const [config, setConfig] = React.useState<ConfigurationInterface>({} as ConfigurationInterface);
  const [currentService, setCurrentService] = React.useState<ServiceInterface | null>(null);
  const [user, setUser] = React.useState<UserInterface>({ displayName: 'Anonymous', guid: '', isHost: false });
  const [chatState, setChatState] = React.useState<ChatStateInterface>();

  const loadConfig = React.useCallback((firstLoad: boolean) => {
    const keyName = window.location.hostname.split('.')[0];
    var previewRoot = 'https://streaminglive.church';
    setCssUrl(previewRoot + '/data/' + keyName + '/data.css?nocache=' + (new Date()).getTime());
    ConfigHelper.load(keyName).then(data => {
      var d: ConfigurationInterface = data;
      checkHost(d);
      setConfig(d);
      if (firstLoad) initChat(keyName);
    });
  }, []);

  const checkHost = (d: ConfigurationInterface) => {
    if (user?.isHost) {
      var tab: TabInterface = { type: "hostchat", text: "Host Chat", icon: "fas fa-users", data: "", url: "" }
      d.tabs.push(tab);
    }
  }

  const initChat = (keyName: string) => {
    setTimeout(function () {
      ChatHelper.init(keyName, (state: ChatStateInterface) => { setChatState(state); setConfig(ConfigHelper.current); });
      setChatState(ChatHelper.state);
    }, 500);
  }

  const handleNameUpdate = (displayName: string) => {
    var u = { ...user };
    u.displayName = displayName;
    setUser(u);
    ChatHelper.setName(displayName);
  }

  const handleLoginChange = () => {
    setUser(ChatHelper.user);
    loadConfig(false);
  }

  React.useEffect(() => {
    setUser(ChatHelper.getUser());
    ServicesHelper.initTimer((cs) => { setCurrentService(cs) });
    loadConfig(true)
  }, [loadConfig]);



  return (
    <>
      <link rel="stylesheet" href={cssUrl} />
      <div id="liveContainer">
        <Header homeUrl={config.logo?.url} logoUrl={config.logo?.image} buttons={config.buttons} user={user} nameUpdateFunction={handleNameUpdate} loginChangeFunction={handleLoginChange} />
        <div id="body">
          <VideoContainer currentService={currentService} />
          <InteractionContainer tabs={config.tabs} chatState={chatState} />
        </div>
      </div>
    </>
  );
}
export default App;

