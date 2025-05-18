# IPv4 Subnet Calculator - GitHub README

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
2. **Class Determination:** Identifies the IP class (A, B, C, D, E) based on the first octet.
3. **Network and Host Parts:** Converts the IP address to binary. The first *n* bits (according to the prefix) are considered the network part. The remaining bits form the host part.
4. **Subnet Mask:** Built by setting the first *n* bits to `1` (network bits), and the rest to `0` (host bits). For example, `/18` gives `255.255.192.0`.
5. **Wildcard Mask:** Calculated as the **reverse** of the subnet mask — each octet is subtracted from `255`. For example, `255.255.192.0` becomes `0.0.63.255`.
6. **Network Address:** Constructed by **keeping the network part** of the IP and **setting all host bits to `0`**.
7. **Broadcast Address:** Built by **keeping the network part** and **setting all host bits to `1`**.
8. **Host Count:** Calculated as `2^(number of host bits) - 2`.

## 📥 PDF Export Feature

Users can download the calculation results as PDF:
1. Click the "Download as PDF" button
2. The browser's print dialog will appear
3. Select "Save as PDF" as the destination
4. Choose your preferred settings and save

## 🖼️ Screenshot

![IPv4 tool screenshot desktop](/assets/img/screenShot_desktop.png)
![IPv4 tool screenshot mobile](/assets/img/screenShot_mobile.png)

## 👨‍💻 Developer

**Alaa MEKIBES**  

Feel free to contribute to this project or report issues through GitHub!