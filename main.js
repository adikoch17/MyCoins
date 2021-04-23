const {app,BrowserWindow} = require('electron');
const express = require('express');
const expApp = express();
const fs =require('fs');

expApp.use(express.json());
expApp.listen(3000, () =>{
    console.log("connected to server");
})

var toTrack = [];



expApp.get('/onStart',(req,res)=>{

    let inp = fs.readFileSync('./track.txt','utf-8');
    let inpArr = inp.split(',');
    toTrack = inpArr;

    res.send({data:toTrack});

});



expApp.post('/addToTrack',(req,res)=>{

    let bod = req.body
    toTrack.push(bod.data);
    let x= toTrack.toString();

    var writeFile = fs.writeFileSync('./track.txt',x,'utf-8');
    res.send({message:"added"});

});


expApp.post('/delete',(req,res)=>{

    let bod = req.body
    let cName = bod.data;
    let i = toTrack.indexOf(cName);
    toTrack.splice(i,1);
    let x = toTrack.toString()
    var writeFile = fs.writeFileSync('./track.txt',x,'utf-8');
    res.send({message:"deleted"});

});







function createWindow(){
    const win = new BrowserWindow({
        width:600,
        height: 700,
        icon:'./assets/btc_eLq_icon.ico'
    });
    win.loadFile("index.html");
}

app.whenReady().then(()=>{
    createWindow();

    app.on('activate', ()=>{
        if(BrowserWindow.getAllWindows().length ===0){
            createWindow();
        }
    });
});

app.on('window-all-closed',()=>{
    if(process.platform!=='darwin'){
        app.quit();
    }
});

