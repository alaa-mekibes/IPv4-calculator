class IpAddress {
    constructor(ip, pre) {
        this.ip = ip;
        this.pre = pre;
        this.type = "public";
        this.cases = [];
        this.casesBinary = [[], [], [], []];
        this.casesDecimal = [];
    }

    ipCasesSeperator() {
        let ipSeperator = this.ip.split(".");
        for(let i = 0; i < ipSeperator.length; i++) {
            this.cases.push(parseInt(ipSeperator[i]));
        }
    }

    ipCasesInBinary() {
        for(let i = 0; i <this.cases.length; i++) {
            let arr = [];
          this.casesBinary[i] =  this.ipToBinary(this.cases[i], i, arr);
        }
    }

    ipCasesInDecimal() {
        for(let i = 0; i < this.casesBinary.length; i++) {
            let arr = [];
           this.casesDecimal[i] = parseInt(this.ipToDecimal(this.casesBinary[i], arr));
        }        
    }

    whichType() {
        const [b1, b2, b3, b4] = this.casesDecimal;
        if(b1 === 10 
        || b1 === 172 && b2 >= 16 && b2 <= 31
        || b1 === 192 && b2 === 168) {
            this.type = "private";
            return;
        } 

        if(b1 === 127) {
            this.type = "loopback";
            return;
        }
        if(b1 === 169 && b2 === 254) {
            this.type = "link-local";
            return;
        }
        if(b1 >= 224 && b1 <= 239) {
            this.type = "multicast";
            return;
        }
        if(b1 === 255 && b2 === 255 && b3 === 255 && b4 === 255) {
            this.type = "broadcast";
            return;
        }
        if (
        b1 === 0 ||                                           // 0.0.0.0/8
        (b1 === 100 && b2 >= 64 && b2 <= 127) ||              // 100.64.0.0/10
        (b1 === 192 && b2 === 0 && b3 === 0) ||               // 192.0.0.0/24
        (b1 === 192 && b2 === 0 && b3 === 2)  ||              // 192.0.2.0/24
        (b1 === 192 && b2 === 88 && b3 === 99) ||             // 192.88.99.0/24
        (b1 === 198 && b2 >= 18 && b2 <= 19) ||               // 198.18.0.0/15
        (b1 === 198 && b2 === 51 && b3 === 100) ||            // 198.51.100.0/24
        (b1 === 203 && b2 === 0 && b3 === 113) ||             // 203.0.113.0/24
        b1 >= 240)                                            // 240.0.0.0/4
        {
            this.type = "reserved";
            return;
        }
    }

    showIpAddress() {
        let binary = [];
        this.casesBinary.forEach(e => {
            binary += e.join("") + ".";
        })
        if(binary.endsWith(".")) binary = binary.slice(0, -1);
        console.log("IP Address Original: " + this.ip + "/" + this.pre + " " + binary);

        const article = document.createElement("article");
        article.innerHTML = `
        <h3>Address Information</h3>
        <p><strong>Address: </strong> <span class="decimalORstringText">${this.ip}</span> <span class="binaryText">${binary}</span></p>
        <p><strong>Type: </strong> <span class="decimalORstringText">${this.type}</span></p>
        `;
        document.querySelector("#result").appendChild(article);
    }
    
    // Methods Methods
    ipToBinary(part, index, arr) {
        if(part !== 0) {
            let rest = part % 2;
            part = Math.trunc(part / 2);
            arr.push(rest);
            return this.ipToBinary(part, index, arr);
        }
        else {
            while(arr.length < 8) {
                arr.push(0);
            }
            return arr.reverse();
        }
    }

    ipToDecimal(part, arr) {
        let decimal = 0;
        for(let bit = 0; bit < part.length; bit++) {
            decimal +=  part[bit] * Math.pow(2, part.length - 1 - bit);
        }
        arr.push(decimal);
        return arr;
    }
}

class NetworkParts extends IpAddress {
    constructor(ip, pre) {
        super(ip, pre);
        this.networkPartBinary = [[], [], [], []];
        this.machinePartBinary = [[], [], [], []];
        this.networkBitNumber = 0;
        this.machineBitNumber = 0;
        this.mahinesNumber = 0;
        this.ipCasesSeperator();
        this.ipCasesInBinary();
    }


