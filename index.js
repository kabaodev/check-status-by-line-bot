const express = require("express");
const app = express();
const line = require("@line/bot-sdk");
const axios = require("axios");

//----------- LINE CHAT BOT --------------------

const config = {
  channelAccessToken:
    "yrwhMNR5RehCcuna1TRzFxSMcqr5/yumfrWJzjKcRBHAdtqWv/o3cyG6ZcOuzAVjzeXTg0BfuYyAnAihY51HAqzgSprxbXxB6hNYKVlGezafURiGdt4DZ8FW9QR5NB+TupkOxsAMIOITQnX5kzQipAdB04t89/1O/w1cDnyilFU=",
  channelSecret: "8fc9b0f173945a4490c47666e80bc930",
};

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  axios
    .get("https://hellokabao.com/dudeeAPI/machine_monitor", {
      headers: {
        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      },
    })
    .then((resp) => {
      var result = "";
      resp.data.map((res, i) => {
        var str = res.machine_name + " -> Status : " + res.machine_status;
        result += str;
      });
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: result,
      });
    });
}

const port = process.env.PORT || 4000;
app.listen(port);
