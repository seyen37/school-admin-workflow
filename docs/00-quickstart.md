# 5 分鐘安裝指南

> 本指南預設你**第一次接觸 Google Apps Script**。如果你已經熟悉 GAS，可以直接跳到第 4 步。

---

## 安裝前自我檢查（3 分鐘）

請先確認下列五件事，缺一不可。

- [ ] **我有 Google 帳號**（學校 Workspace 或一般 Gmail 都可以）
- [ ] **我能在 Google Drive 建立新資料夾**
- [ ] **我能新增 Google Calendar 事件**（學校管理員沒鎖住 Calendar API）
- [ ] **我能用 Gmail 寄信**（這是寄通知信給承辦人用的）
- [ ] **我能開啟 [script.google.com](https://script.google.com)**（學校 IT 沒擋 Apps Script）

> **如果第 5 項被擋住**：請聯絡學校資訊組或 Workspace 管理員，請他們把 Apps Script 加入允許清單。這是 Google Workspace Admin Console 的設定，不是 Google 本身的限制。

---

## 1. 在 Drive 建立總資料夾

1. 打開 [Google Drive](https://drive.google.com)
2. 在你個人資料夾或共用雲端硬碟下，建立一個新資料夾
3. 命名建議：`學校行政專案工作流`（之後 11 個專案資料夾都會生在這裡面）

> **建議用共用雲端硬碟**：若你打算讓多人協作或將來離職交接，請放在學校的「共用雲端硬碟」，不要放個人帳號。原因見 [07-faq-for-principals.md 第 2 題](./07-faq-for-principals.md)。

---

## 2. 取得 Drive 總資料夾 ID

1. 打開剛建立的資料夾
2. 看瀏覽器網址列，會像這樣：
   ```
   https://drive.google.com/drive/folders/1aBcDe-FgHiJ_kLmNoPqRsTuVwXyZ0123
   ```
3. **複製 `/folders/` 後面那串**：`1aBcDe-FgHiJ_kLmNoPqRsTuVwXyZ0123`
4. 貼到記事本暫存，後面要用

---

## 3. 取得 Calendar ID

兩種選法：

### 選法 A：用個人主日曆（最簡單）

ID 就是字串 `primary`，直接使用，跳過下面步驟。

### 選法 B：用學校共用日曆（推薦）

1. 打開 [Google Calendar](https://calendar.google.com)
2. 左側「我的日曆」找到你要用的日曆 → 滑鼠移上去 → 點三個點 → **設定與共用**
3. 往下滑到「整合日曆」區塊
4. 複製「**日曆 ID**」，長得像 `xxxxxx@group.calendar.google.com`
5. 貼到記事本暫存

---

## 4. 建立 Apps Script 專案

1. 打開 [script.google.com](https://script.google.com)
2. 點左上角的「**+ 新增專案**」
3. 把專案改名（左上）：`學校行政專案工作流`
4. 你會看到一個空白的 `Code.gs`，**先別動它**

---

## 5. 貼上程式碼

1. 開啟本 repo 的 [src/Code.gs](../src/Code.gs)
2. 全選 → 複製
3. 回到 Apps Script，貼到 `Code.gs`（覆蓋原本的 `function myFunction()`）
4. 同樣方式把 [src/config.example.gs](../src/config.example.gs) 的內容貼到 Code.gs 最上方（在 `const VERSION = ...` 之後）

---

## 6. 改 4 行設定

把 `CONFIG` 中這 4 個值改成你的：

```javascript
const CONFIG = {
  ROOT_FOLDER_ID: '貼你在第 2 步複製的 Drive ID',
  CONTROL_SHEET_ID: '',                        // 留空，系統會自動建立
  CALENDAR_ID: '貼你在第 3 步複製的 Calendar ID',
  ADMIN_EMAIL: '你的 Email（出錯會寄給你）',
  TIMEZONE: 'Asia/Taipei',
  ERROR_THROTTLE_SECONDS: 600
};
```

按 **Ctrl + S** 儲存。

---

## 7. 執行 `setupAdminWorkflow()`

1. 在 Apps Script 編輯器頂端，函式下拉選單選 **`setupAdminWorkflow`**
2. 點「執行」
3. **第一次會跳出授權對話框**，這是正常的：
   - 點「審查權限」
   - 選你的 Google 帳號
   - 出現「Google 尚未驗證這個應用程式」→ 點左下「進階」→ 「前往（不安全）」
   - 同意一系列權限（Drive、Forms、Sheets、Docs、Calendar、Gmail）

> **「不安全」是嚇人但正常的訊息**：因為這支腳本是你自己寫的（不是 Google 上架審查過的應用），所以會顯示這段警告。實際上權限只在你自己的 Google 帳號內運作。

4. 授權完會自動再執行一次
5. 看執行結果頂端是不是顯示「執行完成」（綠色勾）

---

## 8. 從 Logger 取得表單網址

1. 在 Apps Script 編輯器，點左側「**執行作業**」（Executions）
2. 找到剛剛跑完的 `setupAdminWorkflow`，點開
3. 你會看到一長串訊息，其中有：
   ```
   公文專案啟動表填寫網址：https://docs.google.com/forms/d/e/.../viewform
   專案階段日期新增表填寫網址：https://docs.google.com/forms/d/e/.../viewform
   行政專案總控表：https://docs.google.com/spreadsheets/d/.../edit
   ```
4. **把這三個網址複製、貼到 Google 文件保存**

---

## 9. 試填一筆測試資料

1. 打開「公文專案啟動表填寫網址」
2. 隨便填一份測試專案（專案年度填 `測試`、其他必填欄位隨意）
3. 送出
4. **5 秒內**檢查：
   - [ ] Drive 總資料夾 → `03_專案資料夾` → 出現一個新資料夾
   - [ ] 該資料夾內有 11 個子資料夾（`00_原始公文...`、`01_計畫書...` 等）
   - [ ] 該資料夾內有 3 個檔案（專案紀錄 Docs、待辦追蹤表、成果檢核表）
   - [ ] 行政專案總控表新增一列
   - [ ] 你的 Email 信箱收到一封「【行政專案已建立】測試」

全部打勾 → 安裝成功 ✅

任何一項沒勾到 → 看 [04-troubleshooting.md](./04-troubleshooting.md)

---

## 10. 把表單網址分享給承辦人

兩張表單網址（公文專案啟動表 + 專案階段日期新增表）就是承辦人**唯一需要的東西**。

建議：

1. 把兩個網址做成 QR Code 或短網址
2. 印出來貼在辦公室
3. 在校內公告或 Line 群組分享
4. 用 [docs/06-privacy-template.md](./06-privacy-template.md) 寫一份簡短的「使用說明」一起發

---

## 完成後下一步

- 想懂運作原理 → [01-architecture.md](./01-architecture.md)
- 想客製表單欄位 → [02-form-fields.md](./02-form-fields.md)
- 想做完整驗收測試 → [03-testing.md](./03-testing.md)
- 想知道資料怎麼移除 → [05-uninstall.md](./05-uninstall.md)
