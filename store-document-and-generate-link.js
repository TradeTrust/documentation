/**
 * Generate a TradeTrust / TrustVC document actions link and attach qrCode.
 *
 * Modes:
 *   - "w3c" (default): public document URI, no encryption / no TradeTrust storage
 *   - "oa":   reserve encrypted slot via /queue, then optionally upload (OA docs)
 *
 * Usage:
 *   node store-document-and-generate-link.js
 *
 * Edit the CONFIG block below — no .env required.
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// CONFIG — edit these values in this file
// ---------------------------------------------------------------------------
const CONFIG = {
  // "w3c" | "oa"
  mode: "w3c",

  // Viewer redirect target baked into the actions payload
  redirectUrl: "https://dev.tradetrust.io",

  // Also print a direct viewer link: `${redirectUrl}/?q=...`
  printDirectViewerLink: true,

  // Chain id in the actions payload (required by tradetrust / trustvc viewers)
  chainId: "11155111",

  // --- W3C mode ---
  // Public HTTPS URL that returns raw signed W3C VC JSON (gist, S3, CDN, etc.)
  // No encryption key is used.
  publicDocumentUrl:
    "https://gist.githubusercontent.com/manishdex25/e4cc566e3e548e237512eef6bf68694c/raw/boe-dc-document.json",

  // Optional key only if your W3C host returns OA-encrypted ciphertext (rare)
  encryptionKey: null,

  // --- OA mode (encrypted TradeTrust storage) ---
  storageUrl: "https://tradetrust-functions.netlify.app/.netlify/functions/storage",
  apiKey: "TTfunctions2022!",
  uploadDocument: true,
  headers: {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    origin: "https://dev.tradetrust.io",
    pragma: "no-cache",
    priority: "u=1, i",
    referer: "https://dev.tradetrust.io/",
    "sec-ch-ua": '"Chromium";v="152", "Not?A_Brand";v="24", "Google Chrome";v="152"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
  },

  // Local document used to attach qrCode / write output
  documentPath: path.join(__dirname, "document.json"),
  attachQrCodeToDocument: true,
  writeUpdatedDocument: true,
  updatedDocumentPath: path.join(__dirname, "document.with-qr.json"),

  // Host used for the encoded QR / actions URL
  // Prefer actions.tradetrust.io; redirectUrl still decides where users land.
  actionsHost: "https://actions.tradetrust.io",
};
// ---------------------------------------------------------------------------

function buildActionsPayload({ uri, key, redirectUrl, chainId }) {
  const payload = {
    uri,
    redirect: redirectUrl,
    ...(chainId !== undefined && chainId !== null && chainId !== ""
      ? { chainId: typeof chainId === "number" ? chainId : Number(chainId) || String(chainId) }
      : {}),
  };

  if (key) {
    payload.key = key;
    payload.permittedActions = ["STORE"];
  } else {
    payload.permittedActions = ["VIEW"];
  }

  return {
    type: "DOCUMENT",
    payload,
  };
}

function encodeActionsLink(actionsHost, action) {
  return `${actionsHost}?q=${encodeURIComponent(JSON.stringify(action))}`;
}

function buildDirectViewerLink(redirectUrl, action) {
  const base = redirectUrl.replace(/\/$/, "");
  return `${base}/?q=${encodeURIComponent(JSON.stringify(action))}`;
}

function mergeCookies(existing, setCookieHeaders) {
  const jar = new Map();

  for (const part of (existing || "").split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    jar.set(trimmed.slice(0, eq), trimmed.slice(eq + 1));
  }

  for (const header of setCookieHeaders || []) {
    const first = header.split(";")[0];
    const eq = first.indexOf("=");
    if (eq === -1) continue;
    jar.set(first.slice(0, eq).trim(), first.slice(eq + 1).trim());
  }

  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

function getSetCookieHeaders(response) {
  if (typeof response.headers.getSetCookie === "function") {
    return response.headers.getSetCookie();
  }
  const single = response.headers.get("set-cookie");
  return single ? [single] : [];
}

async function requestJson(url, { method = "GET", headers = {}, body, cookie } = {}) {
  const finalHeaders = { ...headers };
  if (cookie) finalHeaders.Cookie = cookie;

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch {
    json = undefined;
  }

  if (!response.ok) {
    const err = new Error(`HTTP ${response.status} ${response.statusText} for ${method} ${url}`);
    err.status = response.status;
    err.body = text;
    throw err;
  }

  return {
    json,
    cookie: mergeCookies(cookie, getSetCookieHeaders(response)),
    response,
  };
}

function attachAndWriteDocument(actionsLink) {
  const { documentPath, attachQrCodeToDocument, writeUpdatedDocument, updatedDocumentPath } = CONFIG;

  if (!fs.existsSync(documentPath)) {
    console.log(`\nLocal document not found at ${documentPath} — skipping qrCode attach.`);
    return null;
  }

  const document = JSON.parse(fs.readFileSync(documentPath, "utf8"));

  if (attachQrCodeToDocument) {
    document.qrCode = {
      type: "TrustVCQRCode",
      uri: actionsLink,
    };
    console.log("\nAttached qrCode to document in memory.");
  }

  if (writeUpdatedDocument) {
    fs.writeFileSync(updatedDocumentPath, JSON.stringify(document, null, 2));
    console.log(`Wrote updated document → ${updatedDocumentPath}`);
    return updatedDocumentPath;
  }

  return null;
}

async function runW3cMode() {
  const {
    publicDocumentUrl,
    encryptionKey,
    redirectUrl,
    chainId,
    actionsHost,
    printDirectViewerLink,
  } = CONFIG;

  if (!publicDocumentUrl) {
    throw new Error('CONFIG.publicDocumentUrl is required in mode "w3c".');
  }

  console.log('Mode: w3c (public URI, no TradeTrust encrypted storage)\n');
  console.log("1) Using public document URI:");
  console.log(`   ${publicDocumentUrl}`);

  const action = buildActionsPayload({
    uri: publicDocumentUrl,
    key: encryptionKey || undefined,
    redirectUrl,
    chainId,
  });

  const actionsLink = encodeActionsLink(actionsHost, action);
  const directViewerLink = buildDirectViewerLink(redirectUrl, action);

  console.log("\n2) Generated actions / QR link:");
  console.log(`   ${actionsLink}`);

  if (printDirectViewerLink) {
    console.log("\n3) Direct viewer link:");
    console.log(`   ${directViewerLink}`);
  }

  const updatedDocumentPath = attachAndWriteDocument(actionsLink);

  console.log("\nDone.");
  console.log(
    JSON.stringify(
      {
        mode: "w3c",
        documentUri: publicDocumentUrl,
        actionsLink,
        directViewerLink: printDirectViewerLink ? directViewerLink : null,
        redirectUrl,
        chainId,
        updatedDocumentPath,
      },
      null,
      2
    )
  );
}

async function runOaMode() {
  const {
    storageUrl,
    apiKey,
    redirectUrl,
    chainId,
    headers,
    uploadDocument,
    actionsHost,
    printDirectViewerLink,
  } = CONFIG;

  if (!apiKey) {
    throw new Error("CONFIG.apiKey is empty — set it in this file for OA mode.");
  }

  console.log("Mode: oa (encrypted TradeTrust storage — OA documents)\n");

  const commonHeaders = {
    ...headers,
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  };

  console.log("1) Reserving storage slot via GET /queue ...");
  const queue = await requestJson(`${storageUrl}/queue`, {
    method: "GET",
    headers: commonHeaders,
  });

  const id = queue.json?.id;
  const key = queue.json?.key;
  if (!id || !key) {
    throw new Error(`Unexpected /queue response: ${JSON.stringify(queue.json)}`);
  }

  console.log(`   id  = ${id}`);
  console.log(`   key = ${key}`);

  const storageUri = `${storageUrl}/${id}`;
  const action = buildActionsPayload({
    uri: storageUri,
    key,
    redirectUrl,
    chainId,
  });

  const actionsLink = encodeActionsLink(actionsHost, action);
  const directViewerLink = buildDirectViewerLink(redirectUrl, action);

  console.log("\n2) Generated actions / QR link:");
  console.log(`   ${actionsLink}`);

  if (printDirectViewerLink) {
    console.log("\n3) Direct viewer link:");
    console.log(`   ${directViewerLink}`);
  }

  const updatedPath = attachAndWriteDocument(actionsLink);

  let document = null;
  if (fs.existsSync(CONFIG.documentPath)) {
    document = JSON.parse(fs.readFileSync(CONFIG.documentPath, "utf8"));
    if (CONFIG.attachQrCodeToDocument) {
      document.qrCode = { type: "TrustVCQRCode", uri: actionsLink };
    }
  }

  if (!uploadDocument) {
    console.log("\nUpload skipped (CONFIG.uploadDocument = false). Done.");
    console.log(
      JSON.stringify(
        {
          mode: "oa",
          id,
          key,
          storageUri,
          actionsLink,
          directViewerLink: printDirectViewerLink ? directViewerLink : null,
          updatedDocumentPath: updatedPath,
        },
        null,
        2
      )
    );
    return;
  }

  if (!document) {
    throw new Error(`Cannot upload — document not found at ${CONFIG.documentPath}`);
  }

  console.log("\n4) Fetching CSRF token ...");
  const csrf = await requestJson(`${storageUrl}/csrf-token`, {
    method: "GET",
    headers: commonHeaders,
    cookie: queue.cookie,
  });

  const csrfToken = csrf.json?.csrfToken;
  if (!csrfToken) {
    throw new Error(`Unexpected /csrf-token response: ${JSON.stringify(csrf.json)}`);
  }
  console.log(`   csrfToken = ${csrfToken}`);

  console.log(`\n5) Uploading document to POST /${id} ...`);
  const upload = await requestJson(`${storageUrl}/${id}`, {
    method: "POST",
    headers: {
      ...commonHeaders,
      "X-CSRF-Token": csrfToken,
    },
    cookie: csrf.cookie,
    body: { document },
  });

  console.log("   Upload OK.");
  if (upload.json) {
    console.log(`   Response: ${JSON.stringify(upload.json)}`);
  }

  console.log("\nDone.");
  console.log(
    JSON.stringify(
      {
        mode: "oa",
        id,
        key,
        storageUri,
        actionsLink,
        directViewerLink: printDirectViewerLink ? directViewerLink : null,
        redirectUrl,
        updatedDocumentPath: updatedPath,
      },
      null,
      2
    )
  );
}

async function main() {
  if (CONFIG.mode === "w3c") {
    await runW3cMode();
  } else if (CONFIG.mode === "oa") {
    await runOaMode();
  } else {
    throw new Error(`Unknown CONFIG.mode "${CONFIG.mode}". Use "w3c" or "oa".`);
  }
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  if (err.body) console.error(err.body);
  process.exit(1);
});
