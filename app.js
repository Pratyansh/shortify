import express from "express";
import { shortener_router } from "./routes/shortener_routes.js";

const app=express();

const PORT=process.env.PORT || 3000;


app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(shortener_router);

app.set("view engine", "ejs");
// app.set("views","./views");

app.listen(PORT,()=>{
    console.log(`Server running at http:localhost:${PORT}`);
    
})