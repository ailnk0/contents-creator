import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

const TOTAL_SLIDES = 12;
const VIEWPORT = { width: 1920, height: 1080 };
const DEVICE_SCALE_FACTOR = 2; // 실제 캡처: 3840x2160

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  let browser = null;

  try {
    // Dynamic import puppeteer to avoid build issues
    const puppeteer = await import("puppeteer");

    browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ ...VIEWPORT, deviceScaleFactor: DEVICE_SCALE_FACTOR });

    // Get base URL from environment or use default
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const screenshots: Uint8Array[] = [];

    // Capture each slide as screenshot
    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      const url = `${baseUrl}/slides/pdf-ua/pages/${i}`;
      console.log(`Capturing slide ${i}: ${url}`);

      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

      // Wait for animations to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Hide UI elements for clean capture
      await page.evaluate(() => {
        const header = document.querySelector("header");
        const progressBar = document.querySelector('[class*="fixed"][class*="bottom-0"][class*="h-1"]');
        const keyboardHint = document.querySelector('[class*="fixed"][class*="bottom-4"]');
        const loadingOverlay = document.querySelector('[class*="fixed"][class*="inset-0"][class*="z-50"]');

        if (header) (header as HTMLElement).style.display = "none";
        if (progressBar) (progressBar as HTMLElement).style.display = "none";
        if (keyboardHint) (keyboardHint as HTMLElement).style.display = "none";
        if (loadingOverlay) (loadingOverlay as HTMLElement).style.display = "none";
      });

      // Take screenshot as JPEG
      const screenshot = await page.screenshot({
        type: "jpeg",
        quality: 90,
        fullPage: false,
      });

      screenshots.push(screenshot);
    }

    await browser.close();
    browser = null;

    // Create PDF from screenshots
    const pdfDoc = await PDFDocument.create();

    const scaledWidth = VIEWPORT.width * DEVICE_SCALE_FACTOR;
    const scaledHeight = VIEWPORT.height * DEVICE_SCALE_FACTOR;

    for (const screenshot of screenshots) {
      const jpgImage = await pdfDoc.embedJpg(screenshot);
      const page = pdfDoc.addPage([scaledWidth, scaledHeight]);
      page.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: scaledWidth,
        height: scaledHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="PDF-UA-Strategy.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF 생성 오류:", error);
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore close error
      }
    }

    return NextResponse.json(
      { error: "PDF 생성에 실패했습니다", details: String(error) },
      { status: 500 }
    );
  }
}
