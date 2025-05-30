class IpAddress {
  constructor(ip, pre) {
    this.ip = ip;
    this.pre = pre;
    this.type = "public";
    this.cases = [];
    this.ipBinaryStr = "";
    this.casesBinary = [[], [], [], []];
    this.ipCasesSeperator();
    this.ipCasesInBinary();
    this.whichType();
    this.networkPartBinary = [[], [], [], []];
    this.machinePartBinary = [[], [], [], []];
    this.networkBitNumber = 0;
    this.machineBitNumber = 0;
    this.mahineNumber = 0;
    this.findNetworkPart();
    this.findInterfacePart();
  }

  ipCasesSeperator() {
    let ipSeperator = this.ip.split(".");
    for (let byte = 0; byte < ipSeperator.length; byte++) {
      this.cases.push(parseInt(ipSeperator[byte]));
    }
  }

  ipCasesInBinary() {
    for (let byte = 0; byte < this.cases.length; byte++) {
      this.casesBinary[byte] = this.ipToBinary(this.cases[byte], byte, []);
      this.ipBinaryStr += this.ipToBinary(this.cases[byte], byte, []).join("") + ".";
    }
    if (this.ipBinaryStr.endsWith("."))
      this.ipBinaryStr = this.ipBinaryStr.slice(0, -1);
  }

  whichType() {
    const [b1, b2, b3, b4] = this.cases;
    if (
      b1 === 10 ||
      (b1 === 172 && b2 >= 16 && b2 <= 31) ||
      (b1 === 192 && b2 === 168)
    ) {
      this.type = "private";
      return;
    }

    if (b1 === 127) {
      this.type = "loopback";
      return;
    }
    if (b1 === 169 && b2 === 254) {
      this.type = "link-local";
      return;
    }
    if (b1 >= 224 && b1 <= 239) {
      this.type = "multicast";
      return;
    }
    if (b1 === 255 && b2 === 255 && b3 === 255 && b4 === 255) {
      this.type = "broadcast";
      return;
    }
    if (
      b1 === 0 || // 0.0.0.0/8
      (b1 === 100 && b2 >= 64 && b2 <= 127) || // 100.64.0.0/10
      (b1 === 192 && b2 === 0 && b3 === 0) || // 192.0.0.0/24
      (b1 === 192 && b2 === 0 && b3 === 2) || // 192.0.2.0/24
      (b1 === 192 && b2 === 88 && b3 === 99) || // 192.88.99.0/24
      (b1 === 198 && b2 >= 18 && b2 <= 19) || // 198.18.0.0/15
      (b1 === 198 && b2 === 51 && b3 === 100) || // 198.51.100.0/24
      (b1 === 203 && b2 === 0 && b3 === 113) || // 203.0.113.0/24
      b1 >= 240
    ) {
      // 240.0.0.0/4
      this.type = "reserved";
      return;
    }
  }

  findNetworkPart() {
    this.networkBitNumber = this.pre;
    let bit = 0, byte = 0;
    for (let prefix = 0; prefix < this.pre; prefix++) {
      if (bit >= 8) {
        bit = 0;
        byte++;
      }
      this.networkPartBinary[byte].push(this.casesBinary[byte][bit]);
      bit++;
    }

    for (let bit = 0; bit < 4; bit++) {
      while (this.networkPartBinary[bit].length < 8) {
        this.networkPartBinary[bit].push(null);
      }
    }
  }

  findInterfacePart() {
    this.machineBitNumber = 32 - this.pre;
    this.mahineNumber = Math.pow(2, this.machineBitNumber) - 2 < 0 ? 0 : Math.pow(2, this.machineBitNumber) - 2;
    let bit = 0, byte = 0;
    for (let prefix = 0; prefix < this.pre; prefix++) {
      if (bit >= 8) {
        bit = 0;
        byte++;
      }
      this.machinePartBinary[byte][bit] = null;
      bit++;
    }
    for (let prefix = this.pre; prefix < 32; prefix++) {
      if (bit >= 8) {
        bit = 0;
        byte++;
      }
      if (byte >= 4) break;
      this.machinePartBinary[byte][bit] = this.casesBinary[byte][bit];
      bit++;
    }
  }

  // Methods Alter
  ipToBinary(part, index, arr) {
    if (part !== 0) {
      let rest = part % 2;
      part = Math.trunc(part / 2);
      arr.push(rest);
      return this.ipToBinary(part, index, arr);
    } else {
      while (arr.length < 8) {
        arr.push(0);
      }
      return arr.reverse();
    }
  }

  ipToDecimal(part, arr) {
    let decimal = 0;
    for (let bit = 0; bit < part.length; bit++) {
      decimal += part[bit] * Math.pow(2, part.length - 1 - bit);
    }
    arr.push(decimal);
    return arr;
  }
}

