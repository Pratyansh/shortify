import {readFile} from "fs/promises";
import path from "path"; 
import express from "express";
import { postURLshortener,getshortenerpage, redirectToShortlink } from "../controllers/postshortener.controllers.js";
import { saveLinks,loadLinks } from "../models/shortener.models.js";

const router= express.Router();


router.get("/",getshortenerpage);

router.post("/",postURLshortener)
    
router.get("/:shortCode",redirectToShortlink);


export const shortener_router=router;