import type { GuideContent } from './guideContent';

export const upiGuideContent: Record<string, GuideContent> = {
  'how-to-generate-upi-qr-code': {
    intro: "A UPI QR code lets someone pay a person or business by scanning a code in a compatible UPI app. For small shops, stalls, freelancers, tutors, and service providers, a printable payment poster can make checkout easier than reading out a UPI ID. This guide explains how to create a UPI QR code with or without a fixed amount, add a name or business logo, download a poster, test it before use, and avoid common payment scams. Navorika's [free UPI QR code generator](/tools/upi-qr-code-generator) builds the code in your browser. It does not register a bank account, confirm the recipient's identity, collect payments, or track transactions.",
    sections: [
      {
        title: 'What is a UPI QR code?',
        content: "UPI stands for Unified Payments Interface, India's payment system that allows participating banks and payment apps to route payments between accounts. A UPI payment QR usually contains a payment URI with a payee address (UPI ID), a payee name, and the INR currency. It can optionally include an amount and a note. The code is a way to present payment details; it is not a receipt or a guarantee that the receiving account is correct. A person scanning the QR should always verify the recipient shown in their payment app before authorizing payment.\n\nA **static QR code** usually points to one recipient and may leave the amount blank. A **fixed-amount QR code** includes a proposed amount, which some apps may display or handle differently. A payment gateway's dynamic QR may also contain an order reference, expiration, and transaction-specific backend tracking. Navorika creates a basic UPI payment URI; it does not provide gateway-generated dynamic payment requests."
      },
      {
        title: 'How to generate a UPI QR code for free',
        content: "1. Open the [UPI QR Code Generator](/tools/upi-qr-code-generator).\n2. Enter the **business or person name** you want printed on the poster. Use a name that your customers recognize.\n3. Enter your **UPI ID**, such as an address supplied by your bank or UPI app. A mobile number alone is not always a UPI ID; use the complete address that includes an @ handle.\n4. Optionally enter a linked mobile number to display as contact information. This number is not used to route payment in the generated code.\n5. Optionally enter an amount in Indian rupees and a short note, such as an invoice number. Leave the amount empty when customers should enter their own amount.\n6. Optionally upload a business logo or photograph. Choose one of five poster colors.\n7. Review the preview, then download the poster as PNG or PDF.\n8. Scan the downloaded code with a second device or a trusted UPI app. Confirm that the payee and amount are correct before printing copies.\n\nThe tool generates the QR and poster locally in your browser. It does not send the image or payment details to Navorika's servers."
      },
      {
        title: 'Create a UPI QR code with or without an amount',
        content: "For a market stall, donation counter, or a shop selling differently priced items, leave the amount blank. The payer can enter the correct total in their app. For a fixed-fee service, enter a value such as 250 or 250.00. The generator writes this as INR 250.00 into the payment URI.\n\n**Example:** A tutor collecting a ₹500 class fee enters a name, their UPI ID, and amount 500. The QR proposes ₹500 when scanned by a compatible app. The payer should still check the amount before approving payment.\n\nA payment note is useful for context, but do not depend on it as an accounting or settlement system. Apps may display, trim, or interpret optional fields differently. Always reconcile payments against your bank or UPI app transaction history."
      },
      {
        title: 'Add your logo or photo without making the QR difficult to scan',
        content: "A good poster clearly separates the business identity from the actual code. Navorika places the optional uploaded image **above** a large QR, rather than overprinting it in the center. This avoids obscuring the encoded squares. The poster order is name, optional photo/logo, large QR, UPI ID and payment details. If you do not upload an image, the image section disappears completely.\n\nFor best results, use a square PNG, JPEG, or WebP logo with enough contrast. Keep the printed QR black on white, avoid stretching the code, and do not crop the blank border around it. The five poster colors affect the design accents, not the QR's black-and-white scanning pattern. If a logo contains a phone number or other personal information, remember that the information will be visible on printed or shared posters."
      },
      {
        title: 'Download a printable UPI QR poster as PNG or PDF',
        content: "Use **PNG** when you want to share a poster in a chat, place it in a digital menu, or send it to a local print shop. PNG is a raster image, so printing much larger than its intended size can soften edges. Use **PDF** when you want a single-page document that is easier to print consistently. The PDF embeds the generated poster image, so it is not a fully editable vector layout.\n\nPrint a test copy and scan it from the distance your customers will use. Leave enough white space around the QR, avoid glossy reflections, and keep the code flat. A QR that scans on a screen may fail on a tiny sticker or poorly printed paper. Re-test after resizing or laminating."
      },
      {
        title: 'How to verify a UPI QR code before displaying it',
        content: "Use a trusted UPI app to scan the QR. Read the payee information shown by the app and compare it with the bank account or UPI ID you intended to receive money into. If you encoded a fixed amount, confirm the app shows the intended rupee value. If the app does not recognize the code, check the UPI ID format, scan contrast, print size, and whether the app supports the URI.\n\nFor a business, ask a trusted colleague to verify the poster on another phone. If possible, make a small test payment and confirm it appears as **received** in the correct bank or UPI app transaction history. A screenshot of a payment confirmation from a customer is not reliable proof of receipt."
      },
      {
        title: 'Common UPI QR problems and fixes',
        content: "**The QR will not scan:** Increase print size, clean the camera lens, remove glare, and preserve the white margin. Re-download the poster if the image has been compressed or stretched.\n\n**The recipient looks wrong:** Stop. Check the UPI ID in your bank or payment app, then regenerate the poster. Never assume the printed name guarantees the actual account.\n\n**The amount is missing or different:** Some apps interpret optional payment URI fields differently. Verify the payment screen manually before authorizing.\n\n**The photo is missing:** Select a supported PNG, JPEG, or WebP image under 5 MB. If no image is selected, the poster intentionally shows no photo area.\n\n**The QR opens an unsupported app or fails:** Try another compatible UPI app and verify that the UPI ID is active. Navorika cannot validate the account or resolve bank-side errors."
      },
      {
        title: 'UPI QR safety: receiving money versus sending money',
        content: "A QR code used to **receive** payment should not require the recipient to enter a UPI PIN to receive money. If someone asks you to scan a code and enter a PIN to collect a refund, prize, or payment, treat it as suspicious: authorizing with a PIN can initiate a debit. Do not share UPI PINs, OTPs, passwords, or screen-sharing access with strangers.\n\nIf you display a printed QR in a shop, periodically inspect it for stickers pasted over the original code. Fraudsters can replace a legitimate merchant's QR with one pointing to a different account. Recheck the recipient in the scanning app and monitor actual receipts. Report suspected fraud through your bank/payment provider and the appropriate official reporting channels.\n\nA UPI QR code is not a payment request that must be accepted blindly. The payer controls the final authorization in their app. The generator does not charge fees, collect bank credentials, or guarantee successful transfers."
      },
      {
        title: 'Who can use a printable UPI QR code?',
        content: "Small retailers can display a QR near the counter. Freelancers can put one on a printed invoice or payment reminder. Tutors can create a poster for a class fee. Event volunteers can share a code for a known recipient, while ensuring the payer verifies the destination. For large-scale commerce, refunds, automatic reconciliation, or per-order tracking, consider a supported bank or payment-provider merchant solution rather than a static QR poster.\n\nIf you change your UPI ID, bank account mapping, or business name, replace older posters and verify the new code. A stale poster may continue directing payments to an old address even when your business information changes."
      }
    ],
    faqs: [
      { question: 'Can I generate a UPI QR code without an amount?', answer: 'Yes. Leave the amount blank so the payer can enter the amount in their UPI app.' },
      { question: 'Can I add my shop name and logo?', answer: 'Yes. Enter a name and optionally upload a PNG, JPEG, or WebP image. Without an image, the poster has no empty image section.' },
      { question: 'Can I download a UPI QR code as PDF?', answer: 'Yes. The generator downloads a single-page PDF poster or a PNG image.' },
      { question: 'Does the QR code expire?', answer: 'The generator does not set an expiry. Whether the payment address remains usable depends on the UPI ID and provider; a payment-provider dynamic QR may have different rules.' },
      { question: 'Is the linked mobile number required?', answer: 'No. It is an optional label printed on the poster, not the UPI address encoded into the QR.' },
      { question: 'Does Navorika receive or verify payments?', answer: 'No. The tool only creates a QR and poster. Check actual payments in your bank or UPI app.' },
      { question: 'Do I need a UPI PIN to receive money?', answer: 'Receiving a payment does not require entering a UPI PIN. Never authorize a debit to claim money.' },
      { question: 'Can a fixed-amount QR be edited by the payer?', answer: 'App behavior varies. Always verify the amount shown in the UPI app before confirming payment.' }
    ],
    summary: "Create a UPI QR poster by entering your name and UPI ID, optionally setting an INR amount and note, choosing a color, and downloading PNG or PDF. Test the QR in a trusted UPI app before printing. Never enter a UPI PIN to receive money.",
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Generate a UPI QR Code for Free (With or Without Amount)',
      description: 'Create, customize, test, and print a UPI payment QR code safely.',
      author: { '@type': 'Organization', name: 'Navorika Team' },
      datePublished: '2026-11-08',
      dateModified: '2026-11-08'
    }
  }
};
