/**
 * sheets.gs — 試算表 schema 與 CRUD
 *
 * 處理四種試算表：
 *   1. 行政專案總控表（單一檔案，集中所有專案的索引）
 *   2. 階段日期紀錄（總控表的另一張工作表）
 *   3. 待辦追蹤表（每專案一個獨立檔案）
 *   4. 成果檢核表（每專案一個獨立檔案）
 *
 * 還包含「專案紀錄 Docs」的建立（Docs 不算 sheet 但歸在這裡方便 orchestration）
 */

// ====================================================================
// 欄位定義
// ====================================================================

const CONTROL_HEADERS = [
  '專案編號', '專案名稱', '年度', '承辦處室', '承辦人', '承辦人Email',
  'Drive資料夾連結', '專案紀錄Docs連結', '待辦追蹤表連結', '成果檢核表連結',
  'NotebookLM筆記本連結', '專案狀態', '備註',
  '來文單位', '公文文號', '建立日期',
  '活動日期', '成果期限', '經費期限', '是否有經費'
];

const MILESTONE_HEADERS = [
  '紀錄編號', '新增時間', '建立者Email',
  '專案編號', '專案名稱', '日期類型', '日期', '提醒設定',
  '負責人', '負責人Email',
  '是否寫入待辦追蹤表', '是否建立Calendar提醒',
  '說明', 'Calendar事件ID', '待辦追蹤表連結',
  '狀態', '備註'
];

const TASK_HEADERS = [
  '任務編號', '階段', '任務名稱', '任務說明',
  '負責人', '協助單位', '期限', '提醒日期',
  '狀態', '需要附件', '附件位置', '備註'
];

const CHECKLIST_HEADERS = [
  '項目', '是否需要', '目前狀態', '存放位置', '負責人', '備註'
];

// ====================================================================
// 總控表初始化
// ====================================================================

/**
 * 確保總控表有「行政專案總控表」工作表 + 正確 header
 * 已存在則不動已有資料
 */
function initializeControlSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('行政專案總控表');
  if (!sheet) {
    // 找預設的「工作表1」並改名
    const sheets = spreadsheet.getSheets();
    if (sheets.length === 1 && sheets[0].getName() === '工作表1') {
      sheet = sheets[0];
      sheet.setName('行政專案總控表');
    } else {
      sheet = spreadsheet.insertSheet('行政專案總控表');
    }
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CONTROL_HEADERS);
  } else {
    // 檢查 header 是否完整；若缺欄則補在最右邊
    const existing = getHeaderRow(sheet);
    const existingSet = {};
    existing.forEach(function (h) { existingSet[safeString(h).trim()] = true; });
    const missing = CONTROL_HEADERS.filter(function (h) { return !existingSet[h]; });
    if (missing.length > 0) {
      sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
    }
  }

  formatSheet(sheet, CONTROL_HEADERS.length);
  return sheet;
}

/**
 * 確保「階段日期紀錄」工作表存在 + 正確 header
 */
function initializeMilestoneRecordSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('階段日期紀錄');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('階段日期紀錄');
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(MILESTONE_HEADERS);
  }
  formatSheet(sheet, MILESTONE_HEADERS.length);
  return sheet;
}

// ====================================================================
// 寫入總控表
// ====================================================================

function appendToControlSheet(payload) {
  const ss = SpreadsheetApp.openById(getControlSheetIdSafely());
  const sheet = initializeControlSheet(ss);
  const headers = getHeaderRow(sheet);

  const rowData = {
    '專案編號': payload.projectCode,
    '專案名稱': payload.data['專案名稱'] || '',
    '年度': payload.data['專案年度'] || '',
    '承辦處室': payload.data['承辦處室'] || '',
    '承辦人': payload.data['承辦人'] || '',
    '承辦人Email': payload.data['承辦人Email'] || '',
    'Drive資料夾連結': payload.projectFolder.getUrl(),
    '專案紀錄Docs連結': payload.projectDoc.getUrl(),
    '待辦追蹤表連結': payload.taskSheet.getUrl(),
    '成果檢核表連結': payload.checklistSheet.getUrl(),
    'NotebookLM筆記本連結': '',
    '專案狀態': '籌備中',
    '備註': payload.data['備註'] || '',
    '來文單位': payload.data['來文單位'] || '',
    '公文文號': payload.data['公文文號'] || '',
    '建立日期': nowStamp(),
    '活動日期': payload.data['活動日期'] || '',
    '成果期限': payload.data['成果繳交期限'] || '',
    '經費期限': payload.data['經費核銷期限'] || '',
    '是否有經費': payload.data['是否有經費'] || ''
  };

  appendObjectRow(sheet, headers, rowData);
}

