---
title: "Wireguard"
layout: default
---

# 📖 WireGuard Configuration Guide (Server + Client)

## 1. Installation
```
sudo apt update && sudo apt install wireguard
```
## 2. Generate Keys
wg genkey | tee privatekey | wg pubkey > publickey
- privatekey: private key (**do not share**)  
- publickey: share with the other peer  

## 3. Server Configuration (/etc/wireguard/wg0.conf)
```
[Interface]
PrivateKey = SERVER_PRIVATE_KEY
Address = 10.0.0.1/24
ListenPort = 51820

[Peer] # Client 1
PublicKey = CLIENT1_PUBLIC_KEY
AllowedIPs = 10.0.0.2/32

[Peer] # Client 2
PublicKey = CLIENT2_PUBLIC_KEY
AllowedIPs = 10.0.0.3/32

- Address: server's internal IP  
- ListenPort: UDP port (51820 by default)  
- AllowedIPs: unique IP for each client (don't use /24 here)  
```
## 4. Client Configuration (/etc/wireguard/wg0.conf)
```
[Interface]
PrivateKey = CLIENT_PRIVATE_KEY
Address = 10.0.0.2/24

[Peer]
PublicKey = SERVER_PUBLIC_KEY
Endpoint = SERVER_PUBLIC_IP:51820
AllowedIPs = 10.0.0.0/24
PersistentKeepalive = 25

- Address: client's internal IP  
- Endpoint: server's public IP and port  
- AllowedIPs:  
  • 10.0.0.0/24 → only VPN network traffic  
  • 0.0.0.0/0, ::/0 → all traffic goes through the tunnel  
- PersistentKeepalive: keeps the tunnel alive behind NAT  
```
## 5. Bring Up the Interface
```
sudo wg-quick up wg0
```

Shut down:
```
sudo wg-quick down wg0
```
## 6. Auto-start
```
sudo systemctl enable wg-quick@wg0
```
## 7. Verify Connection
```
sudo wg show
```

## 8. Network Tests
Client:
```
ping 10.0.0.1
```
Server:
```
ping 10.0.0.2
```

## 9. Security and Access
- Each client has unique keys.  
- AllowedIPs on server → internal IP assigned to client.  
- AllowedIPs on client → which traffic is routed through VPN.  
- Never reuse keys or IPs.  
- Use firewall (ufw or iptables) if you need to restrict access.  