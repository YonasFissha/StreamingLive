import React, { useEffect } from 'react';
import './App.css';
import { ConfigHelper, ConfigurationInterface, ServiceInterface, Header, VideoContainer, InteractionContainer, Chat } from './Components';
import { ServicesHelper, ChatHelper, UserInterface, ChatStateInterface } from './Helpers';

const App: React.FC = () => {
  const [cssUrl, setCssUrl] = React.useState('about:blank');
  const [config, setConfig] = React.useState<ConfigurationInterface>({} as ConfigurationInterface);
  const [currentService, setCurrentService] = React.useState<ServiceInterface | null>(null);
  const [user, setUser] = React.useState<UserInterface>({ displayName: 'Anonymous', guid: '' });
  const [chatState, setChatState] = React.useState<ChatStateInterface>();

  const loadConfig = () => {
    const keyName = window.location.hostname.split('.')[0];
    var previewRoot = 'https://streaminglive.church';
    setCssUrl(previewRoot + '/data/' + keyName + '/data.css?nocache=' + (new Date()).getTime());
    ConfigHelper.load(keyName).then(data => {
      var d: ConfigurationInterface = data;
      setConfig(d);
      setTimeout(function () {
        ChatHelper.init(keyName, (state: ChatStateInterface) => { setChatState(state) });
        setChatState(ChatHelper.state);
      }, 500);
    });
    setUser(ChatHelper.getUser());
    ServicesHelper.initTimer((cs) => { setCurrentService(cs) });


  }


  const handleNameUpdate = (displayName: string) => {
    var u = { ...user };
    u.displayName = displayName;
    setUser(u);
    ChatHelper.setNameCookie(displayName);
  }

  React.useEffect(loadConfig, []);



  return (
    <>
      <link rel="stylesheet" href={cssUrl} />
      <div id="liveContainer">
        <Header homeUrl={config.logo?.url} logoUrl={config.logo?.image} buttons={config.buttons} />
        <div id="body">
          <VideoContainer currentService={currentService} />
          <InteractionContainer tabs={config.tabs} user={user} nameUpdateFunction={handleNameUpdate} chatState={chatState} />
        </div>
      </div>
    </>
  );
}
export default App;

