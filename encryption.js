class encryption{
    // http://my.core.com/~katiemarie10/prime/prime1-1G.htm max:65 000 (very slow that wayp)
    constructor(puKey=null, prKey=null, mod=null){
        if(!(puKey&&prKey&&mod)){
            // no arguments, create new default key/value pair
            console.error("not secure, default key pair created only for testing");
            [puKey, prKey] = this.create();
        } else if((puKey&&prKey)&&(!mod)){
            // only two arguments given, they have to be prime
            console.log("creating new key pair with the primes:", puKey, prKey);
            [puKey, prKey] = this.create(puKey, prKey);
        } else {
            // all three arguments given
            puKey=[puKey, mod];
            prKey=[prKey, mod];
            console.log("using given key pair:", puKey, prKey);
        }
        this.privateKey=prKey;
        this.publicKey=puKey;
    }
    create(p=7717,q= 7727){
        // p and q have to be prime numbers
        console.log("prime 1:", p);
        console.log("prime 2:", q);
        // mod number
        const n=p*q;
        console.log("max encodable number:", n);
        // trapdoor (only easy when p and q known)
        const phi_n=(p-1)*(q-1);
        // console.log("created phi(n):", phi_n);
        // coprime with n and with phi, between 1 and phi
        let e=Math.floor(phi_n/2);
        while(this.gcd(e, phi_n) != 1){
            e++
        } if(e>=phi_n){console.error("e>phi(n), try bigger primes");}
        console.log("created public key:", e);
        // d*e%phi=1
        let i=e;
        while(((i*phi_n)+1)%e != 0){
            i++
        }
        const d = (i*phi_n+1)/e;
        console.log("created private key:", d);
        const publicKey=[e,n];
        const privateKey=[d,n];
        return [publicKey, privateKey];
    }
    // encrypt with public key
    public(msg, puKey=this.publicKey){
        return(this.modpow(msg, puKey[0], puKey[1]));
    }
    // encrypt with private key
    private(msg,prKey=this.privateKey){
        return this.public(msg, prKey);
    }
    hash(msg, size=4200199){
        return this.modpow(msg, 50053, size);
    }
    modpowo(base, exp, mod){
        let result=1;
        for(let i=exp;i>0;i--){
            result=(result*base)%mod
        }
        return result;
    }
    // Iterative Javascript program to
    // compute modular power
    
    // Iterative Function to
    // calculate (x^y)%p in O(log y)
    modpow(x, y, p)
    {
        // Initialize result
        let res = 1;
    
        // Update x if it is more
        // than or equal to p
        x = x % p;
    
        if (x == 0)
            return 0;
    
        while (y > 0)
        {
            // If y is odd, multiply
            // x with result
            if (y & 1)
                res = (res * x) % p;
    
            // y must be even now
            
            // y = $y/2
            y = y >> 1;
            x = (x * x) % p;
        }
        return res;
    }
    gcd(x, y) {
        while(y) {
            var t = y;
            y = x % y;
            x = t;
        }
        return x;
    }
}

export default encryption