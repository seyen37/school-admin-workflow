/**
 * Code.gs — 主進入點與 orchestration
 *
 * 對外提供 4 個函式：
 *   setupAdminWorkflow()        — 首次安裝或重新組裝
 *   onFormSubmit(e)             — 公文專案啟動表觸發
 *   onMilestoneFormSubmit(e)    — 專案階段日期新增表觸發
 *   resetAdminWorkflow(dryRun)  — 完全重置（dryRun=true 只列不刪）
 *
 * 還包含兩個健康檢查函式：
 *   testDriveFolder()           — 驗證 Drive 連線
 *   testSendMail()              — 驗證 Gmail 寄信權限
 *
 * 致謝：本程式 fork 自 mihozip/google-workspace-admin-project-workflow（MIT）
 */

const VERSION = '1.0.0-fork';

// ====================================================================
// CONFIG — 請參考 config.example.gs
// ====================================================================
//
// 第一次使用：把 config.example.gs 的 CONFIG 物件複製到這裡，並改 4 行設定。
// 為避免敏感 ID 洩漏，建議把 CONFIG 放在獨立的 config.gs（.gitignore 已排除）。
//
// const CONFIG = { ... };
//
// 若你看到「CONFIG is not defined」，表示你還沒貼設定，
// 請先看 docs/00-quickstart.md 第 5、6 步。

// ====================================================================
// setupAdminWorkflow — 首次安裝或重新組裝
// ====================================================================

/**
 * 完整安裝流程：建立資料夾 → 總控表 → 表單 → 觸發器
 * 拆成四個小函式，方便日後 debug 與單元測試
 */
function setupAdminWorkflow() {
  if (typeof CONFIG === 'undefined') {
    throw new Error('找不到 CONFIG，請先把 config.example.gs 的內容複製到 Code.gs 並修改設定。');
  }

  log('=== setupAdminWorkflow 開始 v' + VERSION + ' ===');

  const rootFolder = setupFolders();
  const controlSpreadsheet = setupControlSheet(rootFolder);
  const formsResult = setupForms(rootFolder);
  setupTriggers(formsResult.starterResponseSheetId, formsResult.milestoneResponseSheetId);

  setProp('VERSION', VERSION);

  log('=== setupAdminWorkflow 完成 ===');
  log('公文專案啟動表：' + formsResult.starterForm.getEditUrl());
  log('公文專案啟動表填寫網址：' + formsResult.starterForm.getPublishedUrl());
  log('專案階段日期新增表：' + formsResult.milestoneForm.getEditUrl());
  log('專案階段日期新增表填寫網址：' + formsResult.milestoneForm.getPublishedUrl());
  log('行政專案總控表：' + controlSpreadsheet.getUrl());

  return {
    version: VERSION,
    starterFormEditUrl: formsResult.starterForm.getEditUrl(),
    starterFormPublishedUrl: formsResult.starterForm.getPublishedUrl(),
    milestoneFormEditUrl: formsResult.milestoneForm.getEditUrl(),
    milestoneFormPublishedUrl: formsResult.milestoneForm.getPublishedUrl(),
    controlSheetUrl: controlSpreadsheet.getUrl()
  };
}

/**
 * 第一步：建立 5 個根層資料夾
 */
function setupFolders() {
  const rootFolder = DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);
  ensureRootLevelFolders(rootFolder);
  log('Step 1/4：根層資料夾就緒');
  return rootFolder;
}

/**
 * 第二步：建立或讀取行政專案總控表
 */
function setupControlSheet(rootFolder) {
  let controlSheetId = safeString(CONFIG.CONTROL_SHEET_ID || getProp('CONTROL_SHEET_ID'));
  let spreadsheet;

  if (controlSheetId) {
    spreadsheet = SpreadsheetApp.openById(controlSheetId);
  } else {
    spreadsheet = SpreadsheetApp.create('行政專案總控表');
    controlSheetId = spreadsheet.getId();
    const controlFolder = getOrCreateSubFolder(rootFolder, '02_專案總控表');
    moveFileToFolder(controlSheetId, controlFolder);
    setProp('CONTROL_SHEET_ID', controlSheetId);
  }

  initializeControlSheet(spreadsheet);
  initializeMilestoneRecordSheet(spreadsheet);

  log('Step 2/4：行政專案總控表就緒');
  return spreadsheet;
}