    findNetworkPart() {
        this.networkBitNumber = this.pre;
        let bit = 0, byte = 0;
        for(let prefix = 0; prefix < this.pre; prefix++) {
            if(bit >= 8) {
                bit = 0;
                byte++;
            } 
            this.networkPartBinary[byte].push(this.casesBinary[byte][bit]);
            bit++;
        }

        for(let bit = 0; bit < 4; bit++) {
          while(this.networkPartBinary[bit].length < 8 ) {
            this.networkPartBinary[bit].push(null);
          }
        }
        console.log("net Part: ");
        console.log(this.networkPartBinary);
    }

        findInterfacePart() {
        this.machineBitNumber = 32 - this.pre;
        this.mahinesNumber = (Math.pow(2, this.machineBitNumber) - 2) < 0 ? 0 : (Math.pow(2, this.machineBitNumber) - 2);
        let bit = 0, byte = 0;
         for(let prefix = 0; prefix < this.pre; prefix++) {
             if(bit >= 8) {
                bit = 0;
                byte++;
            } 
            this.machinePartBinary[byte][bit] = null;
            bit++;
         }
        for(let prefix = this.pre; prefix < 32; prefix--) {
             if(bit >= 8) {
                bit = 0;
                byte++;
            } 
            if(byte >= 4) break;
            this.machinePartBinary[byte][bit] = this.casesBinary[byte][bit];
            bit++;
        }
        console.log("machine Part: ");
        console.log(this.machinePartBinary);
    }

        showIpAddress() {
       console.log("Number of network bits: " + this.networkBitNumber + "\nNumber of host bits: " + this.machineBitNumber);
       console.log("Number of hosts: " +  this.mahinesNumber);
    }
}


class Network extends NetworkParts {
constructor(ip, pre) {
        super(ip, pre);
        this.networkBinary = [[], [], [], []];
        this.networkDecimal = [];
        this.networkPartStr = "";
        this.machinePartStr = "";
        this.findNetworkPart();
        this.ipCasesInDecimal();
    }
    
    networkInBinary() {
        let bit = 0, byte =0;
        for(let prefix = 0; prefix < 32; prefix++) {
            if(prefix > 0 && prefix % 8 === 0) {
                bit = 0;
                byte++;
                if(prefix < this.pre)
                this.networkPartStr += ".";
                else
                this.machinePartStr += ".";
            } 
            if(this.networkPartBinary[byte][bit] !== null)
                {
                    this.networkBinary[byte][bit] = this.networkPartBinary[byte][bit];
                    this.networkPartStr += this.networkPartBinary[byte][bit];
                }
                else {
                    this.networkBinary[byte][bit] = 0;
                    this.machinePartStr += 0;
                }
                
            bit++;
        }
    }

    ipCasesInDecimal() {
        for(let byte = 0; byte < this.networkBinary.length; byte++) {
            let arr = [];
           this.networkDecimal[byte] = parseInt(this.ipToDecimal(this.networkBinary[byte], arr));
        }        
    }

    showIpAddress() {
        let binary = [];
        this.networkBinary.forEach(e => {
            binary += e.join("") + ".";
        })
        if(binary.endsWith(".")) binary = binary.slice(0, -1);
        console.log("Network: " +  this.networkDecimal.join(".") + " %c" + this.networkPartStr + "%c" + this.machinePartStr, "color: red", "color: #fff");

        const article = document.createElement("article");
        article.innerHTML = `
        <h3>Network Information</h3>
        <p><strong>Network Address: </strong> <span class="decimalORstringText">${this.networkDecimal.join(".")}</span> <span style="white-space: nowrap;"><span class="binaryPart">${this.networkPartStr}</span> <span class="binaryText">${this.machinePartStr}</span></span></p>
        <p><strong>Number of network bits: </strong> <span class="decimalORstringText">${this.networkBitNumber}</span></p>
        `;
        document.querySelector("#result").appendChild(article);
    }
}

class SubnetMask extends NetworkParts {
constructor(ip, pre) {
        super(ip, pre);
        this.networkBinary = [[], [], [], []];
        this.networkDecimal = [];
        this.networkPartStr = "";
        this.machinePartStr = "";
        this.findNetworkPart();
        this.ipCasesInDecimal();
    }
    
    networkInBinary() {
        let bit = 0, byte = 0;
        for(let prefix = 0; prefix < 32; prefix++) {
            if(prefix > 0 && prefix % 8 === 0) {
                bit = 0;
                byte++;
                if(prefix < this.pre)
                this.networkPartStr += ".";
                else
                this.machinePartStr += ".";
            } 
            if(this.networkPartBinary[byte][bit] !== null)
            {
                this.networkBinary[byte][bit] = 1;
                this.networkPartStr += "1";
            }
                else {
                    this.networkBinary[byte][bit] = 0;
                    this.machinePartStr += "0";
                }
            bit++
        }
    }

