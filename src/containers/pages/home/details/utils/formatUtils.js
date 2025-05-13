export const convertTo12HourFormat = (time) => {
  const [hour, minute] = time.split(":");
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour >= 12 ? "PM" : "AM";
  return `${formattedHour}:${minute} ${period}`;
};

export const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const openURL = (url) => url && window.open(url, "_blank");
