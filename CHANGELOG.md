# 變更紀錄

依照 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/) 格式。
版本編號遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

---

## [Unreleased]

### 規劃中

- 實機驗收（`docs/checklists/install-test-30min.md`），確認提醒時間與表單發布狀態
- v1.0.0：打 tag、補真實截圖

---

## [1.0.0-rc.1] — 2026-10-01

### Fixed

- **通知信寄不出去**：改用 `MailApp.sendEmail`。原本的 `GmailApp` 需要 `https://mail.google.com/` 權限，但 `appsscript.json` 沒有列，所有通知信與 `testSendMail()` 都會權限錯誤
- **連按兩次送出會建出兩個同編號專案**：總控表改為在鎖內先寫「建立中」佔位列，建完再回填；建立失敗的列標為「錯誤」、「建立中」超過 10 分鐘視為中斷，兩者都可直接重送
- **「當天提醒」被靜默略過、其餘提醒在半夜跳**：事件由全天改為當天 08:00–08:30；提醒以 08:00 起算，「當天」為 07:55（Calendar 規定至少提前 5 分鐘）
- **照 README 安裝會出現 `xxx is not defined`**：README、00-quickstart、scripts/README 補上完整 8 個檔案清單

### Changed

- `appsscript.json` 移除未使用的 `gmail.send` 與 `script.external_request` 權限
- 版本號統一為 `1.0.0-rc.1`（原本程式寫 `1.0.0-fork`、CHANGELOG 寫 `0.1.0-skeleton`）

### Docs

- 04-troubleshooting 新增「xxx is not defined」「GmailApp 權限」「卡在建立中」三段
- 01-architecture 更新 onFormSubmit 流程與專案狀態值
- 07-faq-for-principals 補充權限說明
- 修正文件小錯：01-architecture 步驟編號、throttle 實際存在 CacheService、配額錯誤訊息為 `email`、config 檔放法說法統一

---

## [1.0.0-fork] — 2026-05-20（未打 tag）

### Added

- P2 docs 八份、P3 Apps Script 七個模組、P4 教材與去識別化範例、CONTRIBUTING
- 治理層：PROJECT_PLAYBOOK、決策日誌、WORK_LOG、pre-public 與 30 分鐘驗收清單、secret-scan workflow

---

## [0.1.0-skeleton] — 2026-05-20

### Added

- repo 初始骨架
- 主 README（痛點導向，目標讀者為學校主任/組長）
- LICENSE（MIT，保留原作 Albert Peng 與本 fork 雙重版權聲明）
- ACKNOWLEDGEMENTS.md（顯眼致謝原作 mihozip）
- 完整目錄結構：docs/、src/、lessons/、examples/、scripts/、.github/
- .gitignore（排除敏感設定）

### Forked from

[mihozip/google-workspace-admin-project-workflow](https://github.com/mihozip/google-workspace-admin-project-workflow) commit at 2026-05-20。
