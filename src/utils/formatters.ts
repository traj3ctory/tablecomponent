import { FeatureEditionI, ScreenshotI } from "../types";

/**
 * @function formattedDate
 * @description Formats the date to a more readable format
 */
export const formattedEditions = (editions: { items: FeatureEditionI[] }) => {
  return editions.items[0].edition.name;
};

/**
 * @function formattedDate
 * @description Formats the date to a more readable format
 */
export const formattedTimeOfCapture = (screenshot: {
  items: ScreenshotI[];
}) => {
  return screenshot?.items[0]?.timeOfCapture
    ? new Date(screenshot.items[0].timeOfCapture as string).toLocaleDateString()
    : "-";
};
