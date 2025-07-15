import { ImageURISource } from "react-native";

export function getImageUrl(image: string | null) {
  const baseUrl = "https://web-youwise-dev.loca.lt/covers";

  const img = {
    uri: `${baseUrl}/${image}`,
    headers: {
      "bypass-tunnel-reminder": "1234", // TODO: Should only be used in development
      Authorization: "Basic " + btoa("admin:WrZYIj6VvIZ2LQK"), // TODO: Replace with actual credentials
    },
  } as ImageURISource;

  console.log("Image URL:", img);

  return img;
}
