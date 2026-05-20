# lib/ — 模組拆分

主程式 `Code.gs` 對外只暴露 4 個函式（setup/onForm/onMilestone/reset），所有實作細節分散在這六個 lib 檔案。

| 檔案 | 職責 |
|---|---|
| `utils.gs` | 字串/檔名 sanitize、日期解析、表單回應解析、流水號生成（含 LockService）、dedupe、PropertiesService 包裝 |
| `folders.gs` | Drive 資料夾建立、11 個子資料夾命名規約、檔案搬移、reset 用的封存 |
| `forms.gs` | 兩張 Google Forms 的欄位定義、觸發器安裝/移除 |
| `sheets.gs` | 4 種試算表 schema（總控表/階段日期紀錄/待辦/檢核）、CRUD、預設任務與檢核項目、專案紀錄 Docs 建立 |
| `calendar.gs` | 多日曆派發、popup reminder（本 fork 對原作的關鍵改進）、事件描述模板 |
| `notifications.gs` | Gmail 通知（新專案/階段日期/重複專案/錯誤）、錯誤 throttle（CacheService） |

## GAS 載入順序

Google Apps Script 把專案內所有 `.gs` 檔合併到單一 V8 環境執行，**全部函式都在同一個 global scope**。檔案順序不影響可見性，但編輯器顯示順序按字母排，建議在 GAS 編輯器把 `Code.gs` 拉到最上面方便閱讀。

## 載入到 GAS 的兩種方式

### 方式 A：手動逐檔複製貼上（推薦給第一次使用）

1. 在 Apps Script 編輯器點「+」新增檔案
2. 命名為 `lib_utils`（GAS 不允許 `/`）
3. 把 `lib/utils.gs` 內容貼進去
4. 對其他 5 個 lib 檔重複

### 方式 B：用 clasp 命令列工具同步

```bash
npm install -g @google/clasp
clasp login
clasp create --type standalone --title "學校行政專案工作流"
clasp push
```

對開發者較友善，但需要 Node.js 環境。

## 不該動的東西

- `PROJECT_SUBFOLDERS` (folders.gs)：11 個子資料夾的順序與命名是 schema 一部分。改了會讓既有專案找不到正確子資料夾。
- `CONTROL_HEADERS` / `MILESTONE_HEADERS` / `TASK_HEADERS` / `CHECKLIST_HEADERS` (sheets.gs)：對應到既有總控表的欄位順序。改了會錯位。
- `VERSION` (Code.gs)：升級遷移腳本會用它判斷該跑哪一段遷移。

## 安全可以改的東西

- 預設任務的內容與數量（buildDefaultTasks）
- 預設檢核項目（createResultChecklistSheet 內的 rows）
- 通知信文字模板（notifications.gs 各函式）
- Calendar 事件描述的格式（buildEventDescription）
- 預設提醒天數（calendar.gs 各 `createInitialProjectEvents` 內的 reminderDays）
