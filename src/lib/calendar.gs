/**
 * calendar.gs — Calendar 事件建立、popup reminder、多日曆派發
 *
 * 對原作的關鍵改進：
 *   1. 真正會跳通知的 popup reminder（addPopupReminder）
 *   2. 多日曆派發：依承辦處室路由到不同 Calendar
 *   3. 事件描述加上專案資料夾、待辦表、檢核表連結
 */

// ====================================================================
// 多日曆派發
// ====================================================================

/**
 * 依承辦處室取得對應的 Calendar 物件
 * 找不到對應就用 default，再找不到就用 CALENDAR_ID
 */
function getCalendarFor(office) {
  // 優先檢查 CONFIG.CALENDARS（多日曆模式）
  if (CONFIG.CALENDARS && typeof CONFIG.CALENDARS === 'object') {
    const officeKey = safeString(office).trim();
    if (officeKey && CONFIG.CALENDARS[officeKey]) {
      const cal = CalendarApp.getCalendarById(CONFIG.CALENDARS[officeKey]);
      if (cal) return cal;
      log('警告：CONFIG.CALENDARS["' + officeKey + '"] 找不到對應 Calendar，改用 default');
    }
    if (CONFIG.CALENDARS['default']) {
      const cal = CalendarApp.getCalendarById(CONFIG.CALENDARS['default']);
      if (cal) return cal;
    }
  }

  // 單日曆模式
  const cal = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID || 'primary');
  if (!cal) {
    throw new Error('找不到指定的 Calendar，請確認 CONFIG.CALENDAR_ID');
  }
  return cal;
}

// ====================================================================
// 提醒設定解析
// ====================================================================

/**
 * 解析「提醒設定」字串為天數陣列
 * 例：「當天提醒, 前3天提醒」→ [0, 3]
 */
function parseReminderOptions(value) {
  const s = safeString(value);
  if (!s) return [];

  const days = [];
  if (s.indexOf('當天') >= 0) days.push(0);
  if (s.indexOf('前1天') >= 0) days.push(1);
  if (s.indexOf('前3天') >= 0) days.push(3);
  if (s.indexOf('前7天') >= 0) days.push(7);
  if (s.indexOf('前14天') >= 0) days.push(14);
  return days;
}

/**
 * 取得最早的提醒日期（用於寫入待辦表的「提醒日期」欄）
 */
function getEarliestReminderDate(milestoneDate, reminderDays) {
  if (!milestoneDate) return null;
  if (!reminderDays || reminderDays.length === 0) return milestoneDate;
  const maxDays = Math.max.apply(null, reminderDays);
  return offsetDate(milestoneDate, -maxDays);
}

// ====================================================================
// 建立 Calendar 事件 + 附加 popup reminder
// ====================================================================

/**
 * 為新專案建立初始 Calendar 事件（活動日、成果期限、經費期限）
 * 每個事件預設帶上 popup reminder
 * 回傳事件 ID 陣列
 */
function createInitialProjectEvents(data, projectFolder, taskSheet, checklistSheet) {
  const calendar = getCalendarFor(data['承辦處室']);
  const eventIds = [];

  const descBuilder = function () {
    return buildEventDescription({
      projectName: data['專案名稱'],
      office: data['承辦處室'],
      owner: data['承辦人'],
      folderUrl: projectFolder.getUrl(),
      taskUrl: taskSheet.getUrl(),
      checklistUrl: checklistSheet.getUrl()
    });
  };

  // 活動日：當天 + 前 1 天提醒
  if (data['活動日期']) {
    const id = createEventWithReminders(
      calendar,
      '【活動日】' + buildEventTitle(data),
      data['活動日期'],
      descBuilder(),
      [0, 1]
    );
    if (id) eventIds.push(id);
  }

  // 成果繳交期限：前 7 天 + 前 3 天 + 當天提醒
  if (data['成果繳交期限']) {
    const id = createEventWithReminders(
      calendar,
      '【成果期限】' + buildEventTitle(data),
      data['成果繳交期限'],
      descBuilder(),
      [7, 3, 0]
    );
    if (id) eventIds.push(id);
  }

  // 經費核銷期限：前 7 天 + 當天提醒
  if (data['經費核銷期限']) {
    const id = createEventWithReminders(
      calendar,
      '【經費核銷期限】' + buildEventTitle(data),
      data['經費核銷期限'],
      descBuilder(),
      [7, 0]
    );
    if (id) eventIds.push(id);
  }

  return eventIds;
}

/**
 * 為既有專案的階段日期建立 Calendar 事件
 */
