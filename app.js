import {createServer} from "http";
import {readFile} from "fs/promises";
import path from "path"; 

const port=3000;

const server = createServer(async (req,res)=>{

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

        const serveFile = async (res, filePath, contentType)=>{
            try{
                const data = await readFile(filePath, "utf-8");
                res.writeHead(200, {"Content-type":contentType});
                res.end(data);
            }
            catch{
                res.writeHead(404,{"Content-type":"text/html"});
                res.end("404 Page not found");
            }
        }

        if (req.url==='/'){
            return serveFile(res, path.join("public","index.html"),"text/html");
        }
        else if(req.url==='/style.css'){
            return serveFile(res, path.join("public","style.css"),"text/css");
        }

    }
}).listen(port,()=>{
    console.log(`Server running at http:localhost:${port}`);
    
})