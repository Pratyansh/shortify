import {createServer} from "http";
import {readFile, writeFile} from "fs/promises";
import crypto from "crypto";
import path from "path"; 

const port=3000;
const DATA_FILE = path.join("data", "links.json");


const serveFile = async (res, filePath, contentType)=>{
    try{
        const data = await readFile(filePath, "utf-8");
        res.writeHead(200, {"Content-type":contentType});
        res.end(data);
        }
    catch{
        res.writeHead(404,{"Content-type":"text/plain"});
        res.end("404 Page not found");
    }
};

const loadLinks = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
    throw error;
  }
};

const saveLinks = async (links) => {
  await writeFile(DATA_FILE, JSON.stringify(links));
};

const server = createServer(async (req,res)=>{
    console.log("➡️ REQUEST:", req.method, req.url);
    if (req.method==='GET'){
        // if (req.url==='/'){
        //     try{
        //         const data = await readFile(path.join("public","index.html"), "utf-8");
        //         res.writeHead(200, {"Content-type":"text/html"});
        //         res.end(data);
        //     }
        //     catch{
        //         res.writeHead(404,{"Content-type":"text/html"});
        //         res.end("404 Page not found");
        //     }
        // }
        // else if(req.url==='/style.css'){
        //     try{
        //         const data = await readFile(path.join("public","style.css"), "utf-8");
        //         res.writeHead(200, {"Content-type":"text/css"});
        //         res.end(data);
        //     }
        //     catch{
        //         res.writeHead(404,{"Content-type":"text/html"});
        //         res.end("404 Page not found");
        //     }
        // }


        if (req.url==='/'){
            return serveFile(res, path.join("public","index.html"),"text/html");
        }
        else if(req.url==='/style.css'){
            return serveFile(res, path.join("public","style.css"),"text/css");
        }
        else if (req.url === "/links") {
            const links = await loadLinks();
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(links));
        }
        else {
            const links = await loadLinks();
            const shortCode = req.url.split("?")[0].slice(1);
            console.log("links red. ", req.url);

            if (links[shortCode]) {
            res.writeHead(302, { location: links[shortCode] });
            return res.end();
            }

            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({error:"Shortened URL is not found"}));
        }

    }

    if(req.method==="POST" && req.url==="/shorten"){ 
        console.log("Post /shorten HIT")
        const links = await loadLinks();
        let body="";
        req.on("data",(chunk)=>{
            console.log(`Chunks = ${chunk}`);   
            body= body+chunk;
        })
        req.on("end",async()=>{
            console.log(`End hua \n`);
            try{
            console.log(body);
            const {url, shortCode}=JSON.parse(body);
            if (!url){
                res.writeHead(400,{"Content-Type":"text/plain"});
                return res.end("Url is a required input");
            }

        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

      if (links[finalShortCode]) {
        res.writeHead(400, { "Content-Type": "text'plain" });
        return res.end("Short code already exists. Please choose another.");
      }

      links[finalShortCode] = url;

      await saveLinks(links);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, shortCode: finalShortCode }));
    }
    catch(err){
        res.writeHead(500,{"Content-Type":"applicaion/json"});
        res.end(JSON.stringify({error:"Server Error.."}))
    }
    });
    }


}).listen(port,()=>{
    console.log(`Server running at http:localhost:${port}`);
    
})