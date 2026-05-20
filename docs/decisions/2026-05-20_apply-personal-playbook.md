# 2026-05-20：套用 personal-playbook 核心原則（meta-decision）

> 範圍：在 P3 完成、P4 開始前，將 personal-playbook §一-§十 的核心原則套用到 admin-project-workflow，補齊「第一天清單」缺漏的治理結構。
>
> 起點：admin-project-workflow 已完成 P1 骨架 / P2 文件 / P3 程式三輪，但缺 docs/decisions/、WORK_LOG、PROJECT_PLAYBOOK 引用、LICENSE 真名等治理層元素。
> 終點：套用 O2「核心套用（不含個人慣例）」，補齊治理缺口後再進 P4。
>
> 對應 commits：
> - `<未推>` docs: apply personal-playbook governance (decisions/_TEMPLATE, init log, work log, LICENSE identity)

---

## 決策 1：該不該套用 personal-playbook？

**情境**：personal-playbook README 明示「新建 GitHub 專案的第一天：把 PROJECT_PLAYBOOK.md 複製到新 repo 的 docs/」。admin-project-workflow 走到 P3 才被使用者提醒「依此原則做修正」。是時候動了。

**選項**：
- A. **不套用**：admin-project-workflow 是 fork，跟 personal-playbook 規範解耦
- B. **僅套用 LICENSE 真名**（最小程度）
- C. **核心套用**：抄 PROJECT_PLAYBOOK + decisions + WORK_LOG + LICENSE + README 開發脈絡 + pre-public checklist
- D. **完整套用**：含 C 全部 + 雙帳號備份 SOP + 機構 AI mission 章節等

**決定**：選 C（即 O2）。

**考量**：
1. A 違背 personal-playbook 「source-of-truth 文件設計成可被任何新 repo 直接套用」的初衷——使用者自己寫的 SOP 不套自己的新 repo 等於白寫
2. B 太單薄，沒抄 PROJECT_PLAYBOOK 等於沒套
3. **C 把「核心原則」（決策日誌 / 工作紀錄 / 身份鏈 / 公開前審查）做進去，個人慣例（雙帳號）留 backlog**——既符合 playbook，又保持 admin-project-workflow 對其他學校 fork 者的中立性
4. D 把雙帳號 SOP 包進來會讓非個人使用者困惑「我為什麼要設 seyenbot」——個人慣例不應該汙染工具 repo

**教訓**：
- **SOP 文件分層套用**：核心原則（普世）必抄，個人慣例（情境特定）視情況。判準是「fork 者是否需要這條」。
- **personal-playbook README 的「抄走 / 不抄」表是設計上的精華**：把「source-of-truth 自用」與「fork 可抄」明確區分，是治理文件的關鍵設計。

---

## 決策 2：套用時序——先 P4 再補 vs 先補再 P4 vs 並行

**情境**：套用 playbook 需要 ~1.5 小時，跟 P4（教材 + 範例 + 貢獻規範）大約等量。先做哪個？

**選項**：
- A. **先 P4 再補 playbook**：先把內容做完，治理層之後補
- B. **先補 playbook 再 P4** ★ 推薦
- C. **並行（兩線同時做）**

**決定**：選 B。

