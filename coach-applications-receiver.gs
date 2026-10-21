// Public, text-only application receiver. Deploy only after reviewing the privacy
// and abuse limitations; anyone who knows the web-app URL can submit to it.
const SHEET_NAME = 'Coach Applications';
const HEADERS = ['Application Reference', 'Submitted At', 'Status', 'Full Name', 'Email', 'Phone', 'Application Details'];

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 30000) throw new Error('Invalid request');
    const body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid request');
    if (body.website) return reply_({ok: false});
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.reference || '')) throw new Error('Invalid reference');
    const d = body.data;
    if (!d || typeof d !== 'object' || Array.isArray(d)) throw new Error('Invalid data');
    if (typeof d.name !== 'string' || !d.name.trim() || d.name.length > 200 || typeof d.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || typeof d.phone !== 'string' || !/^\+[1-9]\d{6,14}$/.test(d.phone.replace(/[\s()-]/g, ''))) throw new Error('Invalid contact');
    if (['accurate','terms','review','guidelines'].some(k => d[k] !== true)) throw new Error('Missing consent');
    if (!Array.isArray(body.certifications) || body.certifications.length > 20) throw new Error('Invalid certifications');
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      if (!sheet || HEADERS.some((h, i) => sheet.getRange(1, i + 1).getValue() !== h)) throw new Error('Sheet not configured');
      const count = sheet.getLastRow() - 1;
      if (count > 0 && sheet.getRange(2, 1, count, 1).getValues().some(row => row[0] === body.reference)) return reply_({ok:true, reference:body.reference, duplicate:true});
      const details = JSON.stringify({data:d, certifications:body.certifications});
      if (details.length > 25000) throw new Error('Application too long');
      sheet.appendRow([body.reference, new Date().toISOString(), 'Submitted', clean_(d.name), clean_(d.email), clean_(d.phone), clean_(details)]);
      return reply_({ok:true, reference:body.reference});
    } finally { lock.releaseLock(); }
  } catch (_) { return reply_({ok:false, error:'Unable to accept application'}); }
}

function clean_(value) {
  const text = String(value);
  return /^[\s]*[=+\-@]/.test(text) ? "'" + text : text;
}

function reply_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
