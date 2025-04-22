export const getWeatherDetails = (city: string) => {
  console.log("Function call: ", city);
  if (city === "patiala") {
    return "10°C";
  } else if (city === "mohali") {
    return "14°C";
  } else if (city === "mumbai") {
    return "12°C";
  } else if (city === "okra") {
    return "15°C";
  } else if (city === "kollam") {
    return "16°C";
  } else if (city === "delhi") {
    return "18°C";
  }
};