/**
 * 第三步：建立兩張 Forms 與對應的回應試算表
 */
function setupForms(rootFolder) {
  const starterFolder = getOrCreateSubFolder(rootFolder, '01_公文專案啟動表');
  const milestoneFolder = getOrCreateSubFolder(rootFolder, '04_專案階段日期新增表');

  // 啟動表
  let starterFormId = getProp('STARTER_FORM_ID');
  let starterResponseSheetId = getProp('STARTER_RESPONSE_SHEET_ID');

  if (!starterFormId || !starterResponseSheetId) {
    const responseSpreadsheet = SpreadsheetApp.create('公文專案啟動表_表單回應');
    starterResponseSheetId = responseSpreadsheet.getId();
    moveFileToFolder(starterResponseSheetId, starterFolder);

    const form = createProjectStarterForm();
    form.setDestination(FormApp.DestinationType.SPREADSHEET, starterResponseSheetId);
    starterFormId = form.getId();
    moveFileToFolder(starterFormId, starterFolder);

    setProp('STARTER_FORM_ID', starterFormId);
    setProp('STARTER_RESPONSE_SHEET_ID', starterResponseSheetId);
  }

  // 階段日期新增表
  let milestoneFormId = getProp('MILESTONE_FORM_ID');
  let milestoneResponseSheetId = getProp('MILESTONE_RESPONSE_SHEET_ID');

  if (!milestoneFormId || !milestoneResponseSheetId) {
    const responseSpreadsheet = SpreadsheetApp.create('專案階段日期新增表_表單回應');
    milestoneResponseSheetId = responseSpreadsheet.getId();
    moveFileToFolder(milestoneResponseSheetId, milestoneFolder);

    const form = createMilestoneForm();
    form.setDestination(FormApp.DestinationType.SPREADSHEET, milestoneResponseSheetId);
    milestoneFormId = form.getId();
    moveFileToFolder(milestoneFormId, milestoneFolder);

    setProp('MILESTONE_FORM_ID', milestoneFormId);
    setProp('MILESTONE_RESPONSE_SHEET_ID', milestoneResponseSheetId);
  }

  log('Step 3/4：兩張表單就緒');

  return {
    starterForm: FormApp.openById(starterFormId),
    starterResponseSheetId: starterResponseSheetId,
    milestoneForm: FormApp.openById(milestoneFormId),
    milestoneResponseSheetId: milestoneResponseSheetId
  };
}

/**
 * 第四步：安裝兩個提交觸發器
 */
function setupTriggers(starterResponseSheetId, milestoneResponseSheetId) {
  installFormSubmitTrigger(starterResponseSheetId);
  installMilestoneSubmitTrigger(milestoneResponseSheetId);
  log('Step 4/4：兩個觸發器已安裝');
}

// ====================================================================
// onFormSubmit — 公文專案啟動表觸發
// ====================================================================