    ipCasesInDecimal() {
        for(let byte = 0; byte < this.networkBinary.length; byte++) {
            let arr = [];
           this.networkDecimal[byte] = parseInt(this.ipToDecimal(this.networkBinary[byte], arr));
        }        
    }

    showIpAddress() {
        let binary = [];
        this.networkBinary.forEach(e => {
            binary += e.join("") + ".";
        })
        if(binary.endsWith(".")) binary = binary.slice(0, -1);
        console.log("Subnet Mask: " +  this.networkDecimal.join(".") + " %c" + this.networkPartStr + "%c" + this.machinePartStr, "color: red", "color: #fff");

        const article = document.querySelector("#result article:last-child");
        article.innerHTML += `
        <p><strong>SubnetMask: </strong> <span class="decimalORstringText">${this.networkDecimal.join(".")}</span> <span style="white-space: nowrap;"><span class="binaryPart">${this.networkPartStr}</span> <span class="binaryText">${this.machinePartStr}</span></span></p>
        `;
    }
}

class WildCardMask extends NetworkParts {
constructor(ip, pre) {
        super(ip, pre);
        this.machineBinary = [[], [], [], []];
        this.machineDecimal = [];
        this.networkPartStr = "";
        this.machinePartStr = "";
        this.findInterfacePart();
        this.ipCasesInDecimal();
    }
    
    machineInBinary() {
        let bit = 0, byte = 0;
        for(let prefix = 0; prefix < 32; prefix++) {
            if(prefix > 0 && prefix % 8 === 0) {
                bit = 0;
                byte++
                if(prefix < this.pre)
                this.networkPartStr += ".";
                else
                this.machinePartStr += ".";
            } 
            if(this.machinePartBinary[byte][bit] !== null)
            {
                this.machineBinary[byte][bit] = 1;
                this.machinePartStr += "1";
            }
            else {
                    this.machineBinary[byte][bit] = 0;
                    this.networkPartStr += 0;
                }
            bit++
        }
    }

    ipCasesInDecimal() {
        for(let byte = 0; byte < this.machineBinary.length; byte++) {
            let arr = [];
           this.machineDecimal[byte] = parseInt(this.ipToDecimal(this.machineBinary[byte], arr));
        }        
    }

    showIpAddress() {
        let binary = [];
        this.machineBinary.forEach(e => {
            binary += e.join("") + ".";
        })
        if(binary.endsWith(".")) binary = binary.slice(0, -1);

        console.log("WildCardMask: " +  this.machineDecimal.join(".") + " %c" + this.networkPartStr + "%c" + this.machinePartStr, "color: #fff", "color: red");

        const article = document.querySelector("#result article:last-child");
        article.innerHTML += `
        <p><strong>Wildcard Mask: </strong> <span class="decimalORstringText">${this.machineDecimal.join(".")}</span> <span style="white-space: nowrap;"><span class="binaryPart">${this.networkPartStr}</span> <span class="binaryText">${this.machinePartStr}</span></span></p>
        <p><strong>CIDR Notation: </strong><span class="decimalORstringText">/${this.pre}</span></p>
        `;
    }
}

class Broadcast extends NetworkParts {
constructor(ip, pre) {
        super(ip, pre);
        this.machineBinary = [[], [], [], []];
        this.machineDecimal = [];
        this.networkPartStr = "";
        this.machinePartStr = "";
        this.findInterfacePart();
        this.ipCasesInDecimal();
    }
    
    machineInBinary() {
        let bit = 0, byte = 0;
        for(let prefix = 0; prefix < 32; prefix++) {
            if(prefix > 0 && prefix % 8 === 0) {
                bit = 0;
                byte++
                if(prefix < this.pre)
                this.networkPartStr += ".";
                else
                this.machinePartStr += ".";
            } 
            if(this.machinePartBinary[byte][bit] !== null)
            {
                this.machineBinary[byte][bit] = 1;
                this.machinePartStr += "1";
            }
            else {
                    this.machineBinary[byte][bit] = this.casesBinary[byte][bit];
                    this.networkPartStr += this.casesBinary[byte][bit];
                }
            bit++
        }
    }

    ipCasesInDecimal() {
        for(let byte = 0; byte < this.machineBinary.length; byte++) {
            let arr = [];
           this.machineDecimal[byte] = parseInt(this.ipToDecimal(this.machineBinary[byte], arr));
        }        
    }

