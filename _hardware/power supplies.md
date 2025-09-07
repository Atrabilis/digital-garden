---
title: "Power Supplies"
layout: default
---

# Power Supplies

Power supplies are electric devices that transform the AC signal from your power line into DC power for your PC to use. They have various important specifications, listed below:

## Form factor

| Form Factor | Width (mm) | Height (mm) | Depth (mm)      | Notes                                    |
|-------------|------------|-------------|-----------------|------------------------------------------|
| ATX         | 150        | 86          | 140–180         | Standard desktop PSU, most common.        |
| SFX         | 125        | 63.5        | 100             | Small form factor, mini-ITX builds.       |
| SFX-L       | 125        | 63.5        | 130             | Longer version of SFX for bigger fan.     |
| TFX         | 85         | 65          | 175             | Slim cases, office desktops.              |
| Flex-ATX    | 81.5       | 40.5        | 150             | Very compact, thin clients/embedded.      |
| EPS (server)| 150        | 86          | 200–300+        | Server/workstation, extended ATX size.    |

You will see ATX power supplies more often.

## Modularity
Power supplies also differ in modularity, wich refers to whether  the cables can be detached or not.

| Modularity Type | Description                                                                 | Pros                                         | Cons                                     |
|-----------------|-----------------------------------------------------------------------------|----------------------------------------------|------------------------------------------|
| Non-modular     | All cables are permanently attached to the PSU.                            | Cheapest, fewer connection points.           | Messy cable management, unused cables.   |
| Semi-modular    | Essential cables (24-pin ATX, CPU 8-pin) are fixed; others are detachable. | Balance between price and flexibility.       | Still some permanent cables.             |
| Fully modular   | All cables (including 24-pin ATX) are detachable.                          | Best airflow, easy cable management, replaceable cables. | More expensive, extra connectors add complexity. |

## Power factor correction (PFC)

By being a switching device by design, power supplies have power factor, this power factor can be corrected or not, depending on the design.

| PFC Type      | Description                                                            | Power Factor (PF) | Pros                                       | Cons                                      |
|---------------|------------------------------------------------------------------------|-------------------|--------------------------------------------|-------------------------------------------|
| None (legacy) | No correction, just rectifier + bulk capacitors.                       | ~0.5–0.6          | Very cheap, simple design.                 | Inefficient, high harmonics, not compliant with modern standards. |
| Passive PFC   | Uses passive components (inductor/coil) to improve PF.                 | ~0.7              | Better than none, inexpensive.             | Large, heavy coil; fixed input voltage (e.g., only 220 V). |
| Active PFC    | Uses electronic circuits (MOSFETs + controllers) to shape input current.| 0.95–0.99         | High efficiency, wide input (100–240 V), standard today. | Slightly more expensive, more complex design. |

## Efficiency certification (80 Plus)

Power supplies can, or not, align with the 80 Plus certification, a commercial certification created in 2004 by Ecos Consulting (now managed by CLEAResult and EPRI). It certifies that a power supply hace at least 80% efficiency at 20%, 50% and 100% of demand. Now is the defacto standard in the industry.

| Certification | 10% Load | 20% Load | 50% Load | 100% Load | Typical Efficiency |
|---------------|----------|----------|----------|-----------|--------------------|
| Standard      |   –      |   80%    |   80%    |   80%     | ~80%               |
| Bronze        |   –      |   82%    |   85%    |   82%     | ~83–85%            |
| Silver        |   –      |   85%    |   88%    |   85%     | ~86–88%            |
| Gold          |   –      |   87%    |   90%    |   87%     | ~89–90%            |
| Platinum      |   –      |   90%    |   92%    |   89%     | ~91–92%            |
| Titanium      |  90%     |   92%    |   94%    |   90%     | ~93–94%            |


## Design topology

Like any other power converter, PSUs have different circuit topologies. Knowing the topology can help in the repair process if needed.

| Topology                | Description                                                                 | Typical Efficiency | Usage in PSUs                        |
|--------------------------|-----------------------------------------------------------------------------|--------------------|---------------------------------------|
| Half-Bridge             | Early design with two switching transistors; simple but inefficient.        | ~65–70%            | Very old AT/early ATX, obsolete today. |
| Double Forward          | Uses two MOSFETs with a transformer; better than half-bridge.               | ~70–80%            | Low-cost ATX, entry-level non-certified. |
| Active Clamp Forward    | Variant of forward with energy recovery; reduces switching losses.           | ~75–85%            | Mid-range PSUs without high certification. |
| LLC Resonant Half-Bridge| Resonant converter with soft switching; very efficient, modern standard.     | ~85–94%            | Bronze to Titanium certified PSUs.    |
| Synchronous Rectification| Uses MOSFETs instead of diodes on secondary side, reducing conduction loss.| +2–4% boost        | Combined with LLC in high-end designs. |


## Dimensioning

here is a short guide in the dimensioning of a PSU 


---

### 1. Identify the Main Consumers
- **GPU (Graphics Card)** → usually the largest consumer (150–500 W).
- **CPU (Processor)** → second largest (65–250 W).
- **Other components**:
  - Motherboard + chipset: ~40–60 W
  - RAM: ~3–5 W per module
  - SSD/HDD: 3–10 W each
  - Fans / pumps: 2–5 W each

👉 Rule of thumb: **GPU + CPU = 80–90% of total system power.**

---

### 2. Estimate Total System Load
- Add GPU + CPU + ~50–100 W for the rest of the system.
- Example:
  - GPU: 220 W
  - CPU: 125 W
  - Rest: 60 W
  - **Total = 405 W**

---

### 3. Add Safety Margin
- Apply **20–30% headroom** for transients and future upgrades.
- Formula: 

    PSU wattage ≈ (GPU + CPU + 70 W) × 1.3

---

### 4. Select PSU Wattage
- **Entry-level builds (no GPU / iGPU only):** 400–500 W
- **Mid-range gaming (RTX 3060/i5):** 550–650 W
- **High-end gaming (RTX 4080/i7/i9):** 750–850 W
- **Extreme builds (RTX 4090/5090 + i9/Ultra 9):** 1000–1200 W

---

### 5. Consider PSU Quality
- **Certification:** At least 80 PLUS Bronze (Gold recommended).
- **PFC:** Active PFC is standard and required.
- **Topology:** Prefer modern designs (LLC resonant + synchronous rectification).
- **Modularity:** Semi- or fully modular for better cable management.

---

### 6. Verify Connectors
- Ensure enough **PCIe 8-pin / 12VHPWR** connectors for GPU.
- Ensure proper **EPS (CPU power)** connectors for your motherboard.

---

## ✅ Quick Checklist
- [ ] Calculate GPU + CPU power draw
- [ ] Add 70 W for other components
- [ ] Add 20–30% headroom
- [ ] Choose PSU with proper certification
- [ ] Verify connectors (PCIe/EPS)
