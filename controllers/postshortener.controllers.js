import crypto from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import { saveLinks,loadLinks } from "../models/shortener.models.js";

export const getshortenerpage=async(req,res)=>{
    try {
        const links = await loadLinks();
        res.render("index",{links,host:req.host})

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}

export const postURLshortener = async(req,res)=>{
    try {
        const {url, shortCode}=req.body;
        const links = await loadLinks();
        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
        
        if (links[finalShortCode]) {
            res.status(400).send("Short code already exists. Please choose another.")
        }
        links[finalShortCode] = url;
        await saveLinks(links)
        return res.redirect("/");
        }
      catch (error) {
     }  
    }

    export const redirectToShortlink=async(req, res)=>{
        try{
            const {shortCode}=req.params;
            const links= await loadLinks();
            if(!links[shortCode]) return res.status(404).send("Error 404 occurred");
            return res.redirect(links[shortCode]);
        }
        catch(err){
        console.log(err);
        res.status(500).send("Internal server error"); 
    }       
}