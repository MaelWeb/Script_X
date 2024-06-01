/*
 * @Author: Mael mael.liang@live.com
 * @Date: 2024-06-01 10:27:37
 * @LastEditors: Mael mael.liang@live.com
 * @LastEditTime: 2024-06-01 11:55:55
 * @FilePath: /WorkSpace/Script_X/syncTask.js
 * @Description:
 */
import axios from "axios";
import { jsonrepair } from "jsonrepair";
import fs from "fs";

const urls = [
  "https://raw.githubusercontent.com/NobyDa/Script/master/NobyDa_BoxJs.json",
  "https://gist.githubusercontent.com/Sliverkiss/a7496bd073820942b44a9b36874aaf4c/raw/sliverkiss.gallery.json",
];

const localJsonFilePath = "QX_Gallery.json"; // 本地 JSON 文件路径

// async function fetchJsonFile(url) {
//   const response = await fetch(url);
//   console.log("🔥 ~ fetchJsonFile ~ response:",url, response);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
//   }
//   const data = await response.json();
//   return data;
// }

async function fetchJsonFile(url) {
  try {
    const response = await axios.get(url);
    let data = response.data;

    // 处理返回的数据是字符串形式的 JSON
    if (typeof data === "string") {
      data = JSON.parse(jsonrepair(data));
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
}

async function mergeJsonFiles() {
  let mergedData = {
    "name": "ZeroLia 任务集合",
    "description": "感谢各大神分享脚本，如有侵权请联系删除",
    "author": "@ZeroLia",
    "icon": "https://avatars.githubusercontent.com/u/7869311",
    "repo": "https://github.com/MaelWeb/Script_X/main",
    "task": [],
  };

  let localData = {};
  if (fs.existsSync(localJsonFilePath)) {
    localData = JSON.parse(fs.readFileSync(localJsonFilePath, "utf-8"));
  }

  // 合并远程 JSON 文件
  for (const url of urls) {
    try {
      const data = await fetchJsonFile(url);
      mergedData.task.push(...data.task);
    } catch (error) {
      console.error("🔥 ~ mergeJsonFiles ~ error:", url, error);
    }
  }


  mergedData = {
    ...mergedData,
    ...localData,
    task: [...mergedData.task, ...localData.task],
  };


  // 写入合并后的 JSON 文件
  fs.writeFileSync(localJsonFilePath, JSON.stringify(mergedData, null, 2));
}

mergeJsonFiles()
  .catch((err) => {
    console.error("Error merging JSON files:", err);
  });
