// Function to fetch and replace all visible tweets on the page
function fetchAndReplaceTweets() {
  // Twitter uses the 'article' tag for each tweet container
  const tweets = document.querySelectorAll('article');
  tweets.forEach(async (tweet, index) => {
    // Fetch the tweet's text content
    const tweetTextElement = tweet.querySelector('div[lang]');
    // Replace the tweet's content
    if (tweetTextElement) {
      const content = tweetTextElement.textContent

      const ethereumAddressRegex = /0x[a-fA-F0-9]{40}/;
      const match = content.match(ethereumAddressRegex);
    
      if (match) {
        const ethereumAddress = match[0];
        if(ethereumAddress) {
          const res = await chrome.runtime.sendMessage({
            action: 'verifyAddress',
            data: ethereumAddress
          })
          console.log(res)
          if(res.verificationStatus.status != "notfound") {
            const good = Number(res.verificationStatus.Good)
            const bad = Number(res.verificationStatus.Bad)
            console.log(good, bad)
            if(good + bad < 100) {
              insertUncertainTagWithStyle(tweetTextElement)
            } else {
              if(good > bad) {
                insertGoodTagWithStyle(tweetTextElement)
              } else {
                insertSuspiciousTagWithStyle(tweetTextElement)
              }
            }
          } else {
            insertUncertainTagWithStyle(tweetTextElement)
          }
        }
      }
    }
  });
}

// Run the function once when the content script is loaded
fetchAndReplaceTweets();

// Set up a MutationObserver to watch for new tweets being added to the page dynamically
const observer = new MutationObserver(() => {
  fetchAndReplaceTweets();  // Fetch and replace tweets whenever new tweets are added
});

// Observe changes in the body or tweet container
observer.observe(document.body, { childList: true, subtree: true });

async function insertSuspiciousTagWithStyle(tweetTextElement) {

  const content = tweetTextElement.textContent

  const ethereumAddressRegex = /0x[a-fA-F0-9]{40}/;
  const match = content.match(ethereumAddressRegex);

  if (match) {
    const ethereumAddress = match[0];

    //const status = await getAddressStatus(ethereumAddress)
    // Modify the Ethereum address by adding '0x--' and insert "suspicious address!!" in bold and red color after the address
    const modifiedAddress = `<a href=https://izanami.pages.dev?address=${ethereumAddress} target="_blank" style="color: red;">${"0X" + ethereumAddress.slice(2)}</a>`
    const suspiciousTag = ' <strong style="color: red;">Suspicious Address!!</strong>';

    // Address found, insert "suspicious address!!" with red color and bold right after the Ethereum address
    const edited = content.replace(ethereumAddressRegex, modifiedAddress + suspiciousTag);
    tweetTextElement.innerHTML = edited
    return ethereumAddress
  }

  // No address found, return original content
  return
}

async function insertUncertainTagWithStyle(tweetTextElement) {

  const content = tweetTextElement.textContent

  const ethereumAddressRegex = /0x[a-fA-F0-9]{40}/;
  const match = content.match(ethereumAddressRegex);

  if (match) {
    const ethereumAddress = match[0];

    //const status = await getAddressStatus(ethereumAddress)
    // Modify the Ethereum address by adding '0x--' and insert "suspicious address!!" in bold and red color after the address
    const modifiedAddress = `<a href=https://izanami.pages.dev?address=${ethereumAddress} target="_blank" style="color: gray;">${"0X" + ethereumAddress.slice(2)}</a>`
    const suspiciousTag = ' <strong style="color: gray;">Uncertain Address?!</strong>';

    // Address found, insert "suspicious address!!" with red color and bold right after the Ethereum address
    const edited = content.replace(ethereumAddressRegex, modifiedAddress + suspiciousTag);
    tweetTextElement.innerHTML = edited
    return ethereumAddress
  }

  // No address found, return original content
  return
}

async function insertGoodTagWithStyle(tweetTextElement) {

  const content = tweetTextElement.textContent

  const ethereumAddressRegex = /0x[a-fA-F0-9]{40}/;
  const match = content.match(ethereumAddressRegex);

  if (match) {
    const ethereumAddress = match[0];

    //const status = await getAddressStatus(ethereumAddress)
    // Modify the Ethereum address by adding '0x--' and insert "suspicious address!!" in bold and red color after the address
    const modifiedAddress = `<a href=https://izanami.pages.dev?address=${ethereumAddress} target="_blank" style="color: green;">${"0X" + ethereumAddress.slice(2)}</a>`
    const suspiciousTag = ' <a style="color: green;">Reliable Address<img src="https://develop.gen3-ui-v1.pages.dev/icons/FireIcon.svg"/></a>';

    // Address found, insert "suspicious address!!" with red color and bold right after the Ethereum address
    const edited = content.replace(ethereumAddressRegex, modifiedAddress + suspiciousTag);
    tweetTextElement.innerHTML = edited
    return ethereumAddress
  }

  // No address found, return original content
  return
}