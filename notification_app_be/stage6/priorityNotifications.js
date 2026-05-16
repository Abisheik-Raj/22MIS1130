const axios = require("axios");

require("dotenv").config({
  path: "../../.env",
});

const Log = require("../../logging_middleware");

const API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function fetchNotifications() {

  try {

    await Log(
      "backend",
      "info",
      "service",
      "Fetching notifications for priority inbox",
      process.env.ACCESS_TOKEN
    );

    const response = await axios.get(
      API_URL,
      {
        headers: {
          Authorization:
            `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    return response.data.notifications || [];

  } catch (error) {

    await Log(
      "backend",
      "error",
      "service",
      error.message,
      process.env.ACCESS_TOKEN
    );

    console.log(
      error.response?.data ||
      error.message
    );

    return [];
  }
}

function sortNotifications(notifications) {

  return notifications
    .sort((a, b) => {

      const priorityDiff =
        (priorityMap[b.Type] || 0) -
        (priorityMap[a.Type] || 0);

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return (
        new Date(b.Timestamp) -
        new Date(a.Timestamp)
      );
    })
    .slice(0, 10);
}

async function main() {

  const notifications =
    await fetchNotifications();

  const topNotifications =
    sortNotifications(notifications);

  await Log(
    "backend",
    "info",
    "service",
    "Generated top 10 priority notifications",
    process.env.ACCESS_TOKEN
  );

  console.log("\nTop Notifications:\n");

  topNotifications.forEach((item, index) => {

    console.log(
      `${index + 1}. ${item.Type} - ${item.Message}`
    );

  });
}

main();