class NetworkComponets extends IpAddress {
  constructor(ip, pre) {
    super(ip, pre);

    this.networkBinary = "";
    this.subnetMaskBinary = "";
    this.wildCardMaskBinary = "";
    this.broadcastBinary = "";
    this.firstMachineBinary = "";
    this.lastMachineBinary = "";
    this.machineBinaryInZero = "";
    this.machineBinaryInOne = "";

    this.networkDecimal = [];
    this.subnetMaskDecimal = [];
    this.wildCardMaskDecimal = [];
    this.broadcastDecimal = [];
    this.firstMachineDecimal = [];
    this.lastMachineDecimal = [];

    this.InBinary();
    this.binaryToDecimal();
    this.showIpAddress();
  }

  InBinary() {
    let bit = 0, byte = 0;
    for (let prefix = 0; prefix < 32; prefix++) {
      if (prefix > 0 && prefix % 8 === 0) {
        bit = 0;
        byte++;

        if (prefix < this.pre) {
          // Network Part
          this.networkBinary += ".";
          this.subnetMaskBinary += ".";
          this.wildCardMaskBinary += ".";
          this.broadcastBinary += ".";
        } else {
          // Machine Part
          this.machineBinaryInZero += ".";
          this.machineBinaryInOne += ".";
          this.firstMachineBinary += ".";
          this.lastMachineBinary += ".";
        }
      }
      if (this.networkPartBinary[byte][bit] !== null) {
        // Network Part
        this.networkBinary += this.networkPartBinary[byte][bit].toString();
        this.subnetMaskBinary += "1";
        this.wildCardMaskBinary += "0";
        this.broadcastBinary += this.networkPartBinary[byte][bit].toString();
      } else {
        // Machine Part
        this.machineBinaryInZero += "0";
        this.machineBinaryInOne += "1";
        this.firstMachineBinary += prefix !== 31 ? "0" : "1";
        this.lastMachineBinary += prefix !== 31 ? "1" : "0";
      }
      bit++;
    }
  }

  binaryToDecimal() {
    // Concat Network part + Machine part
    const networkBinary = this.networkBinary + this.machineBinaryInZero;
    const subnetMaskBinary = this.subnetMaskBinary + this.machineBinaryInZero;
    const wildCardMaskBinary = this.wildCardMaskBinary + this.machineBinaryInOne;
    const broadcastBinary = this.broadcastBinary + this.machineBinaryInOne;
    const firstMachineBinary = this.networkBinary + this.firstMachineBinary;
    const lastMachineBinary = this.networkBinary + this.lastMachineBinary;

    for (let byte = 0; byte < 4; byte++) {
      this.networkDecimal[byte] = parseInt(
        this.ipToDecimal(networkBinary.split(".")[byte], [])
      );
      this.subnetMaskDecimal[byte] = parseInt(
        this.ipToDecimal(subnetMaskBinary.split(".")[byte], [])
      );
      this.wildCardMaskDecimal[byte] = parseInt(
        this.ipToDecimal(wildCardMaskBinary.split(".")[byte], [])
      );
      this.broadcastDecimal[byte] = parseInt(
        this.ipToDecimal(broadcastBinary.split(".")[byte], [])
      );
      this.firstMachineDecimal[byte] = parseInt(
        this.ipToDecimal(firstMachineBinary.split(".")[byte], [])
      );
      this.lastMachineDecimal[byte] = parseInt(
        this.ipToDecimal(lastMachineBinary.split(".")[byte], [])
      );
    }
  }

  showIpAddress() {
    const resultContainer = document.querySelector("#result");
    const article = document.createElement("article");
    article.classList.add("results-section__results");
    article.innerHTML = `
        <h3>Address Information</h3>
        <p><strong>Address: </strong> <span class="results-section--decimalORstringText">${this.ip}</span> <span class="results-section--binaryText">${this.ipBinaryStr}</span></p>
        <p><strong>Type: </strong> <span class="results-section--decimalORstringText">${this.type}</span></p>
        <h3>Network Information</h3>
        <p><strong>Network Address: </strong> <span class="results-section--decimalORstringText">${this.networkDecimal.join(".")}</span> <span style="white-space: nowrap;"><span class="results-section--binaryPart">${this.networkBinary}</span> <span class="results-section--binaryText">${this.machineBinaryInZero}</span></span></p>
        <p><strong>Number of network bits: </strong> <span class="results-section--decimalORstringText">${this.networkBitNumber}</span></p>
        <p><strong>SubnetMask: </strong> <span class="results-section--decimalORstringText">${this.subnetMaskDecimal.join(".")}</span> <span style="white-space: nowrap;"><span class="results-section--binaryPart">${this.subnetMaskBinary}</span> <span class="results-section--binaryText">${this.machineBinaryInZero}</span></span></p>
        <p><strong>Wildcard Mask: </strong> <span class="results-section--decimalORstringText">${this.wildCardMaskDecimal.join(".")}</span> <span style="white-space: nowrap;"><span class="results-section--binaryPart">${this.wildCardMaskBinary}</span> <span class="results-section--binaryText">${this.machineBinaryInOne}</span></span></p>
        <p><strong>CIDR Notation: </strong><span class="results-section--decimalORstringText">/${this.pre}</span></p>
        <h3>IP Range & Usable Hosts</h3>
        <p><strong>Broadcast: </strong> <span class="results-section--decimalORstringText">${this.broadcastDecimal.join(".")}</span> <span style="white-space: nowrap;"><span class="results-section--binaryPart">${this.networkBinary}</span> <span class="results-section--binaryText">${this.machineBinaryInZero}</span></span></p>
        <p><strong>Number of host bits: </strong> <span class="results-section--decimalORstringText">${this.machineBitNumber}</span></p>
        <p><strong>First Usable IP: </strong> <span class="results-section--decimalORstringText">${this.firstMachineDecimal.join(".")}</span> <span style="white-space: nowrap;"><span class="results-section--binaryPart">${this.networkBinary}</span> <span class="results-section--binaryText">${this.firstMachineBinary}</span></span></p>
        <p><strong>Last Usable IP: </strong> <span class="results-section--decimalORstringText">${this.lastMachineDecimal.join("."
        )}</span> <span style="white-space: nowrap;"><span class="results-section--binaryPart">${this.networkBinary}</span> <span class="results-section--binaryText">${this.lastMachineBinary}</span></span></p>
        <p><strong>Number of hosts: </strong> <span class="results-section--decimalORstringText">${this.mahineNumber}</span></p>
        `;
    resultContainer.appendChild(article);
  }
}

