const API_KEY = "AIzaSyDR5k5m6y_cSEjbwIm4DGjQ_NNiFc2HxPw";
const VIDEO_ID = "REzmQGS1YXQ";
const POLL_INTERVAL = 1000; // প্রতি ১ সেকেন্ডে চেক করবে

let nextPageToken = "";

async function fetchChat() {
  const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${await getLiveChatId()}&part=snippet,authorDetails&pageToken=${nextPageToken}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.items) {
    data.items.forEach(item => {
      const name = item.authorDetails.displayName;
      typeWriter(name);
    });
  }

  nextPageToken = data.nextPageToken;
  setTimeout(fetchChat, POLL_INTERVAL);
}

async function getLiveChatId() {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${VIDEO_ID}&key=${API_KEY}`);
  const data = await res.json();
  return data.items[0].liveStreamingDetails.activeLiveChatId;
}

// টাইপিং ইফেক্ট
function typeWriter(text) {
  const element = document.getElementById("typed-text");
  let i = 0;
  element.innerHTML = "";

  const interval = setInterval(() => {
    element.innerHTML += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
    }
  }, 150);
}

fetchChat();