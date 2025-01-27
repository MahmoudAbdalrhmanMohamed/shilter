// src/pusher.js
// import Pusher from "pusher-js";

// const pusher = new Pusher("03594b985c5c9701cb47", {
//   cluster: "eu",
//   encrypted: true,
// });

// export default pusher;
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "pusher",
  key: "03594b985c5c9701cb47",
  cluster: "eu",
  forceTLS: true,
});

var channel = window.Echo.channel("scraping.progress.admin.1");
channel.listen("progress.one", function (data) {
  console.log(JSON.stringify(data));
  console.log("mohamed ahmed");
});

// export default pusher;
