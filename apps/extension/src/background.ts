import browser from "webextension-polyfill";

console.log("Hello from the background!");

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'verifyAddress') {
    console.log("Message received with action verifyAddress.");

    // Call the async function and use the response
    getAddressStatus(message.data)
      .then((status) => {
        // Send the response back after the async function resolves
        sendResponse({
          status: 'completed',
          address: message.data,
          verificationStatus: status
        });
        console.log("Response sent successfully:", { status: 'completed', address: message.data, verificationStatus: status });
      })
      .catch((error) => {
        // Handle any errors in the async operation
        console.error("Error during address verification:", error);
        sendResponse({
          status: 'failed',
          error: error.message
        });
      });

    // Returning true here to tell Chrome that sendResponse will be called asynchronously
    return true;
  }
});

async function getAddressStatus(address: string) {
  const requestOptions = {
    method: "GET",
    
  };
  
  const res = await fetch(`https://greenpower.wayneies1206.workers.dev/addressStatus?index=${address}`, requestOptions)
  const _res = await res.json()
  console.log(_res)
  return _res
}