**考量**：
1. A 風險：P4 開始時若沒先建好 docs/decisions/ 結構，P4 自己的決策（教材選什麼風格、範例怎麼去識別化）會沒地方寫，又得補 → 兩次工
2. **B 把治理結構先建好，P4 開始就能即時把決策寫進 decisions/**——對應 personal-playbook §4.5「decision log 值得即時寫」原則
3. C 並行需要 context switch，會降低兩個任務的品質
4. B 也對應「**先把第一天清單做完，再做後續內容**」的 §一 精神——admin-project-workflow 等於補做「遲到的第一天」

**教訓**：
- **治理結構先於內容生產**：先把「怎麼記」的格式定好，再開始記，比「記了再來想格式」省力
- **遲到的第一天清單 > 永遠沒做的第一天清單**：發現缺漏的當下補上，比繼續往前推進累積技術債好

---

## 決策 3：PROJECT_PLAYBOOK.md 抄到哪、要不要改？

**情境**：personal-playbook README 規定「**抄到 docs/PROJECT_PLAYBOOK.md**」、「**0 修改可用**」、「最多換掉附錄 B / J.5 LICENSE 範本內的個人姓名」。要嚴格遵守還是改寫？

**選項**：
- A. **0 修改、原檔抄**（嚴格遵守 source-of-truth）
- B. 抄但改掉所有個人專屬內容（stroke-order、DogLab 等案例）
- C. 抄到自訂位置（不是 docs/PROJECT_PLAYBOOK.md）
- D. 不抄，自寫一份精簡版

**決定**：選 A。

**考量**：
1. A 對應 personal-playbook 已完成的「PROJECT_PLAYBOOK / HISTORY 拆分」設計——拆分後 PROJECT_PLAYBOOK.md 已經是「抽象化、去除自身印記」的乾淨版，可以 0 修改抄
2. B 重複勞動：personal-playbook 已做過抽象化，再改一次浪費
3. C 違反 source-of-truth 命名約定，未來他人想對照原作會找不到
4. D 等於沒套 playbook，等於決策 1 的方案 A
5. 唯一可考慮微調：附錄 J.5 LICENSE 範本內的個人姓名——但 admin-project-workflow 的 LICENSE 已經分開處理，不需要改 PROJECT_PLAYBOOK 內容

**教訓**：
- **嚴守 source-of-truth 的「零修改可用」承諾**：每次微調就是給未來自己的維護負擔。原作者（使用者本人）已經把抽象化做好，fork 者（我）應該信任
- **抄 vs 改的決策應該前置**：在 README 規範裡就規定「0 修改」，避免每次 fork 都重新討論

---

## 決策 4：LICENSE 真名格式

**情境**：第一版 LICENSE 寫成「本 repo 維護者」placeholder。personal-playbook §2.1 規定真名格式：中文實名 + 羅馬拼音 + GitHub URL + 年份。

**選項**：
- A. `許士彥 (Hsu Shih-Yen) — https://github.com/seyen37` ★ 使用者選定
- B. `Albert Peng` 風格（跟原作對應、但不是使用者真名）
- C. 使用者 handle `seyen37` 不加實名
- D. 完全匿名

**決定**：選 A（使用者明確選擇）。

**考量**：
1. A 完整符合 personal-playbook §2.1 規範：中文實名 + 羅馬拼音（國際合作友善）+ GitHub URL（活的證據鏈）+ 年份（首次公開年 2026）
2. B 跟原作姓名近似但不真實，會造成混淆
3. C 用 handle 不夠正式，法律文件要求可指認的個人身份
4. D 完全匿名違反 personal-playbook 「身份鏈」原則
5. A 也對應 personal-playbook §二「身份鏈三件套」LICENSE / README / footer 三處同步

**教訓**：
- **法律文件的真名是策略而非弱點**：實名 + 羅馬拼音 + GitHub URL 三點立體證據，比匿名更能保護著作權
- **避免在 LICENSE 寫 email**：personal-playbook §2.1 明確警告 email 會被爬蟲，本 fork 嚴格遵守

---

## 反思

**做得好的**：
- **使用者點明問題後 30 秒內就承認缺漏**：沒有辯解「P1/P2/P3 已經夠了」，而是直接讀 personal-playbook 找差距
- **用對齊缺口表呈現現況**：把 12 條缺口分 🔴🟡🟢 三級，使用者能快速理解優先序
- **QODA 同樣套用到 meta-decision 上**：不是「我就抄了」，而是先給 O1/O2/O3 三方案讓使用者選

**可以更好的**：
- **應該在 P1 開始前就做「第一天清單核取」**：personal-playbook §1.1 明確列出 LICENSE / .gitignore / docs/ / docs/decisions/ + _TEMPLATE.md，我跳過了 decisions 部分
- **對「使用者已知 SOP」的偵測機制不夠主動**：使用者有 personal-playbook 這份明顯資產（資料夾名 `personal-playbook` 已經是信號），我應該在接到「重新設計新 repo」任務時主動問「你有沒有自己的 SOP？」
- **沒有在 P1/P2/P3 過程中即時記決策日誌**：QODA 三輪在當下沒被寫成 .md，Phase 2.5 才補回——違反 personal-playbook §4.5「即時寫」原則

**對長期專案的影響**：
- **admin-project-workflow 成為 personal-playbook 第一個外部 fork dogfooding 案例**：實證「source-of-truth 文件真的可以被新 repo 直接套用」
- **建立「Phase 2.5 治理補強」這個 pattern**：未來其他 fork 若也跳過第一天清單，可以用同樣 phase 補上，不必整個重做
- **對 AI 助手（我）的長期教訓**：接到「新 repo」任務時，第一個問題應該是「使用者有沒有自己的 SOP / playbook？」，而不是「該寫什麼」
- **未來其他 fork 不必再走這個彎路**：本 decision log 標明「先補再做後續」是最省力路徑，後人可直接套用
