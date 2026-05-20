/**
 * config.example.gs — 設定範本
 *
 * 使用步驟：
 *   1. 複製整段 CONFIG 物件
 *   2. 貼到 Code.gs 最上方（在 const VERSION 之後）
 *   3. 修改下面 4 個必填欄位
 *   4. 切勿把含真實 ID 的設定 commit 到公開 GitHub
 *
 * 進階：你可以把 CONFIG 放到獨立的 config.gs 檔案，
 * .gitignore 已排除 config.gs，避免敏感資訊外洩。
 */

const CONFIG = {
  // ====================================================================
  // 必填：4 個基本設定
  // ====================================================================

  // 1. Google Drive 總資料夾 ID
  //    從 Drive 網址 /folders/ 後面那串複製，例：1aBcDe-FgHiJ_kLmNoPqRsTuVwXyZ0123
  ROOT_FOLDER_ID: 'YOUR_GOOGLE_DRIVE_ROOT_FOLDER_ID',

  // 2. Google Calendar ID（單日曆模式）
  //    用個人主日曆填 'primary'
  //    用學校共用日曆填 xxxxx@group.calendar.google.com
  CALENDAR_ID: 'primary',

  // 3. 管理者 Email（系統錯誤通知會寄到這裡）
  ADMIN_EMAIL: 'admin@example.com',

  // 4. 時區（影響日期顯示與 Calendar 事件時間）
  TIMEZONE: 'Asia/Taipei',

  // ====================================================================
  // 進階：可選設定
  // ====================================================================

  // 行政專案總控表 ID
  // 留空字串，系統會自動建立並回填 PropertiesService
  CONTROL_SHEET_ID: '',

  // 多日曆派發（取消註解啟用）
  // 設定後，系統會依「承辦處室」自動把事件建到對應 Calendar
  // 找不到對應就用 default
  //
  // CALENDARS: {
  //   '教務處': 'xxxxx@group.calendar.google.com',
  //   '學務處': 'yyyyy@group.calendar.google.com',
  //   '總務處': 'zzzzz@group.calendar.google.com',
  //   '資訊組': 'wwwww@group.calendar.google.com',
  //   'default': 'primary'
  // },

  // 錯誤通知 throttle 秒數
  // 相同錯誤在此秒數內不重複寄信給 ADMIN_EMAIL，避免錯誤連鎖灌爆信箱
  // 預設 600 秒（10 分鐘）；CacheService 最大 21600（6 小時）
  ERROR_THROTTLE_SECONDS: 600
};
