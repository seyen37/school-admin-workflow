# 2026-05-20：收工 retrospective + 共通性原則

> 範圍：今日 5 小時 session 結束時的 retrospective。把從 P1 → P5 + Phase 2.5 + 收工九階段過程中**浮現出來、超出 personal-playbook 既有規則之外**的 6 條新共通性原則凍結成書面。
>
> 起點：admin-project-workflow `b968afe` + `29b7006` 已雙推 GitHub、長期記憶 3 條已寫入。
> 終點：session-close retrospective 完成；6 條新原則可供未來 fork / 新 repo 參考；給 personal-playbook 的回饋建議產出。
>
> 對應 commits：
> - `b968afe` init: fork & rewrite from mihozip/google-workspace-admin-project-workflow
> - `29b7006` docs: add 30-minute install acceptance checklist
> - `<待推>` docs: add session-close retrospective + update WORK_LOG with P4/P5/收工

---

## 為什麼寫這份檔案

今天的工作是一次完整的「**從 0 到雙推上線**」實戰。**過程中浮現的 lesson 不寫下來、明天就忘了**。

更重要的是：這些原則**多數不在 personal-playbook 現有章節**裡，是今天 dogfood 過程中**新長出來**的可推廣經驗。如果只把它們留在前三份 decision log 的「反思」段裡，會被埋沒——所以集中寫一份「共通性原則」專檔。

未來若考慮回饋 personal-playbook，這份檔案是輸入源。

---

## 共通性原則 6 條

### 原則 1：致謝強度是策略選擇，不是法律最小要求

**從哪個情境浮現**：今天 fork mihozip/google-workspace-admin-project-workflow 時，討論該怎麼致謝原作。

**原則陳述**：MIT 等寬鬆 License 法律上只要求保留 copyright notice。但對「**學校 / 公部門 / 學術場域**」，致謝強度應該是**策略選擇**：

- **層 1 — 法律基礎**：LICENSE 內保留原作 copyright + 加 fork 維護者
- **層 2 — 文化層**：README 顯眼處段落（不是末尾小字）
- **層 3 — 詳實層**：獨立 `ACKNOWLEDGEMENTS.md` 列出**繼承自原作的設計** vs **本 fork 的擴充範圍**

**適用場景**：
- ✅ Fork 他人 MIT/Apache repo 後做大幅改寫
- ✅ 把開源工具引入校內 / 公部門
- ✅ 學術論文相關工具

**反例（不適用）**：
- 法律授權嚴格的 fork（CC BY-SA / GPL）已強制 attribution，不需「策略性升級」
- 純技術 demo / toy project，致謝過度反而 noise

**為什麼這條值得寫進原則**：許多人以為「致謝 = 加個 link 就好」，沒意識到這是**結構性的護城河**。三層致謝後，任何人質疑「為什麼跟原作那麼像」都有三個獨立證據可指。

---

### 原則 2：新 repo 任務第一個問題 = 使用者有沒有 SOP

**從哪個情境浮現**：今天 P1-P3 全做完才被使用者提醒「請檢視 personal-playbook 找共通性原則做修正」，導致要插入 Phase 2.5 治理補強。

**原則陳述**：接到「新建 repo」、「fork repo」、「重做 repo」這類任務時，**第一個動作不是問該寫什麼，而是問「**你有沒有自己的 SOP / playbook 該套用？**」**

**怎麼偵測**：
1. 工作資料夾名稱是否含 `playbook` / `sop` / `personal` 等 keyword
2. 使用者過去對話是否提過 SOP
3. 直接明問

**適用場景**：
- ✅ 任何個人新 repo
- ✅ 個人 fork 他人 repo 後改寫
- ✅ 帶有「長期累積」意圖的專案

**反例（不適用）**：
- 純拋棄式腳本（幾小時就丟）
- 公司專案有強制 template（直接套用）

**已凍結為長期記憶**：見本機 `~/AppData/.../memory/check-user-sop-before-new-repo.md`。

---

### 原則 3：發現缺漏時插入新 phase，不要重做

**從哪個情境浮現**：P3 結束後發現缺整套治理層（decisions / WORK_LOG / PROJECT_PLAYBOOK 引用）。沒有重做 P1-P3，而是**插入 Phase 2.5 治理補強**。

**原則陳述**：當「**遲到的第一天清單**」與「**已完成的後續階段**」衝突時，**用插入新 phase（非整數編號）的方式補上**，比重做後續階段省力 10 倍。

**Pattern**：
```
原計畫：P1 → P2 → P3 → P4
發現缺漏 → 插入 Phase 2.5 補治理 → P4
```

