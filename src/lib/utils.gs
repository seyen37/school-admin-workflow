/**
 * utils.gs — 共用工具函式
 *
 * 提供：
 *   - 字串/檔名 sanitize
 *   - 日期解析與格式化
 *   - 表單回應解析與驗證
 *   - 試算表 header 對應與整列寫入
 *   - 流水號生成（人類友善的 ProjectCode）
 *   - dedupe 重複專案偵測
 *   - LockService 包裝
 *   - PropertiesService 讀寫
 */

// ====================================================================
// 字串與檔名
// ====================================================================

/**
 * 確保回傳 string，null/undefined 轉為空字串
 */
function safeString(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * 移除檔名中不被 Drive 接受的字元
 * Drive 對檔名其實很寬鬆，但為避免 URL 問題與視覺混亂，仍清掉常見特殊字元
 */
function sanitizeFileName(name) {
  return safeString(name)
    .replace(/[\\/:*?"<>|\r\n\t]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 200);
}

/**
 * 把承辦處室名稱轉成 ProjectCode 用的前綴
 * 例：教務處 → 教務、資訊組 → 資訊、學生輔導中心 → 學生輔導
 */
function normalizeOfficePrefix(office) {
  return safeString(office)
    .replace(/(處|組|室|科|隊|中心|館|站)$/, '')
    .substring(0, 4) || '未分類';
}

/**
 * 判斷字串是否表達肯定（用於表單的「是/否」題判斷）
 */
function isAffirmative(value) {
  const v = safeString(value).trim();
  return v === '是' || v === 'Yes' || v === 'yes' || v === 'true' || v === '1';
}

// ====================================================================
// 日期處理
// ====================================================================

/**
 * 解析日期字串為 Date 物件
 * 支援：yyyy-MM-dd、yyyy/MM/dd、MM/dd/yyyy、ISO 8601、Date 物件本身
 */
function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  const s = safeString(value).trim();
  if (!s) return null;

  // 直接讓 Date 解析（處理 ISO 與大多數常見格式）
  let d = new Date(s);
  if (!isNaN(d.getTime())) return d;

  // 處理 yyyy/MM/dd
  const m1 = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (m1) {
    d = new Date(parseInt(m1[1]), parseInt(m1[2]) - 1, parseInt(m1[3]));
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

/**
 * 格式化日期為 yyyy/MM/dd（給 Sheet 顯示用）
 */
function formatDateForSheet(date) {
  if (!date) return '';
  const d = (date instanceof Date) ? date : parseDate(date);
  if (!d) return '';
  return Utilities.formatDate(d, CONFIG.TIMEZONE, 'yyyy/MM/dd');
}

/**
 * 把日期往前推 N 天（N 可為負值往後）
 */
function offsetDate(value, days) {
  const d = parseDate(value);
  if (!d) return null;
  const result = new Date(d.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 取當前時間的字串，給檔名或紀錄編號用
 */
function nowStamp(format) {
  return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, format || 'yyyy/MM/dd HH:mm');
}

// ====================================================================
// 表單回應解析
// ====================================================================

/**
 * 把 Google Forms 觸發事件 e 解析成扁平物件
 * 多選欄位以「, 」串接成單一字串
 */
function parseFormResponse(e) {
  const data = {};
  if (!e || !e.namedValues) {
    throw new Error('沒有取得表單回應資料，請確認觸發器是「來自試算表 → 提交表單時」。');
  }
  Object.keys(e.namedValues).forEach(function (key) {
    const value = e.namedValues[key];
    data[key] = Array.isArray(value)
      ? value.join(', ').trim()
      : safeString(value).trim();
  });
  return data;
}

/**
 * 驗證必填欄位，缺一即拋出例外
 */
function validateRequiredFields(data, fields) {
  const missing = [];
  fields.forEach(function (f) {
    if (!safeString(data[f]).trim()) missing.push(f);
  });
  if (missing.length > 0) {
    throw new Error('缺少必填欄位：' + missing.join('、'));
  }
}

// ====================================================================
// 試算表通用工具
// ====================================================================

/**
 * 讀取試算表第一列作為 header 陣列
 */
function getHeaderRow(sheet) {
  if (sheet.getLastColumn() === 0) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

/**
 * 從 header 陣列建立 { 欄位名: 欄位索引(0-based) } 對應
 */
function buildHeaderMap(headers) {
  const map = {};
  headers.forEach(function (h, i) {
    map[safeString(h).trim()] = i;
  });
  return map;
}

/**
 * 用欄位名取列中的值
 */
function getValueByHeader(row, map, headerName) {
  const idx = map[headerName];
  if (idx === undefined) return '';
  return row[idx];
}

/**
 * 依 header 順序把物件值寫成一列附加到試算表
 */
function appendObjectRow(sheet, headers, dataObj) {
  const row = headers.map(function (h) {
    const key = safeString(h).trim();
    return dataObj[key] !== undefined ? dataObj[key] : '';
  });
  sheet.appendRow(row);
}

/**
 * 套用基本視覺格式（粗體標題、凍結首列、自動調整欄寬）
 */
function formatSheet(sheet, columnCount) {
  try {
    sheet.getRange(1, 1, 1, columnCount).setFontWeight('bold').setBackground('#f1f3f4');
    sheet.setFrozenRows(1);
    for (let c = 1; c <= columnCount; c++) {
      sheet.autoResizeColumn(c);
    }
  } catch (err) {
    // 格式化失敗不影響資料正確性
    Logger.log('formatSheet warning: ' + err.message);
  }
}

/**
 * 從 URL 解析出 Spreadsheet ID
 */
function getSpreadsheetIdFromUrl(url) {
  const s = safeString(url).trim();
  if (!s) return '';
  let m = s.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m && m[1]) return m[1];
  m = s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m && m[1]) return m[1];
  m = s.match(/^([a-zA-Z0-9_-]{20,})$/);
  if (m && m[1]) return m[1];
  return '';
}

// ====================================================================
// ProjectCode 流水號（人類友善：115-教務-001）
// ====================================================================

/**
 * 建立 dedupe key：(年度, 處室, 專案名稱) 完整三元組
 * 用於偵測重複送出表單建立的重複專案
 */
function buildDedupeKey(year, office, projectName) {
  return [
    safeString(year).trim(),
    safeString(office).trim(),
    safeString(projectName).trim()
  ].join('|');
}

/**
 * 在總控表中查詢是否已存在相同 dedupe key 的專案
 * 回傳 { projectCode, folderUrl, ... } 或 null
 */
function findExistingProjectByDedupeKey(year, office, projectName) {
  const ss = SpreadsheetApp.openById(getControlSheetIdSafely());
  const sheet = ss.getSheetByName('行政專案總控表');
  if (!sheet || sheet.getLastRow() < 2) return null;

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const map = buildHeaderMap(headers);

  const targetKey = buildDedupeKey(year, office, projectName);
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const k = buildDedupeKey(
      getValueByHeader(row, map, '年度'),
      getValueByHeader(row, map, '承辦處室'),
      getValueByHeader(row, map, '專案名稱')
    );
    if (k === targetKey) {
      return {
        rowIndex: i + 1,
        projectCode: getValueByHeader(row, map, '專案編號'),
        projectName: getValueByHeader(row, map, '專案名稱'),
        folderUrl: getValueByHeader(row, map, 'Drive資料夾連結'),
        owner: getValueByHeader(row, map, '承辦人'),
        ownerEmail: getValueByHeader(row, map, '承辦人Email')
      };
    }
  }
  return null;
}

/**
 * 生成人類友善的 ProjectCode：{年度}-{處室前綴}-{流水號:3碼}
 * 例：115-教務-001
 *
 * 流水號從總控表內計算「相同 (年度, 處室前綴)」的最大號 + 1
 *
 * ⚠️ 並行安全：本函式**不**自帶 lock，呼叫端負責 lock。
 *    這樣設計是因為呼叫端 onFormSubmit 已用 withLock 包了
 *    「dedupe + generateProjectCode」整個 critical section，
 *    若這裡再 withLock 會造成嵌套（雖然 GAS LockService 在同 context 通常可重入，
 *    但無文件保證，避免依賴未定義行為）。
 */
function generateProjectCode(year, office) {
  const yearStr = safeString(year).trim() || 'XXX';
  const officePrefix = normalizeOfficePrefix(office);

  const ss = SpreadsheetApp.openById(getControlSheetIdSafely());
  const sheet = ss.getSheetByName('行政專案總控表');
  if (!sheet || sheet.getLastRow() < 2) {
    return yearStr + '-' + officePrefix + '-001';
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const map = buildHeaderMap(headers);
  const targetPrefix = yearStr + '-' + officePrefix + '-';

  let maxSeq = 0;
  for (let i = 1; i < values.length; i++) {
    const code = safeString(getValueByHeader(values[i], map, '專案編號'));
    if (code.indexOf(targetPrefix) === 0) {
      const seq = parseInt(code.substring(targetPrefix.length), 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  }

  const next = maxSeq + 1;
  return targetPrefix + ('00' + next).slice(-3);
}

// ====================================================================
// LockService 包裝
// ====================================================================

/**
 * 取得 script lock 執行 fn，避免並行送出時的競態
 * 預設等鎖最多 10 秒
 */
function withLock(fn, waitMs) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(waitMs || 10000);
    return fn();
  } finally {
    try { lock.releaseLock(); } catch (e) { /* noop */ }
  }
}

// ====================================================================
// PropertiesService 包裝
// ====================================================================

function getProp(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function setProp(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, safeString(value));
}

function deleteProp(key) {
  PropertiesService.getScriptProperties().deleteProperty(key);
}

function getAllProps() {
  return PropertiesService.getScriptProperties().getProperties();
}

/**
 * 取得總控表 ID（先看 CONFIG，再看 PropertiesService）
 * 拋例外若兩處都沒有
 */
function getControlSheetIdSafely() {
  const id = safeString(CONFIG.CONTROL_SHEET_ID || getProp('CONTROL_SHEET_ID')).trim();
  if (!id) {
    throw new Error('找不到總控表 ID，請先執行 setupAdminWorkflow()');
  }
  return id;
}

// ====================================================================
// 日誌
// ====================================================================

/**
 * 統一日誌輸出（Logger 與 console 都寫，方便在 Executions 與 Stackdriver 都能看到）
 */
function log(message) {
  Logger.log(message);
  try { console.log(message); } catch (e) { /* noop */ }
}

function logError(message, error) {
  const text = message + (error ? ' | ' + error.message + '\n' + (error.stack || '') : '');
  Logger.log(text);
  try { console.error(text); } catch (e) { /* noop */ }
}
