import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import MsgReaderModule from '@kenjiuno/msgreader';
const MsgReader = MsgReaderModule.default || MsgReaderModule;

// Runs inside the existing production smoke server and browser, including CI.
export async function checkEmailConverters(page, base) {
  let checks = 0;
  const blockedRequests = [];
  const trackRequest = request => { if (request.url().includes('tracker.invalid')) blockedRequests.push(request.url()); };
  page.on('request', trackRequest);
  const raw = Buffer.from('From: Alex <alex@example.com>\r\nTo: Jamie <jamie@example.com>\r\nSubject: =Review & notes\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary="parts"\r\n\r\n--parts\r\nContent-Type: text/html; charset=utf-8\r\n\r\n<p>Hello <b>Jamie</b></p><img src="https://tracker.invalid/pixel"><script>throw new Error("email script ran")</script>\r\n--parts\r\nContent-Type: application/octet-stream\r\nContent-Disposition: attachment; filename="report.bin"\r\nContent-Transfer-Encoding: base64\r\n\r\nAAECA/8=\r\n--parts--\r\n');
  async function getBytes(action) {
    const waiting = page.waitForEvent('download'); await action(); const download = await waiting;
    const stream = await download.createReadStream(); const chunks=[]; for await (const chunk of stream) chunks.push(chunk);
    return {name:download.suggestedFilename(),bytes:Buffer.concat(chunks)};
  }
  try {
    // The homepage has its own card renderer: exercise it, not only /tools.
    await page.goto(`${base}/`,{waitUntil:'networkidle'});
    await page.getByRole('searchbox',{name:'Search tools',exact:true}).fill('eml');
    const expectedIcons=[['pdf','📨'],['msg','📬'],['html','🌐'],['excel','📊'],['word','📝']];
    for(const [format,icon] of expectedIcons) {
      const card=page.locator(`a.group[href="/tools/eml-to-${format}"]`);
      await card.waitFor({state:'visible'});
      assert.equal(await card.locator('span[aria-hidden="true"]').textContent(),icon,`Homepage EML ${format} icon`);
      assert.equal(await card.locator('svg.lucide-arrow-left-right').count(),0);
      checks++;
    }
    for (const [format,label,extension] of [['pdf','PDF','pdf'],['msg','MSG','msg'],['html','HTML','html'],['excel','Excel','xlsx'],['word','Word','docx']]) {
      await page.setViewportSize({width:390,height:844});
      const response=await page.goto(`${base}/tools/eml-to-${format}`,{waitUntil:'networkidle'});assert.equal(response.status(),200);
      assert.equal(await page.locator('h1').textContent(),`Free EML to ${label} Converter Online`);
      const tool=page.locator(`section[aria-label="EML to ${label} converter"]`);
      await tool.getByLabel('Choose EML files').setInputFiles({name:'test.eml',mimeType:'message/rfc822',buffer:raw});
      await tool.getByRole('button',{name:'Convert & download',exact:false}).waitFor();
      await page.waitForFunction(()=>document.querySelector('section[aria-label^="EML to"] [role="status"]')?.textContent?.includes('ready'));
      const frame=page.frameLocator('iframe[title="Safe email preview"]');await frame.getByText('Hello Jamie',{exact:false}).waitFor();
      assert.equal(await frame.locator('script,img[src],form,a[href],style:not(head style)').count(),0);
      const result=await getBytes(()=>tool.getByRole('button',{name:'Convert & download',exact:false}).click());assert.ok(result.name.endsWith(`.${extension}`));
      if(format==='pdf')assert.ok((await PDFDocument.load(result.bytes)).getPageCount()>0);
      if(format==='msg'){const reader=new MsgReader(new Uint8Array(result.bytes).buffer);const email=reader.getFileData();assert.equal(email.subject,'=Review & notes');assert.equal(email.attachments.length,1);assert.deepEqual([...reader.getAttachment(email.attachments[0]).content],[0,1,2,3,255]);}
      if(format==='html'){const html=result.bytes.toString('utf8');assert.ok(!html.includes('tracker.invalid'));assert.match(html,/<b>Jamie<\/b>/);assert.match(html,/report.bin/);}
      if(format==='excel'||format==='word'){const zip=await JSZip.loadAsync(result.bytes);const xml=await zip.file(format==='excel'?'xl/worksheets/sheet1.xml':'word/document.xml').async('string');assert.match(xml,/Jamie/);assert.match(xml,/report.bin/);if(format==='excel'){assert.ok(!xml.includes('<f>'));assert.match(xml,/t="inlineStr"/);}}
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'No mobile horizontal overflow');
      await tool.getByRole('button',{name:'Clear files'}).click();assert.equal(await tool.locator('iframe').count(),0);
      await tool.getByRole('button',{name:'Try sample email'}).click();
      await page.waitForFunction(()=>document.querySelector('section[aria-label^="EML to"] [role="status"]')?.textContent?.includes('ready'));
      assert.match(await tool.locator('dl').textContent(),/Meeting notes/);
      const guide=await page.goto(`${base}/guides/how-to-convert-eml-to-${format}`,{waitUntil:'domcontentloaded'});assert.equal(guide.status(),200);assert.match(await page.locator('h1').textContent(),/How to Convert EML/);
      checks+=8;
    }
    // A pair of identical source names must become separate, numbered ZIP entries.
    await page.goto(`${base}/tools/eml-to-word`,{waitUntil:'networkidle'});
    await page.getByLabel('Choose EML files').setInputFiles([{name:'same.eml',mimeType:'message/rfc822',buffer:raw},{name:'same.eml',mimeType:'message/rfc822',buffer:raw}]);
    await page.waitForFunction(()=>document.querySelector('section[aria-label^="EML to"] [role="status"]')?.textContent?.includes('2 emails ready'));
    const batch=await getBytes(()=>page.getByRole('button',{name:'Convert & download ZIP'}).click());
    const zip=await JSZip.loadAsync(batch.bytes);assert.deepEqual(Object.keys(zip.files),['01-same.docx','02-same.docx']);
    // Exercise the canvas PDF branch for text outside the standard PDF font encoding.
    await page.goto(`${base}/tools/eml-to-pdf`,{waitUntil:'networkidle'});
    const international=Buffer.from('From: alex@example.com\r\nSubject: Unicode message\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nСервис — مرحبا — नमस्ते');
    await page.getByLabel('Choose EML files').setInputFiles({name:'unicode.eml',mimeType:'message/rfc822',buffer:international});
    await page.waitForFunction(()=>document.querySelector('section[aria-label^="EML to"] [role="status"]')?.textContent?.includes('ready'));
    const unicodePdf=await getBytes(()=>page.getByRole('button',{name:'Convert & download PDF'}).click());
    const doc=await PDFDocument.load(unicodePdf.bytes);assert.ok(doc.getPageCount()>0);assert.ok(unicodePdf.bytes.length>1000);
    assert.deepEqual(blockedRequests,[],'No email tracking URLs requested');checks+=3;
  } finally {page.off('request',trackRequest);}
  return checks;
}
