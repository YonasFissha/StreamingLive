# StreamingLive
A live stream wrapper with chat for churches.

Visit <a href="https://streaminglive.church/">https://streaminglive.church/</a> to learn more.

### Depends on
* [AccessManagementApi](https://github.com/LiveChurchSolutions/AccessManagement) - User authentication

### Components
* **StreamingLiveApi** - NodeJS API for accessing app data (api.streaminglive.church)
* **StreamingLiveChat** - NodeJS API for handling websocket chat connections (chat.streaminglive.church)

* **StreamingLiveAdmin** - ReactJS admin interface for configuring church services (admin.streaminglive.church)
* **StreamingLiveSub** - ReactJS public face website that end-users visit to chat (subdomain.streaminglive.church)
* **StreamingLiveWeb** - ReactJS brochure site (streaminglive.church)

### Dev Setup Instructions
* **StreamingLiveWeb and StreamingLiveAdmin** 
  * Copy dotenv.sample.txt file to .env
  * Run *npm install*
  * Run *npm start*.  
  *Note: You can keep the default values that point to the staging APIs.  To create a test account visit https://staging.streaminglive.church/*

* **StreamingLiveSub**
  * Copy dotenv.sample.txt file to .env
  * Run *npm install*
  * Run *npm start*.  
  *Note: You can keep the default values that point to the staging APIs.  To create a test account visit https://staging.streaminglive.church/ .  To determine which site to load the app looks at the left most subdomain (localhost when running locally).  In order for it to work, you'll either need a site registered as localhost.streaminglive.church or will need to set up a dns entry and a record that matches it*
  

* **StreamingLiveApi** - 
  * You will need a local MySql server to develop against.  Create a new database on it called "streamingLive".  
  * Next, copy dotenv.sample.txt to .env and edit it to point to your MySql server.  
  * Run "npm install" to download the dependencies
  * Run "npm run initdb" to create the needed tables in the streamingLive database.  
  * Run Finally run "npm run dev" to start the local server.


### Additional Info
* [FAQ](https://github.com/LiveChurchSolutions/StreamingLive/wiki/FAQ)
* [Technical Documentation](https://github.com/LiveChurchSolutions/StreamingLive/wiki/Technical-Documentation)
