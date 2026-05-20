# 致謝

本專案 fork 自 [mihozip/google-workspace-admin-project-workflow](https://github.com/mihozip/google-workspace-admin-project-workflow)，並在原作的基礎上重新設計、擴充功能、改寫文件與教材。

---

## 原作者

**Albert Peng (mihozip)**

- 原 repo：<https://github.com/mihozip/google-workspace-admin-project-workflow>
- License：MIT
- 我們深深感謝原作者在學校行政工作流自動化上的開創性嘗試，以及把整套設計開源讓更多學校受惠的胸襟。

---

## 我們完整繼承自原作的設計

以下這些設計原則與架構，是原作的智慧財產，我們完整繼承：

- 「公文 → 自動建專案 → 追蹤 → 成果」的整體工作流概念
- 「一案一資料夾、一案一紀錄、一案多日期、一案一知識庫」四大原則
- 11 個標準化 Drive 資料夾的命名與順序（00 原始公文…99 系統產生文件）
- 公文專案啟動表 + 專案階段日期新增表的雙表單架構
- 「AI 不取代判斷，只負責建檔、追蹤與提醒」的人機分工原則
- 公文附件由承辦人手動上傳到專案資料夾，而非透過表單上傳的決策
- 不自動執行：正式公告、經費核銷、成果送出、對外通知、法規判斷、簽核

---

## 本 fork 的擴充範圍

我們在原作之上做了以下重新設計與功能增強：

### 文件層

- 重寫 README，從「定位導向」改為「痛點導向」，主軸聚焦學校主任/組長視角
- 新增 [給主任的 FAQ](./docs/07-faq-for-principals.md)：10 題校長/主任會問的問題
- 新增 [隱私說明範本](./docs/06-privacy-template.md)：給承辦人可直接貼用的校內公告
- 新增 [移除/重置指南](./docs/05-uninstall.md)
- [測試流程](./docs/03-testing.md)補上明確的「驗收標準」與「失敗對照表」
- 在 [安裝指南](./docs/00-quickstart.md)補上前置檢查清單與截圖

### 程式層

- **防止重複送出**：表單重複提交不會建立兩份資料夾
- **真正會跳提醒的 Calendar 事件**：補上 `addPopupReminder()`，不是只把日期記在日曆
- **多日曆支援**：依承辦處室自動派發到對應的 Calendar
- **人類友善的專案編號**：從 `115-教務處-0520143015` 改成 `115-教務-001`
- **錯誤通知 throttle**：相同錯誤 10 分鐘內不重複寄信
- **拆模組**：原本一個大函式拆成 folders/forms/sheets/calendar/notifications 五個 lib
- **加入 VERSION 字串與升級遷移腳本骨架**
- **加 `resetAdminWorkflow()` dry-run 模式**

### 教材與範例

- 教材原始稿改為 Markdown（原作為 HTML），HTML 由 Markdown 自動產生
- 新增 [examples/](./examples/) 提供一個完整跑過、去識別化的範例專案
- 新增 [CONTRIBUTING.md](./CONTRIBUTING.md) 與 GitHub Issue Template

### 安全與維運

- 新增 GitHub Action `secret-scan.yml` 自動擋住誤 commit 的 Drive/Calendar ID
- `src/config.example.gs` 與真實設定分離，避免敏感資訊外洩
- 加入 `.gitignore` 排除常見洩漏路徑

---

## License 沿用

本 repo 沿用原作的 MIT License。原作版權聲明完整保留於 [LICENSE](./LICENSE) 檔案中。

如果你也想 fork 本專案，請繼續保留原作 Albert Peng 與本 fork 維護者的版權聲明。

---

## 想回饋給原作？

如果本 fork 的某些改進對原作社群也有價值，我們很樂意把對應 patch 提交回 [原 repo](https://github.com/mihozip/google-workspace-admin-project-workflow) 的 issue / PR。歡迎在本 repo 的 issues 中 ping 我們協助打包。