    showIpAddress() {
        let binary = [];
        this.machineBinary.forEach(e => {
            binary += e.join("") + ".";
        })
        if(binary.endsWith(".")) binary = binary.slice(0, -1);

        console.log("Broadcast: " +  this.machineDecimal.join(".") + " %c" + this.networkPartStr + "%c" + this.machinePartStr, "color: #fff", "color: red");

        const article = document.createElement("article");
        article.innerHTML = `
        <h3>IP Range & Usable Hosts</h3>
        <p><strong>Broadcast: </strong> <span class="decimalORstringText">${this.machineDecimal.join(".")}</span> <span style="white-space: nowrap;"><span class="binaryPart">${this.networkPartStr}</span> <span class="binaryText">${this.machinePartStr}</span></span></p>
        `;
        document.querySelector("#result").appendChild(article);
    }
}

class FirstLastMachine extends NetworkParts {
constructor(ip, pre) {
        super(ip, pre);
        this.FirstmachineBinary = [[], [], [], []];
        this.FirstmachineDecimal = [];
        this.FirstmachinePartStr = "";

        this.LastmachineBinary = [[], [], [], []];
        this.LastmachineDecimal = [];
        this.LastmachinePartStr = "";

        this.networkPartStr = "";
        this.findInterfacePart();
        this.ipCasesInDecimal();
    }
    
    machineInBinary() {
        let bit = 0, byte =0;
        for(let prefix = 0; prefix < 32; prefix++) {
            if(prefix > 0 && prefix % 8 === 0) {
                bit = 0;
                byte++;
                if(prefix < this.pre)
                this.networkPartStr += ".";
                else {
                    this.FirstmachinePartStr += ".";
                    this.LastmachinePartStr += ".";
                }
            } 
            if(this.machinePartBinary[byte][bit] !== null)
            {
                this.FirstmachineBinary[byte][bit] = ((prefix !== 31) ? 0 : 1);
                this.FirstmachinePartStr += ((prefix !== 31) ? "0" : "1");

                this.LastmachineBinary[byte][bit] = ((prefix !== 31) ? 1 : 0);
                this.LastmachinePartStr += ((prefix !== 31) ? "1" : "0");
            }
            else {
                this.FirstmachineBinary[byte][bit] = this.casesBinary[byte][bit];
                this.LastmachineBinary[byte][bit] = this.casesBinary[byte][bit];
                this.networkPartStr += this.casesBinary[byte][bit];
                }
            bit++;
        }
    }

    ipCasesInDecimal() {
        for(let byte = 0; byte < this.FirstmachineBinary.length; byte++) {
            let arr = [];
            this.FirstmachineDecimal[byte] = parseInt(this.ipToDecimal(this.FirstmachineBinary[byte], arr));
            arr = [];
            this.LastmachineDecimal[byte] = parseInt(this.ipToDecimal(this.LastmachineBinary[byte], arr));
        }        
    }

    showIpAddress() {
        let Firstbinary = [];
        this.FirstmachineBinary.forEach(e => {
            Firstbinary += e.join("") + ".";
        })
        if(Firstbinary.endsWith(".")) Firstbinary = Firstbinary.slice(0, -1);
        let Lastbinary = [];
        this.LastmachineBinary.forEach(e => {
            Lastbinary += e.join("") + ".";
        })
        if(Lastbinary.endsWith(".")) Lastbinary = Lastbinary.slice(0, -1);

        console.log("First machine: " +  this.FirstmachineDecimal.join(".") + " %c" + this.networkPartStr + "%c" + this.FirstmachinePartStr, "color: #fff", "color: red");
        console.log("Last machine: " +  this.LastmachineDecimal.join(".") + " %c" + this.networkPartStr + "%c" + this.LastmachinePartStr, "color: #fff", "color: red");

        const article = document.querySelector("#result article:last-child");
        article.innerHTML += `
        <p><strong>Number of host bits: </strong> <span class="decimalORstringText">${this.machineBitNumber}</span></p>
        <p><strong>First Usable IP: </strong> <span class="decimalORstringText">${this.FirstmachineDecimal.join(".")}</span> <span style="white-space: nowrap;"><span class="binaryPart">${this.networkPartStr}</span> <span class="binaryText">${this.FirstmachinePartStr}</span></span></p>
        <p><strong>Last Usable IP: </strong> <span class="decimalORstringText">${this.LastmachineDecimal.join(".")}</span> <span style="white-space: nowrap;"><span class="binaryPart">${this.networkPartStr}</span> <span class="binaryText">${this.LastmachinePartStr}</span></span></p>
        <p><strong>Number of hosts: </strong> <span class="decimalORstringText">${this.mahinesNumber}</span></p>
        `;
    }
}