**為什麼可行**：
- Phase 2.5 動到的是「治理層」（LICENSE 真名、decision log、PROJECT_PLAYBOOK 引用、checklist），**與內容層（docs/src/lessons）正交**
- 違反 personal-playbook §一「append-only」原則？不，那是針對「**內容**」的；對「**結構**」allow 結構性重構（§一附註）

**適用場景**：
- ✅ 新 repo 在 mid-development 才發現缺治理層
- ✅ 中途加入新規範但既有產出仍正確
- ✅ 跨團隊整合時發現某團隊跳過 SOP

**反例（不適用）**：
- 發現的缺漏會「**污染既有產出**」（例如資料 schema 錯了）→ 必須重做
- 缺漏跟既有產出深度耦合 → 重做成本可能反而較低

**已實證**：Phase 2.5 1.5 小時補完 9 件治理事項，相比重做 P1-P3（>3 小時）省 50%+。

---

### 原則 4：獨立 sub-agent code review 抓得到自己抓不到的問題

**從哪個情境浮現**：P3 程式寫完後，請 Explore agent 做獨立 review，抓到 5 個我自己沒注意到的問題（其中 3 個 🔴 必修）。

**原則陳述**：**「自我 review」與「獨立 review」抓到的問題類型不一樣**。前者通常抓「我知道我寫得不好」的地方；後者抓「我以為沒事」的地方。

**5 個今天抓到的問題類別**：
1. **scope 認知盲點**：generateProjectCode 雙重 lock 死鎖風險 — 我寫的時候只看單一函式
2. **falsy 防禦過嚴**：`if (!rowIndex)` 對 0 誤判 — 我用直覺寫
3. **靜默失敗**：archiveFolder catch 不拋例外 — 我以為 fallback 行為足夠
4. **邊界值缺驗證**：addPopupReminder 超過 40320 分上限 — 我寫了註解但沒寫程式檢查
5. **重複去除**：recipients 陣列直接 push — 我認為「兩欄不會同值」但實際會

**Pattern**：對「**接近交付**的程式碼」，**強制做一輪獨立 review**，不依賴自我 review。

**怎麼做**：
- 在 Claude Code / Cowork 環境用 Explore agent（或 general-purpose agent）做獨立 review
- 給 agent 明確的 review checklist（正確性 / 平台特性 / 並行安全 / 設計問題 / 錯誤處理）
- 要求依嚴重度分 🔴🟡🟢 三級

**適用場景**：
- ✅ 任何 deliverable 程式碼
- ✅ 重大 PR 提交前
- ✅ 公開 repo 的 release tag 前

**反例（不適用）**：
- 純 prototype（快丟） — overhead 不值
- 純文件修改 — sub-agent 抓不到太多

---

### 原則 5：QODA 四步是「決策成本前置」，不是儀式

**從哪個情境浮現**：今天連續走 4 輪 QODA（結構主軸 / 目錄 / 執行節奏 / apply-playbook），全部 sign-off 才動手。沒有任何一輪因為「方向錯」需要重做。

**原則陳述**：QODA（Question → Options → Decision → Approval）的本質是「**把對齊成本壓在 plan 階段**」，避免到 implementation 才發現方向錯導致重做。

**4 個今天的 QODA 紀錄**：

| QODA 輪 | Q | 提供 Options 數 | 結果 |
|---|---|---|---|
| 1 | 倉庫結構主軸 | 3 | 使用者選 B 聚焦 |
| 2 | 目錄結構 + 命名 | 4（呈現為樹） | 使用者選 D（含 examples / lessons） |
| 3 | 執行節奏 | 3 | 使用者選 B 分四階段 |
| 4 (meta) | apply playbook 多深 | 3 | 使用者選 O2 核心套用 |

**為什麼這條是原則而非單純 SOP**：
- 4 輪 QODA 共耗時 ~30 分鐘
- 沒有任何一輪需要 backtrack
- 對應「**plan-first 紀律 = senior 紀律的核心**」（personal-playbook §0.4）

**反例（不適用）**：
- 微小修正、typo → 跳過 QODA
- 已有明確 ADR / sign-off 的延伸實作 → 跳過 QODA

**深化原則**：QODA 不是「我要做什麼讓你決定」，而是「**我把選項與權衡呈現好，讓你的決定有足夠資訊**」。Options 的品質比數量重要。

---

### 原則 6：共通性原則的回饋機制 — 浮現 → 凍結 → 回饋 source-of-truth

**從哪個情境浮現**：本檔本身就是這條原則的具體應用。今天 dogfood personal-playbook 過程中浮現出 5 條新原則（原則 1-5），如果不寫下來就會隨 session 蒸發。

