# 常見錯誤排解

> 找錯的順序：先看 **Apps Script 編輯器 → 執行作業（Executions）** 內最近一筆紅色失敗紀錄，點開看完整錯誤訊息，再用下面的對照表找解法。

---

## 安裝階段

### 「找不到 Drive 資料夾」

**錯誤訊息範例：**
```
Exception: Unexpected error while getting the method or property getFolderById on object DriveApp.
```

**原因與解法（由常見到不常見）：**

1. **ID 抄錯**：檢查 `CONFIG.ROOT_FOLDER_ID` 是否完整、沒有多餘空白、沒有把網址也貼進去
2. **資料夾被刪了**：到 Drive 確認資料夾還在（沒被丟進垃圾桶）
3. **權限不足**：你用 A 帳號跑腳本，但資料夾屬於 B 帳號 → 把資料夾分享給 A，或改用 B 跑

---

### 「Apps Script 授權失敗」

**症狀：** 按執行後跳出「Authorization required」但點下去沒反應。

**解法：**
1. 把瀏覽器的彈跳視窗封鎖**暫時關掉**
2. 重新點執行
3. 跳出授權對話框後依序完成
4. 如果出現「Google 尚未驗證這個應用程式」**這是正常的**——點「進階」→「前往（不安全）」

---

### 「Calendar API 沒啟用」

**錯誤訊息範例：**
```
Calendar API has not been used in project XXXX before or it is disabled.
```

**解法：**
1. Apps Script 編輯器左側 → **服務（Services）**
2. 點「+ 新增服務」
3. 找 `Google Calendar API` → 新增
4. 重跑 `setupAdminWorkflow`

---

### 觸發器沒裝起來

**症狀：** 安裝完跑測試 3，表單送出後什麼都沒發生。

**檢查：**
1. Apps Script 編輯器左側 → **觸發條件（Triggers）**
2. 應該看到兩個觸發器：`onFormSubmit`、`onMilestoneFormSubmit`，事件來源都是「來自試算表」、事件類型「提交表單時」

**解法：**

- 如果觸發器**完全沒出現** → 重跑 `setupAdminWorkflow`，注意 Logger 是否有「installFormSubmitTrigger」相關錯誤
- 如果觸發器**出現但無法執行**（紅色驚嘆號）→ 點該觸發器看詳情，通常是授權過期，按提示重新授權

---

## 執行階段

### 「表單送出後沒收到通知信」

**檢查順序：**

1. **看執行作業是不是有錯**
   - Apps Script → 執行作業 → 看 `onFormSubmit` 最近一筆狀態
   - 紅色 → 點開看錯誤
   - 綠色 → 表示腳本跑完了，問題在 Gmail 端
2. **Gmail 寄信配額用完了嗎**
   - 一般 Gmail 一天 100 封，Workspace 一天 1500 封
   - 不太可能用完，但批次匯入 50 個專案時要注意
3. **承辦人 Email 填錯**
   - 看總控表那列的「承辦人Email」欄位
   - 改正後手動寄一封補通知（程式不會自動補寄）

---

### 「Calendar 沒有彈跳提醒」

**症狀：** Calendar 事件建好了，但時間到沒跳通知。

**檢查：**
1. 打開該 Calendar 事件 → 看右側「通知」區
2. 應該有「09:00 之前 — 彈出式」之類的設定
3. 如果完全沒提醒 → 程式建立時沒呼叫 `addPopupReminder()`

**這條跟原作差別最大，請特別檢查 P3 版本是否正確改寫。**

如果你用的還是 P1 骨架版（Code.gs 尚未實作），Calendar 提醒本來就還不會有。

---

### 「配額用盡」

**錯誤訊息範例：**
```
Service invoked too many times for one day: gmail
```

**解法：**
- **Gmail 配額**：暫停一天等 reset；長期解法是改用 Workspace 帳號（一天 1500 封）
- **Drive 配額**（一天 250 個檔案）：減少同時建立的專案數，或拆兩天匯入
- **Apps Script 執行時間配額**（一天 6 小時）：通常是腳本有死迴圈，去 Executions 看哪個函式跑太久

---

### 「總控表欄位錯亂」

**症狀：** 新增專案後，欄位錯位（例如承辦人寫到 Email 欄）。

**原因：** 你手動改了總控表的欄位名稱或順序。

**解法：**
1. **不要手動改總控表的標題列**
2. 如果已經改了，回頭把標題列改回程式預期的名稱（見 [01-architecture.md](./01-architecture.md) 「總控表」欄位表）
3. 已有錯位的列手動修正即可

---

## 維護階段

### 「我想換 Drive 總資料夾」

**做法：**
1. 改 `CONFIG.ROOT_FOLDER_ID` 為新資料夾 ID
2. **不要**清除 `PropertiesService` 內的其他 ID（表單還在舊資料夾）
3. 把舊資料夾內的 `03_專案資料夾/*` 全部移到新資料夾
4. 把舊的兩張表單檔案、總控表也移到新資料夾的對應子資料夾
5. 重跑 `setupAdminWorkflow` 確認沒新建重複資源

> **更乾淨的做法**：跑 `resetAdminWorkflow(false)` 完全重置 → 改 CONFIG → 重新 setup → 把舊專案資料夾手動搬過來。

---

### 「我想改表單欄位但不想重建專案」

**可以安全做的：**
- 改題目文字、說明、選項顯示名稱

**會出問題的：**
- 刪除必填欄位、改題型、改欄位名稱

詳見 [02-form-fields.md 第 3 節](./02-form-fields.md#3-自訂表單欄位的步驟)。

---

### 「我想合併兩個專案」

**現況：** 系統沒提供合併功能（合併是「需要判斷的事」，不應自動化）。

**手動做法：**
1. 在總控表選定主專案、要併入的副專案
2. 把副專案資料夾內檔案搬到主專案資料夾
3. 把副專案的待辦表項目用「複製值」貼到主專案的待辦表
4. 把副專案在 Calendar 的事件改名加上 `[已併入 XXX]`
5. 在總控表副專案那列「專案狀態」改為「已合併到 XXX」（保留歷史紀錄，不刪除）

---

### 「我想看誰建了哪個專案」

每個專案在總控表都有「承辦人」與「建立日期」。階段日期紀錄也記錄了「建立者Email」。

**進階：** 在 Apps Script 編輯器 → 執行作業（Executions）可以看每次觸發是誰的帳號跑的（執行歸屬於觸發器擁有者）。

---

## 萬一卡住了

1. **看 [03-testing.md](./03-testing.md)** 的對應測試項，按驗收標準逐項排查
2. **看本系統的 [GitHub Issues](#)**（你 push 後會有連結）
3. **去回報問題**：用 [.github/ISSUE_TEMPLATE/install-failed.md](../.github/ISSUE_TEMPLATE/install-failed.md) 模板
4. **緊急狀況**：先跑 `resetAdminWorkflow(false)` 全部重置，再從 [00-quickstart.md](./00-quickstart.md) 重新開始（你的歷史專案資料夾不會被刪）
