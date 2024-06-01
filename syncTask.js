/*
 * @Author: Mael mael.liang@live.com
 * @Date: 2024-06-01 10:27:37
 * @LastEditors: Mael mael.liang@live.com
 * @LastEditTime: 2024-06-01 10:38:14
 * @FilePath: /WorkSpace/Script_X/syncTask.js
 * @Description:
 */
const fetch = require("node-fetch");
const fs = require("fs");

const urls = [
  "https://raw.githubusercontent.com/NobyDa/Script/master/NobyDa_BoxJs.json",
  "https://gist.githubusercontent.com/Sliverkiss/a7496bd073820942b44a9b36874aaf4c/raw/sliverkiss.gallery.json",
];

const localJsonFilePath = "QX_Gallery.json"; // 本地 JSON 文件路径
const mergedJsonFilePath = "merged_tasks.json";

async function fetchJsonFile(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

async function mergeJsonFiles() {
  let mergedData = {
    "name": "ZeroLia 任务集合",
    "description": "感谢各大神分享脚本，如有侵权请联系删除",
    "author": "@ZeroLia",
    "icon": "https://avatars.githubusercontent.com/u/7869311",
    "repo": "https://github.com/MaelWeb/Script_X/main",
    "task": []
  };

  if (fs.existsSync(localJsonFilePath)) {
    const mergedData = JSON.parse(fs.readFileSync(localJsonFilePath, "utf-8"));
    mergedData.task.push(...localData.task);
  }

  // 合并远程 JSON 文件
  for (const url of urls) {
    try {
      const data = await fetchJsonFile(url);
      mergedData.task.push(...data.task);
    } catch (error) {
      console.error(error);
    }
  }

  // 合并本地 JSON 文件
  if (fs.existsSync(localJsonFilePath)) {
    const localData = JSON.parse(fs.readFileSync(localJsonFilePath, "utf-8"));
    mergedData = {
      ...mergedData,
      ...localData,
      task: mergedData.task.push(...localData.task)
    }
  }

  // 写入合并后的 JSON 文件
  fs.writeFileSync(mergedJsonFilePath, JSON.stringify(mergedData, null, 2));
}

mergeJsonFiles()
  .then(() => {
    console.log("JSON files merged successfully.");
  })
  .catch((err) => {
    console.error("Error merging JSON files:", err);
  });
