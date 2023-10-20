import puppeteer from "puppeteer";

const url = "https://rezerwacja.zuw.szczecin.pl/";

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
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    // console.log("request:", req.url());
    req.continue();
  });

  // page.on("requestfinished", (req) => {
  //   console.log("finished:", req.url());
  //   console.log("finished req.response:", req.response);
  // });

  // page.on("response", (res) => {
  //   console.log("on response:", res.url());
  // });

  await page.goto(`${url}`);
  await page.waitForSelector(".operation-button");

  const theButton = await findButtonWithText(page);

  if (theButton) {
    console.log("theButton:", theButton);
    await theButton.click();

    const response = await page.waitForResponse((response) => {
      if (response.url().includes("GetAvailableDaysForOperation")) {
        console.log("response from button click:", response.url());
      }
    });
  } else {
    console.log("Button not found");
  }

  await browser.close();
}

fetching();
