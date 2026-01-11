import crypto from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import { insertShortLink,loadLinks, getLinkByShortcode } from "../models/shortener.models.js";

export const getshortenerpage=async(req,res)=>{
    try {
        const links = await loadLinks();
        // console.log(links);
        
        res.render("index",{links,host:req.host})

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}

export const postURLshortener = async(req,res)=>{
    try {
        // console.log(`${JSON.stringify(req.body)}`);
        
        const {url, shortCode}=req.body;
        const links = await loadLinks();
        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

        const existingLink = links.find(link => link.shortCode === finalShortCode);
        if (existingLink) {
            return res.status(400).send(`<h1> URL with that short code already exists. Please choose another. <a href="/">Go Back</a></h1>`)
        }
        // links[finalShortCode] = url;
        // await saveLinks(links)
        await insertShortLink({url, shortCode: finalShortCode});
        return res.redirect("/");
        }
      catch (error) {
        console.error(error);
        return res.status(500).send("Error occurred in posting the form");
     }
    }

    export const redirectToShortlink=async(req, res)=>{
        try{
            // const {shortCode}=req.params;
            // const links= await loadLinks();
            // if(!links[shortCode]) return res.status(404).send("Error 404 occurred");
            // return res.redirect(links[shortCode]);
            const {shortCode}=req.params;
            const link = await getLinkByShortcode(shortCode);
            if(!link) return res.status(404).send("Error 404 occurred");
            return res.redirect(link.url);
        }
        catch(err){
        console.log(err);
        res.status(500).send("Internal server error"); 
    }       
}