/* eslint-disable */
/*
 dashboardLoader.js
 @author: kiran@entrib.com and gdgupte@entrib.com
 Use this as API to interact with ShopWorx Dashboard Loader - Android App
*/

// APIs to interact with

// Set Dashboards - saved in preferences
export const setDashboards = (url1, dur1, url2, dur2, url3, dur3) => {
  Dashboard.setDashboards(url1, dur1, url2, dur2, url3, dur3);
  Dashboard.goFullScreen();
};

export const setDashboardRestart = (restartAt, restartEvery) => {
  Dashboard.setDashboardRestart(restartAt, restartEvery);
};

export const clearDashboardRestart = () => {
  Dashboard.clearDashboardRestart();
};

export const getDashboardRestartAt = () => Dashboard.getDashboardRestartAt();

export const getDashboardRestartEvery = () => Dashboard.getDashboardRestartEvery();
export const getDashboards = () => Dashboard.getDashboards();
// Change Dashboard url - use this in case of single dashboard mode. Also restarts the dashboard
export const changeUrl = (url) => {
  Dashboard.changeUrl(url);
};

// Load default Welcome Page - also restarts the dashboard
export const loadWelcomePage = () => {
  Dashboard.loadWelcomePage();
};

// Load Dashboards and run
export const launchDashboards = () => {
  Dashboard.launchDashboards();
  Dashboard.goFullScreen();
};

// Go FullScreen - in case it is not in full screen mode
export const goFullScreenMode = () => {
  Dashboard.goFullScreen();
};
// Restart Dashboard App
export const restartDashboardApp = () => {
  Dashboard.restartDashboardApp();
};

export const playAlarm = () => {
  Dashboard.playAlarm();
};

export const stopAlarm = () => {
  Dashboard.stopAlarm();
};

export const updateApk = (url) => {
  Dashboard.updateApk(url);
};

export const getApkVersion = () => Dashboard.getVersion();

export const getServerAddress = () => Dashboard.getServerAddress();

export const getIdentifier = () => Dashboard.getIdentifier();

export const getPassword = () => Dashboard.getPassword();

export const login = (server, identifier, password) => {
  Dashboard.login(server, identifier, password);
};

export const setSessionId = (sessionId) => {
  Dashboard.setSessionId(sessionId);
};

export const getDeviceId = () => `${Dashboard.getDeviceId()}`;
// Keep Alive Timer

// setInterval(function() {
//    try {
//        Dashboard.keepAlive(true);
//    } catch(e) {
//            console.log("Not run through Dashboard loader app.")
//    }}, 4000); //send keep alive every 4 seconds - max. 30 seconds