// main
function inputVerification() {
  const ipAdd = document.querySelector("#ipadd");
  const prefix = document.querySelector("#prefix");
  const subnetMask = document.querySelector("#subnetMask");
  const warning = document.querySelector("#errorMSG");
  const resultContainer = document.querySelector(".results-section");
  const ipValidation = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;

  const setInvalid = (filed, msg, ipStatus, prefixStatus, removeOtherAtt) => {
    warning.textContent = msg;
    ipAdd.setAttribute("aria-invalid", ipStatus);
    prefix.setAttribute("aria-invalid", prefixStatus);
    filed.setAttribute("aria-describedby", "errorMSG");
    removeOtherAtt.removeAttribute("aria-describedby");
}

  // Validation Checker
  if (!ipAdd.value) {
    setInvalid(ipAdd, "the IP address entry is empty", "true", "false", prefix);
    return;
} else if (!parseInt(prefix.value) && !parseInt(subnetMask.value)) {
      setInvalid(prefix, "You must select a subnet mask OR enter a prefix", "true", "false", ipAdd);
      return;
    }
    
    if (parseInt(prefix.value) < 1 || parseInt(prefix.value) > 32) {
      setInvalid(prefix, "enter a valid prefix [1 - 32]", "true", "false", ipAdd);
      return;
    }
    
    if (!ipValidation.test(ipAdd.value.trim())) {
    setInvalid(ipAdd, "enter a valid ip Address", "true", "false", prefix);
    return;
  }
  
  if (parseInt(prefix.value) &&parseInt(subnetMask.value) &&parseInt(prefix.value) !== parseInt(subnetMask.value)) 
  {
    setInvalid(prefix, "Prefix value does not match the subnet mask", "true", "false", ipAdd);
    return;
  }

  if (!parseInt(prefix.value) && parseInt(subnetMask.value))
    prefix.value = parseInt(subnetMask.value);

  // Validation success => init + Create Objects
  init(1);

  new IpAddress(ipAdd.value.trim(), parseInt(prefix.value.trim()));
  new NetworkComponets(ipAdd.value.trim(), parseInt(prefix.value.trim()));

  // Smooth Scroll
  resultContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  // Download Button
  const downloadPdfBtn = document.createElement("button");
  downloadPdfBtn.id = "download";
  downloadPdfBtn.classList.add("results-section__download");
  downloadPdfBtn.setAttribute("type","button");
  downloadPdfBtn.setAttribute("aria-label","Download IP address information as PDF");
  downloadPdfBtn.textContent = "Donwload as pdf";
  resultContainer.appendChild(downloadPdfBtn);
  downloadPdfBtn.addEventListener("click", (_) => print());
}

function resetInputes() {
  document.querySelector("#ipadd").value = "";
  document.querySelector("#prefix").value = "";
  document.querySelector("#subnetMask").value = "";
  init(0);
}

function init(result) {
  const errorFiled = document.querySelector("#errorMSG");
  const articleContainer = document.querySelector(".main__result")
  const downloadBtn = document.querySelector("#download");
  const resultContainer = document.querySelector(".results-section");
  const ipAdd = document.querySelector("#ipadd");
  const prefix = document.querySelector("#prefix");

  errorFiled.textContent = "";
  prefix.setAttribute("aria-invalid", "false");
  ipAdd.setAttribute("aria-invalid", "false");

  ipAdd.removeAttribute("aria-describedby");
  prefix.removeAttribute("aria-describedby");

  if(articleContainer) articleContainer.remove();
  if (downloadBtn) downloadBtn.remove();
  if (result === 0) resultContainer.style.display = "none";
  else {
    resultContainer.style.display = "block";
    resultContainer.setAttribute("aria-live", "polite");
  }
  console.clear();
}

document.addEventListener("DOMContentLoaded", (_) => {
  const calculateBtn = document.querySelector("#calculate");
  const resetBtn = document.querySelector("#reset");

  calculateBtn.addEventListener("click", inputVerification);
  resetBtn.addEventListener("click", resetInputes);
});
