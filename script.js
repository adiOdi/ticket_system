import  encryption  from "./encryption.js";
import  card  from "./card.js";
import QrScanner from './scanner.js';
import boolArray from './boolArray.js';
// import QRCodeStyling from './qrcodegenerator.js';
const makeRead=true; //false => print; true => scan
const DEBUG=false;

// setup ///////////////////////////////////////
const admin=new encryption(65,77039393,59629259);
let nonce=10;
let qrScanner=null;
let usedNonces=new Array(1000).fill(false);//new boolArray();
let blockQR=false;

// scanning cards //////////////////////////////////////////////////////////////
if(makeRead){
    if(DEBUG){
        processresult('22877751:4147942');
    } else {
    // https://openbase.com/js/qr-scanner/documentation
    
    QrScanner.WORKER_PATH = './scanner-worker.js';

    const videoElem=document.getElementById("video");
    qrScanner = new QrScanner(videoElem, result => processresult(result));
    // show scanRegion
    document.getElementById("scanRegion").className = "";
    // qrScanner.setCamera('environment');
    qrScanner.setInversionMode('invert');
    document.getElementById('scanRegion').appendChild(qrScanner.$canvas);
    // start ////////////////////////////
    qrScanner.start();
    }
} 

// creating cards //////////////////////////////////////////////////////////////
else {
    const canvas=document.getElementById('canvas');
    canvas.className='';
    while(nonce<16){
        const code=createCode();
        console.log(validateCode(code));
        console.log(code);
        const screen = new card(code);
        screen.render();
    }
    window.print();
    console.log("last used nonce:", nonce)
}

////////////////////////////////////////////////////////////////////////////////

// process qr-code /////////////////////////////////////////////////////////////

function processresult(result){
    if(blockQR) return;
    blockQR=true;
    const nonce=validateCode(result)
    const canvas=document.getElementById('canvas');
    if(nonce){
        // if(!DEBUG) qrScanner.stop();
        
        const videoElem=document.getElementById("scanRegion");
        videoElem.className='hide';
        if(checkUsed(nonce)){
            console.log("already used ticket");
            canvas.className="fail";
            canvas.innerHTML="Already used ticket. Press to continue.";
        } else {
            console.log("success! ticket#:",nonce);
            canvas.className="success";
            canvas.innerHTML="Ticket is valid! Press to continue.";
        }
        canvas.onclick=function(){
            console.log('next please');
            canvas.className='hide';
            videoElem.className='';
            if(!DEBUG) qrScanner.start();
            if(DEBUG) processresult('22877751:4147942');
            blockQR=false;
        };
    } else {
        canvas.className='softfail';
        canvas.innerHTML="Ticket not valid";
        setTimeout(function(){
            canvas.className='hide';
        },2000)
        console.log("Code not valid")
        blockQR=false;
    }
    
    // qrScanner.stop();
    // qrScanner.destroy();
    // qrScanner = null;
}

// creating and validating codes ///////////////////////////////////////////////

function createCode(){
    nonce++;
    // console.log("nonce:",nonce);
    // console.log("hash:",admin.hash(nonce));
    // console.log("encrypted:",admin.private(nonce));
    return String(admin.private(nonce)).concat(':'+String(admin.hash(nonce)))
}

function validateCode(code){
    const split=code.split(':');
    const hash=split[1];
    const nonce=admin.public(split[0]);
    // console.log("hash:",hash);
    // console.log("decrypted:",nonce);
    return admin.hash(nonce)==hash ? nonce:0;
}
function checkUsed(nonce){
    if(usedNonces[nonce]){
        return true;
    } else {
        // write
        usedNonces[nonce]=true;
        return false;
    }
}
////////////////////////////////////////////////////////////////////////////////