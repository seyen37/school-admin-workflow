/**
 * folders.gs — Drive 資料夾建立與管理
 *
 * 11 個專案子資料夾的命名規約定義在這裡，
 * 編號順序對應行政工作的時間軸：00 公文 → 01-09 流程 → 99 系統產生
 */

// 11 個子資料夾的命名規約
const PROJECT_SUBFOLDERS = [
  '00_原始公文與附件',
  '01_計畫書與核定資料',
  '02_工作分工與會議紀錄',
  '03_表單與回覆資料',
  '04_經費與採購核銷',
  '05_活動照片與照片說明',
  '06_成果資料與成果報告',
  '07_公告通知與對外文字',
  '08_簡報與成果展示',
  '09_檢討與下次改進',
  '99_系統產生文件'
];

// setup 時建立的根層子資料夾
const ROOT_LEVEL_FOLDERS = [
  '01_公文專案啟動表',
  '02_專案總控表',
  '03_專案資料夾',
  '04_專案階段日期新增表',
  '06_Apps Script'
];

/**
 * 在 parent 底下找名稱為 name 的子資料夾，沒有就建立
 * 同名重複時取第一個（並寫入警告 log）
 */
function getOrCreateSubFolder(parent, name) {
  const folders = parent.getFoldersByName(name);
  if (folders.hasNext()) {
    const first = folders.next();
    if (folders.hasNext()) {
      log('警告：父資料夾「' + parent.getName() + '」下有多個「' + name + '」，已取第一個');
    }
    return first;
  }
  return parent.createFolder(name);
}

/**
 * setup 階段：在總資料夾下建立 5 個根層子資料夾
 */
function ensureRootLevelFolders(rootFolder) {
  const result = {};
  ROOT_LEVEL_FOLDERS.forEach(function (name) {
    result[name] = getOrCreateSubFolder(rootFolder, name);
  });
  return result;
}

/**
 * 為新專案建立完整資料夾結構
 * 回傳 { projectFolder, subFolders: { '00_原始公文與附件': Folder, ... } }
 */
function createProjectFolderStructure(year, office, projectName) {
  const rootFolder = DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);
  const projectsParent = getOrCreateSubFolder(rootFolder, '03_專案資料夾');

  const folderName = sanitizeFileName(year + '_' + office + '_' + projectName);
  const projectFolder = projectsParent.createFolder(folderName);

  const subFolders = {};
  PROJECT_SUBFOLDERS.forEach(function (name) {
    subFolders[name] = projectFolder.createFolder(name);
  });

  return { projectFolder: projectFolder, subFolders: subFolders };
}

/**
 * 把檔案從根目錄（剛 create 出的位置）搬到目標資料夾
 * GAS 的 DocumentApp.create / SpreadsheetApp.create 預設放在根目錄
 */
function moveFileToFolder(fileId, targetFolder) {
  const file = DriveApp.getFileById(fileId);
  targetFolder.addFile(file);

  // 從根目錄移除（不刪除檔案本身）
  const parents = file.getParents();
  while (parents.hasNext()) {
    const p = parents.next();
    if (p.getId() !== targetFolder.getId()) {
      try {
        p.removeFile(file);
      } catch (err) {
        log('moveFileToFolder warning: ' + err.message);
      }
    }
  }
  return file;
}

/**
 * 為 reset 流程用：把資料夾搬到「99_系統封存_yyyyMMdd/」
 * 不直接刪除，保留作紀錄
 *
 * 回傳 { archiveFolder, moved: boolean }
 * moved=false 表示新版 DriveApp 不支援 addFolder/removeFolder，
 * 此時資料夾仍在原位置，呼叫端需明確告知使用者去手動搬移。
 */
function archiveFolder(folder, rootFolder) {
  if (!folder) return { archiveFolder: null, moved: false };

  const archiveName = '99_系統封存_' + nowStamp('yyyyMMdd');
  const archiveFolder = getOrCreateSubFolder(rootFolder, archiveName);

  // GAS V8 已棄用 addFolder/removeFolder；用 Drive Advanced Service 較穩
  // 為避免 lib 必須啟用 Drive Service，保留 fallback 行為並回傳明確結果
  try {
    archiveFolder.addFolder(folder);
    const parents = folder.getParents();
    while (parents.hasNext()) {
      const p = parents.next();
      if (p.getId() !== archiveFolder.getId()) {
        try { p.removeFolder(folder); } catch (e) { /* noop */ }
      }
    }
    return { archiveFolder: archiveFolder, moved: true };
  } catch (err) {
    log('archiveFolder fallback：addFolder/removeFolder 不可用，資料夾「' +
        folder.getName() + '」仍在原位置，請手動搬到「' +
        archiveName + '」。錯誤：' + err.message);
    return { archiveFolder: archiveFolder, moved: false };
  }
}