// ====================================================================
// 階段日期紀錄
// ====================================================================

/**
 * 在「階段日期紀錄」新增一列；回傳新列的 rowIndex 供後續更新
 */
function appendMilestoneRecord(data, eventIds, taskSheetUrl, status, note) {
  const ss = SpreadsheetApp.openById(getControlSheetIdSafely());
  const sheet = initializeMilestoneRecordSheet(ss);

  const recordId = 'M-' + nowStamp('yyyyMMdd-HHmmss');

  sheet.appendRow([
    recordId,
    data['新增時間'] || nowStamp(),
    data['建立者Email'] || '',
    data['專案編號'] || '',
    data['專案名稱'] || '',
    data['日期類型'] || '',
    data['日期'] || '',
    data['提醒設定'] || '',
    data['負責人'] || '',
    data['負責人Email'] || '',
    data['是否寫入待辦追蹤表'] || '是',
    data['是否建立Calendar提醒'] || '是',
    data['說明'] || '',
    (eventIds || []).join(', '),
    taskSheetUrl || '',
    status || '處理中',
    note || data['備註'] || ''
  ]);

  return sheet.getLastRow();
}

/**
 * 更新階段日期紀錄某列的狀態與相關欄位
 * rowIndex 為 1-based，傳入 null/undefined/0/負值都視為無效
 */
function updateMilestoneRecord(rowIndex, eventIds, taskSheetUrl, status, note) {
  if (rowIndex === null || rowIndex === undefined || rowIndex < 1) return;
  const ss = SpreadsheetApp.openById(getControlSheetIdSafely());
  const sheet = initializeMilestoneRecordSheet(ss);

  const map = buildHeaderMap(MILESTONE_HEADERS);
  if (eventIds !== null && eventIds !== undefined) {
    sheet.getRange(rowIndex, map['Calendar事件ID'] + 1).setValue((eventIds || []).join(', '));
  }
  if (taskSheetUrl !== null && taskSheetUrl !== undefined) {
    sheet.getRange(rowIndex, map['待辦追蹤表連結'] + 1).setValue(taskSheetUrl || '');
  }
  if (status) {
    sheet.getRange(rowIndex, map['狀態'] + 1).setValue(status);
  }
  if (note !== null && note !== undefined) {
    sheet.getRange(rowIndex, map['備註'] + 1).setValue(note);
  }
}

/**
 * 從總控表找出對應 ProjectCode 的專案資訊
 */
function findProjectByCode(projectCode) {
  const ss = SpreadsheetApp.openById(getControlSheetIdSafely());
  const sheet = ss.getSheetByName('行政專案總控表');
  if (!sheet || sheet.getLastRow() < 2) return null;

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const map = buildHeaderMap(headers);

  if (map['專案編號'] === undefined) {
    throw new Error('總控表缺少「專案編號」欄位');
  }

  const target = safeString(projectCode).trim();
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (safeString(getValueByHeader(row, map, '專案編號')).trim() === target) {
      return {
        rowIndex: i + 1,
        projectCode: target,
        projectName: getValueByHeader(row, map, '專案名稱'),
        year: getValueByHeader(row, map, '年度'),
        office: getValueByHeader(row, map, '承辦處室'),
        owner: getValueByHeader(row, map, '承辦人'),
        ownerEmail: getValueByHeader(row, map, '承辦人Email'),
        folderUrl: getValueByHeader(row, map, 'Drive資料夾連結'),
        projectDocUrl: getValueByHeader(row, map, '專案紀錄Docs連結'),
        taskSheetUrl: getValueByHeader(row, map, '待辦追蹤表連結'),
        checklistSheetUrl: getValueByHeader(row, map, '成果檢核表連結'),
        status: getValueByHeader(row, map, '專案狀態')
      };
    }
  }
  return null;
}

