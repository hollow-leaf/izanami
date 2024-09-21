import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./pages/Popup";


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchedElements') {
    const contentDiv = document.getElementById('content');
    if(contentDiv) contentDiv.innerHTML = message.data.join('<br>');
    console.log(contentDiv)
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
});

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
