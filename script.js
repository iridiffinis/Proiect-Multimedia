import date from "./media/eurostat.json" assert{type:"json"}
// console.log(date);


let graf1 = document.getElementById("graf1");
let pib = [];
let x=6,y=0;
let w=30;
let h = 400- 10;
let spatiu = 12;

// let canvas = document.getElementById("canvas");
// let ctx = canvas.getContext("2d");
// let cW = canvas.clientWidth;
// let cH = canvas.clientHeight;
// let mapPIB = new Map();
// let mapSV = new Map();
// let mapPop = new Map();

let select = document.getElementById("tara");
let tara;
select.onchange = function()
{
    tara = document.getElementById("tara").value;
    stergereSVG();
    preluareDate(tara);
    console.log(tara);
    construireGrafic(pib);
    console.log(pib);
}

function stergereSVG()
{
    graf1.innerHTML="";
    x=6;y=0;
}

function preluareDate(taraSelectata)
{
    pib = [];
    for (const i in date) 
    {
        if (date[i].indicator =="PIB" && date[i].tara == taraSelectata)
        {
            for (let j = 2000; j<=2018; j++)
            {
                if(date[i].an ==j)
                {
                    pib.push(date[i].valoare);
                    console.log(date[i].valoare);
                }
            }
        }
    }
    return pib;
}

function construireGrafic(pibTara)
{
    var v=[];
    var max = Math.max(...pibTara);
    console.log("max ="+max);
    for (var i in pibTara)
    {
        v.push(pibTara[i]*h/max);
    }
    console.log(v);

    for(var i in v)
    {
        var baraNoua = document.createElementNS("http://www.w3.org/2000/svg","rect");
        var tooltip = document.createElementNS("http://www.w3.org/2000/svg","title");
        var an = 2000+parseInt(i);
        tooltip.textContent = "PIB pe cap de locuitor: " + pibTara[i] +"; "+"anul: " +an;
        baraNoua.setAttributeNS(null,"x",x);
        y = (h - v[i])+5;
        baraNoua.setAttributeNS(null,"y",y);
        baraNoua.setAttributeNS(null,"width",w);
        baraNoua.setAttributeNS(null,"height",v[i]);
        x=x+w+spatiu;

        graf1.appendChild(baraNoua);
        baraNoua.appendChild(tooltip);
    }
}



let selectAn = document.getElementById("an");
let an;
selectAn.onchange = function()
{
    an = document.getElementById("an").value;
    console.log(an); //string
    stergereTabel();
    preluareDateAn(an);
    
    
}

let continutTabel = document.createElement("tbody");
// let rand, celtara, celPIB, celSV, celPop;
document.getElementById("tabel").appendChild(continutTabel);

let medieSV = 0;
let mediePOP = 0;
let mediePIB = 0;

function preluareDateAn(anSelectat)
{
    // for(let i in date)
    // {
    //     rand = continutTabel.insertRow();
        
    //     if(date[i].an == anSelectat)
    //     {
    //         celtara = rand.insertCell();
    //         celtara.innerHTML = date[i].tara;
    //         var tara = date[i].tara;

    //         celPIB = rand.insertCell();
    //         celSV = rand.insertCell();
    //         celPop = rand.insertCell();
    //         if (date[i].indicator =="SV")
    //         {
    //             celSV.innerHTML = date[i].valoare;
    //         }
    //         if (date[i].indicator =="POP")
    //         {
    //             celPop.innerHTML = date[i].valoare;
    //         }
    //         if (date[i].indicator =="PIB")
    //         {
    //             celPIB.innerHTML = date[i].valoare;
    //         }


            
    //     }
    // }


    const dateTari = {};

    for (let i in date) {
        if (date[i].an == anSelectat) {
            const tara = date[i].tara;

            console.log(tara);

            if (!dateTari[tara]) {
                dateTari[tara] = { tara, PIB: null, SV: null, POP: null };
            }

            if (date[i].indicator == "SV") {
                dateTari[tara].SV = date[i].valoare;
                medieSV = medieSV + date[i].valoare;
            } else if (date[i].indicator == "POP") {
                dateTari[tara].POP = date[i].valoare;
                mediePOP = mediePOP + date[i].valoare;
            } else if (date[i].indicator == "PIB") {
                dateTari[tara].PIB = date[i].valoare;
                mediePIB = mediePIB + date[i].valoare;
            }

        }
    }

    medieSV = medieSV/27;
    mediePOP = mediePOP/27;
    mediePIB = mediePIB/27;
    console.log(medieSV);
    console.log(mediePOP);
    console.log(mediePIB);

    let sqdifPIB = 0;
    let sqdifPOP = 0;
    let sqdifSV = 0;

    for (let i in date) {
        if (date[i].an == anSelectat) {

            if (date[i].indicator == "SV") {
                sqdifSV = sqdifSV + (date[i].valoare - medieSV)**2;
                
            } else if (date[i].indicator == "POP") {
                sqdifPOP = sqdifPOP + (date[i].valoare - mediePOP)**2;
                
            } else if (date[i].indicator == "PIB") {
                sqdifPIB = sqdifPIB + (date[i].valoare - mediePIB)**2;
                
            }

        }
    }

    let sSV = Math.sqrt(sqdifSV/26);
    let sPOP = Math.sqrt(sqdifPOP/26);
    let sPIB = Math.sqrt(sqdifPIB/26);

    console.log("deviatie standard:");
    console.log(sSV);
    console.log(sPOP);
    console.log(sPIB);

    for (const tara in dateTari) {
        const rowData = dateTari[tara];
        const row = continutTabel.insertRow();

        const celtara = row.insertCell();
        const celPIB = row.insertCell();
        const celSV = row.insertCell();
        const celPop = row.insertCell();

        celtara.innerHTML = rowData.tara;
        celPIB.innerHTML = rowData.PIB !== null ? rowData.PIB : "";
        celSV.innerHTML = rowData.SV !== null ? rowData.SV : "";
        celPop.innerHTML = rowData.POP !== null ? rowData.POP : "";

        const zPIB = Math.abs((rowData.PIB - mediePIB)/sPIB);
        const zSV = Math.abs((rowData.SV - medieSV) /sSV);
        const zPOP = Math.abs((rowData.POP - mediePOP) /sPOP);


        //Atribuire culoare celula folosind Regula empirica a lui Cebisev
        celPIB.style.backgroundColor = atribuireCuloare(zPIB);
        celSV.style.backgroundColor = atribuireCuloare(zSV);
        celPop.style.backgroundColor = atribuireCuloare(zPOP);
    }
}

function atribuireCuloare(scorZ)
{
    if(scorZ <= 1){
        return "limegreen";
    }else if(scorZ > 1 && scorZ <= 2){
        return "gold";
    }else if(scorZ > 2){
        return "orangered";
    }

}

function stergereTabel()
{
    continutTabel.innerHTML ="";
}