// ====================================================================
// 待辦追蹤表（每專案一個）
// ====================================================================

/**
 * 為新專案建立待辦追蹤表（10 項預設任務）
 */
function createTaskTrackingSheet(data, projectFolder) {
  const fileName = sanitizeFileName(
    data['專案年度'] + '_' + data['承辦處室'] + '_' + data['專案名稱'] + '_待辦追蹤表'
  );

  const ss = SpreadsheetApp.create(fileName);
  const sheet = ss.getActiveSheet();
  sheet.setName('待辦追蹤');
  sheet.appendRow(TASK_HEADERS);

  buildDefaultTasks(data).forEach(function (row) { sheet.appendRow(row); });

  applyTaskValidation(sheet);
  formatSheet(sheet, TASK_HEADERS.length);

  // 搬到專案資料夾的「99_系統產生文件」
  const systemFolder = getOrCreateSubFolder(projectFolder, '99_系統產生文件');
  moveFileToFolder(ss.getId(), systemFolder);

  return DriveApp.getFileById(ss.getId());
}

function buildDefaultTasks(data) {
  const owner = data['承辦人'] || '';
  const resultDeadline = data['成果繳交期限'] || '';
  const budgetDeadline = data['經費核銷期限'] || '';
  const eventDate = data['活動日期'] || '';
  return [
    ['T001', '公文', '整理公文要求', '確認辦理依據、期限、成果要求與附件', owner, '', '', '', '未開始', '否', '', ''],
    ['T002', '公文', '建立 NotebookLM 筆記本', '把公文與附件加入專案 Notebook，並把連結貼回總控表', owner, '', '', '', '未開始', '否', '', ''],
    ['T003', '籌備', '撰寫或修正計畫書', '依公文要求完成校內計畫草案', owner, '', '', '', '未開始', '是', '', ''],
    ['T004', '籌備', '建立報名或回覆表單', '確認是否需收教師、家長或學生回覆', owner, '', '', '', '未開始', '否', '', ''],
    ['T005', '執行', '收集活動照片', '活動期間收集照片並補上照片說明', owner, '', eventDate, eventDate, '未開始', '是', '', ''],
    ['T006', '執行', '整理簽到表或參與名冊', '建立人數與參與對象統計', owner, '', eventDate, eventDate, '未開始', '是', '', ''],
    ['T007', '經費', '整理經費明細與憑證', '確認支出項目、憑證與核銷資料', owner, '會計', budgetDeadline, budgetDeadline, '未開始', '是', '', ''],
    ['T008', '成果', '撰寫成果報告草稿', '用 NotebookLM 與 Gemini 協助整理成果報告', owner, '', resultDeadline, resultDeadline, '未開始', '是', '', ''],
    ['T009', '成果', '檢查成果附件是否齊全', '確認照片、簽到、回饋、經費與公文附件', owner, '', resultDeadline, resultDeadline, '未開始', '是', '', ''],
    ['T010', '結案', '建立下次改進建議', '整理檢討與交接注意事項', owner, '', '', '', '未開始', '否', '', '']
  ];
}

function applyTaskValidation(sheet) {
  try {
    const lastRow = Math.max(sheet.getLastRow(), 100);
    const stageRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['公文', '籌備', '執行', '經費', '成果', '結案', '其他'], true)
      .build();
    sheet.getRange(2, 2, lastRow - 1, 1).setDataValidation(stageRule);

    const statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['未開始', '進行中', '已完成', '已取消', '已逾期'], true)
      .build();
    sheet.getRange(2, 9, lastRow - 1, 1).setDataValidation(statusRule);

    const needsAttachmentRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['是', '否', '視情況'], true)
      .build();
    sheet.getRange(2, 10, lastRow - 1, 1).setDataValidation(needsAttachmentRule);
  } catch (err) {
    log('applyTaskValidation warning: ' + err.message);
  }
}