**原則陳述**：fork / dogfood / 套用既有 SOP 時，**會浮現原 SOP 沒涵蓋的新 lesson**。這些 lesson 該循以下流程處理：

```
1. 浮現        在 dogfood 過程中察覺
       ↓
2. 凍結        寫進 fork repo 的 decisions/ 或 retrospective
       ↓
3. 評估        是否具有跨 repo 通用性？
       ↓ Yes
4. 回饋        寫成「給 source-of-truth 的補章建議」
       ↓
5. Source-of-truth 維護者
              評估 → 合併 → 升級 source-of-truth
```

**為什麼這條最重要**：personal-playbook 的價值來自「**真實 dogfood 後累積的智慧**」。如果只寫進來、沒有回饋機制，新 lesson 就只能在 fork 本地長存、無法成為下次 fork 的起點。

**今天的具體應用**：
- 本檔（session-close retrospective）= 凍結
- 後續 chat（給 personal-playbook 的回饋建議）= 回饋準備
- 使用者決定是否 merge 進 personal-playbook = source-of-truth 升級

**適用場景**：
- ✅ 個人專案有 source-of-truth SOP repo（如 personal-playbook）
- ✅ 團隊有 internal handbook
- ✅ 開源社群有 governance docs

**反例（不適用）**：
- 一次性專案（沒有跨 repo 累積意圖）
- SOP 本身是外部規範（無法修改）

---

## 反思

### 做得好的

- **QODA 四輪零 backtrack**：sign-off 才動手的紀律完整貫徹，沒有任何重做
- **獨立 sub-agent code review 抓到 5 個問題**：證明這個機制的價值
- **Phase 2.5 治理補強 pattern 成功**：在 P3 完成、P4 開始前插入治理層，沒影響後續進度
- **長期記憶 3 條凍結**：跨 session 知識保留，下次新 repo 任務不會走同樣彎路
- **6 條共通性原則歸納**：把 session 內的隱性 lesson 顯性化、變成可繼承的資產

### 可以更好的

- **decision log 紀律違反 §4.5「即時寫」**：QODA 三輪當下沒寫 decision log，Phase 2.5 才補。**下次應該每輪 QODA 結束立刻寫**
- **新 repo 第一動作沒做 SOP 偵測**：到 P3 才被提醒。已存為長期記憶，下次應該主動偵測
- **WORK_LOG 在 Phase 2.5 寫的版本未含 P4/P5/收工**：收工時要記得回頭補完整。下次或許可以**每完成一個 phase 就追加 WORK_LOG 一段**，而非最後一次寫完
- **截圖未補（README 看一眼成果段為 placeholder）**：因為我無法存取使用者 Workspace 跑 setup，需使用者後續手動補。**未來 fork 流程應該把「需使用者手動補的物件」列清楚**

### 對長期專案的影響

- **本檔成為「**共通性原則萃取**」的範本**：未來其他 fork / 新 repo 結束時可比照本檔結構寫 retrospective
- **6 條原則可考慮回饋 personal-playbook**：使用者評估後決定是否新增章節或補進現有 §
- **dogfood 過程的成本被量化**：~6.5 小時、4 QODA、9 階段、53 檔案。未來新 repo 估時有 reference
- **personal-playbook 的 source-of-truth 設計被深度驗證**：「0 修改抄走」承諾通過真實 fork 場景，可寫進 HISTORY.md §B 案例索引

---

## 對 personal-playbook 維護者的建議

> 以下是「**建議**」、不是「**已動手**」。使用者自行評估是否要把這 6 條原則的部分或全部合進 `personal-playbook/PROJECT_PLAYBOOK.md` 或 `HISTORY.md`。

可能的合併方式：

| 原則 | 建議 merge 位置 | 形式 |
|---|---|---|
| 1. 致謝強度策略 | §二 智慧財產權三件套 新增 §2.5 | 補一段「Fork 場景的致謝升級」 |
| 2. 新 repo 第一問 SOP | §一 新專案第一天清單 新增 1.0 | 「**第一動作：偵測既有 SOP**」 |
| 3. Phase X.5 治理補強 pattern | §一 + §八（為未來預留架構彈性） | 新增 case study 條目 |
| 4. 獨立 sub-agent review | §八 長期維護習慣 新增 §8.7 | 「重大交付前的獨立 review 機制」 |
| 5. QODA 是決策前置 | §5.9 QODA 協作協定 加附註 | 「為什麼這條值」段補本日 4 輪零 backtrack 證據 |
| 6. 共通性原則回饋機制 | HISTORY.md §B 案例索引 新增 §B.X | 把本檔列為「**第一次完整 fork dogfood 案例**」 |

詳細回饋已在 chat 內以「給 personal-playbook 的回饋建議」獨立呈現。
