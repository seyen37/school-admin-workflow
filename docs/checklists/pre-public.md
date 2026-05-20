# 公開前審查清單

> 從 personal-playbook §七 抽取的精簡 checklist。repo 從 Private 改 Public 之前必跑。
>
> 本清單**不取代** [`docs/PROJECT_PLAYBOOK.md` §七](../PROJECT_PLAYBOOK.md) 完整版，是給 fork 者或新 contributor 快速使用的精簡版。

---

## 1. Secret 稽核

```bash
# 搜尋常見 secret 關鍵字
git grep -i "password\|secret\|api_key\|token\|credentials" -- ":!docs/" ":!*.md"

# 確認 .env / config.gs / config.local.* 在 .gitignore
grep -E "^\.env$|^.*config.gs|config\.local" .gitignore
```

- [ ] 沒有 hardcoded API key / token / password
- [ ] `src/config.gs` 在 `.gitignore` 中
- [ ] `*.local.*` pattern 在 `.gitignore` 中

---

## 2. 個資稽核

```bash
# email 殘留掃描
grep -rn "@gmail\|@hotmail\|@yahoo\|@outlook\|@example.com\|@your-domain" \
  --include="*.md" --include="LICENSE" --include="*.gs"

# 台灣手機 / 市話
grep -rEn "09[0-9]{8}|0[2-8]-?[0-9]{6,8}" --include="*.md" --include="*.gs"

# Drive Folder ID / Calendar ID（可能誤 commit 的學校資源）
grep -rEn "[a-z0-9]+@group\.calendar\.google\.com" --include="*.md" --include="*.gs"
```

- [ ] 沒有真實的 Drive Folder ID
- [ ] 沒有真實的 Calendar ID（`xxxxx@group.calendar.google.com`）
- [ ] 沒有真實的學校 Email（`@*.edu.tw`、`@*.sch.ad`）
- [ ] 沒有承辦人或學生姓名
- [ ] 沒有真實的學校名稱（除非已得到該校同意公開）
- [ ] `git config user.email` 用 GitHub noreply

```bash
# 確認 commit metadata 沒暴露實名 email
git log --all --format="%ae" | sort -u
```

預期看到只有 `<numeric-id>+<username>@users.noreply.github.com`。若有實名 email，討論是否要 rewrite history（成本權衡見 [PROJECT_PLAYBOOK.md §七 lesson](../PROJECT_PLAYBOOK.md)）。

---

## 3. 授權稽核

- [ ] LICENSE 存在
- [ ] LICENSE 內姓名格式：中文實名 + 羅馬拼音 + GitHub URL
- [ ] 原作 mihozip 的 copyright 完整保留
- [ ] ACKNOWLEDGEMENTS.md 顯眼列出原作
- [ ] 第三方資料 / 字型 / 圖片若有引用，都有 attribution
- [ ] 拷貝來的程式碼有註明來源 + 原 license

---

## 4. 文件稽核

- [ ] README 第一段能讓陌生人 30 秒理解專案（痛點 hook + 它能幫你做什麼）
- [ ] 安裝指令確認可重現（跟著 docs/00-quickstart.md 跑可以成功）
- [ ] 至少一份 `docs/decisions/` 已寫好（本 repo 已有三份）
- [ ] CHANGELOG.md 反映目前狀態

---

## 5. CI / 自動化稽核

- [ ] `.github/workflows/secret-scan.yml` 存在且能跑
- [ ] GitHub Actions 沒有暴露 secrets（用 `${{ secrets.X }}` 而非 hardcoded）

---

## 6. 公開前最後一步

- [ ] 跑一遍 `setupAdminWorkflow()` 確認還能用
- [ ] 跑一遍 `testDriveFolder()` 與 `testSendMail()` 確認權限正常
- [ ] 在 GitHub Settings → General → Danger Zone 切到 Public
- [ ] 切到 Public 後立刻檢查 GitHub Actions 是否仍綠燈

---

## 觸發時機

跑這份 checklist 的時機：

- ✅ 第一次從 Private 改 Public 前
- ✅ 大幅修改後（例如 P1-P4 重新設計完成）
- ✅ 新增 dataset / 字型 / 圖庫的 commit 後
- ✅ 接收外部 contributor 的 PR 後（特別注意第 1-2 項）
- ✅ 每次 release tag 前

---

## 跑完都綠才能 push public 的 commit

> 「公開前的 5 分鐘 audit，省下未來 5 小時的解釋與防衛工作。」
> — [personal-playbook §十一](../PROJECT_PLAYBOOK.md)
