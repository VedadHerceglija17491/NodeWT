const express = require("express");
const fs = require('fs');
const bodyParser = require('body-parser');
var multer  = require('multer');
var path = require('path');
let converter = require('json2csv');
 

var app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



const multerConf = {
    storage : multer.diskStorage({
        destination : function(req, file, next){
            next(null, './pdf'); // gdje ce se spasiti pdf
        },
    filename: function(req, file, next){
        const ext = file.mimetype.split('/')[1];
        next(null, req.body.naziv+'.'+ext); // pod kojim ce imenom biti spasen pdf

    }   

    }),
    fileFilter: function (req, file, next){
        if(!file)
        {
            next();
        }
        var nema = true; 
        const ext = file.mimetype.split('/')[1];
        if(ext != "pdf")
        {
            nema = false; //nije pdf
        }
        fs.readdir('./jsons', function(err, files){
            if(err)
            {
                process.exit(1);
            }
            files.forEach(function(file){
                if(req.body.naziv == file.split('Zad.json')[0])
                {
                    nema = false; // vec ima spasen fajl pod tim imenom
                }
            });
            if(nema) // sve ok
            {
                next(null, true);
            }
            else
            {
                next(null, false);
            }
        });
            
    }
};
//zadatak 7
app.get("/zadaci",function(req, res){
    if(req.accepts('json')){
       
           fs.readdir('./jsons', function(err, files){
                if(err){
                    process.exit(1);
                }
                  var niz=[];  // deklaracija niza
                files.forEach(function(file){
                    var obj= require('./jsons/'+file);
                    var objekat = {naziv:obj.naziv, postavka:obj.postavka}; 
                    niz.push(objekat); 
                });
                res.writeHead(200,{'Content-Type':"application/json"});
                res.end(JSON.stringify(niz));
            });
  
    }else if(req.accepts('xml')||req.accepts("text/xml"))
    {
        console.log("uso u xml");
        fs.readdir('./jsons', function(err, files){
            if(err){
                process.exit(1);
            }

            var xmlDocument = '<?xml version="1.0" encoding="UTF-8"?>\n'
            xmlDocument+="<zadaci>\n";
            files.forEach(function(file){
                var obj= require('./jsons/'+file);
               //  xml.ele('zadatak')
             //   .ele('naziv',obj.naziv,'postavka',obj.postavka);
             xmlDocument += "\t<zadatak>\n";
             xmlDocument +="\t\t<naziv>"+obj.naziv +"</naziv>\n"
             xmlDocument +="\t\t<postavka>"+obj.postavka +"</postavka>\n"
             xmlDocument += "\t</zadatak>\n";
                
            });
            xmlDocument+="</zadaci>\n";
            res.writeHead(200,{'Content-Type':"application/xml"});
            res.end(xmlDocument);
           
        });
    }
    else if(req.accepts('csv')){
        

       fs.readdir('./jsons', function(err, files){
          if(err){
                process.exit(1);
            }
            var niz=[];  // deklaracija niza
            files.forEach(function(file){
                var obj= require('./jsons/'+file);
                var objekat = {naziv:obj.naziv, postavka:obj.postavka}; 
                niz.push(objekat); 
            });
         converter.json2csv(niz, function(err,csv){
            res.writeHead(200,{'Content-Type':"application/csv"});
                res.end(csv);
         });
        });
       

    }else{
        fs.readdir('./jsons', function(err, files){
            if(err){
                process.exit(1);
            }
              var niz=[];  // deklaracija niza
            files.forEach(function(file){
                var obj= require('./jsons/'+file);
                var objekat = {naziv:obj.naziv, postavka:obj.postavka}; 
                niz.push(objekat); 
            });
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify(niz));
        });

    }
    });
