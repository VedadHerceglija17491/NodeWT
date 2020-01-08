var GodineAjax = (function(){
    var konstruktor = function(divSadrzaj){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200)
            {
                var arrayJson = JSON.parse(ajax.responseText);
                var htmlGodine = "";
                if(arrayJson.length >= 1) 
                for(var i = 0; i < arrayJson.length; i++)
                {
                    htmlGodine +='<div class="godina">'+
                    " <br>"+    
                     "<h4>"+arrayJson[i].nazivGod+"</h4>"+
                     "<p><strong>Naziv repozitorija vježbe: "+arrayJson[i].nazivRepVje+"</strong> "
                     +"<br>"
                    +" <strong>Naziv repozitorija spirale: "+arrayJson[i].nazivRepSpi+"</strong> "
                     +"<br>"+
                    "</p>"+
                    " </div>"
                }
               divSadrzaj.innerHTML = htmlGodine;
            }
            if (ajax.readyState == 4 && ajax.status == 404)
            {

            }
        }
        ajax.open("GET", "http://localhost:8080/godine", true);
        ajax.send();
    return {
    osvjezi:function(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200)
            {
                var arrayJson = JSON.parse(ajax.responseText);
                var htmlGodine = "";
                if(arrayJson.length >= 1) 
                for(var i = 0; i < arrayJson.length; i++)
                {
                    htmlGodine +='<div class="godina">'+
                    " <br>"+    
                     "<h4>"+arrayJson[i].nazivGod+"</h4>"+
                     "<p><strong>Naziv repozitorija vježbe: "+arrayJson[i].nazivRepVje+"</strong> "
                     +"<br>"
                    +" <strong>Naziv repozitorija spirale: "+arrayJson[i].nazivRepSpi+"</strong> "
                     +"<br>"+
                    "</p>"+
                    " </div>"
                }
               divSadrzaj.innerHTML = htmlGodine;
            }
            if (ajax.readyState == 4 && ajax.status == 404)
            {

            }
        }
        ajax.open("GET", "http://localhost:8080/godine", true);
        ajax.send();

    }
        }
    }
    return konstruktor;
    }());



