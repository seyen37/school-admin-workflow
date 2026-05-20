/**
 * notifications.gs — Gmail 通知與錯誤 throttle
 *
 * 對原作的關鍵改進：錯誤 throttle，10 分鐘內相同錯誤不重複寄信
 * 使用 CacheService 實作（key 為錯誤訊息的 hash）
 */

// ====================================================================
// 一般通知
// ====================================================================

/**
 * 新專案建立完成通知
 */
function sendInternalNotification(payload) {
  const email = payload.data['承辦人Email'];
  if (!email) return;

  const subject = '【行政專案已建立】' + payload.data['專案名稱'];
  const body = [
    (payload.data['承辦人'] || '') + ' 您好：',
    '',
    '系統已建立行政專案工作資料夾。',
    '',
    '專案編號：' + payload.projectCode,
    '專案名稱：' + (payload.data['專案名稱'] || ''),
    '承辦處室：' + (payload.data['承辦處室'] || ''),
    '活動日期：' + (payload.data['活動日期'] || '未填'),
    '成果繳交期限：' + (payload.data['成果繳交期限'] || '未填'),
    '經費核銷期限：' + (payload.data['經費核銷期限'] || '未填'),
    '',
    'Drive 專案資料夾：',
    payload.projectFolder.getUrl(),
    '',
    '專案紀錄 Docs：',
    payload.projectDoc.getUrl(),
    '',
    '待辦追蹤表：',
    payload.taskSheet.getUrl(),
    '',
    '成果檢核表：',
    payload.checklistSheet.getUrl(),
    '',
    '【建議下一步】',
    '1. 把公文與附件上傳到「00_原始公文與附件」。',
    '2. 若本案重要，手動建立 NotebookLM 筆記本，把連結貼回行政專案總控表。',
    '3. 用 Gemini 協助整理公文要求、待辦清單與成果報告草稿。',
    '4. 正式公告、經費核銷與成果送出前仍需人工確認。',
    '',
    '— 學校行政專案工作流（v' + VERSION + '）'
  ].join('\n');

  GmailApp.sendEmail(email, subject, body);
}

/**
 * 階段日期新增通知
 */
function sendMilestoneNotification(project, data, eventIds) {
  const email = data['負責人Email'];
  if (!email) return;

  const subject = '【行政專案已新增階段日期】' + (data['日期類型'] || '') + ' — ' + (project.projectName || '');
  const body = [
    (data['負責人'] || '') + ' 您好：',
    '',
    '系統已為下列專案新增階段日期：',
    '',
    '專案編號：' + project.projectCode,
    '專案名稱：' + (project.projectName || ''),
    '日期類型：' + (data['日期類型'] || ''),
    '日期：' + (data['日期'] || ''),
    '提醒設定：' + (data['提醒設定'] || '預設（前 3 天 + 當天）'),
    'Calendar 事件已建立：' + (eventIds && eventIds.length > 0 ? eventIds.length + ' 個' : '無'),
    '',
    'Drive 專案資料夾：',
    project.folderUrl || '（未設定）',
    '',
    '待辦追蹤表：',
    project.taskSheetUrl || '（未設定）',
    '',
    '— 學校行政專案工作流'
  ].join('\n');

  GmailApp.sendEmail(email, subject, body);
}

/**
 * 重複專案通知（dedupe 阻擋時通知承辦人）
 */
function sendDuplicateProjectNotification(existing, data) {
  const email = data['承辦人Email'];
  if (!email) return;

  const subject = '【提醒】偵測到重複專案：' + (data['專案名稱'] || '');
  const body = [
    (data['承辦人'] || '') + ' 您好：',
    '',
    '系統偵測到您嘗試建立的專案與既有專案重複，未建立新的資料夾與檔案。',
    '',
    '既有專案資訊：',
    '專案編號：' + (existing.projectCode || ''),
    '專案名稱：' + (existing.projectName || ''),
    '原承辦人：' + (existing.owner || ''),
    '',
    'Drive 專案資料夾：',
    existing.folderUrl || '（未設定）',
    '',
    '若您確認這是不同的專案（同名但實際不同），請：',
    '1. 在「專案名稱」加上區分文字，例如「2026 春季」、「臨時加辦」',
    '2. 重新填寫公文專案啟動表',
    '',
    '— 學校行政專案工作流'
  ].join('\n');

  GmailApp.sendEmail(email, subject, body);
}

