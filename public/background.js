import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

// TODO: replace placeholders with real project credentials
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

// It's recommended to connect to the emulator for local development
// import { connectFunctionsEmulator } from "firebase/functions";
// connectFunctionsEmulator(functions, "localhost", 5001);

const suggestFn = httpsCallable(functions, "suggestInRealTime");
const autoCorrectFn = httpsCallable(functions, "autoCorrectCode");
const generateFn = httpsCallable(functions, "generateCode");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SIGN_IN") {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(() => {
        sendResponse({ ok: true });
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
        sendResponse({ ok: false, error: error.message });
      });
    return true; // Indicates that the response is sent asynchronously
  }

  if (msg.type === "REALTIME_SUGGEST") {
    suggestFn({
      partial: msg.content,
      language: msg.language || "JavaScript"
    })
    .then(res => {
      sendResponse({ suggestion: res.data.suggestion });
    })
    .catch(e => {
      console.error("Realtime Suggestion Error:", e);
      sendResponse({ suggestion: "" });
    });
    return true; // Indicates that the response is sent asynchronously
  }

  if (msg.type === "AUTO_CORRECT") {
    autoCorrectFn({
      code: msg.code,
      language: msg.language
    })
    .then(res => {
        sendResponse({ corrected: res.data.correctedCode });
    })
    .catch(e => {
        console.error("Auto Correct Error:", e);
        sendResponse({ corrected: msg.code }); // Return original code on error
    });
    return true; // Indicates that the response is sent asynchronously
  }

  if (msg.type === "GENERATE_CODE") {
    generateFn({
      prompt: msg.prompt,
      language: msg.language
    })
    .then(res => {
      sendResponse({ generated: res.data.code });
    })
    .catch(e => {
        console.error("Generate Code Error:", e);
        sendResponse({ generated: `Error generating code: ${e.message}` });
    });
    return true; // Indicates that the response is sent asynchronously
  }

  // Handle cases where the message type is not recognized
  return false;
});
