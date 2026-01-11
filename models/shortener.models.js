// import {readFile, writeFile} from "fs/promises";
// import path from "path"; 

// const DATA_FILE = path.join("data", "links.json");

// export const loadLinks = async () => {
//   try {
//     const data = await readFile(DATA_FILE, "utf-8");
//     return JSON.parse(data);
//   } catch (error) {
//     if (error.code === "ENOENT") {
//       await writeFile(DATA_FILE, JSON.stringify({}));
//       return {};
//     }
//     throw error;
//   }
// };

// export const saveLinks = async (links) => {
//     await writeFile(DATA_FILE, JSON.stringify(links));
// };

// import { dbClient } from "../config/db.client.js";
import {db} from "../config/db.client.js"
import {env} from "../config/env.js"

// const db = dbClient.db(env.MONGODB_DATABASE_NAME)
// const shortenerCollection = db.collection("shorteners");

export const loadLinks= async ()=>{
  // return shortenerCollection.find().toArray();
  const [rows] = await db.execute('select * from short_links');
  return rows.map(row => ({ shortCode: row.short_code, url: row.url }));

}
// export const loadLinksArray= async ()=>{
//   return shortenerCollection.find().toArray();
// }

export const insertShortLink=async({url, shortCode})=>{
  // return shortenerCollection.insertOne(link)
  const [result] = await db.execute(`insert into short_links(short_code,url) values(?,?)`,
    [shortCode, url]
  );
  return result;
};

export const getLinkByShortcode= async (ShortCode)=>{
  // return await shortenerCollection.findOne({shortCode:ShortCode});
  const [rows]= await db.execute(`select * from short_links where short_code= ? `,[ShortCode]);

  if (rows.length>0){
    const row = rows[0];
    return { shortCode: row.short_code, url: row.url };
  }
  else{
    return null;
  }

}