/**
 * 階段日期新增失敗通知（給填表者與 Admin）
 */
function sendMilestoneErrorNotification(data, errorMessage) {
  // 用 Set 去重，避免負責人與建立者是同一人時寄兩份
  const recipientSet = {};
  if (data['負責人Email']) recipientSet[safeString(data['負責人Email']).toLowerCase()] = data['負責人Email'];
  if (data['建立者Email']) recipientSet[safeString(data['建立者Email']).toLowerCase()] = data['建立者Email'];
  const recipients = Object.keys(recipientSet).map(function (k) { return recipientSet[k]; });

  const to = recipients.length > 0 ? recipients.join(',') : CONFIG.ADMIN_EMAIL;
  if (!to) return;

  const subject = '【行政專案系統】階段日期新增失敗';
  const body = [
    '系統未能完成階段日期新增：',
    '',
    '專案編號：' + (data['專案編號'] || ''),
    '專案名稱：' + (data['專案名稱'] || ''),
    '日期類型：' + (data['日期類型'] || ''),
    '日期：' + (data['日期'] || ''),
    '',
    '錯誤原因：',
    errorMessage,
    '',
    '請檢查後重新提交。常見原因：',
    '・專案編號打錯（請從行政專案總控表複製貼上）',
    '・日期格式錯誤',
    '・必填欄位有空白',
    '',
    '— 學校行政專案工作流'
  ].join('\n');

  GmailApp.sendEmail(to, subject, body);
}

// ====================================================================
// 錯誤通知（含 throttle）
// ====================================================================

/**
 * 系統錯誤通知給 Admin
 * 用 CacheService 做 throttle：相同錯誤 ERROR_THROTTLE_SECONDS 內不重複寄信
 */
function notifyAdminError(error, contextLabel) {
  const adminEmail = CONFIG.ADMIN_EMAIL;
  if (!adminEmail) {
    log('notifyAdminError: 未設定 ADMIN_EMAIL，僅寫入 Log');
    return;
  }

  const errorMsg = error && error.message ? error.message : safeString(error);
  const signature = generateErrorSignature((contextLabel || '') + '::' + errorMsg);

  if (shouldThrottleError(signature)) {
    log('錯誤已在 throttle 期間內，僅寫入 Log（' + signature + '）：' + errorMsg);
    return;
  }

  markErrorSent(signature);

  const subject = '【行政專案系統錯誤】' + (contextLabel || '未知情境');
  const body = [
    '系統發生錯誤：',
    '',
    '情境：' + (contextLabel || '未指定'),
    '錯誤訊息：' + errorMsg,
    '',
    '錯誤堆疊：',
    (error && error.stack) || '（無）',
    '',
    'Signature：' + signature,
    '時間：' + nowStamp(),
    '版本：' + VERSION,
    '',
    '本錯誤已標記，' + (CONFIG.ERROR_THROTTLE_SECONDS || 600) + ' 秒內相同錯誤不重複通知。',
    '',
    '— 學校行政專案工作流'
  ].join('\n');

  try {
    GmailApp.sendEmail(adminEmail, subject, body);
  } catch (sendErr) {
    log('notifyAdminError 寄信失敗：' + sendErr.message);
  }
}

/**
 * 用簡單字串 hash 產生 signature
 */
function generateErrorSignature(text) {
  const s = safeString(text).substring(0, 200);
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return 'err_' + Math.abs(hash).toString(36);
}

function shouldThrottleError(signature) {
  try {
    return CacheService.getScriptCache().get(signature) !== null;
  } catch (err) {
    // CacheService 失敗時不 throttle（寧可多寄信也別漏訊息）
    return false;
  }
}

function markErrorSent(signature) {
  try {
    const ttl = CONFIG.ERROR_THROTTLE_SECONDS || 600;
    CacheService.getScriptCache().put(signature, '1', ttl);
  } catch (err) {
    log('markErrorSent 失敗：' + err.message);
  }
}
