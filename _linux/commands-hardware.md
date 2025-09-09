---
layout: default
title: Hardware
---

# 🔧 Linux Hardware Commands Cheat Sheet

## 🔍 System Information

| Command          | Description |
|------------------|-------------|
| `uname -a`       | Show kernel version and architecture |
| `lsb_release -a` | Display Linux distribution info |
| `hostnamectl`    | Show system status, kernel, architecture |

## 💻 CPU

| Command             | Description |
|---------------------|-------------|
| `lscpu`             | Detailed CPU info (cores, threads, flags) |
| `cat /proc/cpuinfo` | Per-core CPU information |

## 🖥️ GPU
### NVIDIA

| Command            | Description |
|--------------------|-------------|
| `nvidia-smi`       | GPU status, drivers, VRAM, active processes |
| `nvidia-settings`  | Open NVIDIA settings GUI |

### AMD

| Command                   | Description |
|---------------------------|-------------|
| `lspci \| grep VGA`       | Identify AMD GPU |
| `rocminfo`                | Detailed ROCm info (if installed) |
| `clinfo`                  | OpenCL info (works for AMD and Intel) |

### Intel

| Command                   | Description |
|---------------------------|-------------|
| `lspci \| grep VGA`       | Identify Intel GPU |
| `intel_gpu_top`           | Real-time Intel GPU usage monitor |

## 🧠 Memory (RAM)

| Command             | Description |
|---------------------|-------------|
| `free -h`           | Show free/used memory in human-readable form |
| `vmstat -s`         | Memory statistics |
| `cat /proc/meminfo` | Detailed memory information |

## 💽 Disk & Storage

| Command        | Description |
|----------------|-------------|
| `lsblk`        | List block devices (disks, partitions) |
| `df -h`        | Show disk usage of mounted filesystems |
| `sudo fdisk -l`| Partition details (requires root) |
| `lsusb`        | List connected USB devices |

## 🌐 Network

| Command        | Description |
|----------------|-------------|
| `ip a`         | Show network interfaces and IP addresses |
| `iwconfig`     | Wireless info (requires wireless-tools) |
| `ethtool eth0` | Show network adapter details (replace `eth0`) |

## 📦 Sensors & Temperature

| Command                  | Description |
|--------------------------|-------------|
| `sudo apt install lm-sensors -y` | Install lm-sensors package |
| `sudo sensors-detect`    | Detect temperature/voltage sensors |
| `sensors`                | Show sensor readings |

## 📊 All-in-One Tool

| Command                        | Description |
|--------------------------------|-------------|
| `sudo apt install inxi -y`     | Install inxi system info tool |
| `inxi -Fxz`                    | Full system info (CPU, GPU, RAM, network, etc.) |
