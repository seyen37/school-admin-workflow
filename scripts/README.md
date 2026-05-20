# scripts/ — 輔助工具

非主流程的輔助工具放在這裡。

## 規劃

- `generate-installer.php` — 原作的 PHP 產生器，在本 fork 中**降級為可選工具**。對主流程不必要，純粹給想批次生成多個學校客製版本的人使用。
- 可能加入 `dev-tools/` 給開發者使用的測試腳本（單元測試、模擬資料產生器）

> **重要**：核心安裝流程不依賴 PHP。請參考 [docs/00-quickstart.md](../docs/00-quickstart.md) 直接複製 `src/Code.gs` 即可。
