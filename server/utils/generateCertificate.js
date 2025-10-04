import PDFDocument from "pdfkit";
import { v4 as uuidv4 } from "uuid";

export const generateCertificate = (user, course, res, creatorName) => {
  const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 50 });

  // --- Generate Unique ID (Shortened) ---
  const fullUuid = uuidv4();
  const certificateId = fullUuid.substring(0, 8).toUpperCase();

  // --- Response Headers ---
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${course.courseTitle}_Certificate.pdf`
  );

  doc.pipe(res);

  // --- Colors (Updated Palette with Muted Gold Accent) ---
  const darkTeal = "#004D40";     // Primary accent color (Dark Teal)
  const lightTeal = "#4DB6AC";    // Secondary accent color (Light Teal)
  const mutedGold = "#C1A36E";    // NEW ACCENT COLOR
  const black = "#000000";        // Used for main text, a darker contrast
  const grey = "#616161";         // Used for secondary text
  const pureWhite = "#FFFFFF";    // Background color
  const innerMargin = 40;

  // --- Background ---
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(pureWhite);

  // --- Borders (Light Teal Frame with Dark Teal Corner Accents) ---

  // 1. Outer Light Teal Frame
  doc.save()
    .lineWidth(6)
    .strokeColor(lightTeal)
    .rect(25, 25, doc.page.width - 50, doc.page.height - 50)
    .stroke()
    .restore();

  // 2. Dark Teal Corner Accents (Inside the main content area)
  const lineLength = 50;
  doc.save()
    .lineWidth(3)
    .strokeColor(darkTeal)
    .lineCap('square');

  // Top-Left Corner
  doc.moveTo(innerMargin, innerMargin + lineLength)
    .lineTo(innerMargin, innerMargin)
    .lineTo(innerMargin + lineLength, innerMargin)
    .stroke();

  // Top-Right Corner
  doc.moveTo(doc.page.width - innerMargin, innerMargin + lineLength)
    .lineTo(doc.page.width - innerMargin, innerMargin)
    .lineTo(doc.page.width - innerMargin - lineLength, innerMargin)
    .stroke();

  // Bottom-Left Corner
  doc.moveTo(innerMargin, doc.page.height - innerMargin - lineLength)
    .lineTo(innerMargin, doc.page.height - innerMargin)
    .lineTo(innerMargin + lineLength, doc.page.height - innerMargin)
    .stroke();

  // Bottom-Right Corner
  doc.moveTo(doc.page.width - innerMargin, doc.page.height - innerMargin - lineLength)
    .lineTo(doc.page.width - innerMargin, doc.page.height - innerMargin)
    .lineTo(doc.page.width - innerMargin - lineLength, doc.page.height - innerMargin)
    .stroke();

  doc.restore();
  // --- End of Borders ---

  // --- Title and Introduction ---

  // Set starting Y position for title
  doc.y = 85;

  doc
    .font("Times-Bold")
    .fontSize(30)
    .fillColor(mutedGold) // CHANGED: Title color is now Muted Gold
    .text("Certificate of Completion", { align: "center" });

  doc.moveDown(0.5)
    .font("Helvetica")
    .fontSize(14)
    .fillColor(grey)
    .text("This certificate is proudly presented to", { align: "center" });

  // --- Recipient Name ---
  doc.moveDown(0.8)
    .font("Courier-Bold")
    .fontSize(40)
    .fillColor(lightTeal)
    .text(user.name, { align: "center" });

  // Name underline
  const nameWidth = doc.widthOfString(user.name);
  const nameX = (doc.page.width - nameWidth) / 2;
  const nameY = doc.y + 3;
  doc.moveTo(nameX, nameY)
    .lineTo(nameX + nameWidth, nameY)
    .lineWidth(1.5)
    .strokeColor(mutedGold) // CHANGED: Underline color is now Muted Gold
    .stroke();

  // --- Course Info ---
  doc.moveDown(1.5)
    .font("Helvetica")
    .fontSize(14)
    .fillColor(grey)
    .text("For the successful completion of the course", { align: "center" });

  doc.moveDown(0.4)
    .font("Times-Bold")
    .fontSize(20)
    .fillColor(darkTeal)
    .text(course.courseTitle, { align: "center" });

  doc.moveDown(1.2)
    .font("Helvetica")
    .fontSize(12)
    .fillColor(grey)
    .text(
      "Presented in recognition of dedication and outstanding performance.",
      { align: "center" }
    );

  // --- Footer (Signature/Date/Logo) ---
  const footerY = doc.page.height - 120;
  const columnWidth = 220;

  // Left Column (Date)
  const leftX = doc.page.width / 4 - columnWidth / 2;
  const date = new Date().toLocaleDateString();

  doc.font("Helvetica")
    .fontSize(13)
    .fillColor(darkTeal)
    .text(date, leftX, footerY, { width: columnWidth, align: "center" });

  doc.moveTo(leftX, footerY + 20)
    .lineTo(leftX + columnWidth, footerY + 20)
    .lineWidth(1)
    .strokeColor(darkTeal)
    .stroke();

  doc.font("Helvetica")
    .fontSize(10)
    .fillColor(grey)
    .text("Completion Date", leftX, footerY + 25, {
      width: columnWidth,
      align: "center",
    });

  // Right Column (Signature)
  const rightX = (3 * doc.page.width) / 4 - columnWidth / 2;

  doc.font("Times-BoldItalic")
    .fontSize(18)
    .fillColor(darkTeal)
    .text(creatorName, rightX, footerY - 5, {
      width: columnWidth,
      align: "center"
    });

  doc.moveTo(rightX, footerY + 20)
    .lineTo(rightX + columnWidth, footerY + 20)
    .lineWidth(1)
    .strokeColor(darkTeal)
    .stroke();

  doc.font("Helvetica")
    .fontSize(10)
    .fillColor(grey)
    .text("Authorized Signature", rightX, footerY + 25, {
      width: columnWidth,
      align: "center",
    });

  // --- "LearnSphere" Text Logo (Middle of the Footer) ---
  const logoText = "LearnSphere";
  const logoFontSize = 20;
  const logoFont = "Times-Bold";
  const logoColor = darkTeal;

  doc.font(logoFont)
    .fontSize(logoFontSize)
    .fillColor(logoColor);

  const logoTextWidth = doc.widthOfString(logoText);
  const logoTextHeight = doc.currentLineHeight();

  const logoX = doc.page.width / 2 - logoTextWidth / 2;
  const logoY = footerY + 10 - (logoTextHeight / 2) - 5;

  doc.text(logoText, logoX, logoY);

  // --- Certificate ID Block (Bottom Left) ---
  const bottomY = doc.page.height - 60;
  doc.font("Helvetica")
    .fontSize(8)
    .fillColor(grey)
    .text(`Verification ID: ${certificateId}`,
      50,
      bottomY,
      {
        width: 200,
        align: "left"
      }
    );

  doc.end();
};