/**
 * 為既有專案的待辦追蹤表新增一項（給 milestone 用）
 * 回傳 taskSheetUrl
 */
function appendMilestoneToTaskSheet(project, data, milestoneDate, remindDate) {
  if (!project.taskSheetUrl) return '';
  const ssId = getSpreadsheetIdFromUrl(project.taskSheetUrl);
  if (!ssId) return '';

  const ss = SpreadsheetApp.openById(ssId);
  const sheet = ss.getSheetByName('待辦追蹤') || ss.getSheets()[0];

  const dateType = data['日期類型'] || '其他';
  const taskId = 'M' + nowStamp('MMddHHmmss');
  const dateText = formatDateForSheet(milestoneDate);
  const remindText = remindDate ? formatDateForSheet(remindDate) : dateText;
  const taskName = '【' + dateType + '】' + (project.projectName || data['專案名稱'] || '');
  const description = [
    '階段日期：' + dateText,
    '提醒設定：' + (data['提醒設定'] || '當天提醒'),
    '說明：' + (data['說明'] || '')
  ].join('\n');

  sheet.appendRow([
    taskId,
    determineTaskStageByDateType(dateType),
    taskName,
    description,
    data['負責人'] || '',
    '',
    dateText,
    remindText,
    '未開始',
    '否',
    '',
    data['備註'] || ''
  ]);

  return ss.getUrl();
}

/**
 * 由日期類型推測對應的任務階段
 */
function determineTaskStageByDateType(dateType) {
  const map = {
    '校內協調會': '籌備', '第一次會議': '籌備',
    '報名開始日': '籌備', '報名截止日': '籌備', '資料回收期限': '籌備',
    '採購期限': '經費', '經費核銷期限': '經費',
    '活動前檢查日': '執行', '正式活動日期': '執行',
    '照片與成果資料回收日': '成果',
    '成果報告初稿期限': '成果', '成果送出期限': '成果',
    '結案檢討日': '結案'
  };
  return map[dateType] || '其他';
}

// ====================================================================
// 成果檢核表（每專案一個）
// ====================================================================

function createResultChecklistSheet(data, projectFolder) {
  const fileName = sanitizeFileName(
    data['專案年度'] + '_' + data['承辦處室'] + '_' + data['專案名稱'] + '_成果檢核表'
  );

  const ss = SpreadsheetApp.create(fileName);
  const sheet = ss.getActiveSheet();
  sheet.setName('成果檢核');
  sheet.appendRow(CHECKLIST_HEADERS);

  const owner = data['承辦人'] || '';
  const rows = [
    ['原始公文', '是', '待整理', '00_原始公文與附件', owner, ''],
    ['計畫書或核定資料', '建議', '待整理', '01_計畫書與核定資料', owner, ''],
    ['會議紀錄或工作分工', '建議', '待整理', '02_工作分工與會議紀錄', owner, ''],
    ['表單回覆或名冊', data['是否需要收家長或教師回覆'] || '不確定', '待整理', '03_表單與回覆資料', owner, ''],
    ['經費明細與憑證', data['是否有經費'] || '不確定', '待整理', '04_經費與採購核銷', owner, '需會計或主任人工確認'],
    ['活動照片與照片說明', data['是否需要活動照片'] || '不確定', '待整理', '05_活動照片與照片說明', owner, ''],
    ['成果報告', data['是否需要成果報告'] || '不確定', '待整理', '06_成果資料與成果報告', owner, ''],
    ['公告通知與對外文字', '建議', '待整理', '07_公告通知與對外文字', owner, '正式公告需人工確認'],
    ['成果簡報或展示資料', '視需要', '待整理', '08_簡報與成果展示', owner, ''],
    ['檢討與下次改進', '建議', '待整理', '09_檢討與下次改進', owner, '']
  ];
  rows.forEach(function (r) { sheet.appendRow(r); });

  applyChecklistValidation(sheet);
  formatSheet(sheet, CHECKLIST_HEADERS.length);

  const systemFolder = getOrCreateSubFolder(projectFolder, '99_系統產生文件');
  moveFileToFolder(ss.getId(), systemFolder);

  return DriveApp.getFileById(ss.getId());
}