function onFormSubmit(e) {
  let data = null;
  try {
    data = parseFormResponse(e);
    validateRequiredFields(data, [
      '專案名稱', '專案年度', '承辦處室', '承辦人', '承辦人Email'
    ]);

    // 用 lock 確保 dedupe + 流水號生成不會撞號
    const result = withLock(function () {
      // dedupe 檢查
      const existing = findExistingProjectByDedupeKey(
        data['專案年度'], data['承辦處室'], data['專案名稱']
      );
      if (existing) {
        log('偵測到重複專案：' + existing.projectCode);
        return { type: 'duplicate', existing: existing };
      }

      // 生成 ProjectCode
      const projectCode = generateProjectCode(data['專案年度'], data['承辦處室']);
      return { type: 'new', projectCode: projectCode };
    });

    if (result.type === 'duplicate') {
      sendDuplicateProjectNotification(result.existing, data);
      return;
    }

    const projectCode = result.projectCode;

    // 建立完整專案結構（資料夾 + Doc + 待辦表 + 檢核表 + Calendar + 通知）
    const fs = createProjectFolderStructure(
      data['專案年度'], data['承辦處室'], data['專案名稱']
    );
    const projectFolder = fs.projectFolder;

    const projectDoc = createProjectRecordDoc(data, projectFolder);
    const taskSheet = createTaskTrackingSheet(data, projectFolder);
    const checklistSheet = createResultChecklistSheet(data, projectFolder);

    // Calendar 事件（含 popup reminder）
    let eventIds = [];
    try {
      eventIds = createInitialProjectEvents(data, projectFolder, taskSheet, checklistSheet);
    } catch (calErr) {
      logError('Calendar 事件建立失敗（不阻斷整體流程）', calErr);
    }

    // 寫入總控表
    appendToControlSheet({
      projectCode: projectCode,
      data: data,
      projectFolder: projectFolder,
      projectDoc: projectDoc,
      taskSheet: taskSheet,
      checklistSheet: checklistSheet,
      eventIds: eventIds
    });

    // 通知承辦人
    sendInternalNotification({
      projectCode: projectCode,
      data: data,
      projectFolder: projectFolder,
      projectDoc: projectDoc,
      taskSheet: taskSheet,
      checklistSheet: checklistSheet
    });

    log('onFormSubmit 完成：' + projectCode);

  } catch (error) {
    logError('onFormSubmit 失敗', error);
    notifyAdminError(error, 'onFormSubmit' + (data && data['專案名稱'] ? '/' + data['專案名稱'] : ''));
  }
}

// ====================================================================
// onMilestoneFormSubmit — 專案階段日期新增表觸發
// ====================================================================

function onMilestoneFormSubmit(e) {
  let data = null;
  let recordRow = null;

  try {
    data = parseFormResponse(e);
    data['新增時間'] = nowStamp();
    data['建立者Email'] = data['Email Address'] || data['電子郵件地址'] || '';

    validateRequiredFields(data, [
      '專案編號', '專案名稱', '日期類型', '日期', '負責人', '負責人Email'
    ]);

    // 先寫一筆「處理中」的紀錄，後續再更新狀態
    recordRow = appendMilestoneRecord(data, [], '', '處理中', '');

    // 找專案
    const project = findProjectByCode(data['專案編號']);
    if (!project) {
      const msg = '找不到專案編號：' + data['專案編號'];
      log(msg);
      updateMilestoneRecord(recordRow, [], '', '錯誤', msg);
      sendMilestoneErrorNotification(data, msg);
      return;
    }

    // 解析日期
    const milestoneDate = parseDate(data['日期']);
    if (!milestoneDate) {
      const msg = '日期無法解析：' + data['日期'];
      log(msg);
      updateMilestoneRecord(recordRow, [], '', '錯誤', msg);
      sendMilestoneErrorNotification(data, msg);
      return;
    }

    const notes = [];

    // 寫入待辦追蹤表
    let taskSheetUrl = '';
    if (isAffirmative(data['是否寫入待辦追蹤表'])) {
      try {
        const reminderDays = parseReminderOptions(data['提醒設定']);
        const remindDate = getEarliestReminderDate(milestoneDate, reminderDays);
        taskSheetUrl = appendMilestoneToTaskSheet(project, data, milestoneDate, remindDate);
        if (!taskSheetUrl) notes.push('待辦追蹤表寫入失敗：找不到試算表 ID');
      } catch (taskErr) {
        notes.push('待辦追蹤表寫入失敗：' + taskErr.message);
      }
    } else {
      notes.push('表單選擇不寫入待辦追蹤表');
    }

    // 建立 Calendar 事件
    let eventIds = [];
    if (isAffirmative(data['是否建立Calendar提醒'])) {
      try {
        const id = createMilestoneEvent(project, data, milestoneDate);
        if (id) eventIds.push(id);
      } catch (calErr) {
        notes.push('Calendar 事件建立失敗：' + calErr.message);
      }
    } else {
      notes.push('表單選擇不建立 Calendar 提醒');
    }

    const finalNote = [data['備註'] || '', notes.join('；')].filter(function (s) { return s; }).join('；');
    updateMilestoneRecord(recordRow, eventIds, taskSheetUrl, '有效', finalNote);

    sendMilestoneNotification(project, data, eventIds);

    log('onMilestoneFormSubmit 完成：' + data['專案編號'] + ' / ' + data['日期類型']);

  } catch (error) {
    logError('onMilestoneFormSubmit 失敗', error);
    if (recordRow) {
      updateMilestoneRecord(recordRow, [], '', '錯誤',
        [(data && data['備註']) || '', error.message].filter(function (s) { return s; }).join('；'));
    }
    if (data) {
      sendMilestoneErrorNotification(data, error.message);
    }
    notifyAdminError(error, 'onMilestoneFormSubmit');
  }
}