// main
function inputVerification() {
    const ipAdd = document.querySelector("#ipadd");
    const prefix = document.querySelector("#prefix");
    const subnetMask = document.querySelector("#subnetMask");
    const warning = document.querySelector(".error");
    const ipValidation = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;

// Validation Checker
    if(!ipAdd.value) {
        warning.textContent = "the IP address entry is empty";
        ipAdd.setAttribute("aria-invalid", "true");
        prefix.setAttribute("aria-invalid", "false");
        return;
    }else if(!parseInt(prefix.value) && !parseInt(subnetMask.value)) {
        warning.textContent = "You must select a subnet mask OR enter a prefix";
        prefix.setAttribute("aria-invalid", "true");
        ipAdd.setAttribute("aria-invalid", "false");
        return;
    }

    if(parseInt(prefix.value) < 1 || parseInt(prefix.value) > 32) {
        warning.textContent = "enter a valid prefix [1 - 32]";
        prefix.setAttribute("aria-invalid", "true");
        ipAdd.setAttribute("aria-invalid", "false");
        return;
    }

    if(!ipValidation.test(ipAdd.value.trim())) {
        warning.textContent = "enter a valid ip Address";
        ipAdd.setAttribute("aria-invalid", "true");
        prefix.setAttribute("aria-invalid", "false");
        return;
    }

    if(parseInt(prefix.value) && parseInt(subnetMask.value) && parseInt(prefix.value) !== parseInt(subnetMask.value)) {
        warning.textContent = "Prefix value does not match the subnet mask";
        prefix.setAttribute("aria-invalid", "true");
        ipAdd.setAttribute("aria-invalid", "false");
        return;
    }

    if(!parseInt(prefix.value) && parseInt(subnetMask.value)) prefix.value = parseInt(subnetMask.value);


// Validation success => init + Create Objects
prefix.setAttribute("aria-invalid", "false");
ipAdd.setAttribute("aria-invalid", "false");
init(1);

const ip = new IpAddress(ipAdd.value.trim(), parseInt(prefix.value.trim()));
ip.ipCasesSeperator();
ip.ipCasesInBinary();
ip.ipCasesInDecimal();
ip.whichType();
ip.showIpAddress();

const ipParts = new NetworkParts(ipAdd.value.trim(), parseInt(prefix.value.trim()));
ipParts.findNetworkPart();
ipParts.findInterfacePart();
ipParts.showIpAddress();

const net = new Network(ipAdd.value.trim(), parseInt(prefix.value.trim()));
net.networkInBinary();
net.ipCasesInDecimal();
net.showIpAddress();

const s = new SubnetMask(ipAdd.value.trim(), parseInt(prefix.value.trim()));
s.networkInBinary();
s.ipCasesInDecimal();
s.showIpAddress();

const w = new WildCardMask(ipAdd.value.trim(), parseInt(prefix.value.trim()));
w.machineInBinary();
w.ipCasesInDecimal();
w.showIpAddress();

const b = new Broadcast(ipAdd.value.trim(), parseInt(prefix.value.trim()));
b.machineInBinary();
b.ipCasesInDecimal();
b.showIpAddress();

const flm = new FirstLastMachine(ipAdd.value.trim(), parseInt(prefix.value.trim()));
flm.machineInBinary();
flm.ipCasesInDecimal();
flm.showIpAddress();

// Smooth Scroll
document.querySelector(".result_container").scrollIntoView({behavior: "smooth", block: "start"});
// Download Button
const downloadPdfBtn = document.createElement("button");
downloadPdfBtn.id = "download";
downloadPdfBtn.textContent = "Donwload as pdf";
document.querySelector("#result").appendChild(downloadPdfBtn);
downloadPdfBtn.addEventListener("click", _ => print());
}

function resetInputes() {
    document.querySelector("#ipadd").value = "";
    document.querySelector("#prefix").value = "";
    document.querySelector("#subnetMask").value = "";

    init(0);
}

function init(result) {
    document.querySelector(".error").textContent = "";
    document.querySelectorAll(".result_container article").forEach(article => {
        article.remove();
    });
    if(document.querySelector(".result_container #download")) document.querySelector(".result_container #download").remove();
    if(result === 0) document.querySelector(".result_container").style.display = "none";
    else document.querySelector(".result_container").style.display = "block";
    console.clear();
} 

document.addEventListener("DOMContentLoaded", _ => {
    document.querySelector("#calculate").addEventListener("click", inputVerification);
    document.querySelector("#reset").addEventListener("click", resetInputes);
})