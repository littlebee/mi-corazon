export async function callEndpoint(url) {
  const response = await fetch(`${url}?_cb=${Date.now()}`);
  console.log(`called ${url}`, { response });
  const json = await response.json();
  return json;
}

export async function recordVideo() {
  return await callEndpoint("http://buster2.local/record_video");
}

export async function isNewVideoReady() {
  const json = await callEndpoint("http://buster2.local/is_new_video_ready");
  return json.data;
}

export async function saveNewVideo() {
  return await callEndpoint("http://buster2.local/save_new_video");
}

export async function startHeartbeat() {
  return await callEndpoint("http://buster2.local/start_heartbeat");
}

export async function brightWhite() {
  return await callEndpoint("http://buster2.local/bright_white");
}

export async function lightsOff() {
  return await callEndpoint("http://buster2.local/lights_off");
}