// ====================================================================
// resetAdminWorkflow — 完全重置
// ====================================================================

/**
 * 重置流程；強制要求兩階段執行：
 *   resetAdminWorkflow(true)   — dry-run，只列出會刪什麼，不真的刪
 *   resetAdminWorkflow(false)  — 真執行
 *
 * 重要：絕對不會刪除 03_專案資料夾/ 與內部任何專案資料
 */
function resetAdminWorkflow(dryRun) {
  if (dryRun === undefined) {
    throw new Error('請明確指定參數：resetAdminWorkflow(true) 為 dry-run，resetAdminWorkflow(false) 為真執行。');
  }

  const isDryRun = !!dryRun;
  const prefix = isDryRun ? '[DRY-RUN] ' : '[執行] ';
  log('=== ' + prefix + 'resetAdminWorkflow 開始 ===');

  // 1. 列出觸發器
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    const handler = t.getHandlerFunction();
    if (handler === 'onFormSubmit' || handler === 'onMilestoneFormSubmit') {
      log(prefix + '將刪除觸發器：' + handler);
      if (!isDryRun) ScriptApp.deleteTrigger(t);
    }
  });

  // 2. 列出將清空的 PropertiesService keys
  const propKeys = [
    'CONTROL_SHEET_ID',
    'STARTER_FORM_ID', 'STARTER_RESPONSE_SHEET_ID',
    'MILESTONE_FORM_ID', 'MILESTONE_RESPONSE_SHEET_ID',
    'VERSION'
  ];
  propKeys.forEach(function (k) {
    if (getProp(k)) {
      log(prefix + '將清空 PropertiesService：' + k);
      if (!isDryRun) deleteProp(k);
    }
  });

  // 3. 確認保留事項
  log(prefix + '保留：03_專案資料夾/ 與所有歷史專案資料');
  log(prefix + '保留：Calendar 歷史事件（如需清除請手動）');
  log(prefix + '保留：Apps Script 專案本身（含執行歷史）');

  log('=== ' + prefix + 'resetAdminWorkflow 結束 ===');

  if (isDryRun) {
    log('如果以上看起來正確，請執行 resetAdminWorkflow(false) 真正執行重置。');
  } else {
    log('重置完成。請重新執行 setupAdminWorkflow() 建立新的表單與觸發器。');
  }
}

// ====================================================================
// 健康檢查函式
// ====================================================================

/**
 * 測試 Drive 連線：印出總資料夾名稱
 */
function testDriveFolder() {
  if (typeof CONFIG === 'undefined') {
    throw new Error('找不到 CONFIG，請先設定。');
  }
  const folder = DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);
  log('Drive 連線正常，總資料夾名稱：' + folder.getName());
  log('資料夾 URL：' + folder.getUrl());
}

/**
 * 測試 Gmail 寄信：寄一封測試信給 ADMIN_EMAIL
 */
function testSendMail() {
  if (typeof CONFIG === 'undefined') {
    throw new Error('找不到 CONFIG，請先設定。');
  }
  if (!CONFIG.ADMIN_EMAIL) {
    throw new Error('CONFIG.ADMIN_EMAIL 未設定。');
  }
  GmailApp.sendEmail(
    CONFIG.ADMIN_EMAIL,
    '【行政專案系統】測試信',
    '若您收到此信，表示 Apps Script 的 Gmail 寄信權限已正確授權。\n\n版本：' + VERSION + '\n時間：' + nowStamp()
  );
  log('測試信已寄至：' + CONFIG.ADMIN_EMAIL);
}
