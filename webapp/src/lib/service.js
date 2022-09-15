export async function recordVideo() {
  const response = await fetch("http://buster2.local/record_video");
  console.log("record_video", { response });
  return response;
}

export async function isNewVideoReady() {
  const response = await fetch("http://buster2.local/is_new_video_ready");
  const json = await response.json();
  console.log("is_new_video_ready", { json });
  return json.data;
}

export async function saveNewVideo() {
  const response = await fetch("http://buster2.local/save_new_video");
  const json = await response.json();
  console.log("save_new_video", { json });
  return json;
}
