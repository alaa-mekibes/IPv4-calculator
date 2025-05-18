# IPv4 Subnet Calculator

## 📌 Overview

This IPv4 Subnet Calculator is a web-based tool that helps network engineers, students, and IT professionals quickly calculate subnet information for any given IPv4 address. The tool provides detailed network configuration data including network address, broadcast address, usable host range, subnet mask, and more - all presented in both decimal and binary formats.

Built with pure client-side technologies (HTML, CSS, JavaScript) using Object-Oriented Programming principles, this calculator requires no server-side processing and runs entirely in the browser.

## 🛠️ Development Approach

The calculator was developed using modern JavaScript classes following OOP principles:

```javascript
class IpAddress {} // Base class for IP address operations
class NetworkParts extends IpAddress {} // Handles common network components
class Network extends NetworkParts {} // Calculates network address
class SubnetMask extends NetworkParts {} // Handles subnet mask operations
class WildCardMask extends NetworkParts {} // Calculates wildcard mask
class Broadcast extends NetworkParts {} // Calculates broadcast address
class FirstLastMachine extends NetworkParts {} // Determines first/last usable hosts
```

This class hierarchy allows for clean code organization and easy maintenance. The UI was built with responsive CSS to work well on different devices.

## 🔢 Calculation Methodology

The calculator performs the following operations:

1. **IP Address Parsing:** Splits the input IP in CIDR format (e.g., `198.51.100.7/18`) into its decimal octets and prefix.
2. **Network and Host Parts:** Converts the IP address to binary. The first *n* bits "in RED" (according to the prefix) are considered the network part. The remaining bits form the host part "in GREEN".
3. **Subnet Mask:** Built by setting the first *n* bits to `1` (network bits), and the rest to `0` (host bits). For example, `/18` gives `255.255.192.0`.
4. **Wildcard Mask:** Calculated as the **reverse** of the subnet mask — each octet is subtracted from `255`. For example, `255.255.192.0` becomes `0.0.63.255`.
5. **Network Address:** Constructed by **keeping the network part** of the IP and **setting all host bits to `0`**.
6. **Broadcast Address:** Built by **keeping the network part** and **setting all host bits to `1`**.
7. **Host Count:** Calculated as `2^(number of host bits) - 2`.

## IP Address Type Classification  

This tool automatically detects the type of an IPv4 address (private, public, loopback, etc.) based on its numerical value. The classification follows standard networking rules and helps identify special-use addresses.  

#### How It Works  
The `whichType()` method checks the IP address against known ranges in a specific order:  

1. **Private IPs** (used in local networks):  
   - `10.x.x.x` (e.g., 10.0.0.1)  
   - `172.16.x.x` to `172.31.x.x` (e.g., 172.16.1.5)  
   - `192.168.x.x` (e.g., 192.168.1.1)  

2. **Loopback** (used for local testing, always points back to your own machine):  
   - `127.x.x.x` (e.g., 127.0.0.1)  

3. **Link-local** (used when a device can’t get an IP automatically):  
   - `169.254.x.x` (e.g., 169.254.1.10)  

4. **Multicast** (used for group communication, like video streaming):  
   - `224.x.x.x` to `239.x.x.x` (e.g., 224.0.0.251)  

5. **Broadcast** (special address to send data to all devices in a network):  
   - `255.255.255.255`  

6. **Reserved** (addresses set aside for special purposes or future use):  
   - `0.x.x.x` (e.g., 0.0.0.0 – often means "any address")  
   - `100.64.x.x` to `100.127.x.x` (used for carrier-grade NAT)  
   - `192.0.0.x`, `192.0.2.x`, `192.88.99.x` (documentation/testing)  
   - `198.18.x.x` to `198.19.x.x` (benchmark testing)  
   - `198.51.100.x` (example/test address)  
   - `203.0.113.x` (another test range)  
   - Anything from `240.x.x.x` and above (reserved for future use)  

7. **Public IPs** (normal internet addresses):  
   - If none of the above rules match, the IP is considered public (e.g., 8.8.8.8, 142.250.190.46).

## 📥 PDF Export Feature

Users can download the calculation results as PDF:
1. Click the "Download as PDF" button
2. The browser's print dialog will appear
3. Select "Save as PDF" as the destination
4. Choose your preferred settings and save

## 🖼️ Screenshot

![IPv4 tool screenshot desktop](/assets/img/screenShot_desktop.png)

## 💡 Developer

**[Alaa MEKIBES](https://github.com/alaa-mekibes)**

*Feel free to contribute to this project or report issues through GitHub!*