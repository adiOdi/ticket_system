import  encryption  from "./encryption.js";
import  card  from "./card.js";
import QrScanner from './scanner.js';
import boolArray from './boolArray.js';
// import QRCodeStyling from './qrcodegenerator.js';
const makeRead=false; //false => print; true => scan

// setup ///////////////////////////////////////
const admin=new encryption(65,77039393,59629259);
let nonce=10;
let qrScanner=null;
let usedNonces=new boolArray();

// scanning cards //////////////////////////////////////////////////////////////
if(makeRead){
    // https://openbase.com/js/qr-scanner/documentation
    
    QrScanner.WORKER_PATH = './scanner-worker.js';

    const videoElem=document.getElementById("video");
    const qrScanner = new QrScanner(videoElem, result => processresult(result));
    // videoElem.class = "";
    qrScanner.setCamera('environment');
    qrScanner.setInversionMode('invert');

    // start ////////////////////////////
    qrScanner.start();
} 

// creating cards //////////////////////////////////////////////////////////////
else {
    while(nonce<16){
        const code=createCode();
        console.log(validateCode(code));
        console.log(code);
        const screen = new card(code);
        screen.render();
    }
    console.log("last used nonce:", nonce)
}

////////////////////////////////////////////////////////////////////////////////

// process qr-code /////////////////////////////////////////////////////////////

function processresult(result){
    const nonce=validateCode(result)
    if(nonce){
        qrScanner.stop();
        if(checkUsed(nonce)){
            console.log("already used ticket");
        } else {
            console.log("success! ticket#:",nonce);
        }
        
    } else {
        console.log("Code not valid")
    }
    qrScanner.start();
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
    if(usedNonces.get(nonce)){
        return false;
    } else {
        // write
        usedNonces.set(nonce);
        return true;
    }
}
////////////////////////////////////////////////////////////////////////////////