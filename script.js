import  encryption  from "./encryption.js";
import  card  from "./card.js";
import QrScanner from './scanner.js';

const makeRead=false; //false => print; true => scan

// setup //////////////////////////////////////
let admin=new encryption(65,77039393,59629259);
let nonce=10;
let qrScanner=null;

// scanning cards //////////////////////////////////////////
if(makeRead){
    // https://openbase.com/js/qr-scanner/documentation
    
    QrScanner.WORKER_PATH = './scanner-worker.js';

    const videoElem=document.getElementById("video");
    const qrScanner = new QrScanner(videoElem, result => processresult(result));
    // videoElem.class = "";
    qrScanner.setCamera('environment');
    qrScanner.setInversionMode('invert');

    // start ///////////////////////////////////
    qrScanner.start();
} 


// creating cards //////////////////////////////////////////
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




////////////////////////////////////////////////////////////////////////////

function processresult(result){
    const nonce=validateCode(result)
    if(nonce){
        console.log("success! ticket#:",nonce)
    } else {
        console.log("Code not valid")
    }
    qrScanner.stop();
    qrScanner.destroy();
    qrScanner = null;
}

/////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////