# 貢獻指南

> 歡迎你 fork 本專案、改成貴校的樣子、回饋改進。本指南說明怎麼貢獻才能讓改進最容易被合併。

---

## 1. 歡迎什麼樣的貢獻

### ✅ 我們會積極合併

- **bug 回報與修復**：流程跑不通、權限問題、配額處理
- **文件改進**：錯字、不清楚的步驟、新增使用情境
- **去識別化範例**：你的學校試辦結果（人名要徹底匿名）
- **預設任務與檢核項目的學科客製版本**：你的處室 / 學校的工作流可能有特殊欄位
- **語言本地化**：簡體中文、英文、日文…

### ⚠️ 會看情況討論

- **新功能提案**：先看「2. 設計原則」是否符合本系統定位
- **效能優化**：學校場景配額很寬鬆，要先確認真的有瓶頸
- **UI 改造**：除非有明顯使用者痛點，否則暫不接受 UI 重寫

### ❌ 通常不會合併

- 把「人工確認的事」自動化：例如自動發布正式公告、自動核銷、自動對外發文
- 引入大量第三方依賴：本系統刻意只用 Google Workspace 內建服務
- 違反 [LICENSE](./LICENSE) 與致謝原則的修改

---

## 2. 設計原則（不可違背）

任何 PR 都會用這四條原則檢視：

### 2.1 AI 不取代判斷

> AI 的角色是把資料收齊、流程開好、期限提醒、文件整理與成果草稿先準備好。
> 正式公告、經費核銷、成果送出、對外發文、簽核——這些仍由人決定。

如果你的 PR 包含「自動發送對外文件」這類功能，**請先在 issue 討論為什麼適合自動化**。

### 2.2 一案一資料夾、一案一紀錄、一案多日期、一案一知識庫

11 個資料夾的命名與順序、4 種試算表的 schema、雙表單的職責分工——這些是**繼承自原作 mihozip** 的設計，**請勿任意修改命名**。

如果你想新增第 12 個資料夾，請在 issue 提議並說明：
- 用途為何
- 為何不能塞進現有 11 個
- 對下游（待辦表、檢核表、Calendar）的影響

### 2.3 不外傳資料

本系統設計上所有資料留在使用者自有 Google Workspace 內。**任何引入外部服務（Webhook、第三方 API、雲端 Function）的 PR 都要先在 issue 討論**。

### 2.4 開源透明

