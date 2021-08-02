const WebhookQuery = require("./webhook.queries");
const axios = require("axios");
const config = require("config");

module.exports = {
  async onWebhookReceived(data) {
    switch (data.action) {
      case "liveStreamStarted":
        await WebhookQuery.onStreamStarted(data);
        sendStartData(data);
        return;

      case "liveStreamEnded":
        await WebhookQuery.onStreamEnded(data);
        sendEndData(data);
        return;
      case "vodReady":
        // data.url = `https://broadcast.fugu.chat:5443/WebRTCAppEE/streams/${data.vodName}.mp4`;
        data.url = `${config.get("urls.recording_url")}/streams/${
          data.vodName
        }.mp4`;
        sendRecordingData(data);
        await axios.delete(
          `${config.get("urls.broadcast_url")}/${config.get(
            "ant.rtc"
          )}/rest/v2/broadcasts/${data.id}`
        );
        return await WebhookQuery.onRecordingReady(data);
    }
  },
};

async function sendEndData(data) {
  const messages = await WebhookQuery.getSendingData(data);
  const [streamDetails] = await WebhookQuery.getStreamDetails(data);
  const [webhookURL] = await WebhookQuery.getProductWebhook(data);
  await axios.post(webhookURL.webhook_url, {
    type: "STREAM_ENDED",
    stream_details: { ...streamDetails },
    messages: [...messages],
  });
  return;
}

async function sendStartData(data) {
  const [streamDetails] = await WebhookQuery.getStreamDetails(data);
  const [webhookURL] = await WebhookQuery.getProductWebhook(data);
  console.log(webhookURL.webhook_url);
  console.log("STARTING STREAM DATA", streamDetails);
  await axios.post(webhookURL.webhook_url, {
    type: "STREAM_STARTED",
    stream_details: {
      stream_id: streamDetails.stream_id,
      stream_started_at: streamDetails.stream_started_at,
    },
  });
  return;
}

async function sendRecordingData(data) {
  const [webhookURl] = await WebhookQuery.getProductWebhook(data);
  await axios.post(webhookURl.webhook_url, {
    type: "RECORDING_READY",
    stream_details: { stream_id: data.id, recording_url: data.url },
  });
  return;
}
