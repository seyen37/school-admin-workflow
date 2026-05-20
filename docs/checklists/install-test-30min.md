# 安裝測試 30 分鐘執行清單

> 目標：跑完這份清單 = 可以放心把 repo 從 Private 切 Public。
> 前置：你已 git push 完成、有 Google Workspace 帳號、有空閒 30 分鐘。

整份清單分 4 個時段，每段都有明確的 ✅ 通過條件與 ❌ 失敗對照。

---

## 時段 1：前置確認（5 分鐘）

### 1.1 帳號權限自檢

打開 [drive.google.com](https://drive.google.com)、[calendar.google.com](https://calendar.google.com)、[script.google.com](https://script.google.com)，**三個都能進去** = 通過。

- [ ] Drive 能開、能建資料夾
- [ ] Calendar 能開、能新增事件
- [ ] Apps Script 能開（如果跳「組織管理員未啟用此服務」→ 請你校內 IT 開放）

### 1.2 建立測試用總資料夾

- [ ] 在 Drive 建立資料夾 `學校行政專案工作流-測試`
- [ ] 複製資料夾網址，從 `/folders/` 後面取出 ID 貼到記事本

### 1.3 取得 Calendar ID

- [ ] 用 `primary`（個人主日曆，最簡單）→ 跳過下一步
- [ ] 或從 [calendar.google.com](https://calendar.google.com) → 設定 → 找你要用的日曆 → 「整合日曆」→ 複製日曆 ID

---

## 時段 2：安裝（5 分鐘）

### 2.1 建立 Apps Script 專案

- [ ] 開 [script.google.com](https://script.google.com) → 新增專案
- [ ] 命名 `school-admin-workflow-測試`

### 2.2 貼上程式碼（**8 個檔案**）

依以下順序，每個檔案分別新增：

| GAS 編輯器內檔名 | 內容來源 |
|---|---|
| `Code.gs`（系統自動建立） | 把本 repo `src/Code.gs` 全部貼進去（覆蓋原本的 `function myFunction`） |
| `appsscript.json`（需先在 Project Settings → 勾「顯示」） | 貼 `src/appsscript.json` |
| `lib_utils.gs`（手動新增） | 貼 `src/lib/utils.gs` |
| `lib_folders.gs` | 貼 `src/lib/folders.gs` |
| `lib_forms.gs` | 貼 `src/lib/forms.gs` |
| `lib_sheets.gs` | 貼 `src/lib/sheets.gs` |
| `lib_calendar.gs` | 貼 `src/lib/calendar.gs` |
| `lib_notifications.gs` | 貼 `src/lib/notifications.gs` |

- [ ] 全部貼好 → Ctrl + S 儲存

### 2.3 加入 CONFIG 設定

回到 `Code.gs`，在 `const VERSION = '1.0.0-fork';` 那行**下方**貼上設定（從 `src/config.example.gs` 複製）：

```javascript
const CONFIG = {
  ROOT_FOLDER_ID: '你的測試資料夾 ID',
  CONTROL_SHEET_ID: '',
  CALENDAR_ID: 'primary',
  ADMIN_EMAIL: '你的 Email',
  TIMEZONE: 'Asia/Taipei',
  ERROR_THROTTLE_SECONDS: 600
};
```

- [ ] 4 個必填欄位都改成自己的
- [ ] Ctrl + S 儲存

---

## 時段 3：5 項核心驗收測試（15 分鐘）

### 測試 1：Drive 連線（30 秒）

執行 → 函式選 `testDriveFolder` → 點「執行」。第一次會跳授權，依畫面完成。

- ✅ **通過**：執行記錄印出「Drive 連線正常，總資料夾名稱：學校行政專案工作流-測試」
- ❌ **失敗**：
  - 「找不到 ID」→ CONFIG 中的 `ROOT_FOLDER_ID` 有空白或不完整
  - 「沒有權限」→ 確認登入的帳號是該資料夾的擁有者

### 測試 2：setupAdminWorkflow 全綠（2 分鐘）

執行 → 函式選 `setupAdminWorkflow` → 點「執行」。

- ✅ **通過（4 項全部要看到）**：
  - [ ] Logger 印出「`=== setupAdminWorkflow 完成 ===`」
  - [ ] Logger 印出兩個表單填寫網址（複製貼到記事本）
  - [ ] Drive 總資料夾下出現 5 個子資料夾（`01_公文專案啟動表`、`02_專案總控表`、`03_專案資料夾`、`04_專案階段日期新增表`、`06_Apps Script`）
  - [ ] Apps Script 編輯器左側「觸發條件」出現 `onFormSubmit` + `onMilestoneFormSubmit` 兩個觸發器
- ❌ **失敗** → 看 [`docs/04-troubleshooting.md`](../04-troubleshooting.md) 對應段

### 測試 3：第一筆測試專案（5 分鐘）— **核心 happy path**

打開 Logger 印出的「公文專案啟動表填寫網址」，填一筆測試資料：

```
專案年度：測試
承辦處室：資訊組
專案名稱：30分鐘驗收測試
承辦人：（你的名字）
承辦人Email：（你的 Email）
活動日期：（任選 7 天內的日期）
成果繳交期限：（活動日 +1 週）
經費核銷期限：（活動日 +2 週）
其他欄位空白
```

送出後 **10 秒內**確認：

- ✅ **通過（7 項全要打勾）**：
  - [ ] 你的 Email 收到「【行政專案已建立】30分鐘驗收測試」通知信
  - [ ] Drive `03_專案資料夾/` 下出現 `測試_資訊組_30分鐘驗收測試/`
  - [ ] 該資料夾內有 **11 個子資料夾**（`00_原始公文與附件` 到 `99_系統產生文件`）
  - [ ] `99_系統產生文件/` 內有 3 個檔案（專案紀錄 Docs / 待辦追蹤表 / 成果檢核表）
  - [ ] 待辦追蹤表開起來有 10 列預設任務
  - [ ] 成果檢核表開起來有 10 列預設項目
  - [ ] 行政專案總控表新增一列，**ProjectCode 是 `測試-資訊-001`**（人類友善流水號 ✅）
- ❌ **失敗** → 看 Apps Script 編輯器「執行作業」分頁，找最近的 `onFormSubmit` 紅色錯誤

### 測試 4：dedupe 防重複（2 分鐘）— **本 fork 對原作改進 #1**

**用同樣資料**再填一次表單送出。

- ✅ **通過**：
  - [ ] 總控表**不會**多一列（仍只有測試-資訊-001）
  - [ ] Drive **不會**多一個資料夾
  - [ ] 你收到「【提醒】偵測到重複專案」通知信（**而不是**新建立通知）
- ❌ **失敗**：總控表多了一列 → `findExistingProjectByDedupeKey` 沒有運作，去 Executions 看 onFormSubmit log

### 測試 5：Calendar Popup Reminder（3 分鐘）— **本 fork 對原作改進 #2**

打開你的 Calendar，找剛才測試 3 建立的事件：

- 【活動日】測試_資訊組_30分鐘驗收測試
- 【成果期限】測試_資訊組_30分鐘驗收測試
- 【經費核銷期限】測試_資訊組_30分鐘驗收測試

點開任一事件 → 看右側「通知」區。

- ✅ **通過**（這是本 fork 對原作的關鍵改進，必須驗證）：
  - [ ] 活動日事件有 **2 個 popup reminder**（當天 + 前 1 天）
  - [ ] 成果期限事件有 **3 個 popup reminder**（前 7 / 前 3 / 當天）
  - [ ] 經費核銷期限事件有 **2 個 popup reminder**（前 7 / 當天）
- ❌ **失敗**：事件存在但沒任何通知 → `lib/calendar.gs` 的 `addPopupReminder` 沒被呼叫到，去 Executions 看 createInitialProjectEvents log

---

## 時段 4：清理 + Public（5 分鐘）

### 4.1 dry-run reset 測試（1 分鐘）

執行 → 函式選 `resetAdminWorkflow` → **不要直接點執行**，先在編輯器 console 模擬呼叫。

打開「執行」旁邊的下拉 → 找不到怎麼帶參數？改成這樣：

新增一個函式專門做 dry-run 測試：

```javascript
function runDryRunReset() {
  resetAdminWorkflow(true);
}
```

執行 `runDryRunReset`。

- ✅ **通過**：Logger 印出 `[DRY-RUN] 將刪除觸發器：onFormSubmit`、`[DRY-RUN] 將清空 PropertiesService：...` 等，但 **Drive 與 Calendar 完全沒動**
- ❌ **失敗**：實際東西被刪了 → 立刻停止，這是嚴重 bug，回報 issue

### 4.2 清理測試資料（2 分鐘）

測試 3 建立的測試專案資料夾可以保留作紀錄，也可以清掉：

- [ ] 手動把 Drive `03_專案資料夾/測試_資訊組_30分鐘驗收測試/` 移到「垃圾桶」
- [ ] 從行政專案總控表刪掉「測試-資訊-001」那一列
- [ ] 從 Calendar 刪掉 5 個測試事件（搜尋「30分鐘驗收測試」批次刪）

如果要把整個系統重置（為了下一次乾淨安裝）：

- [ ] 把 `runDryRunReset` 改成 `runRealReset()` 內含 `resetAdminWorkflow(false)` 後執行
- [ ] 確認觸發器都被刪、PropertiesService 全空

### 4.3 確認 GitHub Actions 綠燈（1 分鐘）

- [ ] 開 <https://github.com/seyen37/school-admin-workflow/actions>
- [ ] 找最近一次 `Secret Scan` workflow → 應該是綠勾 ✅
- ❌ 紅燈 → 點進去看 step output，告訴我具體哪行 fail

### 4.4 切 Public（1 分鐘）

> ⚠️ **最後一道保險**：再次跑 [`pre-public.md`](./pre-public.md) checklist 第 2、3 項心裡確認一次。

- [ ] 開 <https://github.com/seyen37/school-admin-workflow/settings>
- [ ] 拉到底 → Danger Zone → **Change repository visibility** → Make public
- [ ] 系統會要求輸入 repo 名稱二次確認
- [ ] 切完立刻檢查首頁能否被未登入瀏覽器訪問

**backup repo (seyenbot) 保持 Private**——依 personal-playbook §3.5 規約。

---

## 整體通過標準

跑完上述全部 → **以下 5 條全部 ✅ = 可以放心宣布上線**：

- [ ] 5 個核心測試全綠（時段 3）
- [ ] dry-run reset 沒誤刪（4.1）
- [ ] GitHub Action `Secret Scan` 綠燈（4.3）
- [ ] 沒收到任何 admin 錯誤 email（整個 30 分鐘期間）
- [ ] 你願意把這個 repo 介紹給同事

---

## 失敗對照索引

| 失敗類型 | 看哪裡 |
|---|---|
| 安裝步驟卡住 | [`docs/00-quickstart.md`](../00-quickstart.md) |
| 程式錯誤訊息 | [`docs/04-troubleshooting.md`](../04-troubleshooting.md) |
| 表單欄位疑問 | [`docs/02-form-fields.md`](../02-form-fields.md) |
| 想看完整測試清單 | [`docs/03-testing.md`](../03-testing.md) |
| 想重置整個系統 | [`docs/05-uninstall.md`](../05-uninstall.md) |

---

## 跑完之後

驗證通過後建議做的 3 件事：

1. **Tag release v1.0.0-fork**：
   ```powershell
   git tag v1.0.0-fork
   git push origin v1.0.0-fork
   git push backup v1.0.0-fork
   ```
2. **截 3 張圖補進 `docs/images/`**：公文表單 / Drive 自動建好的資料夾 / 總控表畫面 → 重新 commit 推上去 → README 的「看一眼成果」段就能展示真實畫面
3. **寫一條短訊發布**：FB / Line / Slack「我把學校行政流程自動化做成開源工具了，分享給有興趣的學校」