function createMilestoneEvent(project, data, milestoneDate) {
  const calendar = getCalendarFor(project.office);
  const title = '【' + (data['日期類型'] || '其他') + '】' + (project.projectName || data['專案名稱'] || '');

  // 解析使用者勾選的提醒
  let reminderDays = parseReminderOptions(data['提醒設定']);
  if (reminderDays.length === 0) {
    // 預設：前 3 天 + 當天
    reminderDays = [3, 0];
  }

  const description = buildEventDescription({
    projectName: project.projectName || data['專案名稱'],
    office: project.office,
    owner: data['負責人'],
    folderUrl: project.folderUrl,
    taskUrl: project.taskSheetUrl,
    checklistUrl: project.checklistSheetUrl,
    extra: '說明：' + (data['說明'] || '')
  });

  return createEventWithReminders(calendar, title, milestoneDate, description, reminderDays);
}

/**
 * 事件時段：活動當天 08:00–08:30（定時事件，不用全天事件）
 *
 * 為什麼不用全天事件：全天事件的提醒從當天 00:00 往前算，「前 N 天」會在半夜跳；
 * 而 Calendar 規定提醒至少提前 5 分鐘，「當天」（0 分）會被拒絕。
 * 改成定時事件後，提醒以 08:00 起算：
 *   前 N 天 → N 天前的 08:00
 *   當天    → 當天 07:55（官方下限 5 分鐘）
 */
const EVENT_START_HOUR = 8;
const EVENT_DURATION_MINUTES = 30;
const MIN_REMINDER_MINUTES = 5;      // Calendar 官方下限
const MAX_REMINDER_MINUTES = 40320;  // Calendar 官方上限（4 週）

/**
 * 把提醒天數換成「事件開始前幾分鐘」；超出官方範圍回傳 null
 */
function reminderDaysToMinutes(days) {
  const minutes = Math.max(days * 24 * 60, MIN_REMINDER_MINUTES);
  return minutes > MAX_REMINDER_MINUTES ? null : minutes;
}

/**
 * 依 CONFIG.TIMEZONE 取出日期的年月日，組成當天 EVENT_START_HOUR 點的時間
 * （避免 ISO 字串以 UTC 解析造成日期偏移）
 */
function buildEventStart(date) {
  const ymd = Utilities.formatDate(date, CONFIG.TIMEZONE, 'yyyy-MM-dd').split('-');
  return new Date(Number(ymd[0]), Number(ymd[1]) - 1, Number(ymd[2]), EVENT_START_HOUR, 0, 0);
}

/**
 * 建立定時事件並依 reminderDays 加上 popup reminder
 * 回傳事件 ID；失敗回傳 null（不拋例外，避免單一事件失敗導致整單失敗）
 */
function createEventWithReminders(calendar, title, dateValue, description, reminderDays) {
  const date = parseDate(dateValue);
  if (!date) {
    log('createEventWithReminders: 日期無法解析「' + dateValue + '」，略過');
    return null;
  }

  try {
    const start = buildEventStart(date);
    const end = new Date(start.getTime() + EVENT_DURATION_MINUTES * 60 * 1000);
    const event = calendar.createEvent(title, start, end, { description: description });

    // 清掉日曆預設提醒，只留本系統設定的
    try { event.removeAllReminders(); } catch (e) { /* noop */ }

    (reminderDays || []).forEach(function (days) {
      const minutes = reminderDaysToMinutes(days);
      if (minutes === null) {
        log('addPopupReminder 略過：days=' + days + ' 超過官方上限 ' + MAX_REMINDER_MINUTES + ' 分');
        return;
      }
      try {
        event.addPopupReminder(minutes);
      } catch (err) {
        log('addPopupReminder 失敗（days=' + days + '，' + minutes + ' 分）：' + err.message);
      }
    });

    return event.getId();
  } catch (err) {
    log('createEventWithReminders 失敗：' + err.message);
    return null;
  }
}

// ====================================================================
// 事件描述
// ====================================================================

function buildEventTitle(data) {
  return safeString(data['專案年度']) + '_' + safeString(data['承辦處室']) + '_' + safeString(data['專案名稱']);
}

function buildEventDescription(opts) {
  const lines = [
    '專案名稱：' + safeString(opts.projectName),
    '承辦處室：' + safeString(opts.office),
    '承辦人：' + safeString(opts.owner),
    '',
    '請確認：',
    '  ☐ 公文與附件',
    '  ☐ 待辦追蹤表',
    '  ☐ 成果檢核表',
    '  ☐ 經費與憑證',
    '  ☐ 活動照片與照片說明',
    ''
  ];
  if (opts.folderUrl) lines.push('Drive 專案資料夾：' + opts.folderUrl);
  if (opts.taskUrl) lines.push('待辦追蹤表：' + opts.taskUrl);
  if (opts.checklistUrl) lines.push('成果檢核表：' + opts.checklistUrl);
  if (opts.extra) {
    lines.push('');
    lines.push(opts.extra);
  }
  lines.push('');
  lines.push('提醒：正式公告、經費核銷與成果送出仍需人工確認。');
  return lines.join('\n');
}
