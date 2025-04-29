import { URL_REGEX } from "@/constants/regex";
import { IErrorResponse } from "@/interfaces/error";
import { error } from "console";
import { NextResponse } from "next/server";
import puppeteer from 'puppeteer';
import * as yup from "yup";

const webpagePostBody = yup.object({
  url: yup.string().required().matches(URL_REGEX, "URL is not properly formatted."),
// eslint-disable-next-line @typescript-eslint/no-unused-vars
}).test(({url, ...rest}, ctx) => {
  if(JSON.stringify(rest) !== '{}') {
    return ctx.createError({ message: `Unexpected property: ${Object.keys(rest).join(',')}` });
  }
  else return true
});

export async function POST(request: Request) {
  let browser;
  try {
    const body = await request.json().catch(() => error("Invalid Request"))
    const parsedBody = await webpagePostBody.validate(body, {
      abortEarly: true,
    });
    const { url } = parsedBody;

    const token = process.env.BROWSERLESS_TOKEN;
    const launchArgs = JSON.stringify({
      args: [`--window-size=1920,1080`],
      headless: true,
      stealth: true,
      timeout: 30000
    });
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://production-sfo.browserless.io/?token=${token}&launch=${launchArgs}`,
    });
    // browser = await puppeteer.launch({headless:false, devtools: true});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0', timeout: 10000});
    
    await page.waitForFunction(imagesHaveLoaded, { timeout: 3000 });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
    });

    await browser.close();
    
    const headers = new Headers();
    headers.append('Content-Disposition', 'attachment; filename="document.pdf"');
    headers.append('Content-Type', 'application/pdf');
    return new NextResponse(pdfBuffer, { headers });

  } catch (error: unknown) {
    let errorResponse: IErrorResponse = error as IErrorResponse;
    
    if ((error as {errors: Array<string>}).errors || !errorResponse?.message) { // yup error
      errorResponse = {name: "ValidationError", message: `Validation error: ${(error as {errors: Array<string>}).errors}`}
    }
    
    return new NextResponse(JSON.stringify(errorResponse),{ status: 400 })
  } finally {
    if (browser) {
      browser.close();
    }
  }
}

const imagesHaveLoaded = () => {  
  window.scrollTo(0, document.body.scrollHeight);

  return Array.from(document.images).every((i) => {
    return i.complete || i.loading === 'lazy'
  });
}

