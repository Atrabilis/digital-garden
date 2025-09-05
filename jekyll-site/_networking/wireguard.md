---
title: "Wireguard"
layout: default
---

# 📖 Guía de configuración WireGuard (Servidor + Cliente)

## 1. Instalación
```
sudo apt update && sudo apt install wireguard
```
## 2. Generar claves
wg genkey | tee privatekey | wg pubkey > publickey
- privatekey: clave privada (**no compartir**)  
- publickey: se comparte con el otro peer  

## 3. Configuración del Servidor (/etc/wireguard/wg0.conf)
```
[Interface]
PrivateKey = SERVER_PRIVATE_KEY
Address = 10.0.0.1/24
ListenPort = 51820

[Peer] # Cliente 1
PublicKey = CLIENT1_PUBLIC_KEY
AllowedIPs = 10.0.0.2/32

[Peer] # Cliente 2
PublicKey = CLIENT2_PUBLIC_KEY
AllowedIPs = 10.0.0.3/32

- Address: IP interna del servidor  
- ListenPort: puerto UDP (51820 por defecto)  
- AllowedIPs: IP única de cada cliente (no usar /24 aquí)  
```
## 4. Configuración del Cliente (/etc/wireguard/wg0.conf)
```
[Interface]
PrivateKey = CLIENT_PRIVATE_KEY
Address = 10.0.0.2/24

[Peer]
PublicKey = SERVER_PUBLIC_KEY
Endpoint = SERVER_PUBLIC_IP:51820
AllowedIPs = 10.0.0.0/24
PersistentKeepalive = 25

- Address: IP interna del cliente  
- Endpoint: IP pública y puerto del servidor  
- AllowedIPs:  
  • 10.0.0.0/24 → solo tráfico de la red VPN  
  • 0.0.0.0/0, ::/0 → todo el tráfico pasa por el túnel  
- PersistentKeepalive: mantiene vivo el túnel detrás de NAT  
```
## 5. Levantar la interfaz
```
sudo wg-quick up wg0
```

Apagar:
```
sudo wg-quick down wg0
```
## 6. Arranque automático
```
sudo systemctl enable wg-quick@wg0
```
## 7. Verificar conexión
```
sudo wg show
```

## 8. Pruebas de red
Cliente:
```
ping 10.0.0.1
```
Servidor:
```
ping 10.0.0.2
```

## 9. Seguridad y Accesos
- Cada cliente tiene claves únicas.  
- AllowedIPs en el servidor → IP interna asignada al cliente.  
- AllowedIPs en el cliente → qué tráfico se enruta por la VPN.  
- Nunca reutilizar claves ni IPs.  
- Usa firewall (ufw o iptables) si necesitas restringir accesos.  