import "dotenv/config";
import puppeteer from "puppeteer";

import { sendEmail } from "./sendEmail.js";

const url = "https://rezerwacja.zuw.szczecin.pl/";
const timeToWaitInMilliseconds = 1200000;

async function findButtonWithText(page) {
  const buttons = await page.$$(".operation-button");

  for (const button of buttons) {
    const buttonText = await button.evaluate((node) => node.textContent);
    if (buttonText.includes("TC-Składanie wniosków na pobyt czasowy")) {
      return button;
    }
  }

  return null;
}

async function fetching() {
  console.log(`Starting sending the requests to check available dates...`);
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  // need this to handle requests
  page.on("request", (req) => {
    req.continue();
  });

  await page.goto(`${url}`);
  await page.waitForSelector(".operation-button");

  // find the button that needs to be clicked
  const theButton = await findButtonWithText(page);

  if (theButton) {
    await theButton.click();

    const response = await page.waitForResponse((response) => {
      return response.url().includes("GetAvailableDaysForOperation");
    });

    // Get the response body as a json object
    const responseBody = await response.json();

    // sending an email if there's available time
    if (responseBody.availableDays.length > 0) {
      await sendEmail();
    }
  } else {
    console.log("Button not found");
  }

  await browser.close();
}

fetching();

// the interval of invoking the func is 20mins
setInterval(fetching, timeToWaitInMilliseconds);