修改要保留[原作 mihozip](https://github.com/mihozip/google-workspace-admin-project-workflow)的致謝。任何抄自他人程式碼的部分要明確標註來源與 license。

---

## 3. 如何回報 bug

1. **先看 [docs/04-troubleshooting.md](./docs/04-troubleshooting.md)** 是否已有解法
2. **看 [GitHub Issues](#) 是否已有人回報**（避免重複）
3. **用 [`install-failed.md` issue template](./.github/ISSUE_TEMPLATE/install-failed.md)** 提交

回報時請務必塗黑：
- 你的 Drive Folder ID
- 你的 Calendar ID
- 學校 Email
- 任何含個資的截圖

---

## 4. 如何提交 PR

### 4.1 在動手前先開 issue

**任何修改超過 10 行的 PR，請先開 issue 討論**。理由：

- 你可能不知道我們已經有相關規劃
- 避免你做完才被退件
- 對齊風格與用詞

### 4.2 fork → branch → PR

```bash
# 1. Fork 本 repo 到你的 GitHub 帳號
# 2. Clone 你的 fork
git clone git@github.com:你的帳號/school-admin-workflow.git
cd school-admin-workflow

# 3. 建立 feature branch（不要直接動 main）
git checkout -b feat/你的功能名

# 4. 動工、commit
git add .
git commit -m "feat: <你做了什麼，為什麼>"

# 5. push 到你的 fork
git push origin feat/你的功能名

# 6. 在 GitHub 介面開 PR 到本 repo 的 main
```

### 4.3 PR 描述模板

```markdown
## 為什麼這個 PR

（描述問題或機會，避免「我想加 X 功能」這種表面陳述）

## 怎麼做

（簡述技術選擇，不超過 5 句）

## 測試

（你怎麼驗證它能跑？跑了哪些 docs/03-testing.md 的測試項？）

## 對既有使用者的影響

（會不會破壞既有專案資料夾？需要 migration 嗎？）

## 對應 issue

Fixes #N（如有開過 issue）
```

---

## 5. Commit message 規約

依 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>: <做了什麼，但重點寫「為什麼」>

<空行>

<更詳細的說明，可以多行>
<為什麼這樣做？嘗試過什麼別的方法？>

<空行>

<相關 issue / decision log>
```

**type 用這幾個**：

| type | 用途 | 範例 |
|---|---|---|
| `feat` | 新功能 | `feat: 多日曆派發，依承辦處室自動路由` |
| `fix` | bug 修復 | `fix: dedupe 在並行送出時撞號` |
| `docs` | 純文件 | `docs: 補 quickstart 截圖步驟` |
| `refactor` | 重構（不改行為） | `refactor: setupAdminWorkflow 拆成 4 個小函式` |
| `test` | 測試相關 | `test: 補上 Calendar reminder 的驗收測試` |
| `chore` | 雜項 | `chore: bump VERSION 1.0.0 → 1.1.0` |
| `init` | 第一次 commit | `init: fork & rewrite from mihozip` |

**寫「為什麼」不寫「做了什麼」**：

```
❌ Bad: "改 dedupe 的邏輯"
✅ Good: "fix: dedupe 用 lock 包整個 critical section
         原本只包 findExisting + generateProjectCode 兩步，
         但 appendToControlSheet 在 lock 外，
         並行送出時可能撞號。"
```

---

## 6. 程式碼風格

### 6.1 Apps Script (.gs)

- **V8 runtime**：用 `const`/`let`、箭頭函式、template literals
- **函式註解**：開頭用 JSDoc 風格的多行註解，說明「做什麼 / 不做什麼 / 何時用 / 何時不用」
- **錯誤處理**：對外進入點（onFormSubmit、onMilestoneFormSubmit）必須 try/catch，失敗要 logError + 視情境 notifyAdminError
- **不直接呼叫 DriveApp / CalendarApp**：請寫進 lib 對應模組，主程式只 orchestration

### 6.2 文件

- **正體中文台灣詞彙**：「程式」「品質」「網路」（不是「程序」「质量」「网络」）
- **避免 emoji**：除非語意上真的有幫助（如 ✅❌ 的對照表）
- **每章節有對應的「為什麼」**：不要只寫「怎麼做」、要說「為什麼這樣做」

---

## 7. 為什麼有些功能不會合併

我們會在以下情境婉拒 PR，請理解這不是針對你個人：

1. **違反「2.1 AI 不取代判斷」**：例如自動對外發文、自動核銷
2. **引入大量依賴**：本系統 Apps Script 純依賴 Google 內建 API，這是穩定性與安全性的設計選擇
3. **過度抽象**：本系統設計給「會用 Google Form 但不會寫 code」的承辦人，過度工程會傷害可維護性
4. **跟既有 schema 衝突**：例如修改 11 個資料夾命名、修改 ProjectCode 格式，會破壞既有專案資料
5. **沒有測試**：請至少跟著 [docs/03-testing.md](./docs/03-testing.md) 跑一遍驗證

---

## 8. 致謝原則

任何 PR 合併後，貢獻者會出現在：

- GitHub Contributors 列表（自動）
- 必要時 ACKNOWLEDGEMENTS.md 中
- 若是重大功能改動，CHANGELOG.md 會註明貢獻者

**請不要要求**：
- 在 LICENSE 加入名字（LICENSE 只列原作 + 本 fork 維護者）
- 加額外的「贊助」段落

---

## 9. 文件 / decision log 的規範

如果你的 PR 包含**新功能或架構改動**，請同時：

1. 在 `docs/decisions/YYYY-MM-DD_<topic>.md` 寫一份決策日誌
2. 五段式：情境 / 選項 / 決定 / 考量 / 教訓
3. 範本見 [`docs/decisions/_TEMPLATE.md`](./docs/decisions/_TEMPLATE.md)

這對應 [`docs/PROJECT_PLAYBOOK.md` §五決策日誌自動化規則](./docs/PROJECT_PLAYBOOK.md)。

---

## 10. 與 AI 助手協作的提示

如果你用 Claude / Gemini / Copilot 協作開發本 repo，請在你的 AI 助手前綴加：

```
請依 docs/PROJECT_PLAYBOOK.md §十「與 AI 協作時的 prompt 片段」執行：

1. 每次工作結束時，自動寫決策流到 docs/decisions/YYYY-MM-DD_topic.md
2. 決策日誌結構：情境 / 選項 / 決定 / 考量 / 教訓 五段式
3. commit message 描述「為什麼」而非「做了什麼」
4. 任何 push 之前跑 docs/03-testing.md 的測試項
5. 公開前跑 docs/checklists/pre-public.md
6. 新模組第一行寫明確「做什麼、不做什麼、何時用、何時不用」
7. 回應用正體中文台灣詞彙
```

---

## 11. 聯絡方式

- **Bug / 功能討論**：GitHub Issues
- **隱私 / 安全問題**：請開 private security advisory（不要在 public issue 公開）

---

謝謝你考慮貢獻這個專案。每一個改進都讓更多學校承辦人省下一點時間。
