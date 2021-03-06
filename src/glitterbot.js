const axios = require("axios");
const schedule = require("node-schedule");
const program = require("commander");

// Define command line options and documentation.
program
  .option(
    "-w, --webhook <url>",
    "\x1b[1mRequired: The incoming webhook for your Slack team\x1b[0m",
    process.env.SLACK_WEBHOOK_URL
  )
  .option("-i, --instant", "Run bot once without starting cronjob")
  .option(
    "-c, --cron [cron]",
    "CRON string used for scheduling messages",
    "00 17 * * 1-5"
  )
  .option(
    "-s, --source [url]",
    "The path where `public/*` is hosted",
    "http://glitterbot.s3.amazonaws.com"
  )
  .option(
    "-l, --locale <locale>",
    "Locale to use for glitter selection"
  )
  .option(
    "-u, --url <url>",
    "URL to send"
  )
  .option("-d, --debug", "Log complete axios error messages")
  .parse(process.argv);

// If users didn't provide a Slack webhook URL, close the bot.
if (!program.webhook) {
  console.log("Please provide a Slack webhook URL");
  program.help();
}

// If there is no instant flag, start a cronjob and send a message
// so the user knows it's running.
if (!program.instant) {
  console.log("Glitterbot is running");
  schedule.scheduleJob(program.cron, sendGlitter);
} else {
  sendGlitter();
}

// Returns a random number between 0 and 1
function artificialIntelligence() {
  return Math.random();
}

// Choose if a generic image or a day specific image should be sent.
// There's a 25% chance a generic image gets chosen.
function blockChain() {
  if (artificialIntelligence() > 0.75) {
    return "generic";
  } else {
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return days[new Date().getDay()];
  }
}

// Fetch the list of all images, and then select a
// random image of the previously chosen image type.
function machineLearning(folder, data) {
  const images = data[folder];
  const image = images[Math.floor(artificialIntelligence() * images.length)];
  return `${program.source}/${program.locale}/${folder}/${image}`;
}

function naturalLanguageProcessing() {
  const languages = ["en", "nl"];
  return languages[Math.floor(artificialIntelligence() * languages.length)];
}

async function sendGlitter() {
  try {
    // Using NLP, select the correct locale.
    if (program.locale == undefined) {
      program.locale = naturalLanguageProcessing();
    }

    // Select a folder with images from the blockchain
    // using artificial intelligence.
    const folder = blockChain();

    let url = program.url;
    if (url === undefined) {
      // Using machine learning, get the url for a specific glitterplaatje.
      const { data } = await axios.get(`${program.source}/${program.locale}/images.json`);
      url = machineLearning(folder, data);
    }

    // Sent image url to Slack
    postMessage(url);
  } catch (error) {
    if (program.debug) console.log(error);
    console.log(`Error requesting images.json from ${program.source}`);
  }
}

// Posts a Slack message to the webhook as Glitterbot.
async function postMessage(text) {
  try {
    await axios.post(program.webhook, {
      icon_emoji: ":sparkles:",
      username: "Glitterbot",
      text
    });
    console.log("Sent message: " + text);
  } catch (error) {
    if (program.debug) console.log(error);
    console.log("Error sending message to Slack webhook");
  }
}