function applyChecklistValidation(sheet) {
  try {
    const lastRow = Math.max(sheet.getLastRow(), 50);
    const needRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['是', '建議', '視需要', '不需要', '不確定'], true).build();
    sheet.getRange(2, 2, lastRow - 1, 1).setDataValidation(needRule);

    const statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['待整理', '已收集', '已歸檔', '需補件', '不適用'], true).build();
    sheet.getRange(2, 3, lastRow - 1, 1).setDataValidation(statusRule);
  } catch (err) {
    log('applyChecklistValidation warning: ' + err.message);
  }
}

// ====================================================================
// 專案紀錄 Docs（不是 Sheet，但放這裡方便 orchestration）
// ====================================================================

function createProjectRecordDoc(data, projectFolder) {
  const docName = sanitizeFileName(
    data['專案年度'] + '_' + data['承辦處室'] + '_' + data['專案名稱'] + '_專案紀錄'
  );
  const doc = DocumentApp.create(docName);
  const body = doc.getBody();

  body.appendParagraph('行政專案紀錄').setHeading(DocumentApp.ParagraphHeading.TITLE);

  appendDocSection(body, '一、基本資料', [
    ['公文主旨', data['公文主旨']],
    ['來文單位', data['來文單位']],
    ['公文日期', data['公文日期']],
    ['公文文號', data['公文文號']],
    ['專案名稱', data['專案名稱']],
    ['專案年度', data['專案年度']],
    ['承辦處室', data['承辦處室']],
    ['承辦人', data['承辦人']],
    ['承辦人Email', data['承辦人Email']],
    ['協辦人員', data['協辦人員']]
  ]);

  appendDocSection(body, '二、重要期限', [
    ['活動日期', data['活動日期']],
    ['成果繳交期限', data['成果繳交期限']],
    ['經費核銷期限', data['經費核銷期限']]
  ]);

  appendDocSection(body, '三、經費資訊', [
    ['是否有經費', data['是否有經費']],
    ['核定或預估金額', data['核定或預估金額']]
  ]);

  body.appendParagraph('四、公文要求摘要').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('（請用 NotebookLM 或 Gemini 整理後補入。）');

  body.appendParagraph('五、執行紀錄').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('日期｜事項｜處理情形｜負責人');

  body.appendParagraph('六、成果資料').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  ['照片', '簽到表', '回饋表', '成果報告', '經費附件'].forEach(function (label) {
    body.appendParagraph(label + '：');
  });

  body.appendParagraph('七、缺漏檢查').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  ['尚缺資料', '需要補件', '需人工確認'].forEach(function (label) {
    body.appendParagraph(label + '：');
  });

  body.appendParagraph('八、檢討與下次建議').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  ['本次問題', '下次改善', '可沿用資料'].forEach(function (label) {
    body.appendParagraph(label + '：');
  });

  body.appendParagraph('九、NotebookLM 建議提問').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('請根據本專案來源資料，整理：公文要求、重要期限、成果報告要求、目前缺漏資料與需要人工確認的地方。');

  doc.saveAndClose();

  const systemFolder = getOrCreateSubFolder(projectFolder, '99_系統產生文件');
  moveFileToFolder(doc.getId(), systemFolder);

  return DriveApp.getFileById(doc.getId());
}

function appendDocSection(body, heading, pairs) {
  body.appendParagraph(heading).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  pairs.forEach(function (pair) {
    const label = pair[0];
    const value = safeString(pair[1]);
    body.appendParagraph(label + '：' + value);
  });
}
