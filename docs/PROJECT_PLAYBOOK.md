# 個人專案 Playbook

> ⚠️ **本檔為 admin-project-workflow 套用 personal-playbook 的引用版**
>
> 本檔抄自 [`personal-playbook`](https://github.com/seyen37/personal-playbook)（許士彥個人 SOP 的 source-of-truth），依該 repo README 指引「**0 修改抄入**」。
>
> 因此本檔內部部分連結（例如 `HISTORY.md` § X.Y、`docs/decisions/2026-XX-XX_*.md` 指向 source-of-truth 自身才有的檔案）在 admin-project-workflow 內為失效連結，這是預期行為。
>
> 若想閱讀完整脈絡，請到 source-of-truth repo 查看；admin-project-workflow 內套用 playbook 規則的具體 decisions 在 [`docs/decisions/`](./decisions/)。

---

> 許士彥（Hsu Shih-Yen）GitHub 專案的標準化實踐。
>
> 本文件凝結了個人多個開源專案累積出來的最佳實踐：智慧財產權保護、雙帳號備份、決策日誌自動化、與 AI 協作時的工作紀錄習慣。
>
> **本文件設計為「**通用、可被任何新 repo 直接複製套用**」**：所有自身專屬的歷史紀錄、具體案例 metadata 都另外收錄在 source-of-truth repo 的 [`HISTORY.md`](HISTORY.md)。
>
> **位置慣例**：本文件在 source-of-truth repo（`personal-playbook`）放在 root；複製到其他新專案時放 `docs/PROJECT_PLAYBOOK.md`，避免擾亂主結構。複製後**請勿一併抄走** `HISTORY.md`（那是 source-of-truth repo 自身的歷史，新 repo 應有自己的歷史）。

---

## 目錄

0. [**治理哲學**](#零治理哲學)
1. [新專案第一天清單](#一新專案第一天清單)
2. [智慧財產權三件套](#二智慧財產權三件套)
3. [多帳號 GitHub 備份](#三多帳號-github-備份)
4. [工作紀錄自動化規則](#四工作紀錄自動化規則)
5. [決策日誌自動化規則](#五決策日誌自動化規則)
6. [**資料源稽核（Source-of-Truth Audit）**](#六資料源稽核source-of-truth-audit)
7. [公開前審查清單](#七公開前審查清單)
8. [長期維護習慣](#八長期維護習慣)
9. [附錄：可複製模板](#九附錄可複製模板)
10. [與 AI 協作時的 prompt 片段](#十與-ai-協作時的-prompt-片段)
11. [給未來自己的話](#十一給未來自己的話)
12. [**教育機構 AI mission**](#十二教育機構-ai-mission)

---

## 零、治理哲學

本章節是 personal-playbook 的 thesis 層、定義「**為什麼這份 playbook 採取目前的紀律**」、給 §一-§十二 各層具體規則一個 anchor。

### 0.1 「AI 不是能力不夠、是紀律不夠」（thesis）

評估 AI 工具落地時、**紀律設計優先於能力提升**。

- AI 不是不會做影響分析—它懶得做
- AI 不是找不到 bug—它覺得「大概沒問題」
- AI 不是不會拆任務—它想直接動手比較快

方法論的本質 = 把「**應該做但會偷懶的事**」變成「**不做就無法交付**」。

> 📜 **來源**：139 筆 reference 池多軸收斂結論（note 137 Hermes 用戶 P7/P9/P10 直接命名 + 對位 Ted enforcement / Claude Design L4 silent on pass / 高詣翔 element interactivity / Karpathy 4 規則 / user preference Senior 紀律）。詳 `docs/decisions/2026-05-06_139ref_cherry_pick_spec_v0.md`。

### 0.2 Enforcement-based vs Hope-based governance

兩種 governance 哲學的對立：

| 哲學 | 做法 | 後果 |
|---|---|---|
| **Hope-based** | 寫長 prompt 期待 AI 聽話、依賴 LLM 自律 | scale 不上去、容易回到人手檢查 |
| **Enforcement-based** | 用 code / hook / gate 強制 LLM 順從 | 「**法律控制行為、代碼控制流程與結果**」 |

**準則**：能用代碼鎖的就不寫 prompt 期待。

對位既有 §：
- §3.12 Git Hook = enforcement 在 git workflow 層
- §5.9 QODA 協作協定 = enforcement 在 plan-approve 層
- §0.2 是把這兩個具體 instantiation 上提為 meta 原則

> 📜 **來源**：note 123（Ted claude-lobot enforcement-based governance 命名定型）+ 多軸收斂（101 Claude Design L4 / 105 Context Mode / 117 GitNexus blast radius）。

### 0.3 「人 + AI > 任一方獨立」三方收斂 thesis

「人 + AI > 任一方獨立」是學術 + 主流機構 + practitioner + user preference **多方獨立收斂**的結論：

- **學術**：MIT Sloan Raghavan 研究——人與演算法組合勝過兩者各自
- **主流**：Anthropic 2026/01 經濟指數 52% AI 互動為「增強」非取代、WEF 2025 預測 AI 淨增 78M 工作
- **practitioner**：建築師「最終回實際來源」（note 121）/ Hermes P7 三問自審（137）/ 阿亮 Dreamina「不要在沒確認前生成」（138）
- **user preference**：Senior 紀律「Never mark task as done without proving it works」

**Senior 共識最高權重結論之一**、可作為「保留人類最終決策點 + disclaimer」設計準則的 thesis 基礎。

> 📜 **來源**：note 121 / 137 / 138 / 139 + user preference 多方收斂。

### 0.4 重新框架問題 > 答問題（plan-first 升級）

Senior 紀律的核心**不是「會用更多工具」、是「問對問題」**。

- 面對 AI 任何議題、第一動作是審視問題的框架是否正確、不是急著答
- 把「AI 會怎樣」拉到「我 / 我們在哪裡 / 怎麼辦」
- 對位 user preference plan-first 紀律的 framing 升級版本

> 📜 **來源**：note 139（AI 十大迷思 5+5 反思）+ user preference plan-first + 124（拒絕信息繭房）。

## 一、新專案第一天清單

不必一次做完，但這個順序最少摩擦：

### 1.1 本機 repo 初始化
- [ ] `git init`
- [ ] 建立 `README.md`（基本骨架見附錄 A）
- [ ] 建立 `LICENSE`（MIT 或其他，見附錄 B）
- [ ] 建立 `.gitignore`（語言相關，見附錄 C）
- [ ] 建立 `docs/` 資料夾
- [ ] 建立 `docs/decisions/` 資料夾 + `_TEMPLATE.md`（見附錄 D）

### 1.2 第一次 commit
```powershell
git add README.md LICENSE .gitignore docs/
git commit -m "init: project skeleton"
```

### 1.3 推到雙 GitHub 帳號
- [ ] 在 seyen37 建立空 repo
- [ ] 在 seyenbot 建立空 repo（同名）
- [ ] 設定雙 remote（見「三、多帳號 GitHub 備份」）
- [ ] `git push origin main && git push backup main`

### 1.4 開啟基礎建設
- [ ] GitHub Actions CI workflow（見附錄 E）
- [ ] GitHub Pages（如果專案會公開）
- [ ] 確認 LICENSE 在 GitHub repo 首頁可被識別為 MIT

### 1.5 寫第一份決策日誌
即使是「我為什麼選這個技術 stack」也值得寫一份 `docs/decisions/YYYY-MM-DD_init.md`。**這是長期專案最有價值的累積。**

---

## 二、智慧財產權三件套

著作權保護的關鍵是建立**身份鏈**——同一個身份在多處出現、互相印證。三個必設位置：

### 2.1 LICENSE（法律文件）

**標準格式**：
```
Copyright (c) 2026 許士彥 (Hsu Shih-Yen) (https://github.com/seyen37)
```

**要素**（缺一不可）：
- 中文實名（法律文件中可指認的個人）
- 羅馬拼音（國際合作 / 授權詢問友善）
- GitHub profile URL（活的證據鏈，含 commit 時序）
- 年份（採用首次公開年；長期專案不寫範圍）

**避免**：
- 用 handle/暱稱（`(seyen37)` 不夠正式）
- 寫 email（會被爬蟲爬走）
- 寫年份範圍（除非真的需要強調歷史）

> 📌 **email 處理的 layer 區分**：LICENSE / README 內文**不寫實名 email**；但 git config `user.email`（commit metadata 那一層）是另一回事、可使用 **GitHub noreply email**（見 §3.7 step 5）——兼顧實名追溯與隱私保護。

### 2.2 README.md（讀者第一印象）

**開發脈絡段落**範本：
```markdown
本專案由 **許士彥（Hsu Shih-Yen，<https://github.com/seyen37>）獨立設計與開發**，
[簡述開發歷程：phase 數量、測試數、達成 milestone]。

詳細設計脈絡見 [`docs/decisions/`](docs/decisions/) — 每個關鍵設計決策都有
對應的決策日誌，記錄當時遇到的困難、選項評估、與最終解法。
```

### 2.3 docs/index.html footer（GitHub Pages 文件站）

```html
<footer>
  © 2026 許士彥 (Hsu Shih-Yen) ·
  <a href="https://github.com/seyen37">github.com/seyen37</a> ·
  本網站由 GitHub Pages 託管
</footer>
```

### 2.4 為什麼三處同步重要

每處角色不同：
- **LICENSE** = 法律基礎（最權威）
- **README** = 讀者進入點（最常被閱讀）
- **footer** = 文件站每頁可見（曝光度最高）

三處用一致格式，建立**多點互相印證**的身份鏈——任何人質疑著作權歸屬時，三處都導向同一個可驗證身份。

---

## 三、多帳號 GitHub 備份

### 3.1 為什麼要雙帳號

- **冗餘**：主帳號被鎖、ban、無法登入時，備份帳號是保險
- **時序證據**：兩處 commit 時間戳互相印證，比單一來源強
- **可分流**：若以後有商業化，主帳號 public、備份帳號 private 可彈性切換

### 3.2 SSH key per 帳號設定

**為每個帳號各產一支 ed25519 key**（完整 PowerShell 命令見 §3.7 step 1）：
```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_seyen37
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_seyenbot
```

**`~/.ssh/config` Host alias**（採對稱命名，host 名稱直接含帳號）：
```
Host github.com-seyen37
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_seyen37
  IdentitiesOnly yes

Host github.com-seyenbot
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_seyenbot
  IdentitiesOnly yes
```

各帳號 GitHub 設定 → SSH and GPG keys → 加入對應 public key。測試命令見 §3.7 step 4。

### 3.3 雙 remote 設定

```bash
git remote add origin git@github.com-seyen37:seyen37/PROJECT.git
git remote add backup git@github.com-seyenbot:seyenbot/PROJECT.git
```

### 3.4 一行同步推送 alias

```bash
git config --global alias.pa '!git push origin main && git push backup main'
```

之後 `git pa` 一行同步推兩個 remote。`&&` 鏈意味著 origin 失敗時 backup 不會跑——這是故意的（讓你先處理 origin 問題）。

> **命名建議**：建議所有 host alias 都用 `github.com-<account>` **對稱命名**（host 名稱與 GitHub URL pattern 對應），避免「主帳號是 `github.com-X`、備份帳號是 `github-backup`」這種不對稱命名 — 跨電腦設定時最不容易出錯、配套 SOP 也較一致。

### 3.5 新 repo 完整 setup 七步

開新 repo（不論開源工具、個人筆記、工作專案）都依此 SOP：

**1. 在兩個 GitHub 帳號各建空 repo**（同名）
- **seyen37**（主）：依專案性質選 Public / Private
- **seyenbot**（備份）：永遠 Private（純備份）
- 兩邊都**不勾** README / .gitignore / LICENSE（本地會建）

**2. 本地初始化 + 第一次 commit**
```powershell
cd C:\path\to\<your-project>
git init
git branch -M main
"# my-project" | Out-File README.md -Encoding utf8
git add .
git commit -m "init: project skeleton"
```

**3. 加 origin + backup 兩個 remote**
```powershell
git remote add origin git@github.com-seyen37:seyen37/<repo>.git
git remote add backup git@github.com-seyenbot:seyenbot/<repo>.git
git remote -v   # 確認 4 行（origin/backup 各 fetch+push）
```

**4. 第一次 push 兩邊**（建立 main tracking）
```powershell
git push -u origin main
git push -u backup main
```

**5. 補必備檔案**（依 §一、§二）
- LICENSE（標真名 `許士彥 (Hsu Shih-Yen)`）
- .gitignore（語言對應 + 大檔排除）
- docs/decisions/_TEMPLATE.md
- 第一份 init 決策日誌

**6. 之後每次工作流**
```powershell
git pull         # 開工
# ... 做事 ...
git add .
git commit -m "..."
git pa           # 收工，自動推 origin + backup
```

**7.（可選）啟用 GitHub Pages**
主帳號 repo Settings → Pages → main / root → Save。等 1-3 分鐘訪問 `https://seyen37.github.io/<repo>/`。

### 3.6 常見錯誤與排查

| 症狀 | 原因 | 解法 |
|---|---|---|
| `git pa` 報 `'backup' does not appear to be a git repository` | 沒設 backup remote | 補做 §3.5 step 3 |
| `git push` 卡在 password | SSH key 沒設或 host alias 不對 | 檢查 `~/.ssh/config` + `ssh -T git@github.com-seyen37` 測試 |
| origin 有兩個 push URL（之前用 `set-url --add --push` 設過）| 與 git pa alias 重疊 → seyenbot 收到 2 次 push（重複但無害）| `git config --unset-all remote.origin.pushurl` 清掉，純靠 alias 推兩邊 |
| repo 在 GitHub 改名後 `git pa` 推到舊 URL | 本地 git remote URL 沒更新 | `git remote set-url origin git@github.com-seyen37:seyen37/<新名>.git`（backup 同樣處理）|
| `fatal: Unable to create '.git/index.lock': File exists` | 之前 git 命令異常中斷 / 編輯器仍開著 | `Remove-Item .git\index.lock -Force` 後重試（PowerShell）|
| PowerShell 把 `::` 當命令報錯 | cmd 註解符號被當成 cmdlet | PowerShell 用 `#` 當註解；複製命令時別連同註解貼進去 |


#### 4 個必守規則（補完整 PowerShell 給法）

1. **禁尖括號 placeholder**：PowerShell `<>` 是 redirection 語法

   ```powershell
   # ❌ Bad — 尖括號被 PowerShell 解析成 redirect
   git checkout <branch-name>
   # ✅ Good — 用 placeholder 提示語、不用尖括號
   git checkout BRANCH_NAME    # 替換成實際 branch 名
   git checkout 'feat/foo'     # 或直接舉例
   ```

2. **禁 `&&`**：PowerShell 5.x 不認得 `&&`（PS 7+ 才有）

   ```powershell
   # ❌ Bad in PowerShell 5.x
   git add . && git commit
   # ✅ Good — 用換行 / 分號 / `;`
   git add .
   git commit -m "..."
   # or
   git add .; git commit -m "..."
   ```

3. **`git add` 分行**：跟 §3.10 cowork sandbox 共通，避免 index race

   ```powershell
   git add file1.py
   git add file2.py
   # 或單一 batched：
   git add file1.py file2.py file3.py
   ```

4. **用 `HEAD~N` / `origin/main` 相對引用，不寫死 commit hash**

   ```powershell
   # ❌ Bad — hash 容易漂
   git diff abc1234..def5678
   # ✅ Good — 相對引用穩
   git diff HEAD~3..HEAD
   git diff origin/main..HEAD
   ```

> 📜 **真實案例**：stroke-order 2026-05-03 Phase 12m-7 r38b — 給 user PowerShell 指令貼到 Windows terminal 跑時撞尖括號 + `&&` 雙重錯誤。memory 沉澱後，每次給 PS 指令都先審這 4 條。
### 3.7 跨電腦初次設定（公司 / 第二台電腦）

新電腦上做 6 步（私鑰絕不從別台複製，每台各自生）：

**1. 生成兩支 SSH key**

> 💡 `-C` 是 SSH key comment、會出現在 GitHub「Settings → SSH keys」公鑰列表（**他人可見**）。建議用 `<account>+<machine-id>` 風格、**不要塞實名 email**——避免協作者透過 GitHub UI 撈到你的私人聯絡。
>
> ⚠️ **`<電腦識別>` 用通用代號**（如 `desktop1`、`laptop`、`work-pc`、`win11-2024`），**不要填家裡 / 公司的真實機名 / 暱稱**（例：「我家桌機」「公司 NB」「Mary's Mac」），避免透過公鑰列表暴露實體位置或人際關係。

```powershell
mkdir $HOME\.ssh -Force
ssh-keygen -t ed25519 -C "seyen37+desktop1" -f "$HOME\.ssh\id_ed25519_seyen37" -N '""'
ssh-keygen -t ed25519 -C "seyenbot+desktop1" -f "$HOME\.ssh\id_ed25519_seyenbot" -N '""'
```

**2. 公鑰加到對應 GitHub 帳號**
```powershell
type $HOME\.ssh\id_ed25519_seyen37.pub
# → 複製貼到 https://github.com/settings/keys（登入 seyen37）

type $HOME\.ssh\id_ed25519_seyenbot.pub
# → 切到 seyenbot 帳號，貼到 settings/keys
```

**3. 建立 `~/.ssh/config`**

`notepad $HOME\.ssh\config`，貼：
```
Host github.com-seyen37
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_seyen37
    IdentitiesOnly yes

Host github.com-seyenbot
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_seyenbot
    IdentitiesOnly yes
```

⚠️ 確認檔名是 `config` 沒有 `.txt`：
```powershell
dir $HOME\.ssh\config*
# 若顯示 config.txt：ren $HOME\.ssh\config.txt config
```

**4. 測試 SSH 連線**
```powershell
ssh -T git@github.com-seyen37   # 預期：Hi seyen37!
ssh -T git@github.com-seyenbot  # 預期：Hi seyenbot!
```

**5. 設 global git config（每台電腦各設一次）**

> ⚠️ **`user.email` 用 GitHub noreply、不要用實名 email**——commit metadata 是 public、會被 GitHub UI、`git log`、第三方爬蟲完整暴露。
>
> **取得 noreply email 的步驟**：
> 1. 登入 GitHub → 開 <https://github.com/settings/emails>
> 2. 勾選 **「Keep my email addresses private」** + **「Block command line pushes that expose my email」**（雙保險）
> 3. 該頁會顯示你的 noreply email，格式：`<numeric-id>+seyen37@users.noreply.github.com`
> 4. 複製該 email、填入下方取代 `<YOUR_NOREPLY_EMAIL>`

```powershell
git config --global alias.pa '!git push origin main && git push backup main'
git config --global user.name "seyen37"
git config --global user.email "<YOUR_NOREPLY_EMAIL>"   # 例：12345678+seyen37@users.noreply.github.com
```

**6. Clone 既有 repo 開始工作**
```powershell
git clone git@github.com-seyen37:seyen37/<repo>.git
cd <repo>
git remote add backup git@github.com-seyenbot:seyenbot/<repo>.git
git fetch backup
git pa  # 驗證雙推可用
```

### 3.8 PaaS 部署的 build vs runtime fs 模型

> 部署到免費 / 廉價 PaaS（Render free tier、Railway、Fly.io 等）時，**build phase 寫到 `$HOME/` 的檔案不會傳到 runtime container**——只有 git-checkout 路徑（如 Render 的 `/opt/render/project/src/`）才會。

#### 3.8.1 為什麼會踩雷

直觀以為「build 完成後整個 container fs 都變成 runtime fs」——錯。多數 PaaS 設計：
- **Build container**：跑 `buildCommand`，`$HOME/` 是 build user 的 ephemeral workspace，build 結束就丟
- **Runtime container**：fresh 起，**只**承襲 git checkout 路徑內的檔案

任何 build 階段下載 / 生成想 persist 到 runtime 的檔案（字型、預訓練模型、編譯快取等），**必須**寫到 git-checkout 路徑下，不要寫到 `$HOME/` 或其他「臨時」目錄。

#### 3.8.2 正確 pattern

**反例（會踩雷）**：
```yaml
buildCommand: |
  pip install -e ".[web]"
  bash scripts/fetch_assets.sh    # script 內部寫到 $HOME/.myapp/
```

**正確做法**：
```yaml
buildCommand: |
  pip install -e ".[web]"
  MYAPP_DEST=/opt/render/project/src/.assets bash scripts/fetch_assets.sh

envVars:
  - key: MYAPP_ASSETS_DIR
    value: /opt/render/project/src/.assets   # runtime 從這裡讀
```

並在 `.gitignore` 加 `.assets/`，避免本地跑 build 誤 commit 大檔。

#### 3.8.3 fetch script 的 graceful 設計

下載第三方資源時，**單一資源失敗不該 abort 整個 build**：
- 用 try-per-resource，記 `ok/fail/total` 計數
- `exit 0` 即使部分失敗——讓 app 帶著「部分功能 degraded」上線比 build 完全不過好
- 若服務有 fallback path（前端 fallback 到濾鏡 / 伺服器側 fallback 到 default），這個設計尤其有效

> 📜 **真實案例**：見各專案決策日誌（搜尋 `render_fetch` 或 `build runtime fs`）。

### 3.9 跨 AI session / 跨電腦並行工作 SOP

> 同一個 repo 被多台電腦或多場 AI session 並行更新時，會發生 push 拒絕 / 章節編號碰撞 / 工作覆寫等衝突。下面 4 條 SOP 預防。

#### 3.9.1 每場 session 開工前必跑

```powershell
git fetch                # 拉 remote 變動
git status               # 確認本地 vs remote 差距
git log --oneline --decorate -5    # 看 remote 是否多出未知 commit
```

❌ 不要假設 local 是最新——另一台電腦或另一場 AI session 可能在你不知道的時候 push 過 commit。

#### 3.9.2 動筆加新章節編號前先 grep

```powershell
# 之前在編 §8.5，加新章節前確認 §8.x 哪個是空編號
grep "^### 8\." PROJECT_PLAYBOOK.md
```

❌ 不要看到「§8.4 是最後一條」就直接加 §8.5——另一場 session 可能也加了 §8.5（不同內容）。

#### 3.9.3 破壞性 git 操作前用 `format-patch` 備份

`rebase`、`reset --hard`、`force push` 之前：

```powershell
# 把本地 unpushed commits 存成 patch（永不丟失）
git format-patch <base>..HEAD --stdout > C:\path\to\backup.patch
```

萬一操作失敗或發現遠端版本更好，可用 `git apply backup.patch` 還原本地工作。**5 秒備份 = 永不後悔**。

#### 3.9.4 發現 diverge 時的處理順序

1. **先理解** remote 多了什麼：`git log --oneline --graph --all -10` 看 commit 主題
2. **判斷是否重疊**：commit message 提到的章節 / 主題是否與本場工作重疊？
3. **重疊高** → reset to remote + cherry-pick 本場獨特部分（昨夜 stroke-order × personal-playbook 並行整合即此模式）
4. **重疊低** → 標準 `pull --rebase` 即可
5. **完全衝突** → 暫停、做差異分析、寫整合 plan、再動手

> 📜 **真實案例**：見各專案決策日誌（搜尋 `divergence` 或 `cross-session race`）。

---

### 3.10 Cowork sandbox git index 操作 SOP

Cowork sandbox 的 git index 在連續寫入時會 corruption，連續 `git add` 多次會撞 `bad signature 0x00000000`。預先重建 index、用單一 batched add，可穩定避開。本節為 §3.9 跨 session race 的具體 mitigation。

#### 何時必跑

- 用 cowork sandbox 終端機操作 git
- 上一場 session 留下未 commit 的檔案，現場準備 stage（高風險區）
- 出現 `bad signature 0x00000000` / `index file corrupt`

#### 標準 SOP

**A. 開工前預先重建 index（防禦性）**

```bash
rm -f .git/index
git read-tree HEAD
git status --short
```

**B. 用單一 batched `git add`**（**不**用 `&&` 串多 call）：

```bash
# ✅ Good — 一次到位
git add file1 file2 file3 docs/*.md tests/*.py

# ❌ Bad — 連續多 call 容易撞 corruption
git add file1
git add file2
git add file3
```

**C. 出現 corruption 時的修復**

```bash
rm -f .git/index
git read-tree HEAD
git status --short  # 確認 working tree 改動還在
git add <files batched>
git commit -m "..."
```

**D. Stale lock 處理**

```bash
ls .git/index.lock 2>&1   # 看上場 session 是否留下
# 確認沒有實際 git process 在跑
rm .git/index.lock
```

**E. 0-byte 垃圾檔 / stale lock 刪除受限**

Cowork sandbox 預設 `rm` 會 `Operation not permitted`。要先 mcp 授權：

```
mcp__cowork__allow_cowork_file_delete(file_path=...)
```

再 `rm`。

#### Push / Pull

Sandbox 內**沒有 SSH key**，push / fetch 會撞 `Permission denied (publickey)`。Push 必須在 user 自己 terminal 跑：

```bash
git fetch origin
git push origin main
git push backup main  # 雙 remote
```

> 📜 **真實案例**：stroke-order 2026-05-04 整理 5b r1-r26 + 12m-7 r39 累積 commit。第一次連續 `git add ... && git add ... && git add ...` 立刻撞 index corrupt。改成 batched + 重建 SOP 後 4 個 commit 全成功。詳 stroke-order 的 `docs/journal/2026-05-04_session_log.md`。

#### 3.10 補強段（2026-05-14 升等）— default-deny 紀律強化

> 📜 **本補強段對位**：§3.13 補強段 5 步 incident + 協作電腦 `docs/decisions/2026-05-13_sandbox_host_git_lock.md` 決策 1（沙箱與主機 git 操作不可混用）+ §3.14 第 4 次補強段六維度（維度 4/5）。

**原 §3.10 規則**：sandbox 對 `.git/` 內部檔通常 read-only（cgroup 保護）、不要動 git index from sandbox。

**升級為 default-deny**：

> **sandbox bash 對該 repo 完全不跑 git 寫入命令（含 `git fetch / status / add / commit / push`）**。即使 `git status` 看似 read-only、仍會寫 `.git/index.lock`、留 lock 撞 host 後續操作（見 §3.13 補強段）。

**sandbox 允許做的事**：

- 讀檔（Read tool、`cat`、`head`、`tail`、`wc -l`、`xxd` 等）
- Glob / Grep
- Python 純運算（包括 binary mode 寫檔 — 寫到 working tree、不寫 `.git/`）
- 外部工具（unzip / soffice / pdftoppm / pandoc 等）
- 任何純運算（不觸及 `.git/`）

**sandbox 禁止的事**：

- 任何 `git <cmd>`（含 `git status`、`git log`、`git diff`、`git show`）
  - 註：`git show HEAD:<file>` 讀 blob 雖純讀、仍會 read `.git/index`、可能觸發 mount 副作用
  - 安全做法：sandbox 想看 git 內容、用 host PS 跑 `git show ... > out.md` 然後 sandbox 讀 `out.md`

**為什麼 read-only `git status` 也禁**：

5/13 incident 證明 sandbox `git status` 雖看似只讀、實際會：
1. 寫 `.git/index.lock` 作為 atomic 操作標記
2. mount unlink 權限不足 → lock 殘留
3. host 後續 git 操作撞 lock = exit 128

→ 「**讀寫差異**」對 mount 來說模糊、保守做法：**sandbox 完全不碰 git**。

> 📜 **真實 case**：2026-05-13 pptx 規範 ship-out 過程踩 incident、5 步排查 30 分鐘才定位、詳 §3.13 補強段 + `docs/decisions/2026-05-13_sandbox_host_git_lock.md`。

### 3.11 i18n 檔名：原文 + slug 雙存

中文 / 非 ASCII 標題的下載檔，filename 用 slug（拼音 / transliteration）保跨平台穩定性，但檔內 metadata **同時保留原文** 給系統 / AI 看得懂語意。

#### 為什麼雙存

| 場景 | 純中文檔名 | 純拼音檔名 | 雙存 |
|---|---|---|---|
| 現代 Mac / Windows 本機 | ✓ | ✓ | ✓ |
| Email 附件 | ⚠️ 偶爾 mangle | ✓ | ✓ |
| S3 key / CDN URL | ✗ | ✓ | ✓ |
| Git artifact / CI log | ⚠️ 變 `?????` | ✓ | ✓ |
| AI 解讀檔內 title | ✓ | ✗ 拼音失語意 | ✓ |
| User 看了知道是哪個檔 | ✓ | ⚠️ 要對照 | ✓ |

**雙存** = filename 拼音 + 內容原文 + inline 註解對照，全勝。

#### Schema pattern

```yaml
metadata:
  # 中文標題 + 拼音對照（拼音用於檔名 slug，import 時系統讀中文 title）
  title: "我的曼陀羅—九字真言"     # 拼音: wo-de-mandala-jiu-zi-zhen-yan
  title_pinyin: "wo-de-mandala-jiu-zi-zhen-yan"
```

兩個欄位 + inline `# 拼音: xxx` 註解（人類可讀）。

#### Slug 生成規則

- 全 lowercase
- ASCII alphanumeric + hyphen only（`/[^a-z0-9-]/g` 過濾）
- 多重 hyphen merge（`--+ → -`）
- trim leading/trailing hyphens
- 空時 fallback 到 ID 前 8 字元（`<id-short>`）

#### Lib 選擇

- 中文 → `pinyin-pro` (CDN ≈300KB，僅 export 時需要)
- CJK 通用 → `transliteration`
- 西語 / Latin extended → 標準 unicode normalize（`String.prototype.normalize('NFD')`）
- Server-side Python → `pypinyin`

#### Anti-pattern

- 只存 slug 「`wo-de-mandala.mandala.md`」內容無原文 → 5 個月後 user 看 filename 想不起來是哪張曼陀羅
- 只存中文檔名 → user 在 Linux server 拉 file 變亂碼

> 📜 **真實案例**：stroke-order 2026-05-04 Phase 5b r27 — `.mandala.md` 匯出。User 明確要求「檔名用拼音但內容保留中文」。前端 `_mandalaTitleToPinyin()` slug 函式 + frontmatter `title` (中文) + `title_pinyin` (slug) + inline 註解。詳 stroke-order 的 `docs/decisions/2026-05-04_phase5b_r27_mandala_state_export_import.md`。

### 3.12 Git Hook 自動驗證

> 借鏡來源：研究 `cenconq25/claude-code-app-studio` 的 12 個 hook 架構後抽象化的最小可用集。

**目標**：把「commit / push 前一定要做的稽核」從人工轉成自動。失敗時阻止操作並告知原因；可選工具（如 jq）missing 時 fail soft（warn 而不阻止）。

#### 3.12.1 推薦的 6 個 hook（依重要度排序）

| Hook | 何時跑 | 該做什麼 | 失敗動作 |
|---|---|---|---|
| **pre-commit `validate-commit`** | `git commit` 前 | grep 擋 hardcoded values（API key / token / 實名 email）、擋 `>>>>>>>` merge marker、擋 `console.log` / `print(` debug 殘留 | block commit |
| **pre-push `validate-push`** | `git push` 前 | 警告推到 protected branch（main 直推、無 PR）；確認雙 remote 設定（origin + backup）| warn（不 block）|
| **pre-commit `lint-frontmatter`** | 同 commit | 檢查新增 / 修改的 `.md` 是否帶 frontmatter（title / created）、日期是否為 today | warn |
| **post-merge `notify-divergence`** | merge 完成後 | 比對 `PROJECT_PLAYBOOK.md` 是否被改 → 提示「跨 session 並行可能」（呼應 §3.9）| 純 notify |
| **commit-msg `enforce-format`** | commit message 寫好後 | 檢查 message 不為空、單行、帶 conventional prefix（feat/fix/chore/docs）| warn |
| **pre-commit `strip-null-bytes`** | `git commit` 前 | 掃 staged 文字檔（白名單副檔名）null bytes、in-place strip + re-stage、防 cowork mount 副作用進 commit（見 §3.12.5、§3.14）| strip + warn（不 block）|

#### 3.12.2 Fail-soft 原則

```bash
# hook 開頭：檢查依賴是否存在
if ! command -v jq &>/dev/null; then
    echo "⚠️  jq not found, skipping JSON validation"
    exit 0   # 不阻止 commit
fi
```

**為什麼**：hook 應該「help by default、never block by default」。只有「明顯安全風險」（hardcoded secret）才 block；其他都 warn。

#### 3.12.3 安裝位置（兩個選項）

| 位置 | 優點 | 缺點 |
|---|---|---|
| `.git/hooks/`（每 repo 各裝）| 可隨 repo 客製 | 不被 git 追蹤；clone 時要重裝 |
| `.husky/` 或 `scripts/git-hooks/` + 開機腳本 | 跟 repo 一起 version control | 跨平台兼容（Windows）需小心 |

**個人專案推薦**：把 hook 內容版本化在 `scripts/git-hooks/<hook-name>`，再加 `scripts/git-hooks/install.sh` + `install.ps1` 跨平台安裝腳本，每台 clone 跑一次 `bash scripts/git-hooks/install.sh`（Linux / sandbox）或 `pwsh scripts/git-hooks/install.ps1`（Windows）即裝好。實例見 §3.12.5。

#### 3.12.4 「不做」的判準

不要把以下變成 hook：
- 跑 full test suite（pre-push 慢到讓人想 `--no-verify`）
- 連 GitHub API 驗證（離線時 block）
- 跑 build（commit 不該等編譯）

→ Hook 過度會讓人想 `--no-verify` bypass，反而失去保護。

> 📜 **真實案例**：本原則起源於研究 `cenconq25/claude-code-app-studio` 的 12 個 hook（含 `validate-commit.sh` / `validate-push.sh` / `validate-assets.sh` / `pre-compact.sh` / `post-compact.sh` 等）後抽象化的最小可用集。借鏡細節 + 取捨見 [`HISTORY.md` §B.17](HISTORY.md)。



#### 3.12.5 強化案例：cowork mount null bytes 自動 strip hook

> 📜 **本節 dogfooding**：2026-05-13 第二十三次修訂實裝 `scripts/git-hooks/pre-commit`、smoke test 已驗（文字檔 strip OK、二進位檔保留 OK）。

**背景**：Cowork sandbox 透過 mounted Windows folder 寫 markdown 時、Python `f.write(content)` 即使先 `content.replace(b'\x00', b'')`、mount 仍可能在後續同步階段把 null bytes 灑回檔案（sandbox 與 host 看到不同的 view）。git commit 的 blob view 通常乾淨、但 `git show :file | tr -d -c '\000' | wc -c` 偶爾仍見散布 null（見 `HISTORY.md` §B.24 第 3 次補強段）。

**Why hook、不靠手動 strip**：

- 手動 `content.replace(b'\x00', b'')` 紀律連續 4 次有效（5/13 第 19/20/21/22 次修訂）、但仰賴記性
- §3.14 SOP 已升「五件套+」、第 4 件 `tr -d -c '\x00' | wc -c` 為事後檢查、不防止 commit 帶 null
- hook 在 `git commit` 階段強制攔截、把「**防護**」從紀律轉成自動化
- 對位 §8.36「**self-audit 抓錯立刻修 + 順帶解決相關結構問題**」紀律應用到 commit-time defense

**設計關鍵**：

| 設計選擇 | 理由 |
|---|---|
| 白名單副檔名（`.md` / `.sh` / `.py` / ...）| `git diff --numstat` 對含 null 的「文字檔」會誤判為 binary（null 是它判定的依據）、不能用 numstat 過濾 |
| 二進位副檔名（`.png` / `.pdf` 等）跳過 | 它們合法含 null、不應 strip |
| in-place strip + re-stage（不 fail commit）| §3.12.2 fail-soft「help by default、never block by default」+ §8.36「修而不阻止」 |
| 工作樹也一起 strip | 避免下次 add 再 trigger、commit 後 working tree 與 commit 一致 |
| atomic rename via `.tmp` | 防止 strip 中斷產生半檔 |

**檔案位置**：

```
scripts/git-hooks/
├── pre-commit       # bash hook、~47 行
├── install.sh       # Linux / sandbox 安裝腳本
└── install.ps1      # Windows PowerShell 安裝腳本
```

**安裝**（每台 clone 跑一次）：

```bash
# Linux / sandbox / Mac
bash scripts/git-hooks/install.sh

# Windows PowerShell
pwsh scripts/git-hooks/install.ps1
# 或：powershell -ExecutionPolicy Bypass -File scripts/git-hooks/install.ps1
```

**測試是否生效**：

```bash
# 故意造 null bytes
printf 'line1\nline2\x00\x00line3\n' > test.md
git add test.md
git commit -m "smoke test"
# 應看到：pre-commit: stripping 2 null bytes from test.md
# commit 後 git show HEAD:test.md | tr -d -c '\000' | wc -c = 0
rm test.md && git rm test.md  # cleanup
```

**對位**：

- **§3.12.1 表第 6 行**（本節定義的 hook）
- **§3.14 第 3 次補強段**（hook 對應待 follow-up 條目 1「**git pre-commit hook 自動 strip null bytes**」、本節 = 該條目實裝）
- **§8.36 主規則** + **Sub-rule 1**（self-audit 抓錯立刻修 + 顯式宣告、本 hook 是該紀律的自動化體現）
- **§B.24 第 3 次補強段**（cowork mount null bytes 副作用的根因紀錄）

**為什麼這個習慣值錢**：

5 次 dogfooding case（5/13 同日 5 修）累積出來的 SOP 走「**手動 → 自動**」的最後一哩。手動有 4 次成功紀錄、自動有 1 次 smoke test 紀錄。兩者並存：hook 是 last line of defense、不取代 §3.14 五件套+ 驗證、但**確保即使 SOP 漏跑、commit 也乾淨**。

**互補層（Layer 2）：`.gitattributes` `filter=strip-nul` clean filter**（2026-05-13 第二十四次修訂實裝）

Hook 攔在 **commit 階段**、是 commit-time 兜底。但工作樹寫入時、null bytes 已可能進入 stage area。`.gitattributes` 加 `filter=strip-nul` 則攔在 **`git add` 階段**、是 add-time 主動防線。雙層分工：

| 層 | 觸發點 | 工具 | 角色 |
|---|---|---|---|
| **Layer 1（兜底）** | `git commit` 前 | `scripts/git-hooks/pre-commit` | safety net、catch missing config / unexpected paths |
| **Layer 2（主動）** | `git add` 時 | `.gitattributes` + git filter | 主流程、直接 strip 進 index 前 |

**設計關鍵**：

- **`.gitattributes` 規則**：`*.md filter=strip-nul`（只先做 markdown、其他副檔名待觀察）
- **filter 命令**：`filter.strip-nul.clean = tr -d '\000'`、`filter.strip-nul.smudge = cat`（identity smudge、簡潔）
- **不設 `required`**：missing config = git 用 identity passthrough = 跟沒裝一樣、不破 clone
- **install 整合**：`install.sh` / `install.ps1` 同時裝 hook + 設 filter config、一次性 setup

**End-to-end smoke test 結果**（sandbox `/tmp/filter-test`、2026-05-13）:

| 測試 | 預期 | 實測 |
|---|---|---|
| `.md` 含 3 null bytes → `git add` | filter 在 add 階段 strip、staged blob = 0 nulls | ✅ |
| 同上 → `git commit` | hook 不再 fire（內容已 clean） | ✅ hook 無 output |
| `.png` 含 2 null bytes → commit | 不匹配 filter、binary 保留 nulls | ✅ committed blob 保留 2 nulls |
| 已 clean 的 `.md` → commit | 透傳、無 strip 訊息 | ✅ |

**對既有檔案的影響**：filter 只在新 `git add` 時 fire、既有 tracked 檔案不會自動重 strip。若要追溯套用、跑 `git add --renormalize .`（會把所有 tracked 檔案重 stage 一次、套當前 filter rules）。

> 📜 **第三層補強**：見下方 §3.12.7「**Layer 3：CI null byte assertion（warn-only）**」（2026-05-13 第二十五次修訂實裝）。

#### 3.12.7 強化案例：Layer 3 — CI null byte assertion（warn-only）

> 📜 **本節 dogfooding**：2026-05-13 第二十五次修訂實裝 `.github/workflows/null-byte-audit.yml`、sandbox 模擬 CI 環境 smoke test 已驗（clean / dirty / binary / unknown ext 四種 case 全正確）。

**為什麼還要第三層**：

- Layer 1 hook 攔在 commit 階段、但需要每台 clone 跑 `install.sh` / `install.ps1`、漏裝會失效
- Layer 2 filter 攔在 `git add` 階段、但 `git config filter.strip-nul.clean` 是 per-clone 設定、missing config = identity passthrough = 沒攔
- 兩者都依賴 local 端正確設定、Layer 3 是 **GitHub server 上的第三方旁證**、不依賴 local 任何配置

**設計關鍵**：

| 設計選擇 | 理由 |
|---|---|
| **warn-only（exit 0、never fail）** | 對齊 §3.12.2 fail-soft「**help by default、never block by default**」紀律（Layer 1+2 都走這條）。Personal-playbook 直推 main、fail 會擋住自己 push、不可取 |
| **`on: push: branches: [main]`** | 不用 pull_request（無 PR 流程）、不用 schedule（lag 太大）— 即時跟 commit 同步 |
| **`workflow_dispatch:`** | 允許從 Actions tab 手動 re-run、方便 user 主動驗證 |
| **`git show ":$f"` 看 git blob** | CI 跑在 GitHub server、沒 cowork mount、blob view = working tree view、但統一用 `git show` 表達意圖「**檢查會 commit 進去的內容**」 |
| **`::warning file=...::` annotation** | GitHub 自動在 commit / PR view 標紅、不需特別查 Actions tab |
| **`$GITHUB_STEP_SUMMARY` markdown 表** | Actions tab 一眼看 summary、附 fix instructions、不用每次回 playbook 查 |
| **白名單副檔名跟 hook 一致** | 行為一致、避免「**hook 攔 / CI 沒攔**」或反之的不對稱 |

**Workflow 邏輯**（節選自 `.github/workflows/null-byte-audit.yml`）:

```bash
# 對每個 tracked 文字檔（whitelist 副檔名）
git ls-files | while read f; do
  case "$f" in
    *.md|*.txt|*.sh|*.py|*.ps1|*.json|*.yml|*.yaml|*.toml|*.html|...)
      nul=$(git show ":$f" | tr -d -c '\000' | wc -c)
      [ "$nul" -gt 0 ] && echo "::warning file=$f::Found $nul null bytes"
    ;;
  esac
done
# 永遠 exit 0（warn-only、見上）
```

**Smoke test 結果**（sandbox 模擬 CI 環境）:

| 測試案例 | 預期 | 實測 |
|---|---|---|
| `clean.md`（無 nulls） | 不 flag、不算 warning | ✅ skipped |
| `dirty.md`（1 null） | `::warning::` annotation + count = 1 | ✅ |
| `image.png`（2 nulls、binary） | 不匹配白名單、不掃 | ✅ skipped |
| `script.unknown`（未知副檔名）| 不匹配、不掃 | ✅ skipped |
| Exit code | `0`（warn-only） | ✅ exit 0 |
| `$GITHUB_STEP_SUMMARY` | markdown 表 + fix instructions | ✅ |

**三層完整防線總覽**（5/13 七修 → 八修 progression）:

| Layer | 觸發點 | 工具 | 設定位置 | 失敗模式 |
|---|---|---|---|---|
| **0 manual** | commit 前手動 | §3.14 五件套+ 驗證 | SOP 文件 | 仰賴記性 |
| **2 filter** | `git add` 時 | `.gitattributes` + `filter.strip-nul.clean` | repo + per-clone `git config` | missing config = identity |
| **1 hook** | `git commit` 前 | `scripts/git-hooks/pre-commit` | per-clone `.git/hooks/` | 沒 install = silent |
| **3 CI** | post-push to main | `.github/workflows/null-byte-audit.yml` | GitHub server | 不依賴 local 設定 |

**對位**：

- **§3.12.5 互補層（Layer 2）**：本節是其後續、形成三層完整 stack
- **§3.12.2 Fail-soft 原則**：CI warn-only 對齊
- **§3.14 規則 4 (d) 已實裝**：CI 是 (d) 選項的具體實作

**為什麼這個習慣值錢**：

5/13 同日 7-8 修建構出的 defense-in-depth 是「**Cowork sandbox + Windows host + 雲端 server 三方視角不一致**」的根本應對。沒有任一層完整覆蓋所有情境：

- 只有 hook：clone 漏裝 = 失效
- 只有 filter：config 漏設 = 失效
- 只有 CI：local 已 commit 進去才發現 = 後驗
- **三層聯合 = 互補**：filter 漏網 → hook 接住、hook 漏網 → CI 觸發 warning、CI 漏看 → 下次 audit 補上

**Layer 3 升級為 fail-on-error 的條件（graduate trigger）**：

CI 從 warn-only 升 fail-on-error 不是「**時間到就升**」、而是「**三個條件全滿足才升**」。下方為形式化升級條件、未來 trigger 達標時 user 直接動 1 行 yml（`exit 0` → `exit 1`）+ commit message 標「**Layer 3 graduate: warn → fail**」。

| 條件 | 驗證方法 | 達標標準 |
|---|---|---|
| **(1) Baseline 清乾淨** | host 跑 `git add --renormalize .` 套 Layer 2 filter 把全 repo 重 stage 一輪、`git status` 看是否有變動 | renormalize 後 `git diff HEAD` 為空（或變動 commit 完）、且 `git ls-files \| xargs -I{} sh -c 'git show :{} \| tr -d -c "\000" \| wc -c'` 每個都是 0 |
| **(2) 觀察期：N 次 push 都 green** | GitHub Actions tab 查 `Null Byte Audit (Layer 3 warn-only)` workflow runs | 連續 ≥ 5 次 push 到 main、CI summary 全是「✅ All clean」、且這 5 次涵蓋 ≥ 14 天時間 |
| **(3) Layer 1 hook 不再 fire** | host commit 期間觀察 `pre-commit:` strip 訊息是否出現 | 觀察期內 0 次 `pre-commit: stripping ... null bytes` |

**怎麼升級**（條件全滿足後的操作）:

```yaml
# .github/workflows/null-byte-audit.yml 最後一行
# 從:
exit 0
# 改成:
exit 1
```

+ workflow name 從 `Null Byte Audit (Layer 3 warn-only)` → `Null Byte Audit (Layer 3 strict)`、commit message 標「**Layer 3 graduate: warn → fail**」、HISTORY.md §A 新增條目紀錄升級時機 + baseline 條件達標證明。

**為什麼三個條件都重要**：

- **(1) baseline clean** — 沒這個、第一次 fail run 直接 red、要走 force-push 才能 fix 既有 history、痛
- **(2) 觀察期 + 雙重 criteria（5 runs + 14 天）** — 防短期 false negative；單獨「5 次 push」可能 5 分鐘內全部 push 完、觀察期形同沒做
- **(3) hook 不 fire** — 證明 Layer 2 filter 真的攔下來、不是 Layer 1 在兜底；只有 filter 主動處理穩定，才有資格升 fail

> 📜 **剩餘待 follow-up**:
>
> 1. **`.gitattributes` 擴大副檔名涵蓋** — ✅ 第二十六次修訂同日加 `.sh` / `.py` / `.ps1`（你三大主要工作工具的副檔名）、其他副檔名繼續觀察期等具體 case
> 2. **CI graduate trigger 達標**（上方 3 條件）— 等觀察期累積、不今天動
> 3. **CI scope 擴大** — 目前只 `push: main` + `workflow_dispatch`、未來可加 cron schedule 做 historical audit
> 4. **`.gitattributes` 擴大其他副檔名**（`.yml` / `.json` / `.txt` 等）— 等踩具體 case 再加、避免 pre-mature

### 3.13 跨 sandbox/host 並行操作的 git lock race

當同一個 git repo 同時被 **Cowork sandbox（Linux WSL / Docker / VM）** 跟
**Host OS（Windows / macOS）** 兩端同時操作時，`.git/index.lock` /
`.git/objects/maintenance.lock` 會在兩個 process 間搶鎖。symptoms：

- Sandbox 端 `git status` 印 `warning: unable to unlink '.git/index.lock'`
- Host 端 `git pull` 印 `Unable to create '.git/index.lock': File exists`

#### 規則

1. **Sandbox 端 `.git/` 內部檔通常 read-only**（cgroup 保護）— 即使有
   warning 也通常無害，但無法清掉殘留 lock
2. **要清 lock 改從 Host 端**：
   ```powershell
   Remove-Item .git\index.lock -Force
   Remove-Item .git\objects\maintenance.lock -Force -ErrorAction SilentlyContinue
   ```
3. **避免並發**：sandbox `git status` 後不要立刻 host `git pull`，反之
   亦然。中間留 1-2 秒 buffer
4. **Sandbox modified 全是 CRLF/LF 假告警**：用 `git diff -b` 驗證實質
   內容。delta 為空 = 純 line-ending 差，不需處理（呼應 §3.7 跨機 git
   同步原則）

#### 為什麼這個習慣值錢

兩台電腦不同步 = 經典踩坑（已寫進 §3.9）。但「同一台電腦的 sandbox vs
host」是新型 race：兩個 process 共用 `.git/` 但是兩個獨立的 OS view，
lock 機制不互通。

症狀容易誤判為「git 壞了」而執行不必要的 `git gc` / 重 clone。

#### Audit checklist

- [ ] 看到 lock 錯誤訊息 → 先確認誰在用 git（sandbox? host?）
- [ ] 從 host 端強刪殘留 lock（sandbox 端通常做不到）
- [ ] 清完再操作

> 📜 **真實案例**：2026-05-06 morning audit — Cowork sandbox 端跑
> `git status` / `git fetch` 後留下 0-byte `.git/index.lock`，sandbox
> 端 `rm -f` 被拒（Operation not permitted）。Host PowerShell 跑
> `git pull --ff-only` 撞到同樣 lock；`Remove-Item .git\index.lock
> -Force` 解掉後即可 ff-only 拉新 commit。詳本日 decision log
> `docs/decisions/2026-05-06_r29-r29k_principles.md` §B.15。

#### 3.13 補強段（2026-05-13 incident + 2026-05-14 升等）— 完整 incident 排查 SOP + PS stderr 抓法

> 📜 **本補強段對位**：協作電腦 `docs/decisions/2026-05-13_sandbox_host_git_lock.md` 5 步 incident + 3 核心決策（commit `7bd15ad`）+ §3.14 第 4 次補強段六維度（維度 5/6）+ §8.36 Sub-rule 3 attribution bias。

**起源**：2026-05-13 pptx 規範 ship-out 過程踩 incident — sandbox bash 留 `.git/index.lock` unlinkable → host PS `git add` exit 128 → PS native `2>&1` 走 CLIXML 吞 stderr → reactive 排查 5 步才定位。

#### 5 步 incident 時序（典型 lock race + PS stderr 吞噬連環）

```
[T-30min] sandbox bash 跑 `git fetch --all` / `git status`
            → git 寫入 .git/index.lock
            → sandbox mount 對 .git/ unlink 權限不足
            → warning: "unable to unlink '.git/objects/maintenance.lock': Operation not permitted"
            → sandbox git 認為 lock 是它的、沒繼續清理 → lock 殘留

[T-0] host PS `git add`
            → 看到 index.lock 存在、判 concurrent process
            → fatal exit 128
            → PS native 2>&1 走 CLIXML 包裝、Windows-MCP wrapper 反序列化時丟掉 ErrorRecord
            → user 看到「exit 128」但沒 stderr 訊息
```

**5 步排查典型路徑（reactive、繞路）**:

| Step | 動作 | 誤判 |
|---|---|---|
| 1 | `git add` 失敗 + 看不到原因 → 試簡化 commit message | 誤判 quote 問題 |
| 2 | `git add -v` 仍 untracked、exit 128 | 仍找不到原因（PS 吞 stderr）|
| 3 | 注意到 `.gitattributes` 有 `*.md filter=strip-nul`、推測 filter 沒配 → 跑 install.ps1（pwsh 缺席失敗）→ 手動 `git config` 設 filter | 紅鯡魚（filter 未設 = identity passthrough、不會 break） |
| 4 | 改用 `cmd /c "git add ... 2> err.txt"` 抓 stderr | 看到 `fatal: Unable to create '.git/index.lock': File exists.` |
| 5 | `Remove-Item .git\index.lock -Force` 清 lock → add 成功 | 解決 |

→ **30 分鐘卡關、根因只要 stderr 出來就 5 秒看出**。

#### 規則升級

**規則 A：沙箱 git 寫入操作 → 一律走 host PowerShell**

§3.10 已規定「sandbox `.git/` 通常 read-only」、本補強升級為：

> **預設 deny：sandbox bash 對該 repo 完全不跑 git 寫入命令（含 `git fetch / status / add / commit / push`）**。
> sandbox 只做：讀檔 / Glob / Grep / Python / unzip / soffice / pdftoppm / 純運算。

**為什麼這條規則 default-deny 比「sandbox 可動 git 但小心」強**：

- 兩條路徑寫同一個 `.git/` 是 race condition 溫床、不只 lock 一個雷
- sandbox git 對 SSH alias 本來就不通（`github.com-seyen37` 是主機 `~/.ssh/config` 才有的別名）、能做的只有本地、價值有限
- 自動清 lock 模式（C / D）太脆弱、誤殺真 concurrent process 風險

**規則 B：PS stderr fallback SOP**

`Windows-MCP PowerShell` wrapper 把 git stderr 透過 PS native `2>&1` → CLIXML object stream → 反序列化時丟掉 ErrorRecord、stdout 不含 stderr 內容。

**抓真 stderr SOP**（PS exit non-zero 但無輸出時必觸發）：

```powershell
# 平常
git <cmd>

# 異常時（exit non-zero 但沒輸出）— 切到 cmd /c 抓 stderr 到檔
cmd /c "git <cmd> 2> err.txt"
Get-Content err.txt
Remove-Item err.txt
```

**為什麼 `cmd /c` 不踩同坑**：

- 走 Windows native stderr 重導（檔案、不是 PS object stream）
- 不經過 PS / CLIXML 包裝
- stderr 直接寫檔、`Get-Content` 讀檔 100% 可信
- 限制：只用於抓 stderr 場景；平常 git 命令走 PS（`cmd /c` quoting 比 PS 痛苦）

#### 反例（必須避免）

```
❌ Bad pattern 1：debug 時先猜「最近改的東西是兇手」
  → 5/13 incident 走了 install.ps1 / filter config 的冤枉路
  → 對應 §8.36 Sub-rule 3「recent-feature attribution bias 警示」

❌ Bad pattern 2：exit non-zero 沒 stderr 就試簡化 command
  → 把 quote / encoding / spaces 當嫌犯
  → 應該：先 cmd /c 抓 stderr 看真錯誤、不要瞎試

❌ Bad pattern 3：sandbox 跑 `git status` 只為「看一下狀態」
  → 即使只讀的 git status 也會寫 .git/index.lock
  → sandbox 對 .git/ 任何 git 命令都禁用、看狀態用 host PS
```

#### 對位章節

- §3.10 Cowork sandbox git index 操作 SOP（main rule）
- §3.14 Cowork 寫檔工具 corruption SOP 第 4 次補強段（六維度症候群、本補強對應維度 5 + 6）
- §8.36 Self-audit + Sub-rule 3「recent-feature attribution bias」（debugging 紀律）
- `docs/decisions/2026-05-13_sandbox_host_git_lock.md`（source decision log）

> 📜 **真實 case**：2026-05-13 commit `b56e7cb` 過程踩本 incident、commit `7bd15ad` 寫成 decision log、commit `e18ad10` 補 install.cmd dispatcher 解決規則 A 的衍生痛點（pwsh missing）。

#### 3.13 第 2 補強段（2026-05-14 R59 升等）— sandbox 完全失能 worst case host-side fallback

> 📜 **本補強段對位**：biped-research session R59 (跨 R57/R58/R59 整 3 round sandbox unavailable)、§3.14 第 5 次補強段 worst case 條目、HISTORY.md §B.24 第 5 次補強段。

**起源**：2026-05-14 同日 biped-research session 跑 R57 機器人資料夾整理建議書 / R58 去重 SOP / R59 收工三文件第四輪期間、Cowork sandbox bash 持續返回 `Workspace unavailable. The isolated Linux environment failed to start. You can still use file tools directly.`、跨 3 round 完全失能。原 §3.13 補強段（5/14 day 1）處理 sandbox 部分失能（lock race / CLIXML 吞 stderr / install pwsh missing）但沒涵蓋「sandbox 整段不能用」worst case。

#### Worst case SOP — 純 host-side fallback

| 動作類別 | 採用方式 | 不可採用 |
|---|---|---|
| 檔案查詢 / 預檢 | Read / Glob / Grep file tool | ❌ sandbox bash ls/wc/cat |
| 文件改動類 | 寫 Python script → 給 user host PowerShell 執行 | ❌ sandbox 端執行 Python |
| zip 解壓 / md5 / 二進位處理 | **延後到下 round sandbox 恢復**；當 round 寫成 hook entry 紀錄 | ❌ 強行 PowerShell SOP 給 user 自解（後續還要 deep verify、partial workaround）|
| git operations | 給 user host PowerShell SOP（add / commit / push）| ❌ sandbox 端 git |
| Python script 路徑 | host-visible（如 repo 根目錄 `_rNN_*.py`）| ❌ Cowork outputs/（file_handling_rules §1 寫「Users are not able to see files in this directory」）|

#### 判斷時機

每 round 第一個 bash call 失敗 + retry 1 次後仍失敗 → 確認 sandbox 完全失能 → 立刻切到本 SOP、不浪費 retry 次數。對位 §3.14 第 5 次補強段「新增規則 6: sandbox 失敗 1 次允許 retry、第 2 次必切 host-side fallback」。

#### 跟既有規則的關係

| 既有 | 處理範圍 | worst case 增補 |
|---|---|---|
| §3.10 default-deny | sandbox 不跑 git 寫入 | worst case：sandbox 連 read 都不能用 |
| §3.13 規則 A | sandbox git 寫入走 host | worst case：所有 sandbox 動作都走 host |
| §3.13 規則 B | PS stderr 用 `cmd /c` 抓 | 不受影響 |
| §3.14 第 4 次補強段 | 6 維度 + cascade | 升 9 維度（R59 新 3）+ worst case 條目 |

#### 反例 4: sandbox 失敗就強行重試、不切 host-side

```
❌ Bad pattern: sandbox bash returncode != 0 → retry 3-5 次 → 浪費 token / 持續 fail
✅ Good pattern: 失敗 1 次 retry、第 2 次必切 Read/Glob/Write file tool
```

> 📜 **真實 case**：biped-research session R57+ → R59 跨 3 round sandbox unavailable、整 R59 收工三文件第四輪純 host-side 完成（Read/Glob 預檢 + 給 user 跑 Python script via host PowerShell + zip 解壓延後到 R60）。biped repo `PRINCIPLES.md §15.6` 已實裝完整 case study + SOP。

### 3.14 Cowork 寫檔工具對 mounted Windows UTF-8 中文 markdown 的 corruption SOP

> 📜 **本節 dogfooding：本 SOP 內容即由 sandbox bash + Python list-of-strings 寫入，避開 Edit / Write / bash heredoc 三種已知 corruption 模式。**

Cowork sandbox 內所有寫檔工具（Edit / Write / bash heredoc）對「mounted Windows folder + UTF-8 中文 + CRLF」的 markdown 都會踩 corruption — 工具回報 success 但實際寫入失敗或截斷，commit 上去就壞檔。本節為唯一可靠 SOP。為 §3.10 git index 層 corruption 的姊妹篇（寫檔工具層）。

#### 何時必觸發

- 用 Cowork sandbox 寫 markdown 到 mounted Windows folder（路徑形如 `/sessions/.../mnt/<repo>/`）
- 內容含 UTF-8 中文 ## 章節標題
- 行數 ≥ 80 / 內含 backtick code block / Unicode 箭頭等非 ASCII 字元

#### 三層失效模式（已實證）

| 工具 | 失效行為 | 表象 |
|---|---|---|
| Edit 工具 | 截斷後段內容 + 結尾 mojibake byte | 回報「success」、`wc -l` 行數比預期少、`xxd \| tail` 結尾出現 `ef bf bd` 之類 replacement char |
| Write 工具 | 完全沒寫入 mounted folder（mount cache / sync 問題）| 回報「success」、但 sandbox `ls -la` 看到的 timestamp + size 仍是舊版 |
| bash `cat > file << 'EOF'` quoted heredoc | 含 backtick / Unicode 字元時提前觸發 EOF、heredoc 後段被當 bash command 執行 | error log: `command substitution: line N: syntax error` + `command not found` 連環 |

#### 唯一可靠寫法：sandbox bash + Python list-of-strings

```bash
python3 << 'PYEOF'
lines = [
    '# 標題',
    '',
    '第一段內容...',
    '',
    '## 章節 1',
    # ... 每行單獨用 single-quote string 包
]
content = '\n'.join(lines) + '\n'
with open('/sessions/.../mnt/<repo>/file.md', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print(f"WROTE {len(lines)} lines, {len(content)} bytes")
PYEOF
```

**設計關鍵**：

- `lines = ['...', ...]` 每行一個 single-quote string，內容只要不含 `'` 就零 escape 風險
- `'\n'.join(lines) + '\n'` 確保結尾是 LF（不是 CRLF）
- `newline='\n'` 強制 Python 不做 platform translation
- Python heredoc `<< 'PYEOF'` 用單引號、禁止 bash 變數展開
- 若 host 是 Windows + git autocrlf=true、寫進去的 LF 會在 git checkout 時自動轉 CRLF（正常 workflow）

#### 對既有檔案做局部插入（避免整檔重寫）

整檔重寫大檔（3000+ 行）有風險（line ending 翻譯 / mojibake），用 Python binary mode + marker insert：

```bash
python3 << 'PYEOF'
with open(path, 'rb') as f:
    content = f.read()

# 探測 line ending（保持一致）
NL = b'\r\n' if b'\r\n' in content else b'\n'

section_lines = [...]   # CRLF 或 LF 由 NL 決定
section = NL.join(line.encode('utf-8') for line in section_lines) + NL

marker = '## 下一個章節標題'.encode('utf-8')
idx = content.find(marker)
new_content = content[:idx] + section + NL + content[idx:]

with open(path, 'wb') as f:
    f.write(new_content)
PYEOF
```

#### 五件套+ 驗證（每次寫入後立刻跑）

> 📜 **歷史演進**：2026-05-12 W4 從「三件套」升「四件套+」(加 null check、見 §B.24 第 2 次補強段)。2026-05-13 第十九/二十一次修訂升「五件套+」(加 mojibake grep + git diff --stat、見 §B.24 第 3 次補強段)。本程式區塊反映當前 canonical SOP。

```bash
wc -l <file>                          # 件 1：行數
tail -3 <file>                        # 件 2：結尾內容
xxd <file> | tail -2                  # 件 3：byte-level 結尾是 0a (LF) 或 0d 0a (CRLF)
tr -d -c '\x00' < <file> | wc -c      # 件 4：null byte count（預期 0、cowork mount 副作用偵測）
grep -c $'\xef\xbf\xbd' <file>        # 件 5：mojibake (U+FFFD) count（預期 0）
git diff --stat <file>                # 件 6（+）：insertion/deletion 比例 sanity check
```

通過條件：

- 行數 = `len(lines)`（因 `+ '\n'` 結尾、行數 = list 長度）或 `git show HEAD:<file> | wc -l` ± 預期 delta
- 結尾是預期內容、不是 mojibake
- xxd 末 byte 是 `0a`（LF）或 `0d 0a`（CRLF）、不是 `ef bf bd` 或截斷的 partial UTF-8 byte
- null byte count = 0（散布 null 是 cowork mount 寫回副作用、commit 前要 `content.replace(b'\x00', b'')`）
- mojibake count = 0（任何非 0 都是 UTF-8 corruption 早期指標）
- `git diff --stat` insertion 行數 ≈ 預期插入行數（silent failure 時 diff 顯示 0 insertion = 立刻識別、見 §B.24 第 3 次補強段 Edit silent insertion 模式）

#### 對位章節

- §3.10 Cowork sandbox git index 操作 SOP（git index 層 corruption；本節是寫檔工具層）
- §3.13 跨 sandbox/host 並行操作的 git lock race（lock 層 race；本節是寫入層 corruption）
- §3.9 跨 AI session / 跨電腦並行工作 SOP（章節編號避撞 grep 規則；本節新增 §3.14 即套用該規則）

#### 為什麼這個習慣值錢

寫檔工具不會主動報錯、只會默默砍行；不驗證就 commit 等於把破檔推上 GitHub。五件套+ 驗證 < 10 秒、補救破檔 commit + force push 30 分鐘以上、且 backup remote 也得跟著強推。

> 📜 **真實案例**：見 `HISTORY.md` §B.24（biped-research round 12 收工寫 PRINCIPLES.md 連續踩 3 種寫法）。
>
> 📜 **R37 dogfooding 補強**：biped-research 2026-05-11 R37 ADR-024 §11 順手 update NOTICE.md 時 Edit 工具吃掉 21 行（含「最後更新」行 + IP-Risk 末段、檔案從 364 → 343 行）— **本 SOP 攔截成功**：用 Python `git show HEAD:NOTICE.md` 取乾淨版 + `splitlines(keepends=True)` 在 lines list 上做修改 + binary mode 寫回 → 修復為 380 行完整、無資料損失。詳 `HISTORY.md` §B.24（補強段）。



> 📜 **5/13 第 3 次 dogfooding 補強(第二十一次修訂)**：本日(2026-05-13)升等 §B.34-§B.42 任務、Edit 工具連續踩 2 個新失效模式 + Python binary mode 加 null bytes 進 commit 的問題、**SOP 升級為「四層失效模式 + 五件套+」**。詳 `HISTORY.md` §B.24 第 3 次補強段。
>
> **新增失效模式 1: Edit silent insertion failure**:Edit 工具回報「updated successfully」、但 `grep` 完全找不到任何插入內容(不是截斷、是**完全沒寫入**)。本日大段插入(170 行)連續 2 次都遇到。**症狀**:沒 mojibake、行數沒變、回報 success → 完全 silent。**辨識**:寫入後立即 `grep "<關鍵字>"` 驗證、找不到就確認 silent failure。
>
> **新增失效模式 2: Python binary mode 寫回後 cowork mount 又加 null bytes(中間散布)**:Python `f.write(content)` 立即 `f.read()` 看到 0 null bytes、但檔案系統 view (`tr -d -c '\x00' | wc -c`) 看到 645/660/759 個。Python 端 + bash 端看到不同 view、null bytes 散布在中間(不只 trailing)。**症狀**:`.gitattributes text=auto` 不處理 null、commit 進 git 也帶 null。**SOP 升級**:`content.replace(b'\x00', b'')` 不只 `rstrip(b'\x00')`、且接受「git diff 視角乾淨即可」(file system view 殘留 null 對 commit 內容沒實質影響、但對 PowerShell view 有影響)。
>
> **新增規則 3: Edit 工具大段插入禁忌**:**插入超過 ~50 行的內容、直接走 Python binary mode、不嘗試 Edit**。本日證據:5/13 連續 2 次 170+ 行 Edit 全失敗(1 次 silent / 1 次截斷+mojibake)、Python binary mode 1 次成功。閾值約 50 行(待後續 case 驗證精確值)。
>
> **新增規則 4: .gitattributes 不會 strip null bytes**:`text=auto eol=lf` 只處理 line endings、不處理 null。要徹底防護需:(a) Python 寫入時 `content.replace(b'\x00', b'')`、或 (b) git pre-commit hook 加 `tr -d '\\000'` filter、或 (c) `.gitattributes` 設 `*.md filter=strip-nul`(需額外定義 filter)。**本次採 (a)、第二十三次修訂同日加做 (b)、第二十四次修訂同日加做 (c)、第二十五次修訂同日加做 (d)**(見 §3.12.5 互補層段 + §3.12.7「**Layer 3 CI null byte assertion**」、`.github/workflows/null-byte-audit.yml` warn-only、三層完整防線 0/1/2/3 / Layer 0-3 全部實裝、end-to-end smoke test 全 pass)。
>
> **驗證 SOP 升級為五件套+**:既有四件套+(行數 / tail / xxd / null / mojibake)新增第 6 件:**`git diff --stat <file>` 確認 insertion/deletion 比例符合預期**(silent failure 時 diff 會顯示 0 insertion = 立刻識別)。



> 📜 **5/13 第 4 次 dogfooding 補強(第三十一次修訂)** — **Cowork mount 邊界症候群六維度**：5/13 同日 13 修（主序列 10 修 + 延伸 3 修 + AIQ）累積 6 個 mount-related case、本補強將 §3.14 從「**寫檔工具 corruption SOP**」升級為「**Cowork sandbox/host 邊界症候群六維度綜合 frame**」、同時對位協作電腦寫的 `docs/decisions/2026-05-13_sandbox_host_git_lock.md`。詳 `HISTORY.md` §B.24 第 4 次補強段。
>
> **六維度 case 表**：
>
> | # | 維度 | trigger | symptom | mitigation | 5/13 對應 case |
> |---|---|---|---|---|---|
> | 1 | Edit 工具 silent insertion failure | Edit 大段（或小段 .gitattributes 6 行）插入 | 報 `updated successfully`、grep 找不到任何插入 | 立即 grep 驗證 + Python binary mode | 第 22/24 次 |
> | 2 | Edit 工具 截斷 + mojibake | Edit 多行 + 中文 + code block | 末段被吃掉、xxd 結尾 `ef bf bd` | bash bypass `git show HEAD:X > X` + Python binary mode 重做 | 第 18/21 次 |
> | 3 | Python binary mode → null bytes 進工作樹 | Python `f.write(content)` after read | Python view 0 nulls / bash view N nulls（mount 兩面不同） | `content.replace(b'\x00', b'')` 寫回前；Layer 1/2 兜底 | 第 19-22 次 |
> | 4 | `.git/index` corruption（sandbox view） | sandbox 操作 git status / fetch | sandbox `bad signature 0x00000000` / `fatal: index file corrupt`、host 視角正常 | sandbox 只讀檔、git 寫入操作一律走 host PowerShell | 全 5/13 |
> | 5 | `.git/index.lock` unlinkable（sandbox 留 lock 撞 host） | sandbox 跑 git fetch / status 後 mount 沒釋放 lock | host PS `git add` exit 128、且 PS native `2>&1` 走 CLIXML 吞 stderr、看不到 `Unable to create '.git/index.lock'` | `Remove-Item .git\index.lock`；抓真錯誤用 `cmd /c "git ... 2> err.txt"` | 第 29 次 |
> | 6 | install scripts 預設 `pwsh` missing silent | install.ps1 用 `pwsh -ExecutionPolicy...` 但 user 沒裝 PS 7+ | install 失敗、後續 hook + filter 沒裝、又連鎖造成第 5 維度 lock 沒清 | `install.cmd` auto-detect dispatcher（pwsh > powershell fallback）；§B.36 補強段 2 文件 PS 5.1/7+ 雙模式 forward-compat | 第 29/30 次 |
>
> **統合 thesis**：
>
> > **Cowork sandbox 跟 Windows host 之間有多個邊界層、每層都有 silent failure 模式。永遠不要相信任何工具的「success」回報、永遠 verify。**
>
> 這六維度不是孤立、有 cascade 關係：
> - 維度 6（pwsh missing）→ install 失敗 → Layer 1+2 沒裝 → 維度 3（null bytes 沒被 strip）連鎖
> - 維度 4（sandbox .git/index corrupt）→ sandbox git 操作不可靠 → 維度 5（host 看到 lock 但 sandbox 沒清）連鎖
> - 維度 1/2（Edit 失敗）→ 觸發 Python binary mode 路徑 → 維度 3 null bytes（前已連鎖、被 Layer 1/2 兜底）
>
> **統合 SOP（5 條操作紀律）**：
>
> 1. **寫檔後跑五件套+**（§3.14 既有）：行數 / tail / xxd / null / mojibake / git diff --stat
> 2. **git 寫入操作只在 host 跑、sandbox 只讀檔**（§3.10/§3.13 紀律）：避開維度 4/5 連鎖
> 3. **PS native error capture 不可靠時用 `cmd /c "... 2> err.txt"` 抓 stderr**（協作電腦第 29 次 lesson）：解維度 5 的 visibility 問題
> 4. **install scripts 必須 auto-detect dispatcher、不能 hardcode shell**（協作電腦第 30 次 lesson）：解維度 6
> 5. **Recent-feature attribution bias 警示**（協作電腦第 29 次 lesson）：debug 時別把最近改動當嫌犯、先驗證 healthy；本日 `.gitattributes filter=strip-nul` 是 healthy passthrough、不是維度 5 lock 的 root cause
>
> **統合 fail-soft 紀律**：
>
> 每維度 mitigation 都遵守 §3.12.2「help by default、never block by default」：
> - 維度 1/2 fix：bypass + retry、不 fail commit
> - 維度 3 fix：strip + warn、不 fail commit（Layer 1 hook）
> - 維度 4/5 fix：透明 error message + 手動清 lock、不 abort 整 session
> - 維度 6 fix：dispatcher fallback、不要求 user 必裝 PS 7+
>
> **新增規則 5: 任何插入動作走 Python binary mode（不只 >50 行）**：
>
> 5/13 第 24 次修訂時 `.gitattributes` 6 行插入 Edit silent 失敗、推翻第 3 次補強的「>50 行禁忌」閾值假設。閾值不可靠、保守策略：**只要會跨檔重要改動、任何行數都用 Python binary mode**。小 typo 修正可繼續用 Edit、但任何「**結構性 / 多段 / 含 code block 的插入**」一律 binary mode。
>
> **驗證 SOP 進一步升級**：保留五件套+、額外建議在 critical 改動後**順手 `git log -1 --stat` 比對行數變動跟 git diff --cached --stat 是否一致**（防 Edit silent 失敗的最後一道兜底）。

> 📜 **R59 第 5 次 dogfooding 補強(第三十四次修訂、2026-05-14 day 3)** — **9 維度框架升級 + 跨 session 經驗整合**：biped-research session R59 收工三文件第四輪期間（5/14 同日）連續踩 3 個 §3.14 第 4 次補強段 6 維度框架沒涵蓋的新失效模式（outputs/ 不 host-visible / Python 中文 print silent / Microsoft Store python stub） + 1 個 worst case（sandbox 完全失能跨 3 round）。本次補強將 6 維度擴展為 9 維度 + 加 worst case 條目。詳 `HISTORY.md` §B.24 第 5 次補強段。
>
> **9 維度 case 表**（原 6 + R59 新 3）：
>
> | # | 維度 | trigger | symptom | mitigation | 對應 case |
> |---|---|---|---|---|---|
> | 1 | Edit 工具 silent insertion failure | Edit 大段或 .gitattributes 6 行 | 報 success / grep 0 hit | grep 驗證 + Python binary mode | 第 22/24 次（5/13） |
> | 2 | Edit 工具 截斷 + mojibake | Edit 多行 + 中文 + code block | xxd 結尾 `ef bf bd` | bash bypass + Python binary mode 重做 | 第 18/21 次（5/13） |
> | 3 | Python binary mode → null bytes 進工作樹 | Python `f.write` after read | bash N nulls / Python 0 nulls | `content.replace(b'\x00', b'')` + Layer 1/2 兜底 | 第 19-22 次（5/13） |
> | 4 | `.git/index` corruption（sandbox view） | sandbox 操作 git status / fetch | sandbox bad signature、host normal | sandbox 完全不跑 git、走 host PS | 全 5/13 |
> | 5 | `.git/index.lock` unlinkable + PS CLIXML 吞 stderr | sandbox 留 lock 撞 host | host PS exit 128 + 看不到 stderr | `Remove-Item .git\index.lock` + `cmd /c "... 2> err.txt"` | 第 29 次（5/13） |
> | 6 | install scripts 預設 `pwsh` missing silent | install.ps1 hardcode `pwsh` | silent fail / Layer 1+2 沒裝 | install.cmd auto-detect dispatcher | 第 29/30 次（5/13） |
> | **7** | **Cowork outputs/ 不是 host-visible**（R59 新）| 給 user PowerShell SOP 用 `<outputs path>\script.py` | `python: [Errno 2] No such file or directory` / `9009 command not found` | 給 user 的 .py/.ps1 寫到 host-visible folder（如 repo 根目錄 `_rNN_*.py`）、SOP 結尾 cleanup `Remove-Item _rNN_*.py` | R59 第 1 次失敗（biped session）|
> | **8** | **Python 中文 print silent crash（cp950 codec）**（R59 新）| Python script 含 `print("中文 OK")` 在 Windows console | script 跑完無任何 output、exit 0 / files 沒改 / git status clean | (a) PowerShell SOP `$env:PYTHONIOENCODING="utf-8"` + `$env:PYTHONUTF8="1"` (b) script 開頭 `sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)` (c) log msg 用 ASCII `[OK]/[FAIL]/[WARN]` 前綴 | R59 第 2 次失敗 |
> | **9** | **Windows `python` 可能是 Microsoft Store stub**（R59 新）| user PATH 把 `WindowsApps\python.exe` 排在真 Python 前 | `python script.py` exit 9009 / 無 output；某些 invocation 跳 Store install dialog | 給 user SOP 第一步 `Get-Command python` 看 Source；用全路徑 + PS call operator `& "C:\...\python.exe"`；或用 `py` launcher | R59 第 3 次失敗 |
> | **worst** | **sandbox bash 完全失能跨 round**（R59 worst case）| sandbox 跨多 round 持續返回 `Workspace unavailable. The isolated Linux environment failed to start` | 所有 sandbox bash 命令 fail、無法 unzip / md5 / Python deep verify | 切純 host-side：Read/Glob/Grep file tool 完成查詢；給 user 寫 host Python script；zip 解壓 / md5 等 sandbox-only 操作延後到下 round | R59 跨 R57/R58/R59 整 3 round |
>
> **R59 三維度 cascade 關係**：
>
> - 維度 7（outputs/ 不 host-visible）→ user 跑 `python <invalid path>` → exit 2 / silent fail（容易被 8/9 cascade 混淆 root cause）
> - 維度 8（中文 print silent）→ script 跑了但無 output / 無 traceback → 誤判 script OK 實際 files 沒改 → 連鎖到「為什麼 git status clean」debug 走錯方向
> - 維度 9（Store stub）→ `python --version` 看似有 output（stub forward 到真 Python 印 version）但 `python script.py` 可能 exit 9009 → 誤判 Python 環境 OK 實際 stub 阻擋
> - worst case → 觸發整 session host-side fallback 紀律重組
>
> **統合 thesis 升級**（R59 強化）：
>
> > **Cowork sandbox + Windows host + Python runtime + Cowork file boundary = 4 層邊界都有 silent failure。永遠不要相信任何工具的「success」回報、永遠 verify。多層 cascade 時、debug 第一動作不是猜 root cause 而是降層驗證每層 healthy（依 §8.36 sub-rule 3 attribution bias 紀律）。**
>
> **統合 SOP 升級（R59 新增 3 條紀律）**：
>
> 6. **給 user PowerShell SOP 的 .py 路徑必 host-visible**（維度 7）：寫到 mounted repo 根目錄 `_rNN_*.py`、`_` 前綴標臨時、SOP 結尾 cleanup
> 7. **Python script 三件套（PYTHONIOENCODING env / sys.stdout UTF-8 wrapper / ASCII-only log prefix）**（維度 8）：給 user PowerShell SOP 永遠在第一行設 `$env:PYTHONIOENCODING="utf-8"` + `$env:PYTHONUTF8="1"`
> 8. **Windows `python` 預設不可信、第一次 SOP 必跑 `Get-Command python` 看 Source**（維度 9）：Source 含 `WindowsApps` → 用全路徑 `& "C:\...\pythoncore-*\python.exe"`
>
> **新增規則 6: sandbox 失敗 1 次允許 retry、第 2 次必切 host-side fallback**：
>
> R59 教訓：sandbox 跨 round 失能不是 race / temporary、可能是整個 cowork session 期間 worst case。每 round 第一個 bash call 失敗 + retry 1 次後仍失敗 → 立刻切 §15.6 host-side fallback SOP（依 biped session PRINCIPLES.md 已實裝、可推廣回 personal-playbook）。
>
> **對位 follow-up 推進**（從第 33 修 5 條中對位 #3 + 補新）：
> - ✅ **Follow-up #3** §3.14/§3.18 補強（跨邊界 sandbox mount stale）→ 本補強 9 維度 + worst case 涵蓋（sandbox 完全失能是 stale 的極端情況）
> - 部分推進 **Follow-up #2** §8.36 sub-rule 4 候選（協作電腦類 round 開工 SOP 第 1 步 = git fetch）→ R59 開工確實先跑 `git fetch + git log` inspect（符合候選紀律、第 2 supporting case）
> - 部分推進 **Follow-up #5** 檔案編輯類 SOP 三段式分離 → R59 PowerShell SOP 均採單一 code block + cleanup、未踩 paste markdown to PS 坑


### 3.15 Cowork sandbox cross-mount 大檔 cp / write 限制

Cowork sandbox bash 對 mounted Windows folder 的 file IO 速度約 **5-6 MB/s**，遠低於本機 disk-to-disk（通常 100-500 MB/s）。對 >100 MB 大檔的 cp / write 操作會撞 sandbox 預設 **45 秒 timeout**，造成 partial write 殘檔（檔案存在但內容不完整）。

**症狀**：

- sandbox bash 端 `cp /sandbox/path/big.bin /sessions/.../mnt/<repo>/...` 跑到 timeout 報錯
- 目標位置出現殘檔（如 250 MB / 預期 508 MB — 寫了一半）
- sandbox `rm` 對 mounted folder 內檔可能 `Operation not permitted`（cgroup 限制）

**正確處理**：

1. **由 user 端 PowerShell 處理大檔**（disk-to-disk 比 sandbox cross-mount 快 N 倍）：

```powershell
# 從 uploads 解壓到目標 mounted 子目錄
Expand-Archive -LiteralPath "<src.zip>" -DestinationPath "<dst-mounted-path>" -Force

# 或直接複製
Copy-Item "<src>" "<dst-mounted-path>" -Force

# 驗證 size + md5
(Get-Item -LiteralPath "<dst>/<file>").Length
Get-FileHash -LiteralPath "<dst>/<file>" -Algorithm MD5
```

2. **sandbox bash 只負責 metadata + ADR + .gitignore**（不碰實際大檔）

3. **若殘檔已產生**：依本節姊妹章 §3.16，個別 pathspec gitignore 擋住即可（殘檔本機留無妨、不會 commit）

#### 為什麼這個習慣值錢

sandbox cross-mount 寫入是 IO 瓶頸 + timeout 雙重限制。Senior 紀律：對 >100 MB binary 永遠走 user 端 PowerShell、不期待 sandbox 寫得進去。對應 §3.10 / §3.13 / §3.14 系列，`§3.15 = mount 寫入層 IO 限制`。

> 📜 **真實案例**：見 §B.25（biped-research CPR-0 全身.stl 508 MB sandbox cp 45s timeout 留 250 MB 殘檔）

### 3.16 巨型 binary 檔處理政策（>50 MB）

GitHub 對單檔有硬限制：**50 MB 起警告 / 100 MB hard reject push**。對 >50 MB 的 binary（CAD / mesh / 影片 / dataset 等）必須採取特殊政策、避免直接 commit。

**政策框架**（從 biped-research ADR-007 升格）：

| 維度 | 政策 |
|---|---|
| 本機保留 | ✅ user 端 _raw/ 子目錄留原檔 |
| `.gitignore` | ⛔ **個別 pathspec 擋**（用精確路徑、不用 `*.stl` / `*.bin` 通配避免誤傷小檔）|
| NOTICE / SOURCE_PENDING 紀錄 | ✅ size + md5 + 取得管道 + user 端原始路徑 |
| 降模 / 壓縮版本入庫（鼓勵）| ✅ mesh ≤1M triangles ≈ 50 MB（用 Blender / MeshLab / trimesh）|
| Git LFS 替代 | ⏳ 視需求（免費 1 GB/月 quota，超過要付費）|

**為何用個別 pathspec 而非通配**：通配（`*.stl` / `*.bin`）會擋既有所有相同副檔名的小檔（誤傷）；個別 pathspec 明確、可追蹤、不誤傷。

```
# .gitignore 範例（個別 pathspec）
01_lineage_super_anthony/01c_siegfried_creater/_raw/CPR-0_full_body_3D_print_old_gen/*.stl
```

**降模工具建議**：

- **Blender headless**：`blender -b -P decimate_script.py`（quadric edge collapse）
- **MeshLab CLI**：`meshlabserver -i in.stl -o out.stl -s decimate.mlx`
- **trimesh + fast-simplification**（Python）：`mesh.simplify_quadric_decimation(target_face_count=1_000_000)`

#### 為什麼這個習慣值錢

GitHub 50 MB 警告 + 100 MB reject 是 hard limit、不是 best practice。直接 commit 大 binary 會破壞雙推 SOP（origin + backup 兩邊都塞滿、history 暴增）。本政策跟既有 IP 政策（.exe / .ipt / .stp 等廠商敏感檔）一樣 = 「**本機留 + .gitignore 擋 + metadata 入庫**」三件套。

> 📜 **真實案例**：見 §B.25（biped-research CPR-0 全身.stl 508 MB / 10M triangles 觸發 ADR-007 + 個別 pathspec gitignore + SOURCE_PENDING metadata）


### 3.17 跨環境 shell prompt audit — paste 命令前必讀 prompt

sandbox bash / host PowerShell / VM SSH session 三類 shell 同時開時，**「想都不想就 paste」是引入錯誤的高風險動作**。每個 shell 的 prompt 都告訴你「**我現在在哪台機**」——這是免費、unambiguous 的一手 metadata。paste 前讀 prompt、5 秒成本、避免一日多次踩同坑。

#### 三層 prompt 對位表

| Shell 類型 | Prompt 範例 | 命令類型 |
|---|---|---|
| **host 端 PowerShell**（Windows）| `PS C:\WINDOWS\system32>` / `PS C:\Users\...>` | `Get-`/`Add-Content`/`Copy-Item`/`type`/`ssh`/`ssh-keygen` |
| **sandbox bash**（Cowork Linux）| `bash-5.1$` / `$` / 通常無 user@host prefix | 一般 Linux 命令、git 操作（受 §3.13 cross-mount 限制） |
| **VM SSH session**（Ubuntu 等遠端）| `user@<hostname>:~$`（如 `user@u5m60:~$`、`user@u6p40:~$`）| `sudo`/`systemctl`/`apt`/`docker`/`nvidia-smi`/`netplan` |

#### 給命令 / 收命令的協議

**給命令者**（如 Claude）：**每個命令 block 前必須 explicit 標示執行環境**，格式：

- `【host 端 PowerShell】`（如還需強調「新視窗、不在 SSH session 內」也明說）
- `【sandbox bash】`
- `【VM 內 bash】`（如多台 VM 需 `【u5m60 內 bash】`）

**收命令者**（user）：**paste 前先看 prompt 字串、確認與標示一致**：

- 標示 `【host 端 PowerShell】` + prompt 看到 `user@u5m60:~$` → **STOP、切視窗**
- 標示 `【VM 內 bash】` + prompt 看到 `PS C:\...>` → **STOP、切視窗**

#### 失效模式（已實證）

| 錯位類型 | 後果 | 案例 |
|---|---|---|
| host PowerShell 命令貼 VM bash | `command not found`（如 `findstr` / `arp` / `Get-Process`）| §B.28 早上 arp findstr |
| VM bash 命令貼 host PowerShell | `command not found`（如 `sudo` / `apt`）或 cmdlet 解析錯 | — |
| ssh test 命令貼 VM session 內 | sshd loopback、known_hosts 留垃圾 entry、若繼續還會留 fingerprint 紀錄 | §B.28 中段 ssh -o PreferredAuthentications |
| PowerShell here-string `@"..."@` paste 多執行 | 同命令連跑多次、檔案被追加多份重複 entry | §B.28 Add-Content 兩次 |

#### 救援與紀律

- **STOP first**：發現錯位、別繼續執行、按 `Ctrl+C` 或 `no` 中止
- **回填紀錄**：踩坑時把該 case 加進 §B 案例索引、避免再踩
- **paste 前讀 prompt 5 秒**：比每次救援成本（known_hosts 清理 / config 還原 / 重跑步驟）低 100×

#### 對位章節

- **§8.37 一手 metadata > 推測**：本節是 §8.37 在「**運維執行層**」的延伸——prompt 是免費、unambiguous 的一手「**我在哪台機**」metadata
- **§3.14 寫檔工具 corruption SOP**：本節是 §3.14 的姊妹篇——§3.14 是「**寫檔工具回報 success ≠ 真實寫入**」、§3.17 是「**paste 動作 success ≠ 命令在對的 shell**」
- **§137 plan-first**：標示 / 確認 prompt 是 plan-first 在 paste 動作層面的落實

#### 為什麼這個習慣值錢

sandbox + host PowerShell + VM SSH 三類 shell 並行是 Cowork 工作流的常態。錯位 paste 大多無害（`command not found` 立刻發現）、但少數 case 會留長期 garbage（known_hosts entry / config 重複行 / 半執行狀態）、補救 cost 比 prompt audit 高出 N 倍。Senior 紀律：**標示協議 + paste 前驗 prompt**、把 5 秒 audit 變成 muscle memory。

> 📜 **真實案例**：見 `HISTORY.md` §B.28（U5M60 P1 setup 一日 3 次踩 cross-context paste）。


### 3.18 Cowork uploads 同步異常 SOP — `<uploaded_files>` tag ≠ 檔案真的進 sandbox

> 📜 **本節 dogfooding**：與 §3.10 (git index) / §3.13 (git lock race) / §3.14 (寫檔工具 corruption) / §3.17 (paste prompt audit) 同列為 Cowork sandbox + Windows host 共存系列；本節為「**檔案上傳邊界**」的 mitigation。

Cowork client 收到 `<uploaded_files>` tag 並回報 file_uuid **不代表**檔案真的進入 sandbox 的 `/sessions/.../mnt/uploads/`。多種 silent failure 模式存在：客戶端取到檔案 metadata 但實檔上傳失敗、無錯誤回報、user 與 AI 雙方都以為「檔案已到位」繼續推進、實際 round 動工到一半才發現檔案不存在。本節為唯一可靠 SOP：**round 啟動前必跑 ls uploads 三工具實證**、不可根據 system-reminder / round 預告假設檔案存在。

#### 何時必觸發

- 任何 round 動工前（無論用戶是否「剛剛上傳」）
- 用戶說「補傳了 X」 / system-reminder 顯示 `<uploaded_files>` tag
- 上一 round 收尾時自己寫的「下一 round 預告」內提到的檔案
- 用戶答 Q1-Q5 釐清問題（答案內容隱含某檔案存在）

#### 三層失效模式（已實證）

| 失效類型 | 觸發條件 | 表象 |
|---|---|---|
| **網路磁碟機路徑 silent failure** | 用戶從 `H:\` `S:\` 等映射磁碟機拖檔上傳 | client 顯示「上傳成功」+ 給 file_uuid，但 sandbox `ls uploads/` 看不到、`find -iname '*X*'` 0 hit |
| **`.exe` 副檔名過濾** | 用戶上傳 `.exe` binary 檔（特別是 .NET / Microsoft installer）| 同上、無錯誤訊息 |
| **客戶端 cache stale** | 客戶端 UI 顯示舊上傳清單、新拖檔未同步 | sandbox 端等 5-10 秒後仍未出現 |

#### Round 啟動 SOP — ls uploads 三工具實證

第一個 bash 動作必為：

```bash
echo "=== uploads 最新 5 筆（mtime 排序）==="
ls -lt /sessions/<session-name>/mnt/uploads/ | head -10

echo "=== 預期檔案是否到位 ==="
ls -la /sessions/<session-name>/mnt/uploads/ | grep -iE "<expected_keyword>" || echo "❌ 未到位"

echo "=== 等 5 秒重新確認（避免 sync 延遲）==="
sleep 5
ls -lt /sessions/<session-name>/mnt/uploads/ | head -5
```

通過條件：
- mtime 為「最近」（相對於上一 round 收尾時間明顯較新）
- filename 與用戶 / system-reminder 描述匹配
- size 落在合理區間（PDF 通常 1-50 MB、安裝包 50-200 MB）

**未通過**：立刻 stop and ask、禁止根據訊息標籤就動工、寫補強 ADR / 文件預留位置。

#### Troubleshooting 三步驟（按穩定度排序）

| 順序 | 動作 | 為何穩 |
|---|---|---|
| 1 | 用戶 PowerShell `Copy-Item` 把檔案先複製到 `C:\Users\<user>\Downloads\` 再從那邊上傳 | 排除網路磁碟機路徑 silent failure（最常見原因）|
| 2 | 包成 `.zip` / `.7z` 再上傳 | 避開 `.exe` 副檔名過濾；額外 byproduct = AI 端能取到壓縮包 md5 + 解壓後 binary md5 雙憑證 |
| 3 | metadata-only fallback：用戶 PowerShell 算 `Get-FileHash -Algorithm MD5,SHA256` + size + 用途說明，AI 端寫 dependency markdown 紀錄、不入庫 binary | 上傳完全失敗時的最後保險；對應 §3.16 巨型 binary 政策的姊妹策略 |

#### Round 啟動的反例（必須避免）

```
❌ Bad pattern：
  Round 收尾：寫「下一 round 預告：用戶剛補傳兩個檔案 V5 + dotNet」並列入待辦
  下一 round 啟動：直接寫 Q1-Q5 釐清問題、假設檔案存在
  用戶答 Q1A-Q5A 後才執行 ls uploads → 發現檔案根本不在
  → 已浪費規劃 effort + 用戶決策已綁定不存在的檔案 + 必須 stop and re-plan
```

```
✅ Good pattern：
  Round 收尾：寫「下一 round 預告：**若**用戶提供 V5 + dotNet，可以這樣處理...（hypothetical）」
  下一 round 啟動第一動作：ls -lt uploads → 確認最新檔案
  若有 V5 + dotNet → 寫 Q1-Q5
  若沒有 → 直接問用戶「請確認是否要上傳這兩個檔案，或本 round 改做其他事」
```

#### 對位章節

- **§3.10 Cowork sandbox git index 操作 SOP**：本節是 §3.10 的「**檔案上傳層**」姊妹篇——§3.10 是「git index 寫入層 corruption」、§3.18 是「檔案上傳邊界 silent failure」
- **§3.14 Cowork 寫檔工具 corruption SOP**：兩節都是「**工具回報 success ≠ 真實狀態**」範式，本節是上傳工具層、§3.14 是寫檔工具層
- **§3.16 巨型 binary 檔處理政策**：上傳失敗的 fallback step 3 = §3.16 metadata-only 策略，本節 = §3.16 在「上傳失敗場景」的延伸應用
- **§3.17 paste 命令前必讀 prompt**：兩節都是「**動作 success ≠ 預期效果**」、本節是上傳動作、§3.17 是 paste 動作
- **§十「與 AI 協作 prompt 片段」**：本節 SOP 內容適合升格進 AI 協作 prompt（特別是 round 啟動三工具實證原則）

#### 為什麼這個習慣值錢

`<uploaded_files>` tag 看似權威 metadata（含 file_uuid + filename + 來源 path）但實際**只是 client 端意圖**、不是 sandbox 端事實。差距小（5 秒 ls 即可驗）但成本高：基於不存在檔案動工 → 寫了 ADR / cheatsheet / 釐清問題 → 全部要砍掉重來、用戶決策也要重答、信任成本損耗。

更深層：**senior 紀律 = 對「邊界」的健康懷疑**。同一原則跨 §3.10 / 3.13 / 3.14 / 3.17 / 3.18 反覆出現、不是巧合 — Cowork 整個工作流就是「sandbox 視角 ≠ host 視角」的多維邊界、每個邊界都有自己的 silent failure 模式、都需要主動驗證機制。本節補完了「**檔案上傳邊界**」這個維度。

> 📜 **真實案例**：見 `HISTORY.md` §B.29（biped-research 2026-05-11 R37 V5 PDF + dotNet exe 從 H:/S: 網路磁碟機路徑兩次上傳全失敗）。

### 3.19 跨機並行 push divergence handling SOP（stash → pull → pop dance）

> 📜 **本節 dogfooding**：2026-05-12 W1+W3+W4 commit 時、host PowerShell 嘗試 push 撞 origin/main fast-forward 衝突(協作機 5/9-12 已推 7 個 commit)、走完此 dance 後 commit `784dfce`、push origin + push backup 全綠。同列為 Cowork sandbox + Windows host 共存系列、是 §3.10 / §3.13 / §3.14 / §3.15 / §3.16 / §3.17 / §3.18 的「**跨機 git 同步邊界**」姊妹篇。

跨機並行工作下、push divergence 是常態、不是 exception。典型場景：sandbox bash + host PowerShell + 協作機（另一台 / 公司端）三端並行、任一端 push 後另兩端的本地 main 就 stale。本節為唯一可靠 SOP — 不靠 force push、不靠 rebase、不靠盲合併。

#### 何時必觸發

- host PowerShell 嘗試 `git push` 撞 `Updates were rejected because the remote contains work that you do not have locally`
- `git status` 顯示本地有未 commit 工作（含 untracked file）但又需要 pull 同步
- 對協作機 / 公司機 / 另一台電腦的 commit 不確定有沒有 touch 自己改的檔
- 任何「**先 stash 才能 pull**」的情境

#### 標準 dance（七步、PowerShell 端）

```powershell
# host PowerShell（Windows 端）
cd C:\Users\<user>\Documents\Cowork\<repo>

# 1. Lock check（§3.13 dogfooding）
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }

# 2. Stash 含 untracked file（-u 重要、否則新建檔被 leftover）
git stash push -u -m "<work-in-progress 簡述、含日期+ session 識別>"
git stash list   # verify stash 有進去
git status       # 應 clean、無 modified / untracked

# 3. Fetch 並看 remote 新 commit
git fetch origin
git log --oneline HEAD..origin/main

# 4. 看 commit subject 判斷 conflict 風險（critical step）
#    - 新 commit 是否 touch 我們本地改的同一檔案？
#    - 若是 → 預期 conflict、stash pop 後要解
#    - 若否 → 預期 conflict-free、stash pop 後直接 commit
git log --oneline --stat HEAD..origin/main   # 看 file-level diff

# 5. Fast-forward pull（強制走 ff、不走 merge / rebase）
git pull origin main --ff-only

# 6. Pop stash 把工作拿回來
git stash pop
git status   # 看有沒有 `both modified` 紅字

# 7. 無 conflict → 正常 add + commit + push
#    有 conflict → STOP、貼 output 不亂改、走 §B.36 解 conflict 流程
git add <files>
git commit -m "<message>"
git push origin main
git push backup main   # 雙 remote（§3.3）
```

#### 反例（必須避免）

```
❌ Bad pattern 1：force push 跨機 divergence
  → 協作機的 7 個 commit 直接被擦掉、雙方工作丟失
  → 永遠不要 git push --force / -f / +ref（除非已備份且明確知道後果）

❌ Bad pattern 2：盲 git pull（沒 --ff-only）
  → 觸發自動 merge commit、history 亂、且 stash 還沒退
  → 應該永遠 --ff-only、ff 失敗時走 dance

❌ Bad pattern 3：stash 沒 -u
  → untracked file（新建的 docs/snippets/*.md）留在工作樹、pull 後可能跟 remote 衝突
  → 永遠用 git stash push -u
```

#### 通過條件 / sanity check

- step 2 後 `git status` 必 clean
- step 5 後 `git log --oneline -5` 看到 remote 7 個 commit 已在本地 HEAD 上方
- step 6 後若 `git status` 出現 `both modified` 紅字 → 立即 STOP、貼 output 不亂改
- step 7 push 後雙 remote 都 `Everything up-to-date` 或顯示新 commit SHA

#### 對位章節

- **§3.3 雙 remote 設定**：本節 push step 同步推 origin + backup、是 §3.3 的活用
- **§3.9 跨 AI session / 跨電腦並行工作 SOP**：本節是 §3.9 的「**push 邊界 sub-procedure**」、§3.9 是頂層方法論、本節是 push step 的具體 SOP
- **§3.10 Cowork sandbox git index 操作 SOP**：本節 step 1 lock check 來自 §3.10 dogfooding
- **§3.13 跨 sandbox/host 並行操作的 git lock race**：本節 step 1 lock check 來自 §3.13 dogfooding
- **§8.36 Self-audit 抓錯立刻修**：step 6 conflict 出現時的「STOP 不亂改」紀律 = §8.36 應用到 git conflict 場景

#### 為什麼這個習慣值錢

跨機並行工作不是少數派 use case — 任何「家 + 公司」「本機 + 雲端 sandbox」「自己電腦 + 同事電腦」配置都會遇到。divergence 一秒就發生、解開要 5-10 分鐘。沒 SOP 的情況下、新手常做的兩件事都會傷工作：

1. **force push 蓋掉協作機** — 永遠不要這樣做
2. **盲 git pull** 沒 stash → 撞「local changes would be overwritten」error、然後手忙腳亂

走標準 dance、5 分鐘解決、無資料損失、history 乾淨。

> 📜 **真實案例**：見 `HISTORY.md` §B.41（2026-05-12 W1+W3+W4 commit 時、stash → pull(21 files +2745 lines) → pop → push 雙 remote、commit `784dfce`、無 conflict）。

## 四、工作紀錄自動化規則

### 4.1 核心規則

**每次工作結束時，自動寫工作紀錄**——不需 prompt，AI 助手應主動完成。

存放位置：
- 整段：`docs/WORK_LOG_YYYY-MM-DD.md`（單日總結）
- 細節：`docs/decisions/YYYY-MM-DD_topic.md`（決策流）

### 4.2 工作紀錄結構

```markdown
# YYYY-MM-DD 工作紀錄

> 範圍：今日工作主題（一句話）
> 對應 commits: [hash] [一行 subject]

## 完成項目

- [ ] X-1 任務名稱（測試 N 條 ✅）
- [ ] X-2 任務名稱
- ...

## 數字總結

| 維度 | 數字 |
|---|---|
| 新增模組 | N |
| 新增測試 | N |
| 修改檔案 | N |
| 工作時長 | ~N 小時 |

## 對長期專案的影響

簡短描述今日對 roadmap 的位置與影響。
```

### 4.3 何時寫

- **每個工作 session 結束時**（不論完成度）
- **每個 phase 完成時**（額外寫 `docs/HISTORY.md` 條目）
- **每個 release 時**（加上 release notes）

### 4.4 何時不寫

- 純調查 / 學習（沒有 code 變更）
- 微小 typo 修正（單字換掉）
- 純配置調整（環境變數改動）

### 4.5 Backfill 規則

**未寫的 work log 不是 lost forever**。事後 retrospective 仍可重建——這個彈性消除「沒當天寫就放棄」的拖延陷阱。

backfill 的 source materials（可從中還原時序）：
- 該日相關的 decision logs
- `git log --since=<date> --until=<date>` 的 commit 列表
- commit messages（特別是含 phase/task ID 的）
- chat / email / slack 該日的對話紀錄（若可取得）

backfill 的格式約束：
- 標明 **「補寫日期 + 從何處重建」**（避免日後誤認為當天寫的）
- 內容寬度依然走標準 work log 結構（時段 / 數字 / 影響 / 反思）
- 若某些細節真的消失了（如「當天卡了多久」），誠實寫「無紀錄」優於猜測

> 「Decision log 是 backfill 的 source of truth」這個事實，反過來強化「**decision log 值得即時寫**」的論點——它不只給未來找答案用。

---

## 五、決策日誌自動化規則

> 這是個人專案最有價值的長期累積——遠勝程式碼本身。

### 5.1 核心鐵則

**捕捉「為什麼」，不是「做了什麼」**——「做了什麼」git diff / git log 可以查；「為什麼這樣做、不那樣做」只有當下能寫。

### 5.2 何時寫

凡符合以下任一條件，就寫一份：

- 有 **2 個以上選項**且選了其中一個
- 遭遇 **debug 過程超過 30 分鐘**的 bug
- 做了 **架構決策**（會影響後續多個檔案）
- 與 **使用者偏好** 衝突需要妥協
- 採用了 **看似違反直覺** 的做法

### 5.3 標準結構（每筆決策）

```markdown
## 決策 N：標題（一句話）

**情境**：當時遇到什麼問題？

**選項**：
- A. 選項 A（含技術細節）
- B. 選項 B
- C. 選項 C

**決定**：選 X。

**考量**：
1. 為什麼 A 不行
2. 為什麼 B 不夠好
3. 為什麼 C 是甜蜜點
4. 風險 / 妥協是什麼

**教訓**：
- 通用 lesson 1
- 通用 lesson 2
```

### 5.4 檔案命名規範

兩種命名 schema 並用：

**A. 日期型**（適合單日多項決策的工作紀錄）：
```
docs/decisions/YYYY-MM-DD_topic.md

例：
docs/decisions/2026-04-27_public_deployment.md
docs/decisions/2026-04-27_808_analysis.md
docs/decisions/2026-04-28_phase_a_backend.md
```

**B. 模組型**（適合單一功能的長期演進）：
```
docs/decisions/mode_NN_topic.md
docs/decisions/infra_NN_topic.md

例：
docs/decisions/mode_01_single_char_and_ir.md
docs/decisions/infra_01_data_sources.md
```

### 5.5 整體 layout

```
docs/decisions/
├── _TEMPLATE.md              # 空白模板
├── 2026-04-26_init.md         # 日期型（首日決策）
├── 2026-04-27_phase_X.md
├── mode_01_topic.md           # 模組型
├── mode_02_topic.md
├── infra_01_topic.md
└── infra_02_topic.md
```

### 5.6 為什麼這個習慣值錢

1. **回顧時找得回來**：「半年前那個關於 X 的決定，當時為什麼這樣？」→ 翻日誌找答案
2. **新人接手友善**：未來合作者 / 接手者讀完 `docs/decisions/` 就懂專案脈絡
3. **AI 協作 context**：下次與 AI 協作時，AI 讀決策日誌可以更快理解現有 trade-offs
4. **著作權證據**：「這個設計是我獨立思考的結果」——決策日誌是時序證據鏈
5. **避免重複犯錯**：「教訓」段落會在你下次想做同樣事情時警告自己
6. **Backfill source of truth**：當 work log 來不及當天寫時，事後 retrospective 重建只能靠 decision log + git log（見 §4.5）。決策日誌寫得詳實 = 未來重建 timeline 的可能性

### 5.7 「何時不該立即實作」決策框架

決策不只是「動了什麼」，**「沒動什麼 / 為什麼不動」**同樣值得記錄，是 anti-scope-creep 的關鍵工具。

當你考慮要不要立即實作某個閃過腦海的想法時，跑這 4 題：

1. **主線該做的事都做完了嗎？** 沒做完 → 別分心
2. **有實際使用者拉力嗎？** 沒人問 → 自己用得到嗎？dogfooding 也算
3. **依賴 / 基礎建設都成熟了嗎？** 缺什麼 → 先把那邊補完
4. **新增的維護成本承擔得起嗎？** 已超 N 個 active 工作項時，再加是否合理？

四題全 yes 才動工。否則：
- 寫進 backlog（如 `SPINOFFS.md` 或 `BACKLOG.md`）
- 寫一份精簡決策日誌：**「為何此刻不做」**
- 等下次 review 時重新評估

> **「停下動作收進 backlog」本身是一個有意識的決策**，不是輸給時間。在工程上 knowing when to stop 跟 knowing when to push 同樣重要。

---

### 5.8 跨 phase 共享檔案的 commit：誠實標註 > hunk 強拆

累積多 phase 改動沒 commit 時，共享檔（如 `server.py` / `index.html`）會混多個 phase 的 hunk。**強行 hunk-by-hunk staging 風險高**；commit message 誠實註明「同檔含其他 phase 改動」是務實妥協。

#### 三選一比較

| 路徑 | 風險 | 工序 | 推薦度 |
|---|---|---|---|
| (A) Hunk-by-hunk staging（`git add -p` 或 patch apply） | 高 | 高（每檔每 hunk 手動判斷） | ✗ |
| (B) 一個大 commit 全塞 | 低 | 最低 | ⚠️ 失去 phase 結構 |
| (C) 按 phase 分 commit，**共享檔誠實標註** | 低 | 中 | ✓ 推薦 |

#### How to apply

1. 識別「乾淨可拆」的檔（單 phase 修改）vs「共享檔」（多 phase 並行修改）
2. 乾淨檔按 phase 分 commit
3. 共享檔丟到「主流 phase」commit 內（通常是改動最大那個 phase）
4. **commit message 明確註明**：
   ```
   注：server.py / index.html 同時含 12m-7 r39 rect_title UI/API 改動
   （共享檔案，未拆 hunk）。
   ```
5. 後續 phase 的 commit 也提一句：
   ```
   對應 UI/API 改動已併入前一個 commit。
   ```

#### 為什麼不強拆

- Hunk staging 需要 deep understanding 每個 hunk 屬於哪 phase。誤切會產生「不能 build / 不能 import」的部分 commit，造成後續 bisect 困難
- `git log -p` 任何時候都能看到完整 diff，誠實註明就足夠後人理解 commit 邊界
- 真要 phase-precise rollback，可用 `git checkout <commit> -- <file>` 局部回退；不需 commit 階段就 perfect

> 📜 **真實案例**：stroke-order 2026-05-04 整理 5b r4-r26 (mandala) + 12m-7 r39 (rect_title) 累積工作。`server.py` + `index.html` 同時含兩 phase 改動。Plan A 原本想 hunk 拆，評估風險高（hunks 跨 phase 互依），改成 C2 commit 內含完整 diff、commit message 註明，後續 C3 commit 提「對應 UI/API 改動已併入前一個 commit」。`git log -p` 仍可看完整 diff。詳 stroke-order 的 `docs/journal/2026-05-04_session_log.md`。

### 5.9 QODA 協作協定（Question → Options → Decision → Approval）

> 借鏡來源：研究 `cenconq25/claude-code-app-studio` 後將其 QODA 協定明文化。本章是 §5.3「標準結構」的對話前置，§5.7「何時不該立即實作」的決策框架延伸。

#### 5.9.1 4 步流程

每個非小事決策（涵蓋 §5.2 的 5 條觸發條件 + 與 AI 協作的所有 implementation choice），AI / 自己 / 協作者一律走：

```
Question  → 把問題 frame 清楚（含已知條件、unknown、為什麼此刻要決定）
Options   → 列 ≥ 2 個方案，每個方案附 trade-off
Decision  → 標明「我推薦哪個 + 為什麼」（一段話）
Approval  → 等用戶 / 決策者明確 sign-off 才動手
```

#### 5.9.2 為什麼是 4 步（不是 3 步）

很多人省掉 Approval，變成「Question → Options → Decision → 直接動手」。但**沒 Approval 的 Decision = 推測**：
- 你以為對方接受了 → 結果做出來不是他想要的
- 對方以為你只是在思考 → 沒注意到你已動工

**Approval 是顯式契約點**。可以是「OK」「同意」「選 B」這麼簡短，但**必須是發話人主動表達**，不是接收方推斷。

#### 5.9.3 例外：什麼時候可跳過

| 情境 | 是否跳過 |
|---|---|
| 對話 / 釐清 / 解釋（無實質改動）| ✅ 跳 |
| 微小修正（typo / 格式 / 1-2 行重構）| ✅ 跳 |
| 已有明確 ADR / sign-off 的延伸實作 | ✅ 跳（Approval 已在 ADR 階段給過）|
| 加新依賴 / 改 license / 改架構 / 動 API contract | ❌ **必走 4 步** |
| 資料源變更（換 dataset / 換韌體版本）| ❌ 必走 |
| 不確定就走 | ❌ 必走（成本 < 1 分鐘，誤動成本 > 1 小時）|

#### 5.9.4 與 §五 既有規則的關係

| §5 規則 | QODA 對應 |
|---|---|
| 5.2 何時寫決策日誌 | QODA 走完後 → Decision + 推理（情境 / 選項 / 決定 / 考量 / 教訓）寫進 `docs/decisions/` |
| 5.3 標準結構 | 跟 QODA 4 步幾乎 1:1（情境 = Question、選項 = Options、決定 = Decision、考量 = Approval 後的 trade-off 紀錄）|
| 5.7 何時不該立即實作 | 是 Approval 之前的 gate；4 問通過才 sign-off |

→ **協同**：QODA 是「對話 / 即時決策」的通用協定；§5.2-5.5 是「事後留下文件」的歸檔規範。兩者並用 = 即時對話有結構 + 事後翻查有檔案。

#### 5.9.5 與 AI 協作時的應用

把這段加進使用者偏好或 `CLAUDE.md`：

```markdown
## QODA 協作協定（必須遵守）

任何非小事決策（加新依賴、改架構、選技術 stack、設計 API、命名 convention、動 license 等）：

1. **Question**：把問題 frame 清楚，列已知條件 + unknown
2. **Options**：給 ≥ 2 個方案，每個附 trade-off
3. **Decision**：明示「我推薦哪個 + 為什麼」
4. **Approval**：**等用戶明確 sign-off 才動手**，不要假設用戶 OK

例外：對話 / 釐清 / 微小修正 / 已 ADR sign-off 的延伸實作 → 跳過。
```

> 📜 **真實案例**：本原則起源於研究 `cenconq25/claude-code-app-studio` 後將其 QODA 協定明文化。原 README 段：「Every non-trivial step follows Question → Options → Decision → Approval. Agents ask before assuming, offer at least two viable options for any judgement call, surface the trade-offs, and wait for explicit sign-off」。借鏡細節 + 取捨見 [`HISTORY.md` §B.17](HISTORY.md)。

### 5.10 N 層 hierarchical context budget（四家獨立收斂）

Senior 級 agent 系統 / 工作流 governance 應採「**N 層紀律 scaling**」：依任務 / spec / context 規模對應紀律強度。

**Meta-pattern**（不變）：
- 每次必載層 < ~600 token
- 中層編譯（按需重構成 distilled 形式）
- 深層 RAG（按需檢索）
- **依規模選擇紀律強度**

**實作層數可變（3-5 層皆可）**：

| 來源 | 層數 | 內容 |
|---|---|---|
| 自家 auto-memory（既有實踐） | 2 層 | MEMORY.md 索引 + 個別 \*.md 內容 |
| Ted L0-L4（note 123） | 5 層 | 500 字憲法 / 2000 字技能表 / 30 技能載入 |
| zycaskevin L0-L3（note 130） | 4 層 | 身份 / 核心事實 / 動態情境 / 深度知識 |
| 高詣翔 spec 三層（note 108） | 3 層 | 產品意圖 / 架構邊界 / 實作細節 |
| Hermes P7/P9/P10（note 137） | 3 層 | 小事 / 中事 / 大事 紀律強度 |

**對位 auto-memory 既有實踐**：MEMORY.md 索引 + 個別 file 雙層結構是 4 家 framework 的 minimum viable instantiation、設計 rationale 已被外部驗證。

> 📜 **來源**：四家 reference 獨立收斂於 hierarchical scaling meta-pattern（note 108 / 123 / 130 / 137）。

### 5.11 Memory 四分類 + Strategic memory = distilled causality

Memory 系統按四類設計：

| 類別 | 用途 | 對位 personal-playbook |
|---|---|---|
| **Semantic** | domain knowledge | `auto-memory/user_*.md` / context 文件 |
| **Episodic** | 事件流水（what happened） | git history / session log / WORK_LOG_\*.md |
| **Procedural** | 步驟流程（how to do） | scripts/ / SOP / playbook 規則本身 |
| **Strategic** | **distilled causality（為什麼這樣決策、未來怎麼做）** | `auto-memory/feedback_*.md` / `project_*.md` / decision logs |

**Strategic memory 的關鍵特徵**：
- **不是 episodic event log**（不是「5/4 我做了 X」）
- **是萃取因果**（「**為什麼上次選 A、下次邊界條件變了該選 B**」）
- 範例（note 112 黃油翻譯）：「第三章張三李四結婚改稱老婆、第五章還記得」= strategic memory 在 production 場景的具體 demo

**對位 auto-memory 既有實踐**：
- `feedback_ollama_binding.md` = strategic（為什麼 + 如何套用）
- `feedback_work_log.md` = strategic（紀律 + 為什麼）
- `project_ai_stack.md` = mixed semantic + strategic
- `reference_docs.md` = semantic（純位置 reference）

設計 rationale 補丁：4 個 memory file 命名 prefix（user / feedback / project / reference）已隱含此分類、明文化更精準。

> 📜 **來源**：note 108 高詣翔（理論層 4 分類定義）+ note 112（production 落地 demo）。

## 六、資料源稽核（Source-of-Truth Audit）

> 凡標榜「官方」「政府」「標準」「規範」的資料源，**必須回追到一手公文**。否則內容可能被中介者意外或刻意污染。

**典型風險**：第三方整理品（GitHub Gist、Wikipedia 表格、學術部落格）即使號稱來自官方，仍可能在轉錄過程中夾帶他國規範變體 — 例如以「教育部某字單」為名的整理品中混入 GB18030 變體字、看起來「99.98% 一樣」但已足以污染下游。對 Taiwan-first 專案的影響尤其嚴重。

### 6.1 何時必跑

任何時候加入新資料源——**不只是 public release 之前**。

觸發場合：
- 引用「教育部」「國家標準」「國際協議」「ISO」的字單 / 規範 / 詞典
- 從第三方整理的 GitHub repo / Gist / 學術網站 / 部落格抓資料
- 接 API 取得「政府開放資料」「百科平台資料」
- 抓 Wikipedia / Wikidata 整理表格

### 6.2 三段檢查

**A. 一手公文確認**

- [ ] 找到原始公文 / 公報 / 標準文件（PDF / 紙本掃描 / 政府網站直連）
- [ ] 第三方整理品（Gist、GitHub repo、Wikipedia 表格）只能當「線索」，不能當「資料源」
- [ ] 出版年月、版次、發布單位都明確記錄到 metadata
- [ ] 一手 URL 寫進 `source` / `url` 欄位

**B. 內容比對**

- [ ] 一手 vs 第三方逐字比對（字數、Unicode codepoint 都要對）
- [ ] 任何差異都要追蹤原因（是第三方 OCR 錯？變體污染？版本差？人為刪改？）
- [ ] 差異 ≥ 0 時，**永遠採用一手**，並把差異記錄進決策日誌
- [ ] 一手本身有 metadata bug 時（如 PDF hex/char 不一致），明示「以實際 char 為準」

**C. 區域變體完整性（Taiwan-variant integrity）**

- [ ] 確認所有字元的 Unicode codepoint 屬於目標區域標準
  - **T (Taiwan)**：依 CNS 11643 標準
  - G (PRC)：GB18030 變體（Taiwan-first 專案要避開）
  - J (Japan)：JIS 變體
  - K (Korea)：KSC 變體
  - V (Vietnam)：喃字變體
- [ ] 對近似字（外觀像但 codepoint 不同）特別留意。已知陷阱：
  - **彞 (U+5F5E, T)** vs 彝 (U+5F5D, G)
  - **汨 (U+6C68)** vs 汩 (U+6C69)
  - **過** 在 G/H/T/J/K/V 各有不同變體
- [ ] 工具：Unicode 17.0 CJK chart `https://www.unicode.org/charts/PDF/U4E00.pdf`
      字元下方 G/H/T/J/K/V 標註對應區域變體

### 6.3 抽象案例：政府字單 / 規範類整理品的變體污染

**情境**：第三方整理的「政府某字單」(Gist / GitHub repo / Wikipedia) 與**官方公文 PDF** 比對。

**典型發現**：N 字中常出現 1-2 字差異
- 第三方版：含他國規範變體（例：GB18030 / JIS / KSC 變體）
- 官方版：本國標準字（例：CNS 11643）

**結論**：**永遠採用官方一手 PDF 作為唯一資料源**，每字保留官方 metadata（如字號）追溯到原始公告。

**啟示**：「**字數一樣 ≠ 內容一樣**」、「**99.98% 相同也夠污染**」、「**0.02% 差異就是供應鏈污染的警示燈**」。

> 📜 **真實故事**：本案例的具體經歷（教育部 4808 常用字 + 彝 vs 彞 變體污染）見 [`HISTORY.md` §B.2](HISTORY.md#b2--六-資料源稽核--教育部-4808-變體污染彝-vs-彞)。

### 6.4 自動化建議

如果資料源是會反覆更新的（例如教育部每幾年公告新版字表）：

- 寫 `scripts/build_<source>.py`：從一手公文自動萃取 → 標準 JSON
- script 本身要：
  - 文件開頭 docstring 明確記錄資料源 URL + 出版日 + 版本
  - 預期 char count 在 sanity check 範圍內（避免 PDF parsing 失敗 silent fallback）
  - **Cross-check Unicode codepoint vs 實際字元**（catch PDF metadata bugs）
  - 輸出含 traceability 欄位（如官方字號、流水序號）

**通用 script 雛形**（任何 `build_<source>.py` 都建議含這幾段）：
```python
"""
Source: <一手公文 URL>
Published: <出版日 / 版本>
Authority: <發布單位>
"""
# 從官方 PDF / 一手檔案萃取
# 每筆資料附 traceability id (對應原始公告的字號 / 流水序號)
# 一筆一比對 hex metadata vs 實際內容（catch PDF parsing bugs）
# 預期 char count 在 sanity check 範圍內（避免 silent fallback）
```

### 6.5 多源 triangulation

當有 ≥ 3 份獨立一手源同時對同物件分類時（如：3 份不同的字頻語料 / 3 份不同地名拼寫指南 / 3 份不同的標準分類表），套 **consensus schema**：

```
strict   ← 三源都標 (最 conservative)
majority ← ≥ 2 源標 (平衡)
any      ← ≥ 1 源標 (最 inclusive)
none     ← 無源標 (排除)
```

**為什麼**：每個官方源各自 sampling 偏誤；三源差異本身是資訊不是雜訊。整合 schema 比「挑一個 winner」更有研究價值。

> 📜 **真實案例**：本原則衍生於 stroke-order 專案處理「教育部 4808 + NAER 99-108 字頻 + BIAU 詞典語料」三份獨立字頻一手源時——若硬挑一份當「真理」會丟掉「現代媒體頻次 vs 歷史標準」的關鍵差異，consensus schema 反而保留差異作為下游分類維度。詳見各專案決策日誌。

### 6.6 給 Future Self 的話

「為什麼花這個力氣？只是 1 個字的差異而已。」

因為個人字型 / 寫字機器人 / 教育素材 / Taiwan-first 專案都對「**這字是本國標準嗎？**」這個問題有要求。如果您的 codebase 從一開始就有 audit 習慣，這個 claim 站得住腳；如果省略了，N 年後想補 audit 會發現要回頭比對幾十個資料源——那個 cost 比現在多 100 倍。

> **「資料源頭管理是著作權保護的第一道關卡。」**

從一開始就 audit、就標 source、就比對一手公文 — **這 5 分鐘的習慣是您未來幾年內最划算的投資之一**。

---

## 七、公開前審查清單

repo 從 Private 改 Public 之前，**必跑**：

### 7.1 Secret 稽核

```bash
# 搜尋常見 secret 關鍵字
git grep -i "password\|secret\|api_key\|token\|credentials" -- ":!docs/" ":!*.md"

# 確認 .env 在 .gitignore
grep "^\.env" .gitignore
```

### 7.2 個資稽核

- [ ] commit message 沒有寫到家裡地址 / 私人電話 / 銀行帳號
- [ ] 程式碼註解沒有客戶 / 朋友本名
- [ ] 截圖 / 測試資料沒有真實個人資訊
- [ ] **`git config user.email` 用 GitHub noreply**（避免 commit metadata 暴露實名 email）
  - 取得：<https://github.com/settings/emails> → 勾「Keep my email addresses private」
  - 設定：`git config --global user.email "<numeric-id>+<username>@users.noreply.github.com"`
- [ ] **既有 commit history 是否含實名 email**：
  ```bash
  git log --all --format="%ae" | sort -u
  ```
  若有：通常**接受 trade-off、不 rewrite**（成本高、影響備份獨立性）。重點是「從現在起不再暴露」、不是「過去全清」。
- [ ] **文件內 hardcode email 殘留掃描**：
  ```bash
  grep -rn "@gmail\|@hotmail\|@yahoo\|@outlook\|@example.com\|@your-domain" \
    --include="*.md" --include="LICENSE"
  ```
  範例與文字應該全部用 placeholder 或 noreply 格式、不留實名 email。
- [ ] **更廣的個資 pattern 掃描**（電話、地址、銀行尾號、身分證）：
  ```bash
  # 台灣手機 / 市話
  grep -rEn "09[0-9]{8}|0[2-8]-?[0-9]{6,8}" --include="*.md"
  # 銀行帳號 / 信用卡尾段
  grep -rEn "\b[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}\b|\b[0-9]{12,16}\b" --include="*.md"
  # 台灣地址常見字
  grep -rEn "(台北|新北|桃園|台中|台南|高雄)市.*(路|街|大道).*段.*號" --include="*.md"
  # 身分證字號
  grep -rEn "\b[A-Z][12][0-9]{8}\b" --include="*.md"
  ```
  截圖、測試資料、commit message body 都要看（不只 source code）。

> 💡 **重要 Lesson**：**第一次 `git init` 之前**就把 `git config user.email` 設成 noreply，否則所有早期 commit 都會帶實名 email 進 history。事後 rewrite 成本高、且若已雙推 GitHub，backup remote 會跟著要強推（破壞時序證據獨立性）。
>
> 📜 **真實故事**：本 lesson 起源於一次 public 化前的 audit、發現 5 個 commits 已暴露實名 email — 完整經過見 [`HISTORY.md` §B.3](HISTORY.md#b3--七-公開前審查--email-暴露-audit--lesson-learned)。

### 7.3 授權稽核

- [ ] LICENSE 存在且資訊正確
- [ ] 第三方資料 / 字型 / 圖片授權都有 attribution
- [ ] 拷貝來的程式碼有註明來源 + 原 license

### 7.4 文件稽核

- [ ] README 第一段能讓陌生人 30 秒理解專案
- [ ] 安裝 / 啟動指令確認可重現
- [ ] 至少一份 `docs/decisions/` 已寫好

### 7.5 第三方資料源 attribution 完整性

§7.3 授權稽核的細項——**逐一比對：codebase 引用的所有資料源，是否在 LICENSE 末段都有 attribution**。

具體做法：

1. 列出 codebase 內所有「外部資料」的 inventory：
   - 字典 / 字單 / 詞庫 / 字頻表
   - 字型檔（ttf / otf / woff）
   - 圖庫（pixel art / icon set）
   - 翻譯檔 / 對照表
   - 預訓練模型權重
2. 對每筆來源確認：
   - LICENSE 末段是否有 attribution block？
   - 該資料的原始授權條款是否相容於主授權？
   - 衍生使用是否符合條款（特別是 CC BY-SA / GPL 類有「相同方式分享」要求的）？
3. **只要有「使用了但沒 attribution」的，視為 violation**——即使是公共領域資料，attribution 也表達基本尊重

> 檢查觸發點：每次 release 前 + repo 從 Private 改 Public 前 + 新增 dataset / 字型 / 圖庫的 commit。

### 7.6 強制 attribution 資源的主動同意 gate UX 模式

> 公開部署的網站使用 **CC BY-ND**、**CC BY-SA**、嚴格 attribution 要求的字型 / 圖庫 / 資料時，光在 LICENSE 末段標 attribution 不夠——使用者**沒看見** = 沒達成「visible attribution」的精神。本節給設計模式：UI 上紅綠燈 + 主動同意 gate。

#### 7.6.1 何時必用

凡屬下列任一情境：
- 部署的線上 demo / 工具用到 **CC BY-ND**（必須顯示原作者）資源
- 用到 **CC BY-SA**（衍生作品也要 BY-SA、attribution 強制）
- 政府開放資料的「強制標示出處」條款（例如 Taiwan 政府資料開放授權 1.0）
- 任何 license 寫「**must visibly attribute**」的資源

純把 attribution 寫在 LICENSE 末段、頁尾小字，**法律上爭議大**——普通使用者不會看到。

#### 7.6.2 設計模式：紅燈預設 + 主動同意 toggle

```
進入頁面 → 字型/資源預設 紅燈（未授權）
   ↓ 使用者點 [授權] 按鈕
彈出 confirm dialog 顯示：
   - 資源名稱 + 字數 / 規格
   - License 條款摘要
   - Attribution（原作者 + URL）
   - 法律精確說明：「授權 = 同意網站代為下載/使用，著作權仍歸原作者」
   ↓ 使用者按 [確定]
紅燈 → 綠燈，按鈕變 [取消授權]，資源啟用
   ↓ 使用者隨時可點 [取消授權]
直接生效（無二次確認），綠 → 紅
```

#### 7.6.3 三個關鍵法律精確點

**(a) 區分「下載/使用代理」 vs 「授權轉讓」**

最容易誤解的點。「授權」一詞模糊——使用者可能誤以為 = 「字型給我用 forever」。實際是「**我授權網站從來源下載並代為使用，著作權仍歸原作者**」。

UI 必須**顯著標示**這個區別。建議在 modal 頂端放橘色警示框：

```html
⚠️「授權」一詞的精確意義：此處的「授權」指您授權本網站從字型來源網站
下載與使用該字型，並非字型授權的轉讓。字型本身的著作權仍歸原作者所有。
```

**(b) Confirm dialog 包含 license URL**

使用者要有「能跳到 license 全文」的能力。dialog 內必含 `licenseUrl`，不是只有 license 名稱。

**(c) 取消授權直接生效**

CC BY-ND 等 license 內含「使用者可隨時撤回」精神。「取消授權」不該需二次確認——直接清 localStorage、紅燈、disable 該資源。

#### 7.6.4 技術實作架構（純前端 gate）

最簡單實作：
- 後端字型 / 資源**永遠載入**（runtime 不依授權狀態）
- 前端用 `localStorage["app:resource-authorized:" + key] === "1"` 控制 UI 紅綠燈
- 5 個 init function 各自 check `localStorage` → 渲染對應 banner（紅燈 + 授權按鈕 / 綠燈 + 取消授權 + attribution）
- render 時前端可選擇 reject 未授權 style（額外 gate；非必要）

**為什麼純前端足夠**：CC BY-ND 主要要求「**visible attribution + 使用者明確同意**」，不是嚴格 access control。純前端 UI 顯示 + 點按同意已達成這目標。

**何時需要後端 gate**：商業專案、強監管產業（醫療 / 金融）、license 明確要求 server-side enforcement。一般教育 / 工具網站純前端足夠。

#### 7.6.5 跨字型 / 多資源時的粒度

5 套字型 / 多份資料時，**每個獨立 toggle**——粒度精確匹配 license 顆粒度。一次性「授權所有」按鈕雖簡潔，但混淆不同 license 條款。

#### 7.6.6 按鈕視覺位置

按鈕放在 banner **最前面**（左側），不是末尾。原因：
- 中文 UI 慣例「動作詞」在左
- 末尾的按鈕容易被長 attribution 文字擠到視窗外
- 點擊區域明顯、降低使用者尋找成本

> 📜 **真實案例**：見各專案決策日誌（搜尋 `font_authorization_gate` 或 `cc-by-nd consent ui`）。

---

## 八、長期維護習慣

### 8.1 每次 push 前

- [ ] 跑 `pytest`（或同等 test runner）確認綠燈
- [ ] `git status` 確認沒夾帶意外檔案
- [ ] commit message 描述「為什麼」而非「做了什麼」

### 8.2 每週一次

- [ ] 看一下 GitHub Actions 是否仍綠
- [ ] 看一下 Render / 部署平台 cold start 健康度
- [ ] 整理當週 `docs/decisions/` 是否有遺漏

### 8.3 每月一次

- [ ] 升級依賴（`pip list --outdated`）
- [ ] Review `docs/HISTORY.md` 是否反映目前狀態
- [ ] 清理 stale branches

### 8.4 每個 release

- [ ] bump version
- [ ] 寫 release notes
- [ ] 更新 README badges 數字（測試數、版本）
- [ ] tag the commit (`git tag v0.x.x`)

### 8.5 為未來預留架構彈性（前瞻設計原則）

> **核心思想**：寫第一個檔案前，先想 **6 個月 / 1 年後** 可能的用法 — public 化？變網站？變書？變課程？  
> 想清楚了，**license 選擇、檔案結構、引用方式**自然會浮現。日後拆分 / fork / 公開時，多花 5 分鐘的成本換回避免 5 小時痛苦的價值。

具體習慣（寫筆記 / 開專案時就要做）：

1. **保持原創內容與引用內容的清楚分離**
   - 引用大段第三方內容時，**獨立成檔案 / 段落**，加 metadata 標明來源 + license（在 frontmatter 或檔頭註解）
   - 不要讓「您寫的話」和「您引用的話」深度交織 — 拆分時就無從下刀
   - 範例：`01_硬體架構.md`（原創）vs `99_引用_egh0bww1_blog_excerpt.md`（純引用）

2. **預留 license 抉擇空間**
   - 私人筆記**可以**含 CC BY-SA / GPL 等傳染性引用，但**心裡有數**：未來公開時要選擇「整體跟著傳染 license」或「拆出引用部分到獨立 repo」
   - 詳見附錄 J「授權相容性 cheat sheet」

3. **最小化嵌入式引用**
   - 與其貼 5 行第三方原文，不如**用自己的話 paraphrase** + 引用來源連結
   - Paraphrased text 著作權歸您 → license 自由選

4. **檔案命名 / frontmatter 暗示來源**
   ```yaml
   ---
   license: CC BY-SA 4.0 (derived from egh0bww1 blog)
   source: https://egh0bww1.com/posts/2023-10-24-unitree-go1-collection/
   ---
   ```
   未來自動化 audit script 能 grep 出所有「非 MIT」內容、決定怎麼處理

5. **私人筆記也別放 secret**
   - 即使是 private repo，「現在 private、未來 public」的成本巨大
   - secret 永遠放 `.env` / 環境變數 / 1Password、**never** 在 markdown 內文
   - 想像「明天有人意外 push 成 public」場景，現在能不能承受？

6. **公開化前的「逆向設計」演練**
   - 開新 repo 時，問自己「**最終公開版** 會長什麼樣子？」
   - 從那個目標倒推回來：哪些檔案要拆、哪些 license、哪些 attribution 要先寫好
   - 這比「先寫再說、之後再清」省力 10 倍

> 📌 **提醒**：本節是**心法**，附錄 J 是**工具**。心法不確定時翻附錄 J 的決策樹（J.4）。

### 8.6 移除功能時：保留檔案、只拔載入

當決定下線一個功能（模組、模擬器、舊版實作），預設做法是：

1. **HTML / 入口處拔掉載入**（`<script>` / import / require）
2. **被引用處改寫成走新路徑**（不留 fallback 分支，避免技術債堆積）
3. **檔案本身留在原位**（不要 `rm`，加註「v0.X.Y 起不再載入；保留供歷史追溯」即可）
4. **dead CSS selector / metadata 欄位**：清掉明顯的（避免 grep 噪音），但「資料定義」型的（如每個 skill 帶 `anim` 欄位給已下線 simulator 用）可以暫留，標為已知技術債

**為什麼**：刪檔很爽，但日後想復原（例如做「教學前後對照」、寫 retrospective）時要去 git 撈，成本很高。檔案保留 + 拔載入是最低後悔成本的下線方式。

> 📜 **真實故事**：本原則起源於一次下線 2D SVG simulator（被 3D 模擬器取代）的實戰經驗，完整經過見 [`HISTORY.md` §B.4](HISTORY.md#b4--86-移除功能保留檔案--doglab-coding-v051-下線-2d-svg-simulator)。

### 8.7 Morning audit ritual（每日工作 session 起手式）

每個工作日新 session 開始前，跑 SOP 一致性掃描——**通常 30 分鐘內可完成，效益是後續 4-8 小時的工作不在歪掉的基礎上累積**。

掃描清單：

- [ ] **§二 IP 三件套**：LICENSE / README / footer 三處身份鏈是否一致？
- [ ] **§三 雙 remote**：origin + backup 都活著？最新 commit 兩邊都到了？
- [ ] **§4 work logs**：上一個工作日的 work log 有沒有寫？沒寫立刻補（§4.5 backfill）
- [ ] **§5 decision logs**：上一個工作日的關鍵決策有沒有 log？
- [ ] **§六 audit checklist**：新引入的資料源有跑過三段檢查嗎？
- [ ] **§7.5 attribution 完整性**：新增資料源有寫進 LICENSE 末段？
- [ ] **§8.4 release tag**：上一個 version bump 有對應 git tag？

發現 gap：寫進今天的工作項目（前 30-60 分鐘清掉），再進主工作。

> **為什麼這個習慣值錢**：SOP 寫進 playbook 是一回事，**確實執行是另一回事**。Morning audit 是「對自己的 SOP 服從度的誠實度測試」——即使每次都全綠，這個 ritual 本身就是對 SOP 的尊重。

> 📜 **真實案例**：本 ritual 起源於 stroke-order 專案 2026-04-29 的 morning audit——一次例行掃描揭露 4 個 PROJECT_PLAYBOOK 漏跑章節（WORK_LOG_2026-04-27 backfill / cjk_common_808 §六 retrospective / §七 公開前審查 retrospective / v0.14.0 git tag pending），驗證了「即使 SOP 看似已內化，定期 audit 仍會抓到實際 gap」。詳見各專案決策日誌。

### 8.8 先 inspect 實際輸出，再下 root cause 結論

Debug 時的常見陷阱：看到 UI 不對，就直接改 UI；看到報告說某層出問題，就直接信。**真正的 debug 第一步是 dump 真實輸出**，不要用「應該怎樣」當作起點。

#### 規則

1. **直接看資料層**：可 curl 的 endpoint curl，可 dump 的中間態 dump，可 log 的執行路徑 log。看實際出來的東西，不是「應該」出來的東西。
2. **跨層問題從下往上 trace**：UI 層的「不對」可能是 backend 路徑漏參數，可能是資料層本身就壞。從最底層先看，逐層往上。
3. **看夠細才下結論**：「樣子怪怪的」不是 root cause。具體到「outline path 含 142 段直線 + 181 段 Bezier 但 0 段 C 命令」這種顆粒度，才有資格下結論。

#### 反例 vs 正例

**反例（修兩輪才中）**：
> 用戶報「印章切到隸書/篆書預覽空白」。
> Round 1：盯著前端 tintPreviewFill 看，覺得是 stroke="none" 抹掉子元素 → 修前端。**只解一半**（border 出來了，骨架線還是不見）。
> Round 2：curl `/stamp` endpoint 直接看 SVG。發現 backend 根本沒回 outline path → root cause 在 backend loader 漏帶 `outline_mode=skip` 參數。1 行 fix。

**正例（一次中）**：
> 用戶報「篆書邊緣不平滑」。
> 不假設「是渲染端鋸齒」。curl 取實際 SVG，分析 outline path 命令分布：142 段 L + 181 段 Q + 0 段 C → root cause 在 OTF 字型本身（資料層），用大量短直線近似曲線。立刻知道治本要換字型，緩解可加 `shape-rendering="geometricPrecision"`。

#### 工具技巧

- **Web API**：`curl` / `httpie` / browser DevTools Network tab。看真實 response payload，不要只看前端 console。
- **檔案處理**：`hexdump -C | head` / `xxd | head` 看 raw bytes，`file` 看實際格式。
- **資料庫**：query 出 raw rows，不要只看 ORM 抽象。
- **SVG / 結構化 data**：grep / awk 命令分布，不要只看渲染後的視覺。

#### 為什麼這個習慣值錢

- **省一輪修法時間**：每次「先看實際輸出」可能多花 5-10 分鐘，但少修錯一輪可能省 1-3 小時。
- **跨人協作的可信度**：「我 curl 過 endpoint，response 是 X」遠比「我覺得 backend 應該是這樣」可信。
- **Root cause 文化**：寫 decision log 時，「root cause 是 Y」前面可以接「實際輸出證明...」，論證鏈不靠假設。

> 📜 **真實案例**：本原則起源於 stroke-order 專案 2026-05-01 Phase 11 印章模組精修——前後 8 個 bug fix / feature 中至少 3 處的 root cause 必須先 dump 真實 SVG / API response 才找得到，盲改前端的修法都只解一半。詳見 [`docs/decisions/2026-05-01_stamp_phase11.md`](decisions/2026-05-01_stamp_phase11.md)。
### 8.9 底層改動 → 整條 pipeline audit

座標系統 / scale / EM / bbox / 預設值等基礎抽象的改動，視為**高風險改動**。不只看「直接相關功能是否正確」，要主動 audit 周邊：

- 所有用同類座標的 caller 是否仍正確
- 所有 default 值在新 base 下是否仍合理
- 所有 cap / floor / clamp 是否仍合理
- UX 上「user 看到的數字」是否還對應預期意義

#### 為什麼這個習慣值錢

底層改動會把上層舊 bug 從「不顯眼」變「使用者可感知」。如果改完只看直接範圍 → 隱性 bug 等到使用者撞到才被發現，債務變大。

#### 反例

stroke-order 11g 改 bbox-based scale（從 EM-based）—— 字身改成「outline bbox 撐滿 cell」，比 EM-based 更貼合。但這個改動暴露了既有 `inner_w = max(_, char_size_mm)` 的副作用：以前 EM-scale 字身有自然 padding 看不出來，bbox-scale 撐滿後 user 改 char_size_mm 時 inner_w 會被拉大，造成「user 主觀感覺章面內框跟著變」。

11g 當時只 audit 了「字撐滿 cell」這個直接目標，沒看 inner_w 計算的合理性。Bug 在 12b 才暴露。

#### 正例

12c 陽刻支援動主線之前先 prototype 驗證演算法（見 §8.11）。確認效能 / 視覺 / G-code 規模 / 邊角情況都 OK 之後才動 stamp.py。整個 12c 主分支只有 1 commit。

#### Audit checklist（base infra 改動專用）

- [ ] 列出所有 import 此 module 的 file
- [ ] 列出所有用此 default 值的處（grep magic number）
- [ ] 列出所有 cap / clamp 邏輯
- [ ] 跑全套 pytest 看 regression（不只直接 test file）
- [ ] 若有 UI，spot-check 所有相關面板的「user 看到的數字」

> 📜 **真實案例**：起源於 stroke-order 2026-05-03 Phase 12b — 11g bbox-scale 改動之後 5 週才被 user 撞到 inner_w bug。詳見 stroke-order 的 `docs/decisions/2026-05-03_stamp_industry_alignment.md`。

### 8.10 Default 值 single source of truth

超過一處出現的 default 值在 codebase 內，要改 named constant 並 import。grep 看到 3 處以上的 magic number 即觸發重構。

#### 規則

1. **Pydantic Field default + Query() default + 函式參數 default + UI input value** 同一個值散布到 4-7 處是常見反模式
2. 集中到 module-level constant（如 `stamp.py` 頂端 `DEFAULT_BORDER_PADDING_MM = 0.8`）
3. 所有地方 import 用，UI 改用 `<input :value="defaultBorderPadding">` 之類的 binding（如果框架支援）

#### 為什麼這個習慣值錢

更新 default 時，grep 漏改一處就造成 default 不一致。例如 stroke-order 12b 改 `border_padding_mm 2.0 → 0.8` 要同步 7 處（3 server + 4 stamp.py + 1 index.html）。手動 sed + grep 驗證能 work，但累積 debt。

#### Audit checklist

- [ ] grep `= 0\.8\|= 2\.0\|= 25\|...`（任何看起來像 default 的 magic number）
- [ ] 數出現次數 ≥ 3 → 列入 backlog
- [ ] 重構時：建 module constant + 全部 import + 加 test 確認 default 對齊

> 📜 **真實案例**：起源於 stroke-order 2026-05-03 Phase 12b-6 — 改 `border_padding_mm` 預設要同步 7 處。詳見 stroke-order 的 `docs/decisions/2026-05-03_stamp_industry_alignment.md`。

### 8.11 演算法工作 SOP：先 prototype 後主線

對「未驗證可行性的演算法」工作，動主線之前先寫 prototype（在 `scripts/` 或 `notebooks/`，不進主分支）。

#### 規則

prototype 階段必驗證：

1. **演算法正確性**：單元 case 對（最簡 input 跑出預期 output）
2. **效能規模**：最大 use case 不爆（時間 / 記憶體 / 輸出規模）
3. **視覺 / 業務正確性**：render → 看圖 / 跑端對端 case → 確認業務語意對

prototype 通過後才 port 進主線 module。**Prototype 檔案保留** 在 `scripts/`，當未來文件 / 教學 / 重新驗證用。

#### 為什麼這個習慣值錢

直接動主線寫演算法 + 直接接 API → 邊改邊試 → 主分支被 churn 多輪 commit / 測試持續紅 / 多次 force push 修細節。**Prototype 階段**避開所有這些雜訊。

主分支看起來：演算法工作會是 1 個乾淨 commit（含完整 test），而不是 5-10 個 fix-up commits。

#### 反例 vs 正例

**反例**（典型 anti-pattern）：
> 想實作 X 演算法 → 直接動主線 → 寫 module + 改 endpoint + 改 UI 全部一起 → push → CI 紅 → 修 → CI 還紅 → 修細節 → 最後過 → 主分支多了 5 個無意義 commit。

**正例**（stroke-order 12c-3）：
> 寫 `scripts/prototype_engrave_convex.py` → 跑壓力測試（4 分 / 8 分 / 1 寸 各尺寸）→ render PNG 看 ON/OFF 區段 → 確認 even-odd 正確 → 演算法 port 進主線 module → 1 commit 完整 5 子任務 + 5 測試 → CI 一次過。

#### 何時不需要 prototype

- 純 UI 改動（CSS / 既有元件 reorganize）
- 單純參數調整（已驗證的演算法 default 值更新）
- bug fix（修復路徑已知）
- 文件 / 重構（不改演算法行為）

簡單說：**「演算法行為的 first-time 實作」才需要 prototype**。

> 📜 **真實案例**：起源於 stroke-order 2026-05-03 Phase 12c-3 G-code 陽刻光柵掃描——prototype 確認 scanline + even-odd + boustrophedon 演算法可行（4 分章 38 秒、1 寸 4.5 分、演算 < 100ms），主分支 1 commit (74b996d) 完成 5 子任務。詳見 stroke-order 的 `docs/decisions/2026-05-03_phase12c_convex_engrave.md`。

### 8.12 演算法 module 獨立、不依賴業務 module

演算法（特別是新類型）獨立 module，不污染既有 file，不依賴業務概念。

#### 規則

1. **演算法 module 只依賴抽象資料結構**（polygon / vector / matrix），不知道 stamp / sutra / patch 業務概念
2. **業務 module import 演算法 module**，不反過來
3. **演算法 module 測試獨立**（單元測試只給 module 自己，不依賴業務 fixture）

#### 為什麼這個習慣值錢

- **跨 use case 重用**：同個演算法可能 stamp / patch / sutra / 未來新模式都能用
- **God file 控制**：既有業務 file 不會無限長大（stroke-order 11g 之後 stamp.py 1100+ 行已經很大）
- **測試獨立**：演算法 bug 可在 module 層直接抓，不必 instantiate 完整業務上下文

#### Audit checklist

- [ ] 演算法 module 是否 import 業務 module？（如果有 → 抽象顛倒，要重構）
- [ ] 演算法 module 名稱反映「做什麼」（`engrave.py` / `scanline.py`）而非「給誰用」（`stamp_engrave.py`）
- [ ] 演算法 module 文件含「跨用途複用提示」段落

> 📜 **真實案例**：起源於 stroke-order 2026-05-03 Phase 12c-3 — 光柵掃描演算法獨立成 `exporters/engrave.py`，stamp.py 跟（未來的）patch / sutra 都能 import 用。詳見 stroke-order 的 `docs/decisions/2026-05-03_phase12c_convex_engrave.md`。
---

### 8.13 結構化 input fields > separator hack

當功能 input 含多個語意獨立欄位（如橢圓章 5 段：上弧 / 中央 1-3 行 body / 下弧），用結構化 schema（多個獨立 fields）優於 single text + separator hack（如 `text="A|B|C|D"`）。

#### 規則

1. **多語意欄位 ≥ 3 個** → 拆獨立 fields，不用 separator string
2. **list[T] 用 native list type**（Pydantic / JSON），不用 `"a||b||c"` 字串拆分
3. **GET endpoint 才接受 separator**（query string 沒原生 list） — 但 POST body 一律 native list
4. **Backward compat**：保留舊 single-text fallback path，新欄位全空時 fallback 老邏輯

#### 為什麼這個習慣值錢

Single text + separator 的問題：

- **User 心智成本**：要學 separator 是什麼字元（`|` ? `||` ? `,` ?）+ 怎麼 escape（內文有 `|` 怎麼辦）
- **API 不自我文件化**：`text` field 看 type signature 不知有結構，要看 docs / 範例才懂
- **可選欄位處理麻煩**：empty 欄位要寫 `||` 連續分隔符，user 容易忘
- **未來擴充 break schema**：要加 per-line font size 等 metadata 時，被 separator 綁死
- **語意 vs 顯示混淆**：UI 要 5 個 input 對齊 API 5 段，separator 要做 split / join 同步邏輯

結構化 schema 的代價：

- API field 多 3-5 個（surface area 略大）
- Backward compat 處理：fallback 邏輯（all empty → 走老 path）

代價可控，長期收益大。**反例可參考 CSS `font` shorthand**（多欄位塞 single string 已多次造成 bug，後來 modern CSS 全部拆獨立 property）。

#### Audit checklist

- [ ] grep API field 看有沒有 `text.split("...")` / `text.split("|")` 等 hack
- [ ] 數該 field 在 UI 對應幾個 input → ≥ 3 個就觸發重構
- [ ] 重構時：新增獨立 fields + UI 對齊 + backward-compat fallback + tests

> 📜 **真實案例**：起源於 stroke-order 2026-05-02 Phase 12m-1 橢圓章 — 5 段語意獨立欄位（上弧 / 中央 1/2/3 / 下弧），原本只有 single text + 1-2 行 horizontal split layout。重構成結構化 5 欄位後，user UI 一看即懂、API 自我文件化、各欄位 empty 自動 skip。詳見 stroke-order 的 `docs/decisions/2026-05-02_phase12m_oval_structured.md`。

### 8.14 UI 預設套用要 hook init time，不只 change

UI 控件的 default state 由 JS 在 dropdown / preset 變動時填入（如「切到 oval preset → 自動勾雙線外框」），**必須在 init 時也跑一次**。光是 hook `change` event 不夠 — 第一次載入或 user 沒做 change 時不會觸發 → init state 跟 default-after-change 不一致。

#### 規則

```js
// ❌ 反模式
$("preset").addEventListener("change", applyDefaults);

// ✅ 正模式
$("preset").addEventListener("change", applyDefaults);
applyDefaults();   // ← init 時跑一次，覆蓋首次載入路徑
```

延伸：所有「依賴 user 互動觸發 default」的 init 邏輯都同樣處理。

#### 為什麼這個習慣值錢

症狀：

- User 截圖顯示 default 未生效（checkbox 沒勾、size 不對、hint 是別的 preset 數值）
- 開發者 reproduce 困難（自己切 preset 兩下都 OK，因為觸發過 change）
- 容易誤判為「部署沒上去 / 快取問題」白白浪費排查時間

根因：UI 的 default 邏輯散在兩處 — HTML 寫死 default + JS change-time override。如果 JS change 沒觸發，HTML 寫死的就是「真 default」。但 HTML 不知道目前 preset 是哪個 → 任何依賴 preset 的 default 必然錯。

修法簡單（一行 init call），但容易漏。

#### Audit checklist

- [ ] grep `addEventListener("change",` 對應的 handler 有沒有在 init 也 call
- [ ] 列出所有「依 preset/select 切換填 default」的 handler → 每個都該 init time 跑
- [ ] 寫測試：page load 後 dropdown 預設 preset 對應的 default state 對齊（hard）；OR 簡單 grep `function xxx_init` 內呼叫 default-applier（pragma）

#### 反例 vs 正例

**反例**（典型 anti-pattern）：
> User 進站 → preset dropdown 預設 oval → 但 double_border checkbox 維持 HTML 寫死 unchecked → user 看到「該勾沒勾」回報 bug → 開發者 reproduce 不出來（自己切兩下都 OK）→ 浪費 1 小時排查 cache / 部署 / 後端後才發現是 JS init 沒呼叫 default。

**正例**（stroke-order 12m-1 r3）：
> `stampInit()` 結尾加 `stampApplyPresetDefaults();` → 任何 preset 進站都同步 default → 跟 change-time 行為完全一致 → 沒 first-time UX bug。

> 📜 **真實案例**：起源於 stroke-order 2026-05-02 Phase 12m-1 r3 — r1 設了 oval default = double_border ON 但只 hook 在 change event。User 截圖顯示首次進站雙線外框沒勾，初步誤判為部署問題，後 trace 到 init 沒呼叫 `stampApplyPresetDefaults()`。修法 1 行。詳見 stroke-order 的 `docs/decisions/2026-05-02_phase12m_oval_structured.md`。

### 8.15 Visual rendering 驗證每 round — unit tests 不夠

對 layout / 視覺 / SVG / canvas 工作，**unit tests 驗算法輸出符合預期形狀，但渲染後的 stroke / fill / 多 path 互動可能跟預期完全不同**。每 round 必須 PNG render（或螢幕截圖）視覺驗證，不能光靠單元測試 green 就 ship。

#### 規則

對「視覺輸出」改動（任何 SVG/canvas/UI layout），驗證流程：

1. Unit test 驗演算法核心（座標 / 比例 / count）
2. **PNG render 視覺驗證**（cairosvg / Playwright screenshot / 等）
3. 對齊 reference 圖（如有）— 並排視覺對比
4. 檢查邊角情況（最小/最大 input、極端比例）

少了 step 2/3 容易出**「演算法對、渲染錯」**的 bug。

#### 為什麼這個習慣值錢

SVG render 細節容易 surprise:

- **Stroke** 在 polygon centerline 兩側都加半寬 → 預期單邊效果可能變雙邊
- **Fill-rule** (even-odd vs non-zero) 對複雜 path 結果不同
- **Path 順序** (z-index) 影響覆蓋
- **viewBox padding** 不夠時 stroke 外緣被裁
- **不同瀏覽器** stroke join / linecap 渲染微差

Unit test 通常測座標、頂點、count；無法捕捉這些渲染細節。

#### 反例 vs 正例

**反例**（typical anti-pattern）：
> 寫 sawtooth polygon helper，unit test 驗 polygon 有 N 個 vertices alternating outer/inner — 通過。Ship。User 看到「inner side 也鋸齒」回報 bug → 才發現 stroke 雙邊都 zigzag。多 1 round 重設計 + tests 重寫。

**正例**（stroke-order 12m-1 r19）：
> 改設計用 smooth ellipse + filled triangle teeth attached outside → render PNG → 確認 outer zigzag、inner smooth → user 滿意 1 round 過。Round 之間沒省 PNG verify step。

#### Audit checklist

- [ ] 每個 visual / layout PR 跑了 PNG render 比對
- [ ] reference 圖（user 提供 / 業界範例）有並排比對
- [ ] 邊角 input（n=1, n=極大、aspect ratio 極端）視覺檢查
- [ ] Unit tests 跟 PNG verify 都 green 才 commit

> 📜 **真實案例**：起源於 stroke-order 2026-05-02 Phase 12m-1 r18→r19 — sawtooth 邊飾用 polygon 替換 outer ellipse，unit tests 通過。但 SVG stroke 渲染後 polygon 兩側都 zigzag，user 反映「內側也呈鋸齒」。重設計改用「smooth ellipse + filled triangle teeth attached outside」，PNG verify 通過。詳見 stroke-order 的 `docs/decisions/2026-05-02_phase12m_iterative_polish.md`。

### 8.16 Mixed-arity tuple 解構 pattern 兼容 API 擴充

函式簽章用 tuple 回傳時，未來 API 加欄位會撞解構。改用 `[:N]` 截斷 + `*_` trailing rest，向後兼容多解構點。

#### 痛點

```python
# v1: tuple 3 元素
def get_user_meta(uid):
    return (name, email, role)

# 多處解構
name, email, role = get_user_meta(uid)
```

v2 想加 `created_at` 變 4 元素 → 所有解構點都撞錯。

#### Pattern

```python
# v1+: function 多回 1 個 trailing 欄位
def get_user_meta(uid):
    return (name, email, role, created_at)

# 解構點 — `[:N]` 或 `*_` 兩種寫法
name, email, role = get_user_meta(uid)[:3]   # 顯式截斷
name, email, role, *_ = get_user_meta(uid)   # rest 吃掉

# 新解構點 — 拿到完整
name, email, role, created_at = get_user_meta(uid)
```

兩種寫法都向後兼容，新欄位加在 trailing 不破壞舊呼叫。

#### Anti-pattern

- 改成 `dict` / `dataclass` 也好（更嚴謹），但對既有 tuple-based API 而言，加 trailing element + `[:N]` 是最小改動量
- **絕不**在 middle 插新欄位（`(name, NEW, email, role)`）— 一定撞解構

> 📜 **真實案例**：stroke-order Phase 5b r10 — `placed: list[(char, x, y, size, rot)]` 5-tuple 加 `flags` 欄位。所有 `for (c, x, y, sz, r) in placed` 改成 `for (c, x, y, sz, r, *_) in placed`，避免 caller-side 大改。

### 8.17 多輪 reference-image-driven 視覺迭代 SOP

User 提供 reference 圖時，每輪迭代必跑：plan → design Q → 視覺驗證 → bump。跳過任一步容易做出「演算法對、視覺錯」的迭代結果。本節為 §8.15 的進階版（含 plan/design Q 流程）。

#### 每輪 SOP

1. **Read reference 圖** — 不只看 user 描述，自己看圖（multimodal）
2. **Plan + design Q** — 寫 1-2 段提案 + 1-3 個關鍵抉擇問題給 user 確認，不直接動手
3. **Implement** — 實作（單元測試驗演算法）
4. **PNG render 視覺驗證** — cairosvg / 截圖，並排比對 reference
5. **Bump version** — 即使是 micro 改動也 bump（追蹤每輪變化）
6. **寫 micro decision log**（可選，重大轉折才寫）

#### 為什麼每輪都要做

- 跳過 #2（不問 design Q 直接動）→ 做出 user 不要的結果
- 跳過 #4（不視覺驗證）→ unit test 通過但 user 截圖看到「形狀對效果錯」
- 跳過 #5（不 bump）→ 多輪間混淆無法追溯哪輪出了問題

> 📜 **真實案例**：stroke-order 2026-05-02 Phase 12m-1 r14 → r19，sawtooth 邊飾 6 輪迭代。每輪都跑完整 SOP，r18 出現「inner side 也鋸齒」bug 時能準確定位是 r17→r18 polygon-replace 引入的，r19 改回 smooth ellipse + filled triangle attached outside。詳 stroke-order 的 `docs/decisions/2026-05-02_phase12m_iterative_polish.md`。

### 8.18 AI-friendly 設定檔 = YAML frontmatter + Markdown body 雙層

給 AI / 人類雙讀的設定檔，純 JSON 不夠 AI-friendly，純散文不夠機器精確。**YAML frontmatter（機器） + Markdown body（人類 / AI）** 雙層是黃金標準。

#### Pattern

```markdown
---
schema: project-feature-v1
exported_at: <ISO>
metadata:
  id: <UUID>
  title: <user-facing>
  design_note: <user 自由 prose>
  ...
{...其餘 structured 欄位...}
---

# {{title}}

## 視覺/結構概觀（自動生成，下次匯出會被覆蓋）
（從 frontmatter render template）

## 設計意圖
（user 自由寫，AI 看了會更懂作者想表達什麼）
```

#### 三方各得其所

| 角色 | 看哪 | 行為 |
|---|---|---|
| 機器（import / parse） | frontmatter | 嚴格 schema validation，body 完全忽略 |
| AI 模型 | frontmatter + body | 結構（schema） + 意圖（prose） 全吃 |
| 人類 | body 為主 | frontmatter 偶爾掃，body prose 是主要閱讀面 |

#### 規則

- **frontmatter 是 single source of truth**（機器只信這一邊）
- **body 是 derived view**（每次匯出系統自動 render template）
- 給 user 預留**自由 prose section**（如 `## 設計意圖`）— body 中**唯一** user 可手動編輯保留的部分
- frontmatter 帶 inline comment（如 `# 拼音: xxx`）提升人類可讀性

#### Anti-pattern

- 純 JSON：機器精確但 AI 解讀時要 prompt engineering 才知道欄位語意，user 看不懂
- 純散文 MD：AI 讀爽但同樣的圖每人寫不同 prose → round-trip 不可靠
- frontmatter 全英文 + body 全中文：AI 切 context 困擾，建議都用同語系

> 📜 **真實案例**：stroke-order Phase 5b r27 — `.mandala.md` 曼陀羅匯出。一開始 user 問「能用 MD 嗎」，純散文 MD 不可逆 round-trip；改用雙層後 frontmatter 嚴格 parse + body 給 AI 解讀意圖。詳 stroke-order 的 `docs/decisions/2026-05-04_phase5b_r27_mandala_state_export_import.md`。

### 8.19 Schema versioning：嚴格 + migration table + 友善錯誤

可匯出/匯入的設定檔 schema 一定會演進。Schema 字串 baked into file，未知 schema 嚴格拒絕但訊息列出已知版本，**避免沉默吞錯**。

#### 三大原則

1. **Schema 字串 baked into file**：每個檔案 frontmatter 寫
   `schema: <project>-<feature>-v<n>`，不依賴副檔名 / 上下文判斷
2. **Migration table 集中管理**：
   ```javascript
   const MIGRATIONS = {
     "project-feature-v1": (data) => data,            // identity
     "project-feature-v2": (data) => migrateV1to2(data),
   };
   ```
3. **嚴格但帶引導訊息**：未知 schema → reject + 列出已知版本

#### 嚴格 vs 寬鬆

| 風格 | user 體驗 |
|---|---|
| ❌ 寬鬆（缺欄位忽略）| 「looks-like-it-imported」但實際缺欄位的狀態，編輯後再 export 變混合版本，**沉默破壞資料完整性** |
| ✅ 嚴格（reject + 訊息）| user 馬上看到錯誤訊息 + 已知版本列表 → 知道該升級工具或找對的 importer |

#### Schema 命名約定

- 跨 feature 統一：`<project>-<feature>-v<n>`
- 對齊既有專案：如 stroke-order 用 `stroke-order-psd-v1` (5d 抄經) → 新增 `stroke-order-mandala-v1`
- 數字版本（不用 semver）— migration 邏輯只關心 major version
- **預留 metadata 欄位給未來** — 如 `author` / `tags` / `license`，v1 不用也定義為 optional reserved

#### Anti-pattern

純 JSON `{"foo": 1}` 沒帶 schema 字串 → 升版時無法判定來源版本，只能 heuristic 猜（脆弱）。

> 📜 **真實案例**：stroke-order Phase 5b r27 — `.mandala.md` schema = `stroke-order-mandala-v1`，`MD_MIGRATIONS` 表只一行 identity 但留下擴充模板。`_mandalaMigrateState()` 嚴格 reject 未知 schema 並列出已知版本。詳 stroke-order 的 `docs/decisions/2026-05-04_phase5b_r27_mandala_state_export_import.md`。

### 8.20 By-kind dispatch dict 取代 if/elif 鏈

Endpoint / 服務通用化給多 kind 時，最常見 anti-pattern 是 `if/elif` 鏈散在多處。用 **dict-of-functions** 集中派遣，加新 kind 不動核心邏輯。

#### Pattern

```python
KIND_PSD     = "psd"
KIND_MANDALA = "mandala"
ALLOWED_KINDS = (KIND_PSD, KIND_MANDALA)

VALIDATORS = {
    KIND_PSD:     lambda b: (parse_psd(b), "json"),
    KIND_MANDALA: parse_mandala,  # returns (state, "md"|"svg")
}
SUMMARIZERS = {
    KIND_PSD:     summarise_psd,
    KIND_MANDALA: summarise_mandala,
}

def create_upload(*, kind, content_bytes, ...):
    if kind not in ALLOWED_KINDS:
        raise InvalidUpload(...)
    state, ext = VALIDATORS[kind](content_bytes)
    summary = SUMMARIZERS[kind](state)
    # ... 統一 dedup / rate limit / DB insert（kind 無關）
```

加新 kind 只需 5 步：

1. 加 `KIND_X` 常數 + 進 `ALLOWED_KINDS`
2. 寫 `parse_and_validate_x(content_bytes) → (state, ext)`
3. 寫 `summarise_x(state) → dict`
4. 加進 `VALIDATORS` / `SUMMARIZERS` dict
5. 前端 `_detectKindFromText` 加偵測 + analyser

**核心 endpoint 邏輯不動**。

#### Why dict 比 if/elif 好

- **集中**：所有 kind-specific 邏輯收在 dict，加新 kind 只動 dict（grep 一搜全找到）
- **fail loud**：沒寫 dict entry 立刻 KeyError，不會沉默 fallback 到 default
- **`ALLOWED_KINDS = tuple(VALIDATORS.keys())` 自動同步**，列舉永遠正確
- **per-kind unit test 容易**：每個 validator/summarizer 是獨立 function

#### Anti-pattern

```python
# ❌ if/elif 散在多處
def create_upload(...):
    if kind == "psd": ...
    elif kind == "mandala": ...

def list_uploads(...):
    if kind == "psd": ...
    elif kind == "mandala": ...

def download(...):
    if kind == "psd": ...
    elif kind == "mandala": ...
```

加 kind 要改 N 處，每處都可能漏。

> 📜 **真實案例**：stroke-order Phase 5b r28 — gallery 從 PSD-only 通用化到接 mandala upload。`VALIDATORS` / `SUMMARIZERS` dict 派遣，`create_upload` / `list_uploads` / download endpoint 核心邏輯零變動，只動 dict 跟前端偵測 + 資料層 schema。詳 stroke-order 的 `docs/decisions/2026-05-04_phase5b_r28_gallery_mandala_upload.md`。

### 8.21 Schema 通用化時 dual-write legacy column 漸進遷移

既有 schema 加新通用欄位（如 `summary_json`）時，**legacy 專用欄位繼續寫**，給未來 phase 慢慢遷移空間。**不一次性切換**避免破壞既有資料 / 既有讀者。

#### Dual-write 策略

```python
# create_upload 內部
if kind == KIND_PSD:
    legacy_trace_count   = summary["trace_count"]
    legacy_unique_chars  = summary["unique_chars"]
    legacy_styles_used   = json.dumps(summary["styles_used"])
else:
    legacy_trace_count   = 0
    legacy_unique_chars  = 0
    legacy_styles_used   = None

INSERT INTO uploads (
    user_id, ...,
    kind, summary_json,                        -- 新欄位（所有 kind）
    trace_count, unique_chars, styles_used,    -- legacy（PSD 寫，其他 kind 0/null）
    ...
)
```

讀取側對應：

```javascript
if (kind === 'mandala') {
    return summary.layer_count + ' 裝飾層';   // 新欄位
} else {
    return item.trace_count + ' 筆軌跡';       // PSD legacy
}
```

#### 為什麼 dual-write

| 一次切換到 summary_json | Dual-write |
|---|---|
| 必須跑 backfill migration（risk）| Existing PSD rows 不動 |
| 既有 client 讀 trace_count 會壞 | 既有 client 不受影響 |
| 一次性大改動，rollback 困難 | 漸進可逆 |
| schema deploy 跟 client 部署要同步 | 解耦 |

#### 何時拔掉 legacy column

3 條件都成立才考慮 drop：

1. 所有 PSD 寫入路徑都已切到 summary_json（dual-write 持續 N 個月）
2. 所有讀取側都改成優先讀 summary_json，legacy 路徑只剩 fallback
3. Backfill PSD 既有 row：把 `trace_count` 等寫進 `summary_json` 對應欄位

時機通常是 N+ phase 後。**dual-write 是 stable resting state**，不急著拔。

#### Anti-pattern

- Big-bang migration：寫好新 schema，drop 舊 column，跑 backfill。風險：backfill 失敗時 mid-state DB 既不能讀舊也不能讀新
- 不寫 legacy column：mandala upload 把 `trace_count = NULL`，但既有列表 SQL `COUNT_BY trace_count > 0` 直接漏掉 mandala rows

> 📜 **真實案例**：stroke-order Phase 5b r28 — gallery `uploads` table 加 `kind` + `summary_json`。PSD upload 仍寫 `trace_count` / `unique_chars` / `styles_used`（**也**寫 `summary_json`，內含相同資訊副本）；mandala upload 只寫 `summary_json`，legacy 欄位 = 0/null。列表 card 渲染對 PSD 用 legacy 欄位、對 mandala 用 `item.summary`。詳 stroke-order 的 `docs/decisions/2026-05-04_phase5b_r28_gallery_mandala_upload.md`。

### 8.22 Reconnaissance 在 phase plan 之前

開新 phase 前先 **grep 既有 implementation**。一句 `grep -n
"function\|endpoint\|table" <relevant_dirs>` + 5 分鐘讀，能避免：

- 重做輪子（功能其實已 ship）
- 誤判 scope（你想的「從零做」其實是「補一個 button」）
- 跟既有設計衝突

#### 規則

1. **任何「新 phase / 新 feature」開動前 grep 既有 code**
2. **發現實際 scope 跟原假設不符就誠實 push back，重新 scope**，比悶頭
   做出半懂不懂的東西好
3. User 一句「OK」會誘惑你 ship anything；senior 該做的是「先停一下講
   真話」

#### 反例

- 看到「需要做 profile 編輯功能」直接動工 → 後來才發現後端 +
  service + dialog form + tests 全已 ship，scope 從「重做」縮成
  「補一個 banner ✏️ 快捷」
- AI 假設 X 不存在就動工，事後才發現 X 已存在 → 動到一半要重整 scope，
  較大效率損失

> 📜 **真實案例**：stroke-order Phase 5b r29i — 原計畫「phase 5c
> profile 編輯重做」，recon 發現 9/9 元件已 ship，scope 縮成 45 分鐘
> banner 快捷工作。詳 stroke-order
> `docs/decisions/2026-05-05_phase5b_r29i_profile_edit_shortcut.md`。

### 8.23 Pure logic 抽 `.mjs` export 給 Node test

DOM-coupled module 中的 input validation / serialization / hash /
spec computation 等 **side-effect-free logic 抽 export**，用 Node
`node:test` 跑（無 jsdom 需求）。DOM 操作（appendChild / event
listeners / animations）走 manual E2E。

#### 規則

1. **寫新 frontend module 時先想「哪部分 side-effect-free」**→ 抽
   export → 寫 `tests/test_<feature>.mjs` cover
2. **`.mjs` 強制 ESM**（repo 沒 `package.json` `"type":"module"` 時 `.js`
   在 Node 預設是 CommonJS），browser 也吃（FastAPI mimetype
   `text/javascript`）
3. **DOM 行為 + 動畫走 manual E2E** — 不勉強拉 jsdom

#### 為什麼這個習慣值錢

跨環境 testability：browser + Node 同份原始檔。

- Logic regression 由 Node unit 抓（快、穩定、CI 可跑）
- DOM 行為由 manual E2E 抓（screen / animation 細節）
- 各司其職比拉 jsdom 重 framework 輕

#### Audit checklist

- [ ] 新 frontend `.js` / `.mjs` 看有沒有「副作用 vs 純運算」可拆點
- [ ] 純運算抽 export → 寫 Node test
- [ ] DOM 行為留 inline 不抽

> 📜 **真實案例**：stroke-order r28-r29k 累積 4 個 module 都遵循此
> pattern：`hash.mjs` / `toast.mjs` / `avatar.mjs` × 2（initials +
> validate） — 共 49 個 Node test。詳 stroke-order
> `docs/PRINCIPLES.md` §4。

### 8.24 多入口 collapse single execution path

多個 input 來源（file input change + drag-drop drop / button click +
key shortcut / 多個 mutation handler）若都該觸發同樣的後續流程，
**collapse 到 single execution path** — 把 validation + work + UI
寫一次。

#### 規則

1. **寫新 trigger 前先問**「跟既有 trigger 該走同一條 logic 嗎？」
2. 是 → 抽 shared path（如 `_handleSelectedFile` / `refresh`）→ 兩
   trigger 都 call
3. 各自實作 = drift 風險（drag-drop 漏 client validation / file input
   漏 status update / 一個 trigger 沒 chain refresh）

#### 反例

- File input 跟 drag-drop 各寫一套 upload + validation + UI flow → 4
  個漏點
- 5 個 mutation handler 各自寫 hash sync → 漏一個就 hash 不對

> 📜 **真實案例**：stroke-order r29k avatar drag-drop —
> `_handleSelectedFile(file)` 共用 path，file input + drag-drop 兩入口
> 走同一條 validation/upload/UI。同樣 r29d-r29g `refresh()` 集中所有
> fetch，後續 phase 加新 fetch source 只 push 進 `Promise.all` array
> 享紅利。詳 stroke-order
> `docs/decisions/2026-05-05_phase5b_r29k_avatar_drag_drop.md`。

### 8.25 Client validation 必 mirror server，不嚴不寬

前端驗證規則（type / size / 格式）**必須跟 server 一致** — 先寫
server，client 走 mirror。差一點都會困擾 user：

- Client **嚴於** server → user 困惑「明明可上傳」
- Client **寬於** server → user 上傳完才看到 422，浪費 round-trip

#### 規則

1. **先寫 server validation 規則**，列出常數（`ALLOWED_TYPES = [...]`,
   `MAX_SIZE = ...`）
2. **Client `mirror.mjs` 抄同樣常數 + 同樣 logic**（含邊界 case 如
   charset 後綴）
3. Pure validator export 給 Node test cover
4. Server 改規則時 client 兩處 sync（建議放 docstring 互相 reference
   提醒）

#### 邊界 case 要 mirror

- `charset=` 後綴：`image/png; charset=binary` 兩端都要 `split(';')[0]`
- File extension vs MIME 兩端都不可信（用 magic bytes）
- 0-size 檔 兩端都要 reject

> 📜 **真實案例**：stroke-order r29k avatar — `validateAvatarFile`
> 直接 mirror `service.py` 的 `ALLOWED_AVATAR_TYPES` (PNG/JPEG) +
> `AVATAR_MAX_SIZE_BYTES` (2MB) + charset 後綴 split 邊界 case。詳
> stroke-order
> `docs/decisions/2026-05-05_phase5b_r29k_avatar_drag_drop.md`。

### 8.26 Versioned URL > ETag 對可變資源 cache-bust

可變資源（user-uploaded image / dynamically-generated thumbnail）做
cache-bust 用 **versioned URL**，比 ETag/Last-Modified 簡單一級。

#### Pattern

- DB 存版本 nonce（如 `avatar_path TEXT` 存 `secrets.token_hex(8)`）
- 資源 URL = `/api/.../avatar?v=<nonce>`
- Server 端 response 設 `Cache-Control: public, max-age=86400, immutable`
- 換內容 → DB nonce 換 → URL 換 → 瀏覽器新 fetch
- 舊 URL 永遠 cached 舊內容（`immutable` 表示 client 不該 revalidate）

#### 為什麼比 ETag 好

- ETag/Last-Modified 仍要 conditional GET round-trip 確認（304 也是
  round-trip）
- versioned URL **0 round-trip** — URL 不變即 cached，URL 變即新檔

#### Why DB 存 nonce 不存 path

路徑可從 user_id 算（`avatars/<user_id>.png`），DB column 該存「unique
fact」（這裡是版本 identity）。可 derive 的資訊不該 store。

#### Audit checklist

- [ ] 任何「可變但 client 該 cache 一段時間」的資源都該套
- [ ] DB 加版本 nonce 欄位（更新時 rotate）
- [ ] URL 帶 `?v=<nonce>`
- [ ] Response header `Cache-Control: public, max-age=<long>, immutable`

> 📜 **真實案例**：stroke-order r29j avatar — `avatar_path` 存 8-char
> hex nonce（不是路徑），URL `?v=<nonce>` + `Cache-Control: immutable`。
> 詳 stroke-order
> `docs/decisions/2026-05-05_phase5b_r29j_avatar.md`。

### 8.27 Cross-cutting derivation 集中到 helper

多個 query / endpoint 都需要把同一份 raw data 轉成同一個 derived 欄位
時 → **抽 helper 集中**。

#### 規則

1. **寫第 2 個「derive 同樣 field」query 時就該抽 helper**（DRY rule
   of three 之前一次）
2. helper 也 cover「不外洩 internal raw field」（用 `pop` 移除）
3. 集中後加新 derive 規則（如 cache-bust nonce 變動）只改 helper 一處

#### 反例

5 個 SELECT path 各自 derive `avatar_url` from `avatar_path` →
5 個漏改點。加 cache-bust 規則時要找全 5 處。

```python
# 反模式
def get_session_user(...):
    user = ...; user["avatar_url"] = f"/.../{user['id']}/avatar"
def get_user_profile(...):
    user = ...; user["avatar_url"] = f"/.../{user['id']}/avatar"  # 漏改點 #1
def list_uploads(...):
    user = ...; user["avatar_url"] = f"/.../{user['id']}/avatar"  # 漏改點 #2
# ... 5 個地方各自 derive
```

```python
# 正模式
def _user_dict_with_avatar(row) -> dict:
    d = dict(row)
    nonce = d.get("avatar_path")
    d["avatar_url"] = f"/api/users/{d['id']}/avatar?v={nonce}" if nonce else None
    d.pop("avatar_path", None)  # internal 不外洩
    return d
# 5 處 SELECT 全 call _user_dict_with_avatar(row)
```

> 📜 **真實案例**：stroke-order r29j avatar `_user_dict_with_avatar`
> 5 個 SELECT path 全走同 helper（`get_session_user` /
> `get_user_profile` / `update_profile` / `update_avatar` /
> `_row_to_dict`）。詳 stroke-order
> `docs/decisions/2026-05-05_phase5b_r29j_avatar.md`。

### 8.28 Fetch frequency 一致 → 同 endpoint，不一致 → 拆

多個 derived data 該併在同一個 endpoint 還是拆兩個 → 看 **fetch
frequency 是否一致**：

| 場景 | 結果 |
|---|---|
| Profile + top_uploads（user 切 profile 時兩者都要） | **同 endpoint forward** |
| Profile + uploads list（profile 不變，list 隨翻頁/sort 動） | **拆兩 endpoint** |

#### 為什麼

- 併在一起每次 high-frequency fetch 都重抓 low-frequency 資料 = 浪費
  round-trip + 浪費 server work
- 拆開 low-frequency 變化時 client 要 sync 兩 fetch 反而麻煩；fetch
  frequency 一致就沒這問題

#### 規則

設計 endpoint 前問「這兩個 data 的 invalidation 條件一樣嗎？user 哪些
動作會讓兩者都需要重抓？」一致 → 併；不一致 → 拆。

> 📜 **真實案例**：stroke-order r29d/r29e — profile 拆出 list
> （翻頁高頻動）併進 top_uploads（profile 切換時才動）。詳
> stroke-order
> `docs/decisions/2026-05-04_phase5b_r29e_profile_top_uploads.md`。

### 8.29 Empty state 是 affordance hint，不是該藏的瑕疵

Empty state（user 還沒填的 bio / display_name / avatar / search 結果）
**不該完全 hide** — 應該顯示 affordance placeholder：

- 引導 user「該填了」（hint）
- 視覺平衡（banner 中間少一行 vs italic placeholder）
- 區別「沒這 feature」vs「user 沒填」

#### 規則

寫 render 前問「empty state 該顯什麼？」 — placeholder text（italic
muted）/ generated visual identity（initials + hash color）/ 動作
引導（如「點此編輯」link） — 別用 hide / generic icon。

#### 反例

- 完全 hide empty bio div → user 不知道可以填
- 無 avatar 顯 generic 灰色 icon → 看起來像「沒做這 feature」
- 「無搜尋結果」純空白頁 → 不知該怎麼辦

> 📜 **真實案例**：stroke-order r29i/r29j —
>
> - 空 bio 從「hide div」改「italic 『（尚未填寫個人簡介）』 +
>   opacity 0.7」
> - 無 avatar 從「generic icon」改「initials circle + hash 顏色」
>   （Gmail / GitHub / Slack 同手法）
>
> 詳 stroke-order
> `docs/decisions/2026-05-05_phase5b_r29j_avatar.md`。

### 8.30 `dragover.preventDefault()` 是 drop trigger 的 prerequisite

HTML5 drag-drop 實作時，**dragover event handler 必須 `preventDefault()`**
否則 drop event 永不觸發。

```javascript
preview.addEventListener('dragover', (ev) => {
  ev.preventDefault();   // ← 沒這行 drop 永不觸發
  ev.dataTransfer.dropEffect = 'copy';
  preview.classList.add('is-dragover');
});
preview.addEventListener('drop', (ev) => {
  ev.preventDefault();
  // ... handle file ...
});
```

#### 為什麼

Browser 預設 `dragover` 行為是「拒絕 drop」（為防普通元素變成意外的
drop target），要 `preventDefault()` 解除這層保護才能讓後續 `drop`
event fire。

#### 新手踩坑特徵

drag-drop 全寫對了，drop callback 永不觸發 → 多半是漏 dragover
preventDefault。

#### 規則

實作 drop zone 必檢查 dragover handler 有 preventDefault；最少
dragover 跟 drop 兩 events 都 preventDefault（dragenter 可選）。

> 📜 **真實案例**：stroke-order r29k avatar drag-drop。詳
> stroke-order
> `docs/decisions/2026-05-05_phase5b_r29k_avatar_drag_drop.md`。

### 8.31 P7 三問自審 + strict completion format

完成任務前必填 3 問：

1. **方案正確嗎**？（rationale 是否站得住）
2. **影響全面嗎**？（grep 過所有相關 caller / dependent）
3. **有回歸風險嗎**？（既有 happy path 是否被破壞）

**答不出來不能交**。

#### Strict completion format

```
[P7-COMPLETION]
任務：<一句話 task summary>
方案：<採用 approach>
改動：<檔案 + 行範圍 list>
影響分析：<grep 結果 + 影響的 caller / module>
三問自審：
  - 方案正確：是 / 否（理由）
  - 影響全面：是 / 否（grep 過哪些）
  - 回歸風險：低 / 中 / 高（驗證手段）
剩餘風險：<什麼情境下可能不對 / 待補完處>
```

**「剩餘風險」必填**——不寫不算完成。對位 user preference「Never mark task as done without proving it works」的具體 SOP 化、配 §5.9 QODA 協作協定形成完整交付鏈。

#### 為什麼這個習慣值錢

> 以前不會老實寫「剩餘風險」、覺得寫了像沒做完。但 P7 把它變成交付的必要欄位——**不寫才是不完整**。
> （note 137 Hermes 作者原話）

> 📜 **來源**：note 137（Hermes 作者 P7/P9/P10 系統 + NYCU-Chung my-claude-devteam review）。

### 8.32 失敗 2 次換方法 反偷懶協議

同任務失敗 2 次 → 停止重試原方案 → 寫 **3 個全新假設**逐一驗證。

#### 規則

1. 第 1 次失敗：診斷 + 修正、直接重試
2. 第 2 次失敗：**停止重試 + 寫 3 個全新假設**
3. 「無法解決」之前必須先：
   - 搜官方文件
   - 讀源碼
   - 窮舉可能原因
4. **3 個假設**逐一驗證、不夠再寫第 4 / 5 個、不是悶頭等

#### 反例

- Self-Evo PR #13 上游零回應、繼續等一天看看 → 應在失敗 2 次後改路徑（開新分支 / 重寫修復方式 / 另闢溝通渠道）
- AI 跑 build 失敗 2 次都改同一行 → 應 stop、寫「假設 1 環境問題 / 假設 2 dep version / 假設 3 cache」逐一驗

對位 user preference「If something goes wrong mid-task, stop immediately and re-plan」+「Don't push forward blindly」、把 abstract 紀律量化為「**2 次**」具體 trigger。

> 📜 **來源**：note 137（Hermes 作者反偷懶協議）。

### 8.33 Self-defense bias / reviewer 拿純 diff

**現象**：同一 agent 自己 review 自己會偏向「**這是我自己寫的我不好意思挑毛病**」。

**verifier 設計核心動機**：消除 self-defense bias、必須 clean context 獨立 reviewer 拿**純 diff**評估。

#### Subagent-driven-development pattern

- 每個子任務派 clean context 新 agent
- 完成後派**獨立 reviewer**（看純 diff、無「我寫的」context）
- 審完通過才進下一個

**實測效果**：一次到位機率從 40% 拉到 80%+（note 137 Hermes 作者實際數據）。

#### 對位既有 §

- §四 source-of-truth audit = 同精神（不靠 self-report）
- §5.9 QODA = approval gate
- §8.33 補上「**reviewer context 隔離**」這層

> 📜 **來源**：note 137 + 對位 105 Context Mode / 108 高詣翔 / 101 Claude Design L4 fork_verifier_agent。

### 8.34 「會花真錢 API」skill enforcement pattern

任何呼叫付費外部 API 的 skill 都應採 **mandatory 三段 pattern**：

1. **Pre-call 預估**：顯示金額 + 預期結果（hard-block 跳過）
2. **User 確認**才執行：明文 yes / 確認 trigger
3. **Post-call 回報**：實際成本 + 實際輸出 + 失敗時不靜默

#### 範例（阿亮老師 Dreamina skill）

```
📝 我準備用這些參數生成影片：
Prompt: <英文 cinematic prompt>
參數: 720p / 5 秒 / 16:9
預估費用: 約 $1.50 美金
確認要生成嗎？（輸入 yes 開始、或告訴我要調整什麼）
```

#### 為什麼這個習慣值錢

對位 §教師 use case：未來推 AI 工具給機構教師時、cost discipline 是**必要設計**——避免教師 / 行政層因「不知道會花錢」而踩雷。

> 📜 **來源**：note 138（阿亮老師 3A 實驗室 Dreamina skill）。

### 8.35 Strict negative constraints in skill / agent role

每個 skill / agent 角色定義必含 **strict negative constraints**（「不要做的事」/「禁說 X」/「禁用 Y」清單）。**enforcement 在角色定義層的應用、senior governance 標配**。

#### 4 家獨立收斂範例

| 來源 | 反面清單 |
|---|---|
| Claude Design L2（note 101） | 反 AI slop：避用 Inter / Roboto / Fraunces / 浮濫漸層 / 圓角加左邊框 / SVG 插圖 |
| Ganvas YAML（note 133） | avoid rigid geometric / realistic photography / serif fonts |
| NYCU-Chung 12 agents（note 137） | critic 禁說「看起來 OK」/ vuln-verifier 必寫 PoC |
| Dreamina skill（note 138） | 不要在沒確認 prompt 前生成 / 不要把 API key commit 進 git |

#### 規則

- **正面定義能做什麼 ≠ 規範**——必須補負面定義「不能做什麼」
- **範圍**：technical（禁用 X）/ behavioral（禁說 X）/ ethical（禁用於 X 場景）
- **配 enforcement**：能用 hook 攔截就 hook、不能就明文 prompt instruction

> 📜 **來源**：4 家 reference 獨立收斂（note 101 / 133 / 137 / 138）。

### 8.36 Self-audit 抓錯立刻修 + 順帶解決相關結構問題

每次 patch / commit 之前 grep / 五件套+ 驗證(見 §3.14)、抓到 marker mismatch / 重複內容 / 結構問題時，**立刻 revert + 修正**，並**順帶解決相關連帶結構問題**（即使是上 round 留下的）。

**Why**：senior 紀律 = 「修錯時順帶解決相關結構」而不只是 revert 完事。長期累積的小結構問題會變成 technical debt，每次 self-audit 順手清一個比留 TODO 後續處理累計效果好。

**怎麼套用**：

- 每次 Python edit 後立刻五件套+ 驗證（`wc -l + tail + xxd + null check + mojibake grep + git diff --stat`、見 §3.14）
- 抓到結構問題：判斷「修這個 + 修連帶 = 多花 5-10 分」 vs 「留 TODO 後續再改 = 累積技術債」 — 通常前者較划算
- revert 時順手檢查「revert 是否誤刪原內容」
- 多 step edit 把「修錯」當作獨立 commit 反而增加 noise — 直接 amend 或同一 commit 內處理

**對位 case**：見 §B.26（biped-research Round 17 NOTICE patch 抓到「安東尼零號條目重複 + 子項被切開」結構問題、立刻順帶 cut + paste 修復）



#### Sub-rule 1：自己 Plan 邏輯錯也適用、顯式宣告而非悄改（2026-05-12 dogfooding 補強）

§8.36 的「self-audit 抓錯立刻修」紀律**也適用於 Claude 自己提的 Plan、不只 user 寫的 code**。抓到 Plan 邏輯錯時、**顯式宣告修正**、不悄改、不假裝沒事繼續推。

**何時觸發**：

- 提了 Plan A、開始執行前 / 執行中意識到 Plan 邏輯有錯（順序錯、優先順位錯、根本前提錯）
- 邊執行邊發現「**這樣做 verify 階段一定會抓出來**」、但既有 Plan 不會自動修正

**反例（必須避免）**：

```
❌ Bad pattern 1：假裝 Plan A 對、繼續推
  → 在 verify 階段才暴露、cost 翻倍

❌ Bad pattern 2：悄悄改 Plan A → A'、不告訴 user
  → user 看 commit history / decision log 找不到修正理由
  → 信任流失、未來 Plan 都要 second-guess

❌ Bad pattern 3：等 user 抓到才改
  → 把 self-audit 責任推給 user、放棄 senior 紀律
```

**正確做法**：

1. 抓到 Plan 邏輯錯 → 立刻 STOP
2. 顯式說明：「**我先前 Plan A 有錯、理由是 X、應該改 Y**」
3. 給修正後的 Plan A'
4. 繼續執行、verify 階段確認

**對位 case**：見 §B.41（2026-05-12 U5M60 P1 hardening cloud-init drop-in、Plan A 用 `99-harden.conf` override、意識 first-match-wins 邏輯 → Plan A' 改 `01-harden.conf` 在 cloud-init 之前載入、顯式宣告 → 執行 → 雙向 verify 成功、commit `784dfce` 決策 D-3）。

#### Sub-rule 2：Reference 帶來新議題、同 commit 內 flag、不留 TODO（2026-05-12 dogfooding 補強）

Reference 入庫時、若該 ref 挑戰既有 decision / assumption / phase plan、**必須在同 commit 內 flag 新議題、不留 TODO 後續處理**。對位 §8.36 主規則「**順帶解決相關結構問題**」應用到 reference intake 流程。

**何時觸發**：

- Reference 入庫時、self-audit 問「**這個 ref 是否挑戰既有 decision / 觸發新 spike**」答 yes
- Reference 對位既有 ADR / Phase plan / Architecture 假設有正向 / 負向 impact

**做法**：

1. Reference 主檔寫好（`docs/snippets/reference_<topic>.md`）
2. **同 commit 內** 加新議題條目：
   - 議題編號（如 D44）
   - 議題 scope（具體 spike step、避免後續 scope creep）
   - 議題 timing（對位既有 phase 空檔）
   - 議題 impact path（正向 / 負向 → 對既有 decision 重評估）
3. 更新 `auto-memory/project_reference_pool_*.md` open decisions section
4. commit message 標題含 reference + 新議題雙標籤（例：「reference + D44 flag」）

**反例（必須避免）**：

```
❌ Bad pattern 1：只入庫 reference、新議題寫 TODO 留下次
  → 未來忘記、reference 變死檔、議題重新發明
  → 同 commit 內 flag 比下次再寫快 5 分鐘、效果好 10 倍

❌ Bad pattern 2：reference 入庫 + 立即 spike（沒考慮 timing）
  → 打斷既有 phase、scope creep
  → flag + 排 phase 空檔 = senior 紀律

❌ Bad pattern 3：reference impact 評估太樂觀（只看正向 path）
  → 後續 spike 才發現 ref 也可能 reduce 既有方案空間
  → 議題 impact path 必含正向 / 負向 / 不變 三種可能
```

**對位 case**：見 §B.42（2026-05-12 Qwen 3.6 35B A3B reference 入庫、commit `8701a5b`、主檔 214 行 + 同 commit flag D44「**M60 35B MoE 可行性 spike + D2 角色重評估**」、Spike scope 6 step + timing「**Phase 2-3 後**」+ impact path「**正向 → D2-Plus / 負向 → D2 不動**」、commit message 標題「**Tier 1, M60 重評估觸發**」）。

#### Sub-rule 3：Recent-feature attribution bias 警示（2026-05-13 incident 補強）

Debug 時面對未知 failure、**不要把最近改動 / 新加設施當第一嫌犯**。Recent-feature attribution bias 是人類偵錯偏誤、容易讓排查繞冤枉路、把 root cause 找在錯的方向。

**何時觸發警示**：

- 看到 unexpected failure、想到「**會不會是昨天剛加的 X 沒設定好？**」
- 多個改動近期 ship、面對 failure 直覺找「**最容易 attribution 的改動**」
- 新加設施有「**未配置 = 失敗**」的可能、容易被當嫌犯

**正確做法**：

1. **先抓 root cause（真錯誤訊息 / stderr / log）** — 不靠推測
2. **新設施先確認 healthy default**（讀註解、看設計）— 例如 `.gitattributes filter` 未配置 = identity passthrough、不會 break
3. **多嫌犯時、按 base-rate 排序**（不是 recency）— filesystem / network / permission 是高 base-rate failure、應該優先檢查
4. **不要靠「裝了之後好像就 OK」當證據** — coincidence ≠ root cause、要 verify

**反例（必須避免）**：

```
❌ Bad pattern 1：「最近改了 X、X 沒設定 = 失敗」直接動手裝 X
  → 真 root cause 是 filesystem lock、跟 X 完全無關
  → 浪費時間 + 動到無關設定

❌ Bad pattern 2：裝 X 後 git add 成功 → 結論「X 是 root cause」
  → 中間還做了其他動作（清 lock）、coincidence ≠ causation
  → 應該回頭看真錯誤訊息確認

❌ Bad pattern 3：找不到 root cause 就更積極 attribution 最近改動
  → debugging 應該是「**抓 root cause**」、不是「**找 plausible suspect**」
```

**對位 case**：見 §3.13 補強段 5 步 incident — Step 3 走 `install.ps1 / filter config` 紅鯡魚冤枉路、Step 4 切 `cmd /c` 抓 stderr 才找到真 root cause（filesystem `.git/index.lock`、跟 filter 無關）。

#### Sub-rule 連動（與 §8.39 Tier framework）

Sub-rule 2 直接對應 §8.39 Tier 1 行為（Tier 0 / 1 都需 flag、Tier 2 純歸檔不需）。兩節連動使用：**入庫時走 §8.39 分級、Tier 1 自動觸發 sub-rule 2 的 commit-time flag**。

### 8.37 一手 metadata > 推測 — 跨多筆一致 = 強證據

attribution / 公司名 / 設計者 / 工具版本 / 設計日期等識別性資訊，**always 從一手 metadata verbatim 取**（檔頭 ASCII / OLE2 iProperties / git config / file header），不要用「推測」。

**Why**：一筆一手 metadata 比五輪推測更精確。舉例：STEP `.stp` 是 ASCII 文本格式、檔頭含完整 `FILE_NAME(...)` block 含設計者 + 工具 + 時間戳 — 一次 `head -c 200 | strings` 解開三大謎團。

**多筆一手 metadata 一致 = 極強證據**：同一 attribution 跨多個獨立 metadata 出現 → 給出高 confidence 結論（cross-source 一致性）。

**怎麼套用**：

- 拿到新檔先 `head -c 200 | strings` 看有沒有 ASCII metadata
- 特別看：STEP `.stp` / `.fbx` / `.obj` / `.ino` / `.h` / `.py` header / `.html` `<meta>` / git commit author / package.json
- `.ipt` / `.dwg` / `.stl` / `.docx` 等 binary：用 file 命令 + 對應 viewer 看 iProperties / metadata
- 同一 attribution 跨多個 metadata 一致 → 寫進 doc / ADR 為強結論
- 單筆 metadata 推測 → 標明「推測」、放 ADR 「待研究」、後續 verify

**對位 case**：見 §B.27（biped-research Round 18 STEP metadata verbatim 揭露 `author = ROBOFACTORY` + `originating_system = Autodesk Inventor 2018` + `time_stamp = 2019-01-31` — 一次解開設計者 / 工具版本 / 設計時間三謎；Round 20 兩張 CAS 圖紙標題欄再次驗證 ROBOFACTORY = 跨 3 筆 metadata 一致 → 高 confidence 結論「ROBOFACTORY = Creater 內部設計者」）


### 8.38 Production system 改動前必走 read-only inspection-first SOP

對任何 production system（教師正在用的 Dify / Open-WebUI / Ollama、production 主機、跨人協作的服務）的 tuning / optimization 提議、**改動前必先走 read-only 4-phase inspection、不今天 implement**。Review-not-implement 也是合法 deliverable、未來實際 implement 走 ADR 流程。

**Why**：production 改動有 user-facing impact、出錯成本高。沒 inspect 就動 = 盲改。即使 reference / best practice 看起來明顯該套、也要先 verify 既有狀態、再決定改動順序與時機。對位 §0.4「**重新框架問題 > 答問題**」應用到 production tuning 場景。

#### 4-Phase Inspection SOP

| Phase | 動作 | 通過條件 |
|---|---|---|
| **Phase 1 read-only inspection** | SSH 進去跑 read-only 命令、看 hardware / service / config / errors / log tail | 不執行任何 write / restart / reload、純收集事實 |
| **Phase 2 紙上分析** | 對位 reference / best practice / 既有 ADR、找 mismatch | 列出每個 mismatch + 與 reference 的具體 diff |
| **Phase 3 actionable matrix** | 每個發現產出 (預期效益 / 風險等級 / 建議時機 / verify 方法) | matrix 表完成、A-Z 編號、每項 self-contained |
| **Phase 4 寫 review doc + 不今天 implement** | 寫 `docs/snippets/<system>_<topic>_review.md` 收尾 | 寫完 commit + 不動 production、除非有急迫 outage / error |

#### 何時可以跳過 phase 4「不今天 implement」

- production 已 outage / error 浮現 → 走 incident response、phase 1-3 壓縮、phase 4 直接 implement
- 改動 zero risk + zero blast radius（如純加 log、加 metric）→ 走簡化路徑
- 改動有明確 maintenance window + backup + rollback plan → 走 ADR 流程

#### 反例（必須避免）

```
❌ Bad pattern 1：看 reference 直接 SSH 上去改 config
  → 沒 inspect 既有狀態、不知道改動的真實 blast radius
  → 可能改動的東西已經是 best practice、或反而引發其他問題

❌ Bad pattern 2：phase 1-3 跑完直接 implement
  → 跳過 phase 4 review doc、缺乏 sign-off 與 audit trail
  → 未來 troubleshoot 找不到改動理由 / 時間 / 影響範圍

❌ Bad pattern 3：跑 phase 1 時跑了 `systemctl restart` 之類 write 命令
  → read-only 紀律破壞、可能引發 user-facing impact
  → phase 1 必嚴格 read-only、所有 write 動作留到 phase 4 後
```

#### 對位章節

- **§0.4 重新框架問題 > 答問題**：先 inspect 再決策的 plan-first 升級
- **§5.7 何時不該立即實作 決策框架**：本節是 §5.7 應用到 production tuning 場景
- **§8.36 Self-audit 抓錯立刻修**：read-only inspection 是 self-audit 的前置條件
- **§8.39 Reference 入庫 Tier-based Classification**（下一節）：reference 入庫 + production review 兩條紀律連動使用

#### 為什麼這個習慣值錢

production system tuning 是「**改動代價 ≠ 改動收益**」的典型場景。改對了使用者無感、改錯了立即看到。SOP 強制走「**先 inspect 再決策**」、把 cost 從事後補救（user 報錯 / rollback / 道歉）移到事前評估（10-30 分鐘的 read-only + 寫 doc）。

review-not-implement 是 senior 紀律的具體展現 — 把「**看了沒動**」當合法 deliverable、避免「**動了才發現不該動**」。

> 📜 **真實案例**：見 `HISTORY.md` §B.40（2026-05-12 U6P40 Ollama tuning review、commit `b46c6f0`、發現 GPU 1 完全閒置 + 無 Flash Attention + 無 KV cache 量化、8 改動 matrix A-H、短期 A+B+C combo 建議、**沒今天 implement**、未來走 ADR + maintenance window + backup + rollback + 雙向 verify）。

### 8.39 Reference 入庫 Tier-based Classification Framework（0 / 1 / 2 三級）

Reference / 外部資料 入庫時、若不分類、未來 200+ ref 時找 priority 變地獄。本節定義三級 Tier framework、每級對應明確 follow-up action 與 re-evaluate trigger。

**Why**：reference 之間需要的 follow-up action 完全不同 — future capability 純歸檔即可、挑戰既有 assumption 的 ref 要立即 spike、production inspection 走 §8.38 流程。一套統一分類等於主動承認「**不同 ref ≠ 等價 ref**」、避免「**全 push 進 backlog 然後沒人看**」。

#### Framework 定義

| Tier | 定義 | Follow-up action | Re-evaluate trigger |
|---|---|---|---|
| **Tier 0** | 立即重評估、可能改變既有架構 | 1 週內 spike + 結果出來 | spike 結果出來時 |
| **Tier 1** | 排程 spike 驗證、可能影響後續 phase decision | 排 phase 空檔做 scoped spike、同 commit flag 新 open decision | 既有 phase 完成後 |
| **Tier 2** | 純參考歸檔、未來 phase 才評估 | 寫進 snippets + auto-memory pointer（C 模式雙寫） | 既有 8 階段全 ship + 具體 use case 浮現 |

#### Reference 入庫 SOP（四步）

```
1. Read / 摘要 reference 內容（先讀懂、不急著入庫）

2. 問 self-audit 問題：
   - Q1：這個 ref 會否挑戰既有 decision / assumption？
   - Q2：現在可驗（spike 工具齊）？還是要等 phase 空檔？
   - Q3：純未來 capability、還是觸發具體 use case？

3. 根據 Q1-Q3 答案分級：
   - 會挑戰 + 現在可驗 → Tier 0、1 週內 spike
   - 會挑戰 + 要排 phase 空檔 → Tier 1、同 commit flag 新 open decision（對位 §8.36 sub-rule 2）
   - 不會挑戰、純參考 → Tier 2、寫 future re-evaluate trigger 條件

4. 雙寫（C 模式）：
   - 主檔：docs/snippets/reference_<topic>.md（含 Tier 標籤 + Follow-up action + Re-evaluate trigger）
   - Pointer：auto-memory/project_reference_pool_<id>.md 加新條目
   - commit message 標題含 Tier 標籤（例：「Tier 1, M60 重評估觸發」）
```

#### 對應 Tier 與既有原則

- **Tier 0** 行為 = §8.36「**self-audit 抓錯立刻修 + 順帶解決相關結構問題**」應用到 reference impact assessment
- **Tier 1** 行為 = §8.36 sub-rule 2「**Reference 帶來新議題、同 commit 內 flag、不留 TODO**」
- **Tier 2** 行為 = §5.7「**何時不該立即實作 決策框架**」應用到 reference

#### 反例（必須避免）

```
❌ Bad pattern 1：所有 ref 都標 Tier 2（默認懶分類）
  → 真正會挑戰 assumption 的 ref 被埋沒、未來重新發明議題、cost 高

❌ Bad pattern 2：Tier 0 / 1 標了但沒寫 re-evaluate trigger
  → 未來不知道何時該回頭 review、ref 變死檔

❌ Bad pattern 3：Tier 0 標了但沒同 commit spike
  → 「Tier 0 = 1 週內 spike」承諾失效、實質降級為 Tier 1
```

#### 對位章節

- **§5.7 何時不該立即實作 決策框架**：Tier 2 行為的母概念
- **§8.36 Self-audit 抓錯立刻修**：Tier 1 sub-rule 2 的源頭
- **§8.38 Production 改動 SOP**（上一節）：production review 不是 reference、走 §8.38 不走本節

#### 為什麼這個習慣值錢

reference pool 是 senior dev 的長期資產。沒分類框架 → 變 cognitive overload、未來找不到 priority。有框架 → 「**Tier 0 立刻 spike / Tier 1 phase 後再看 / Tier 2 歸檔備查**」三種行為清晰、`auto-memory/project_reference_pool_*.md` 一掃看到 5 個 Tier 0 → 知道接下來 1 週要 spike 5 件事、不需要把所有 ref 都掃一遍。

> 📜 **真實案例**：見 `HISTORY.md` §B.42（2026-05-12 同日入庫 3 個 reference：Camofox Browser → Tier 2、commit `bacae15`；Qwen 3.6 35B A3B → Tier 1 + 觸發 D44 spike、commit `8701a5b`；U6P40 review → review only 不是 reference、走 §8.38 SOP、commit `b46c6f0`）。

## 九、附錄：可複製模板

### 附錄 A：README.md 骨架

```markdown
# PROJECT_NAME

[![CI](https://github.com/seyen37/PROJECT_NAME/actions/workflows/ci.yml/badge.svg)](https://github.com/seyen37/PROJECT_NAME/actions/workflows/ci.yml)
![python](https://img.shields.io/badge/python-3.10+-blue)
![license](https://img.shields.io/badge/license-MIT-yellow)

一句話描述專案做什麼。

## 🔗 線上資源

- 📖 **文件中心**：<https://seyen37.github.io/PROJECT_NAME/>
- 📦 **GitHub repo**：<https://github.com/seyen37/PROJECT_NAME>

---

## 為什麼

兩三段描述為什麼這個專案存在、解決什麼問題。

## 開發歷程

本專案由 **許士彥（Hsu Shih-Yen，<https://github.com/seyen37>）獨立設計與開發**。
詳細設計脈絡見 [`docs/decisions/`](docs/decisions/)。

## 安裝

```
[安裝指令]
```

## 授權

MIT License — 詳見 [LICENSE](LICENSE)。
```

### 附錄 B：LICENSE（MIT）

```
MIT License

Copyright (c) 2026 許士彥 (Hsu Shih-Yen) (https://github.com/seyen37)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

### 附錄 C：.gitignore（Python 為主）

```
# Python
__pycache__/
*.py[cod]
*.egg-info/
*.egg
build/
dist/

# Virtual env
venv/
.venv/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Project-specific (調整)
.env
*.log
data/cache/
```

### 附錄 D：決策日誌 _TEMPLATE.md

```markdown
# YYYY-MM-DD：決策主題

> 範圍：本日 / 本任務的工作主題（一句話）
>
> 起點：開始時的狀態
> 終點：結束時的狀態
>
> 對應 commits：
> - `hash1` commit subject
> - `hash2` commit subject

---

## 決策 1：標題

**情境**：當時遇到什麼問題？

**選項**：
- A. 選項 A
- B. 選項 B

**決定**：選 X。

**考量**：
1. 為什麼這樣選
2. 風險 / 妥協

**教訓**：
- 通用 lesson

---

## 決策 2：標題

[同上]

---

## 反思

**做得好的**：
- ...

**可以更好的**：
- ...

**對長期專案的影響**：
- ...
```

### 附錄 E：GitHub Actions CI（Python）

`.github/workflows/ci.yml`：

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - name: Install
        run: |
          python -m pip install --upgrade pip
          pip install -e ".[test]"
      - name: Test
        run: pytest
```

### 附錄 F：第三方品牌使用準則 + 商標 disclaimer

> **何時用**：當您的 repo / 文件 / 網站提及任何**他人註冊商標**（廠商名、產品名、品牌 logo）時。
>
> **為什麼必要**：避免被指控「攀附商譽」或「impersonation」。同時保護自己的善意使用。

#### F.1 使用準則（DO / DON'T）

✅ **可以做**：
- 在文件中**事實性提及**他人產品（「本筆記研究 Unitree Go1 機器狗」）
- 在比較表中對照不同產品（"Unitree Go1 vs Petoi Bittle"）
- 引用他人開源 code 並依其 LICENSE 作 attribution

❌ **不要做**：
- 用他人商標當您的 repo / 網站 / 產品名（例：`unitree-blocks.com`、`bittle-toolkit`）
- 直接使用他人 logo / 視覺識別圖案（即使加變形）
- 暗示官方合作 / 認可（`Official Unitree Toolkit`、`Petoi Partner`）
- 在比較中刻意貶低他牌（不實 / 誇大缺點）

#### F.2 標準 disclaimer 模板

放在 README 結尾或網站 footer：

```markdown
## 商標聲明 / Trademark Disclaimer

本專案 / 網站僅作個人學習研究用途。文中提及的所有產品名、品牌名、logo 為其各自擁有者之商標或註冊商標。

This project / site is for personal learning and research only. All product
names, brand names, and logos mentioned are trademarks or registered
trademarks of their respective owners.

- **Unitree®**, **Go1®**, **Go2®** 為 Hangzhou Yushu Technology Co., Ltd. 之商標
- **Petoi®**, **Bittle®**, **Nybble®** 為 Petoi LLC. 之商標
- **Boston Dynamics®**, **Spot®** 為 Boston Dynamics, Inc. 之商標
- 其他未列出商標亦同樣歸其各自擁有者所有

本專案與上述任一公司**無任何附屬、贊助、認可關係**（not affiliated with, endorsed by, or sponsored by）。
```

#### F.3 中國市場的額外考量

若內容會被中國使用者讀到（例如 GitHub 在中國可訪問、或翻譯成簡中發到知乎/CSDN）：
- **「攀附商譽」訴訟風險高於台美**，disclaimer 一定要中文版同時存在
- **避免直接吐槽中國品牌**（特別是 Unitree）— 改用中性「以下為已知技術細節」描述
- **不要 fork 後改名魚目混珠**（例：把 `unitree_legged_sdk` 改名 `unitree_legged_sdk_pro` 上傳，會引廠商注意）

---

### 附錄 G：教育類網站合規清單（COPPA / 個資法 / GDPR-K / 兒少法）

> **何時用**：網站 target user 包含 **18 歲以下**（特別 < 13 歲）時。程式積木 / Scratch-like 編程網站幾乎必中。

#### G.1 法規地圖

| 法規 | 司法管轄 | 適用年齡 | 觸發條件 |
|---|---|---|---|
| **COPPA**（Children's Online Privacy Protection Act） | 美國 | < 13 歲 | 收集兒童個資 / 該網站「主要受眾為兒童」 |
| **GDPR-K**（GDPR 兒童特別保護） | EU | < 16 歲（成員國可降至 13） | 同上，加 EU 用戶 |
| **個資法**（個人資料保護法） | 台灣 | 不分齡（< 7 歲須法定代理人同意） | 收集任何個資 |
| **兒少權益保障法** | 台灣 | < 18 歲 | 內容呈現 / 平台責任 |
| **PIPL**（個人信息保護法） | 中國 | < 14 歲須監護人同意 | 中國用戶 |

#### G.2 合規清單（最小必要）

**A. 設計階段**
- [ ] 明確網站定位：「教育用途，13 歲以上」 vs 「親子共用，需家長監督」 — **影響後續所有政策**
- [ ] 設計時遵循「Privacy by Design」：**預設不收個資**、可選的功能才開啟收集
- [ ] 評估必要性：每個收集欄位都問「真的需要嗎？」（例：暱稱可以、實名不必、地址絕對不要）

**B. 帳號 / 登入**
- [ ] 若有帳號功能：年齡驗證機制（不是嚴格驗證但要有「請輸入生日」並過濾 < 13）
- [ ] < 13 歲：要求家長 email + 同意機制（COPPA verifiable parental consent）
- [ ] 不接受 13 歲以下兒童的姓名 / 地址 / 電話 / 學校名 / 照片 / 影片 / 聲音
- [ ] **建議：教育網站只用「匿名 session」**，不需要登入就能用，避開 COPPA 大部分條文

**C. 上傳 / 分享功能**
- [ ] 用戶創作的積木程式 / 角色 / 動畫，預設**僅本人可見**
- [ ] 「分享」必須是 explicit opt-in，不能 default-public
- [ ] 內容審核機制（至少 keyword filter；社群互動最小化）
- [ ] 不允許 < 13 歲用戶在 public 留言區發文

**D. 數據收集 / Analytics**
- [ ] **不要用 Google Analytics 預設配置**（會收集 cookie、IP）
- [ ] 改用對兒童友善的：**Plausible**、**Umami**、**Fathom**（無 cookie、IP 匿名）
- [ ] 或使用 GA 但開啟「IP anonymization」+ 不啟用「remarketing」
- [ ] Cookie banner（GDPR 必須；台灣個資法建議）

**E. 文件層**
- [ ] **Privacy Policy** 必須 < 13 歲兒童看得懂的版本（白話）+ 完整法律版
- [ ] 明確列出「我們收集 / 我們不收集」
- [ ] 家長聯絡管道（要刪除孩子資料時的窗口）
- [ ] **每年定期 review** Privacy Policy（標日期、變動加 changelog）

**F. 技術層**
- [ ] HTTPS-only（這是 baseline 不是選配）
- [ ] CSP（Content Security Policy）防 XSS
- [ ] 用戶上傳的程式碼**沙箱化執行**（iframe sandbox / Web Worker）
- [ ] 不允許 user code 存取 `window.parent` / `localStorage` 跨來源資料

#### G.3 實務建議：最小化合規負擔

如果您不想處理一堆合規手續，**最強建議**：

> **設計成完全不需要帳號的網站**
>
> - 用 `localStorage` 存使用者作品（瀏覽器本機，不上傳）
> - 「分享」改成「複製連結」（URL 含序列化的程式內容、不存伺服器）
> - 完全不收集個資 → 大部分 COPPA / GDPR / 個資法 條文不適用
> - Privacy Policy 簡單到一句：「本網站不收集任何個人資料；您的作品儲存在您自己的瀏覽器」

**Scratch、Blockly demo、CodePen** 都採類似策略。對個人 / 小型專案是甜蜜點。

---

### 附錄 H：Privacy Policy 骨架（最小版）

> **何時用**：網站涉及任何個資收集（含 cookie、analytics、帳號）時。
>
> **本骨架定位**：個人 / 小型開源網站 baseline 模板。商業專案請找律師。

```markdown
# Privacy Policy / 隱私權政策

> 最後更新：YYYY-MM-DD

## 1. 我們是誰

本網站 [SITE_NAME] 由 許士彥（Hsu Shih-Yen）以個人名義營運。
聯絡：透過 GitHub <https://github.com/seyen37>

## 2. 我們收集什麼資料

我們**不收集**：
- 您的姓名 / 真實身分
- 您的 email / 電話 / 地址
- 您的位置
- 您的瀏覽歷史

我們**會收集**（如有，列出實際情況）：
- [ ] Web Analytics（Plausible / Umami，不用 cookie、IP 匿名化）
- [ ] 錯誤回報（不含個資）
- [ ] 您主動上傳的內容（[說明用途]）

## 3. 我們如何使用資料

[逐項對應上方收集項目，說明用途。沒有的就略過。]

## 4. 我們如何保護資料

- 全站 HTTPS
- 不與第三方分享
- [若有伺服器]：使用業界標準加密儲存

## 5. Cookie 使用

[根據實際情況選擇]
- ☐ 本網站不使用 cookie。
- ☐ 本網站使用以下 cookie：[列出每個 cookie 名稱、用途、保存期限]

## 6. 兒童隱私

本網站[未/有]針對 13 歲以下兒童。如您是家長並擔心孩子的資料：
- 透過 [聯絡方式] 聯繫我們刪除任何相關資料

## 7. 您的權利

依台灣個資法、GDPR、CCPA：
- 查詢您的資料
- 要求刪除您的資料
- 撤回同意

## 8. 政策變更

任何變更會在本頁標示新的「最後更新」日期。重大變更會[網站公告 / email 通知（如有訂閱）]。

## 9. 聯絡

任何問題：透過 GitHub <https://github.com/seyen37>
```

---

### 附錄 I：Terms of Service 骨架（最小版）

```markdown
# Terms of Service / 服務條款

> 最後更新：YYYY-MM-DD

## 1. 服務性質

本網站 [SITE_NAME] 為個人營運之開源教育工具，**免費提供、不保證可用性**。

## 2. 您的責任

使用本服務時您同意：
- 不上傳違法 / 侵權 / 不適合兒童的內容
- 不利用本站從事任何商業營利行為（除非另有書面同意）
- 不嘗試入侵 / 破解 / 反向工程本站
- 自行備份您創作的作品

## 3. 我們的責任

- **本服務按「現狀」提供**，不保證無錯誤、不間斷、無資料遺失
- 本人[ 不負責 / 不承擔 ]因使用本站造成的任何直接或間接損失
- 本服務可能隨時暫停 / 終止（會盡量提前公告）

## 4. 智慧財產權

- 本網站程式碼以 [LICENSE 名稱，例：MIT] 授權
- 您創作的作品**權利歸您所有**；上傳分享即授權本站非專屬展示權
- 若您引用 / fork 本站內容，請依 LICENSE 條款 attribution

## 5. 第三方服務 / 商標

本站使用的第三方服務（[列出，例：GitHub Pages、Plausible Analytics]）有其自己的條款。
本站提及的他人商標（見[商標聲明](#商標聲明)）為其各自擁有者所有。

## 6. 法律適用

本條款依**中華民國（台灣）法律**解釋。任何爭議以**台灣管轄法院**為第一審。

## 7. 條款變更

任何變更會在本頁標示新的「最後更新」日期。繼續使用即視為接受新條款。

## 8. 聯絡

任何問題：透過 GitHub <https://github.com/seyen37>
```

> **注意**：以上是個人小型開源網站的 baseline。若涉及付費功能、用戶資料儲存、商業授權，**請找專業律師**。本模板**不構成法律建議**。

---

### 附錄 J：授權相容性 cheat sheet + 「割開」決策

> **何時用**：要決定 repo / 網站 / 文件**用什麼 license**、或要引用 / fork 他人作品時。  
> **本附錄定位**：個人專案實務指南，不是法律意見。涉及商業 / 訴訟請找律師。

#### J.1 三句話心法

1. **寬鬆 license**（MIT / BSD / Apache / CC BY / CC0）= 衍生作品**可選任何 license**
2. **傳染性 license**（GPL / CC BY-SA / AGPL）= 衍生作品**必須同 license**
3. **「混到一起」前先問一句**：這個來源 license **強制傳染**嗎？是 → 我接受 / 我割開 / 我重寫；否 → 標 attribution 即可

#### J.2 授權相容性矩陣（從「來源」用到「目標」）

| 來源 → 目標 | MIT | Apache 2.0 | GPL v3 | CC BY 4.0 | CC BY-SA 4.0 | CC0 | 商用閉源 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **MIT** | ✓ | ✓ | ✓* | ✓ | ✓* | ✓ | ✓ |
| **Apache 2.0** | ⚠️¹ | ✓ | ✓* | ✓ | ✓* | ⚠️ | ✓ |
| **BSD-3** | ✓ | ✓ | ✓* | ✓ | ✓* | ✓ | ✓ |
| **GPL v3** | ❌ | ❌ | ✓ | ❌ | ⚠️² | ❌ | ❌ |
| **AGPL v3** | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| **CC BY 4.0** | ✓¹ | ✓¹ | ✓ | ✓ | ✓ | ✓ | ✓¹ |
| **CC BY-SA 4.0** | ❌ | ❌ | ⚠️³ | ❌ | ✓ | ❌ | ❌ |
| **CC BY-NC** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **CC0 / Public Domain** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**符號解讀**：
- ✓ 可以（保留 attribution + LICENSE 通知）
- ✓* 整體目標必須變成傳染 license（不是「相容」是「被吸收」）
- ⚠️¹ 必須保留 NOTICE 檔（Apache 2.0 強制要求）
- ⚠️² CC 4.0 → GPL 3.0 是 CC 官方宣告的單向相容（僅軟體脈絡）
- ⚠️³ 同上反方向，CC BY-SA 內容可被 GPL 軟體吸收
- ❌ 不可以（除非取得來源作者額外授權）

**最常見的個人專案結論**：
- **想最大相容** → 用 MIT 或 Apache 2.0（程式碼）/ CC BY 4.0（文件）
- **想保護「衍生作品也要開源」** → GPL 3.0（程式碼）/ CC BY-SA 4.0（文件）
- **想完全放棄權利** → CC0（文件）/ Unlicense（程式碼）

#### J.3 「割開」決策樹

```
您的內容會成為 GitHub PUBLIC repo 嗎？
│
├── ❌ 否（永遠 private）
│      └── 任何引用都 OK，license 不觸發。但仍應預留未來公開化空間（§8.5）
│
└── ✅ 是
       │
       ├── 內容 100% 原創？
       │   └── ✅ 任選 license（程式碼建議 MIT，文件建議 CC BY 4.0）
       │
       └── 內容含第三方授權內容
              │
              ├── 引用都是「寬鬆」license（MIT/BSD/Apache/CC BY/CC0）
              │   └── ✅ 標 attribution、整 repo 自由選 license
              │
              └── 引用含「傳染性」license（GPL / CC BY-SA / AGPL）
                     │
                     ├── 願意接受傳染
                     │   └── 整 repo 用同 license
                     │      （例：含大量 CC BY-SA 引用 → 整 repo 用 CC BY-SA）
                     │
                     └── 不願意傳染（想用 MIT 等寬鬆 license）
                            │
                            ├── 選項 A：重寫所有引用部分為 paraphrase
                            │   （自己的話 → 您自己的著作權 → 自由選 license）
                            │
                            └── 選項 B：「割開」兩個 repo
                                   ├── repo A：原 repo（含引用、用 CC BY-SA）
                                   ├── repo B：純原創（用 MIT）
                                   └── 兩 repo 互相連結但不複製貼上
```

#### J.4 「割開」實作步驟（具體做法）

當您決定割開時：

```powershell
# 1. 各自的 GitHub repo
#    seyen37/<研究筆記名>      ← LICENSE: CC BY-SA 4.0
#    seyen37/<網站 / 程式碼名>  ← LICENSE: MIT

# 2. 本機可以一個 Cowork 資料夾、兩個子目錄各 git init
mkdir C:\Users\F0012\Documents\CoWork\<新專案>
cd C:\Users\F0012\Documents\CoWork\<新專案>
mkdir notes website

cd notes
git init
# 建 LICENSE 為 CC BY-SA 4.0（見 J.5）

cd ..\website
git init
# 建 LICENSE 為 MIT（見附錄 B）

# 3. 各自雙推 GitHub（用 §3.5 SOP）
#    notes 目錄推到 seyen37/<研究筆記名> + seyenbot 備份
#    website 目錄推到 seyen37/<網站名> + seyenbot 備份
```

**互相引用的合法做法**：

✅ **可以做**：
- README 加超連結 `[研究筆記](https://github.com/seyen37/<研究筆記名>)`
- 致謝段落提及「本網站基於 ... 研究筆記之研究結果（CC BY-SA 4.0）」

❌ **不要做**：
- 把 notes repo 某段含 CC BY-SA 引用的文字**整段複製**到 website repo
  → 整個 website 變成混合授權麻煩

✅ **可以做（取代上一條的方式）**：
- 用**自己的話 paraphrase** 該段內容，貼到 website repo
  → paraphrased text 是您原創 → 自由選 license

#### J.5 LICENSE 檔案範本（CC BY-SA 4.0 + Apache 2.0）

**CC BY-SA 4.0**（用於文件 / 研究筆記 repo）：

於 repo root 建 `LICENSE` 檔案：

```
This work by 許士彥 (Hsu Shih-Yen) (https://github.com/seyen37) is
licensed under the Creative Commons Attribution-ShareAlike 4.0
International License (CC BY-SA 4.0).

To view a copy of this license, visit:
https://creativecommons.org/licenses/by-sa/4.0/

You are free to:
  - Share — copy and redistribute the material in any medium or format
  - Adapt — remix, transform, and build upon the material for any purpose,
    even commercially.

Under the following terms:
  - Attribution — You must give appropriate credit, provide a link to
    the license, and indicate if changes were made.
  - ShareAlike — If you remix, transform, or build upon the material,
    you must distribute your contributions under the same license as
    the original.
  - No additional restrictions — You may not apply legal terms or
    technological measures that legally restrict others from doing
    anything the license permits.

Suggested attribution format:
  "<work title>" by 許士彥 (Hsu Shih-Yen)
  (https://github.com/seyen37/<repo>),
  licensed under CC BY-SA 4.0.
```

**Apache 2.0**（用於需要 patent grant 的程式碼）：

完整文字從 <https://www.apache.org/licenses/LICENSE-2.0.txt> 複製，將 `Copyright [yyyy] [name of copyright owner]` 改為：
```
Copyright 2026 許士彥 (Hsu Shih-Yen) (https://github.com/seyen37)
```

> **不要忘記 NOTICE 檔**：Apache 2.0 strongly 建議 repo root 也放 `NOTICE` 檔，列出所有第三方依賴的 attribution。

#### J.6 場景手冊：常見實際案例

**場景 1：私人筆記引用 CC BY-SA blog 大段內容**  
✅ **OK**（私人沒分發、license 不觸發）。但寫筆記時就把該段獨立成檔（§8.5），未來公開時容易處理。

**場景 2：把上述筆記轉 public**  
選一：
- A. 整個筆記 repo 用 CC BY-SA 4.0（接受傳染、最簡單）
- B. 重寫所有 CC BY-SA 引用為 paraphrase + 引用連結（自己的話 → 自由 license）
- C. 「割開」（J.4）

**場景 3：要做網站（MIT）、想用筆記某些圖表**  
選一：
- A. 重新繪製、配上自己的描述文字（最乾淨）
- B. 引用圖表的 CC BY-SA 來源 → 在網站某個 `/credits` 頁標清楚 + 整體網站變混合授權（不推薦）
- C. 圖表只放在 notes repo（CC BY-SA），website 用連結指過去（割開）

**場景 4：fork 別人 GPL 程式碼做修改**  
- 您 fork 後的版本**也必須是 GPL**
- 不能改成 MIT 重新發布
- 在自己的 README 明確標出「Based on `<原專案>`, GPL v3.0」

**場景 5：用 Apache 2.0 函式庫到您的 MIT 專案**  
✅ **OK**，但：
- 必須保留原作者 NOTICE 檔（如果原 repo 有的話）
- README 中標出使用了 Apache 2.0 函式庫 + attribution
- 您專案整體仍可是 MIT（不會被 Apache 2.0 「污染」）

**場景 6：自己 repo 的某些檔案想用不同 license**  
可以做，但要**清楚標註**：
- repo root 主 LICENSE
- 例外檔案開頭寫 `<!-- LICENSE: CC BY-SA 4.0, see LICENSE-CC-BY-SA -->`
- 或建 `LICENSES/` 目錄放各別 license 文字
- **建議：除非真的必要，否則整 repo 一個 license 比較好維護**

#### J.7 一個簡單口訣

> **「我以後**（會 / 可能會）**怎麼用這份內容？」**
> 
> 寫第一行字之前、開新 repo 之前，先想 6 個月、1 年、3 年後可能的用法：
> - 變成 GitHub public？
> - 變成網站？
> - 變成書 / 課程教材？
> - 想被別人 fork？想被別人商用？
> 
> 想清楚了，license 怎麼選、檔案結構怎麼分、什麼可以引用什麼不行，自然會浮現。  
> 不確定時，預設選 **最寬鬆的選項 + 最清楚的 attribution**——進可攻退可守。

#### J.8 進階閱讀

- [Creative Commons - License Compatibility](https://creativecommons.org/share-your-work/licensing-considerations/compatible-licenses/)
- [SPDX License List](https://spdx.org/licenses/)
- [GNU License Compatibility](https://www.gnu.org/licenses/license-compatibility.en.html)
- [TLDRLegal - 各 license 白話對照](https://tldrlegal.com/)
- [choosealicense.com - GitHub 官方 license 選擇器](https://choosealicense.com/)

---

### 附錄 K：常用工具索引

> 跨專案、與 AI 協作時最常觸發的外部 CLI / 套件。詳細用法、use case、限制收錄在 `docs/tools/<工具名>.md` 個別工具卡。

| 工具 | 用途 | 工具卡 | 首次列入 |
|---|---|---|---|
| **markitdown** | PDF / Word / Excel / PPT / 圖片 / 音訊 / YouTube → Markdown | [`docs/tools/markitdown.md`](docs/tools/markitdown.md) | 2026-05-09 |
| **docx 表格欄寬平衡 SOP** | pandoc → docx 後動態算 colWidths、避免單欄 wrap 失衡（`weight = max(chars, 8)` 比例化）| [`docs/tools/docx_table_colwidth_sop.md`](docs/tools/docx_table_colwidth_sop.md) | 2026-05-09 |
| **docx 表格版面設計原則 v4** | 整合版規則：閱讀完整性 + 行數最小化 + Unicode 禁則 + Anti-pattern + v4 演算法整合 | [`docs/tools/docx_table_layout_principles.md`](docs/tools/docx_table_layout_principles.md) | 2026-05-10 |
| **docx Build Workflow** | 操作步驟詳解 + build script 使用說明 + Anti-pattern + Troubleshooting | [`docs/tools/docx_build_workflow.md`](docs/tools/docx_build_workflow.md) | 2026-05-10 |
| **build_docx_with_sop.py** | 一鍵 markdown → docx 套 v4.11 SOP（Python script、~25 行 CLI options）| [`scripts/build_docx_with_sop.py`](scripts/build_docx_with_sop.py) | 2026-05-10 |

**新工具列入準則**：
1. **跨專案有用**：不是某 repo 專屬的 build script、是任何專案都可能用到的
2. **已實測**：本機或 Cowork sandbox 已跑過、確認可用
3. **一句話 thesis**：能講清楚「為什麼比既有路徑強」
4. **對位至少一個既有原則**：說明與本 playbook 哪一段協作（§六 / §八.7 / §四 等）

新工具加入流程：寫 `docs/tools/<name>.md` 完整工具卡 → 本表加一列 → WORK_LOG 補一條。

---

## 十、與 AI 協作時的 prompt 片段

如果你用 Claude Code / 其他 AI 助手協作，把下面這段加進使用者偏好或專案 CLAUDE.md，AI 會自動套用本文件的習慣：

```markdown
## 自動工作習慣（必須遵守）

1. **每次工作結束時**，自動寫決策流（不只成果），存到：
   - 日期型：`docs/decisions/YYYY-MM-DD_topic.md`
   - 模組型：`docs/decisions/mode_NN_topic.md` 或 `infra_NN_topic.md`

2. **決策日誌結構**：每筆決策包含「情境 / 選項 / 決定 / 考量 / 教訓」五段式。
   絕對值得寫的決策：（a）有 2+ 選項且選一個 （b）debug > 30 分鐘
   （c）架構決策 （d）違反直覺的做法。

3. **commit message** 描述「為什麼」而非「做了什麼」。git diff 已經
   告訴讀者做了什麼，commit 該負責解釋動機。

4. **任何 push 之前**：跑 test、`git status` 確認沒夾帶、確認檔案
   不含 secret。

5. **公開前**（Private → Public）：跑 secret 稽核、個資稽核、授權
   稽核，全綠才轉。

6. **新模組第一行**：寫 module docstring，明確「做什麼、不做什麼、
   何時用、何時不用」。

7. **回應使用者** 用繁體中文台灣詞彙，避免大陸用語。

8. **資料源 audit**：使用者要求加入「官方」「政府」「標準」「規範」相關
   的 dataset 時，先問是否有一手公文 PDF / 公報可用。如果只有第三方
   整理品（Gist、GitHub、Wikipedia、學術網站）作為來源，主動 flag 風險：
   提示「第三方整理品可能夾帶他國變體」，建議補一手資料再動工。
   詳見 §六「資料源稽核」。

詳見 docs/PROJECT_PLAYBOOK.md。
```

---

## 十一、給未來自己的話

這份文件不是「規定」，是「我已經試過、確認對自己有用的習慣」。

當你下次新建專案誘惑著想跳過 LICENSE / decision log 時——記得：**這些動作的成本是當下 5 分鐘，省下的是未來 5 小時的回憶 / 解釋 / 防衛工作。**

開源是長期的事，文件是給未來的自己。

---

## 十二、教育機構 AI mission

> ⚠️ 本章是 vision-level、不是 hands-on rule。給 §一-§十一 具體 SOP 一個 mission anchor、特別針對教育機構 IT 場景。

### 12.1 AI 不是平權器、是放大器（thesis）

能處理**結構複雜度**的人 + AI = 指數放大；沒結構感的人 + AI = 更快崩潰。

對位 institutional research：
- IMF 2024：全球 40% 工作面臨 AI 衝擊、高收入經濟體達 60%
- WEF 2025：2030 前 78M 淨增工作、但 59% 勞動力需 retrain、AI 技能薪資溢價 56%
- Anthropic 2026/01 經濟指數：52% 互動為「增強」非取代

### 12.2 教育機構 mission 在 AI 時代的延伸

四條 mission—— **personal-playbook governance 之外、機構場景 unique value**：

1. **主動介入培養學生「結構承載能力」**——不是教 AI 操作、是教如何在多變量複雜情境下保留判斷力
2. **防止 AI 擴大教育不平等**——機構若不主動介入、AI 反而加劇學生間差異（資源 / 數位素養 / 環境差異被放大）
3. **保護「後設認知能力」**——外包推理給 AI 會退化「**知道自己不知道什麼**」的能力（GMU / SSRN 縱向研究警示）
4. **鼓勵真實人際互動**——避免 AI 成為孤立加速器（GMU 1100 用戶研究 + 4 週 RCT 顯示 AI 大量互動正相關於孤獨 / 依賴 / 真實社交減少）

### 12.3 對 §教師 use case 規劃的 implication

§教師 use case 軸線應包含 mission 維度（不只 functional 維度）：

| 軸（功能） | 對位 mission |
|---|---|
| 班務 / 教學 / 互動 | 鼓勵真實人際互動（12.2.4） |
| 招生 / dashboard | 防止不平等加劇（12.2.2） |
| 教育意義示範 | 培養結構承載能力（12.2.1）+ 保護後設認知（12.2.3） |
| 遊戲化激勵（角色成長 P 點數） | 配合 mission、不是純 engagement metric |
| 法規 / 制度文件助手 | 治理紀律示範 |

### 12.4 機構 AI 服務設計準則（與 mission 對齊）

- **保留人類最終決策點**：高責任場域（學生輔導 / 評量 / 招生決策）AI 永遠是 reference 不是 judgment（對位 §0.3 thesis）
- **明文 disclaimer**：「最終回 authoritative source / 行政決策權威」
- **鼓勵真實互動 backup**：機構 AI 對學生服務必須有「**鼓勵真實互動**」backup 機制、不能讓 AI 成為孤立加速器

> 📜 **來源**：note 127（AI 結構密度放大器）+ note 139（AI 十大迷思 5+5 反思 / 引用 Harvard / IMF / WEF / Anthropic / GMU institutional research）
