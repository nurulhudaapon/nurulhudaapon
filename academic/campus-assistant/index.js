const puppeteer = require("puppeteer"); // v20.7.4 or later

let isSuccessful = false;
const timeout = 5000;
const GLOBAL = {
  STUDENT_ID: "",
  PORTAL_PASS: "",
}

(async () => {
  const browser = await puppeteer.launch({
    // launch with UI
    // headless: 'new',
    dumpio: true,
  });

  const page = await browser.newPage();
  //   page.on('console', msg => {
  //     for (let i = 0; i < msg.args.length; ++i)
  //       console.log(`${i}: ${msg.args[i]}`);
  //   });

  page.setDefaultTimeout(timeout);

  await login(page);

  //   try taking section every 3 seconds
  setInterval(async () => {
    console.log("Trying to take section");
    if (isSuccessful) {
      console.log("Successfully registered");
      return;
    }
    await takeSection(page);
  }, 1500);

  //   await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function takeSection(page) {
  try {
    // execute api call from browser
    await page.evaluate(async () => {
      const PREFERRED_SECTION = "221_D5";
      const PREFERRED_COURSE_ID = "457";

      let url =
        "https://studentportal.green.edu.bd/api/CourseSectionInfo?acaCalId=71&programId=2&courseId=457&versionId=1";

      let options = {
        method: "POST",
      };

      const res = await fetch(url, options);
      const text = await res.text();
      // console.log(text);

      const json = JSON.parse(text);
      // return json;

      // console.log(json);
      const sectionObj = json.find((x) => x.sectionName === PREFERRED_SECTION);
      const sitRemaining = sectionObj.capacity - sectionObj.occupied;
      console.log(sitRemaining);

      //   log time

      const date = new Date();
      const time = date.toLocaleTimeString();
      console.log(time);
      if (sitRemaining != 0) {
        console.log("Seat available");
        const url = "https://studentportal.green.edu.bd/api/SectionTake";

        const params = new URLSearchParams();
        params.append("regWorkSheetId", "9055561");
        //   params.append("preSectionId", "12528");
        // params.append("preSectionId", "12506");

        params.append("newSectionId", String(sectionObj.acaCal_SectionID));
        params.append("sectionName", PREFERRED_SECTION); // D5

        params.append("studentId", "24132");
        params.append("courseCode", String(sectionObj.formalCode)); // CSE 221
        params.append("courseId", PREFERRED_COURSE_ID);

        params.append("versionId", "1");
        params.append("programId", "2");
        params.append(
          "url",
          "https://studentportal.green.edu.bd/Student/StudentSectionSelection"
        );

        const urlWithParams = url + "?" + params.toString();
        const res = await fetch(urlWithParams, {
          method: "POST",
        });

        const text = await res.text();
        console.log(text);

        if (text == "1") {
          console.log("Successfully registered");
          // isSuccessful = true;
        }

        // Now call the api to register to that section
      } else {
        console.log("Seat not available");
      }
    });
  } catch (error) {
    await login(page);
  }
}

async function login(page) {
  console.log("Trying to login");

  try {
    {
      const targetPage = page;
      await targetPage.setViewport({
        width: 861,
        height: 888,
      });
    }

    {
      const targetPage = page;
      const promises = [];
      const startWaitingForEvents = () => {
        promises.push(targetPage.waitForNavigation());
      };

      startWaitingForEvents();
      await targetPage.goto("https://studentportal.green.edu.bd/Account/Login");
      await Promise.all(promises);
    }
    {
      const targetPage = page;
      await puppeteer.Locator.race([
        targetPage.locator("::-p-aria(Enter Login Id..)"),
        targetPage.locator("#Input_LoginId"),
        targetPage.locator('::-p-xpath(//*[@id=\\"Input_LoginId\\"])'),
        targetPage.locator(":scope >>> #Input_LoginId"),
      ])
        .setTimeout(timeout)
        .click({
          offset: {
            x: 215.46023559570312,
            y: 15.808258056640625,
          },
        });
    }
    {
      const targetPage = page;
      await puppeteer.Locator.race([
        targetPage.locator("::-p-aria(Enter Login Id..)"),
        targetPage.locator("#Input_LoginId"),
        targetPage.locator('::-p-xpath(//*[@id=\\"Input_LoginId\\"])'),
        targetPage.locator(":scope >>> #Input_LoginId"),
      ])
        .setTimeout(timeout)
        .fill(GLOBAL.STUDENT_ID);
    }
    {
      const targetPage = page;
      await puppeteer.Locator.race([
        targetPage.locator("::-p-aria(Enter Password..)"),
        targetPage.locator("#Input_Password"),
        targetPage.locator('::-p-xpath(//*[@id=\\"Input_Password\\"])'),
        targetPage.locator(":scope >>> #Input_Password"),
      ])
        .setTimeout(timeout)
        .fill(GLOBAL.PORTAL_PASS);
    }
    {
      const targetPage = page;
      const promises = [];
      const startWaitingForEvents = () => {
        promises.push(targetPage.waitForNavigation());
      };
      await puppeteer.Locator.race([
        targetPage.locator("::-p-aria(LOG IN)"),
        targetPage.locator("button"),
        targetPage.locator('::-p-xpath(//*[@id=\\"account\\"]/div[4]/button)'),
        targetPage.locator(":scope >>> button"),
        targetPage.locator("::-p-text(LOG IN)"),
      ])
        .setTimeout(timeout)
        .on("action", () => startWaitingForEvents())
        .click({
          offset: {
            x: 370.4602355957031,
            y: 24.015625,
          },
        });
      await Promise.all(promises);
    }
  } catch (error) {
    console.log("Login error", error);
  }
}
