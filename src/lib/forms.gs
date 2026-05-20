/**
 * forms.gs — 兩張 Google Forms 的建立與觸發器安裝
 *
 * 表單 A：公文專案啟動表（建立新專案）
 * 表單 B：專案階段日期新增表（為既有專案新增日期）
 *
 * 兩張表單的觸發器分別綁定到對應的回應試算表上，
 * 觸發器類型為「來自試算表 → 提交表單時」（FORM_SUBMIT）
 */

// ====================================================================
// 表單 A：公文專案啟動表
// ====================================================================

function createProjectStarterForm() {
  const form = FormApp.create('公文專案啟動表');
  form.setDescription(
    '收到需要追蹤的公文或行政任務時，請填寫本表。\n' +
    '送出後，系統會自動建立：\n' +
    '・專案資料夾（含 11 個子資料夾）\n' +
    '・專案紀錄 Docs\n' +
    '・待辦追蹤表\n' +
    '・成果檢核表\n' +
    '・Calendar 期限提醒（含彈跳通知）\n' +
    '\n' +
    '公文與附件請於專案建立完成後，自行上傳到「00_原始公文與附件」。'
  );
  form.setCollectEmail(true);

  // --- 一、基本資料 ---
  form.addSectionHeaderItem()
    .setTitle('一、基本資料')
    .setHelpText('用來建立專案資料夾、行政專案總控表的基礎資訊。');

  form.addTextItem().setTitle('專案年度').setRequired(true).setHelpText('例：115');
  form.addTextItem().setTitle('承辦處室').setRequired(true).setHelpText('例：教務處、學務處、總務處、資訊組');
  form.addTextItem().setTitle('專案名稱').setRequired(true).setHelpText('例：AI融入教學研習');
  form.addTextItem().setTitle('承辦人').setRequired(true);
  form.addTextItem().setTitle('承辦人Email').setRequired(true);
  form.addParagraphTextItem().setTitle('協辦人員');

  // --- 二、公文資訊 ---
  form.addSectionHeaderItem()
    .setTitle('二、公文資訊')
    .setHelpText('非正式公文也可填入通知來源或任務來源。');

  form.addTextItem().setTitle('公文主旨');
  form.addTextItem().setTitle('來文單位');
  form.addDateItem().setTitle('公文日期');
  form.addTextItem().setTitle('公文文號');

  // --- 三、期限與成果要求 ---
  form.addSectionHeaderItem().setTitle('三、期限與成果要求');

  form.addDateItem().setTitle('活動日期');
  form.addDateItem().setTitle('成果繳交期限');
  form.addDateItem().setTitle('經費核銷期限');

  form.addMultipleChoiceItem()
    .setTitle('是否有經費')
    .setChoiceValues(['是', '否', '不確定']);

  form.addTextItem().setTitle('核定或預估金額');

  form.addMultipleChoiceItem()
    .setTitle('是否需要收家長或教師回覆')
    .setChoiceValues(['是', '否', '不確定']);

  form.addMultipleChoiceItem()
    .setTitle('是否需要活動照片')
    .setChoiceValues(['是', '否', '不確定']);

  form.addMultipleChoiceItem()
    .setTitle('是否需要成果報告')
    .setChoiceValues(['是', '否', '不確定']);

  form.addParagraphTextItem().setTitle('備註');

  return form;
}

// ====================================================================
// 表單 B：專案階段日期新增表
// ====================================================================

function createMilestoneForm() {
  const form = FormApp.create('專案階段日期新增表');
  form.setDescription(
    '為既有行政專案新增重要日期、階段任務與 Calendar 提醒。\n' +
    '請先從行政專案總控表確認專案編號（例：115-教務-001）。'
  );
  form.setCollectEmail(false);

  form.addTextItem()
    .setTitle('專案編號')
    .setRequired(true)
    .setHelpText('請填行政專案總控表中的專案編號（例：115-教務-001）');

  form.addTextItem()
    .setTitle('專案名稱')
    .setRequired(true);

  form.addListItem()
    .setTitle('日期類型')
    .setRequired(true)
    .setChoiceValues([
      '校內協調會',
      '第一次會議',
      '報名開始日',
      '報名截止日',
      '資料回收期限',
      '採購期限',
      '經費核銷期限',
      '活動前檢查日',
      '正式活動日期',
      '照片與成果資料回收日',
      '成果報告初稿期限',
      '成果送出期限',
      '結案檢討日',
      '其他'
    ]);

  form.addDateItem()
    .setTitle('日期')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('提醒設定')
    .setHelpText('可複選；若一個都不勾，系統會自動套用「前 3 天 + 當天」')
    .setChoiceValues([
      '當天提醒',
      '前1天提醒',
      '前3天提醒',
      '前7天提醒',
      '前14天提醒'
    ]);

  form.addTextItem().setTitle('負責人').setRequired(true);
  form.addTextItem().setTitle('負責人Email').setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('是否寫入待辦追蹤表')
    .setHelpText('若沒有特殊原因，請選「是」')
    .setRequired(true)
    .setChoiceValues(['是', '否']);

  form.addMultipleChoiceItem()
    .setTitle('是否建立Calendar提醒')
    .setHelpText('若沒有特殊原因，請選「是」')
    .setRequired(true)
    .setChoiceValues(['是', '否']);

  form.addParagraphTextItem().setTitle('說明');
  form.addParagraphTextItem().setTitle('備註');

  return form;
}

// ====================================================================
// 觸發器安裝
// ====================================================================

/**
 * 移除所有指定 handler 函式的觸發器
 * 避免重複安裝
 */
function removeAllTriggersByHandler(handlerName) {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === handlerName) {
      ScriptApp.deleteTrigger(t);
    }
  });
}

/**
 * 安裝公文專案啟動表的提交觸發器
 */
function installFormSubmitTrigger(responseSheetId) {
  removeAllTriggersByHandler('onFormSubmit');
  const ss = SpreadsheetApp.openById(responseSheetId);
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
}

/**
 * 安裝專案階段日期新增表的提交觸發器
 */
function installMilestoneSubmitTrigger(responseSheetId) {
  removeAllTriggersByHandler('onMilestoneFormSubmit');
  const ss = SpreadsheetApp.openById(responseSheetId);
  ScriptApp.newTrigger('onMilestoneFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
}
