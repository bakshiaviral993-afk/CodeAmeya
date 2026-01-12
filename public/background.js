// This is a placeholder for the background script.
// You can add logic for handling messages, alarms, etc.

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SIGN_IN') {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      // You can now use this token to authenticate with your backend or Firebase
      console.log('OAuth token:', token);
    });
  }
});