app.post("/povratak" ,function(req,res){
    let tijelo = req.body;
    console.log(tijelo['godina']);
    var x = tijelo['godina']==='true';
    
    if(x)
    {
        console.log("vraca godinu");
        res.render("addGodina.ejs");
    }
    else
    {
        res.render("addZadatak.ejs");
    }
});
//zadatak 5
app.get("/godine",function(req,res){
    fs.readFile("godine.csv", function(err,content){ //pocetak druge fje
        var niz=[];  // deklaracija niza
        var tekst = content.toString(); // content je sadrzaj datoteke
        var redovi =tekst.split("\n"); // niz stringova, svaki string je red
        if(redovi[0] != "")
        for(var i=0; i<redovi.length;i++)
        {
            var kolone = redovi[i].split(","); // sadrzaj kolona pojedinacnih redova
            var objekat = {nazivGod:kolone[0], nazivRepVje:kolone[1], nazivRepSpi:kolone[2]}; // kreiranje objekta
            niz.push(objekat); // pusanje
        }
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(niz));
    });
});
//zadatak 3
app.get('/zadatak', function(req, res){
        fs.readFile(__dirname +"/pdf/" + req.query.naziv + ".pdf" , function (err,data){
            res.contentType("application/pdf");
            res.send(data);
        });
});
// zadatak 1 i download file
app.get("/:parametar",function(req,res){
    var stranica = req.params.parametar;
    var x = stranica.split('.')[1];
    if(x==="html") // ako je ekstenzija .html
    {
       //provjera da li postoji file uopste
        if (fs.existsSync(__dirname +"/views/"+stranica.split('.')[0]+".ejs")) {
            stranica = stranica.replace(/.html/g, '.ejs');
            res.render(stranica);
        }
   }else if(x==="pdf") // ako je pdf
    {
            fs.readFile(__dirname +"/pdf/" + stranica, function (err,data){
            res.contentType("application/pdf");
            res.send(data);
        });
    }
});
//zadatak 4
app.post("/addGodina",function(req, res){
    let tijelo = req.body;
    fs.readFile("godine.csv", function(err,content){ 
        var tekst = content.toString(); 
        var redovi =tekst.split("\n"); 
        var ok = true;
        var nijePrvi = true;
        for(var i=0; i<redovi.length;i++)
        {
            var kolone = redovi[i].split(","); 
            
            if(redovi.length == 1 && kolone[0] == "")
            {
                nijePrvi = false;
            }
            if(kolone[0] == tijelo['nazivGod'])
            {
                ok = false;
            }
        }
        if(ok)
        {
            let novaLinija;
            if(nijePrvi)
            {
                novaLinija =  "\n" + tijelo['nazivGod']+ "," + tijelo['nazivRepVje'] + "," + tijelo['nazivRepSpi'];
            }
            else
            {
                 novaLinija =   + tijelo['nazivGod']+ "," + tijelo['nazivRepVje'] + "," + tijelo['nazivRepSpi'];
            }
           fs.appendFile("godine.csv",novaLinija,function(err){
                if(err) throw err;
                res.render("addGodina.ejs");
            });
        }
        else{   
            res.render("greska.ejs",{tekst:"godina sa tim nazivom vec postoji",godina:true});
        }
    });
});
// zadatak 2
app.post("/addZadatak", multer(multerConf).single('postavka'),function(req, res, next) {
    // u multerConf su provjere
    if(req.file){
        var objekat = {naziv:req.body.naziv, postavka: "/"+req.body.naziv+".pdf"};  
        //pravimo json objekat
        var json = JSON.stringify(objekat);
        var x = req.body.naziv+"Zad.json";
       
        fs.writeFile('./jsons/'+x, json, 'utf8', function(){
            res.render("addZadatak.ejs")
        });
       }
    else
    {//ako je bila greska
        res.render("greska.ejs",{tekst:"Postoji zadatak sa istim nazivom ili ekstenzija nije .pdf",godina:false});
    }
});  
app.listen(8080,function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    console.log("Server is listening!!!");
});