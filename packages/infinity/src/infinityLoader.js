/*
 infinityloader.js
 @author: ashinde@entrib.com
 Use this as API to interact with ShopWorx Infinity - Android App
*/

// APIs to interact with

// Set session id on login
export const onLogin = (sessionId) => {
  Infinity.onLogin(sessionId);
};

// Remove session id on logout
export const onLogout = () => {
  Infinity.onLogout();
};
