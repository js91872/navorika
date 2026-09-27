export interface HtmlSample {
  id: string;
  name: string;
  description: string;
  html: string;
}

export const HTML_SAMPLES: HtmlSample[] = [
  {
    id: 'pricing-card',
    name: 'Pricing Card',
    description: 'Modern product subscription tier card with badge, price, feature checklist, and button.',
    html: `<div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 24px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); overflow: hidden; padding: 32px; box-sizing: border-box; color: #1e293b;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
    <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #eff6ff; color: #2563eb; padding: 4px 12px; border-radius: 9999px;">Professional Plan</span>
    <span style="font-size: 12px; color: #64748b; font-weight: 600;">Monthly Billing</span>
  </div>
  <h2 style="font-size: 28px; font-weight: 800; margin: 0 0 8px 0; color: #0f172a;">Developer Suite</h2>
  <p style="font-size: 14px; line-height: 1.5; color: #64748b; margin: 0 0 24px 0;">Everything engineering teams need to build, test, and render high-performance web applications.</p>
  <div style="display: flex; align-items: baseline; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;">
    <span style="font-size: 42px; font-weight: 900; color: #0f172a;">$49</span>
    <span style="font-size: 14px; color: #64748b; margin-left: 6px; font-weight: 500;">/ user / month</span>
  </div>
  <ul style="list-style: none; padding: 0; margin: 0 0 32px 0; display: flex; flex-direction: column; gap: 12px; font-size: 14px;">
    <li style="display: flex; align-items: center; gap: 10px;">
      <span style="color: #10b981; font-weight: 800;">✓</span> High-resolution canvas rendering
    </li>
    <li style="display: flex; align-items: center; gap: 10px;">
      <span style="color: #10b981; font-weight: 800;">✓</span> Unlimited client-side conversions
    </li>
    <li style="display: flex; align-items: center; gap: 10px;">
      <span style="color: #10b981; font-weight: 800;">✓</span> Custom viewport & scale controls
    </li>
    <li style="display: flex; align-items: center; gap: 10px;">
      <span style="color: #10b981; font-weight: 800;">✓</span> Zero cloud latency & local privacy
    </li>
  </ul>
  <button style="width: 100%; background: #2563eb; color: #ffffff; font-weight: 700; font-size: 15px; padding: 14px 24px; border: none; border-radius: 12px; cursor: pointer; text-align: center; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">Get Started Now</button>
</div>`,
  },
  {
    id: 'invoice-receipt',
    name: 'Invoice Receipt',
    description: 'Clean transaction receipt with order ID, customer details, line items, and totals.',
    html: `<div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 24px auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 36px; box-sizing: border-box; color: #0f172a;">
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px;">
    <div>
      <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 4px 0; color: #1e293b;">INVOICE</h1>
      <p style="font-size: 13px; color: #64748b; margin: 0;">#INV-2026-0891</p>
    </div>
    <div style="text-align: right;">
      <p style="font-size: 13px; font-weight: 700; margin: 0 0 2px 0;">Navorika Studio</p>
      <p style="font-size: 12px; color: #64748b; margin: 0;">Date: September 26, 2026</p>
    </div>
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
    <thead>
      <tr style="border-bottom: 1px solid #e2e8f0; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase;">
        <th style="padding: 8px 0; font-weight: 600;">Description</th>
        <th style="padding: 8px 12px; text-align: center; font-weight: 600;">Qty</th>
        <th style="padding: 8px 0; text-align: right; font-weight: 600;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 0; font-weight: 500;">Vector Asset Pack License</td>
        <td style="padding: 12px; text-align: center; color: #64748b;">1</td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600;">$120.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 0; font-weight: 500;">Template Customization Service</td>
        <td style="padding: 12px; text-align: center; color: #64748b;">3 hrs</td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600;">$225.00</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; font-weight: 500;">Deterministic Rendering Addon</td>
        <td style="padding: 12px; text-align: center; color: #64748b;">1</td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600;">$45.00</td>
      </tr>
    </tbody>
  </table>
  <div style="background: #f8fafc; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #64748b;">
      <span>Subtotal</span><span>$390.00</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #64748b;">
      <span>Tax (8%)</span><span>$31.20</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 8px;">
      <span>Total Paid</span><span style="color: #059669;">$421.20</span>
    </div>
  </div>
  <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">Thank you for your business! All assets processed locally.</p>
</div>`,
  },
  {
    id: 'feature-badge',
    name: 'Feature Badge',
    description: 'Gradient badge with metrics, status indicator, and icon highlights.',
    html: `<div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 24px auto; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); border: 1px solid #4338ca; border-radius: 20px; padding: 32px; box-sizing: border-box; color: #ffffff; box-shadow: 0 12px 30px rgba(49, 46, 129, 0.35);">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
    <span style="display: inline-block; width: 10px; height: 10px; background: #34d399; border-radius: 9999px; box-shadow: 0 0 8px #34d399;"></span>
    <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #a5b4fc;">Cluster Operational</span>
  </div>
  <h3 style="font-size: 26px; font-weight: 800; margin: 0 0 8px 0; color: #ffffff;">HTML Conversion Cluster</h3>
  <p style="font-size: 14px; color: #c7d2fe; margin: 0 0 24px 0; line-height: 1.5;">Browser-sandboxed deterministic rendering engine powering PNG, JPG, and raw markup export.</p>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <div style="background: rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.12);">
      <p style="font-size: 12px; color: #a5b4fc; margin: 0 0 4px 0; font-weight: 600;">Processing Privacy</p>
      <p style="font-size: 18px; font-weight: 800; margin: 0; color: #ffffff;">100% Local</p>
    </div>
    <div style="background: rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.12);">
      <p style="font-size: 12px; color: #a5b4fc; margin: 0 0 4px 0; font-weight: 600;">Resolution Scaler</p>
      <p style="font-size: 18px; font-weight: 800; margin: 0; color: #ffffff;">1× / 2× HiDPI</p>
    </div>
  </div>
</div>`,
  },
];
