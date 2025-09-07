---
title: InfluxDB
layout: default

---

## InfluxDB Naming Conventions & Field Purposes

| Component   | What it is                            | Purpose                                      | Naming convention / Examples |
|-------------|---------------------------------------|----------------------------------------------|-------------------------------|
| **Measurement** | The main concept being measured       | Groups time series of the same metric         | Lowercase, snake_case. Ex: `ac_power`, `dc_voltage`, `temperature` |
| **Tags**       | Metadata descriptors (indexed)         | Filter, group, and identify series            | Lowercase, snake_case. Ex: `site=atamo`, `sector=2`, `inverter=1` |
| **Fields**     | Actual values that change over time   | Store the data points (not indexed)           | Lowercase, snake_case. Ex: `active_power=128.0`, `voltage=220.4` |
| **Timestamp**  | When the measurement happened         | Orders and aligns time series                 | Unix time (UTC). Ex: `1631116800` |

---

### Example (line protocol)

ac_power,site=atamo,sector=2,inverter=1 active_power=128.0,reactive_power=35.5,voltage=220.4 1631116800

- **Measurement** → `ac_power`  
- **Tags** → `site=atamo`, `sector=2`, `inverter=1`  
- **Fields** → `active_power`, `reactive_power`, `voltage`  
- **Timestamp** → `1631116800`  


## References on InfluxDB Schema Design and Naming Conventions

### 1. InfluxDB Official — Schema Design Recommendations
- Source: *InfluxDB Schema Design Recommendations*  
  Official guidelines on schema design: measurements, tags, fields, timestamps, and how to optimize for query performance.  
  [https://docs.influxdata.com/influxdb3/cloud-serverless/write-data/best-practices/schema-design](https://docs.influxdata.com/influxdb3/cloud-serverless/write-data/best-practices/schema-design)

### 2. InfluxDB Official — Naming Restrictions & Conventions
- Source: *InfluxDB Naming Restrictions and Conventions*  
  Recommendations about descriptive names, using snake_case, avoiding special characters and reserved words in identifiers.  
  [https://docs.influxdata.com/influxdb3/enterprise/reference/naming-restrictions](https://docs.influxdata.com/influxdb3/enterprise/reference/naming-restrictions)

### 3. InfluxDB Official (v1) — Schema and Data Layout
- Source: *InfluxDB Schema and Data Layout (v1)*  
  Explains the difference between tags and fields, when to use each, and how to avoid high cardinality and sparse schemas.  
  [https://docs.influxdata.com/influxdb/v1/concepts/schema_and_data_layout](https://docs.influxdata.com/influxdb/v1/concepts/schema_and_data_layout)

### 4. InfluxDB Official (v2) — Key Concepts
- Source: *InfluxDB Key Concepts (v2)*  
  Fundamentals of InfluxDB data model: measurements, tags, fields, and timestamps, and how they impact performance.  
  [https://docs.influxdata.com/influxdb/v2/reference/key-concepts/data-elements](https://docs.influxdata.com/influxdb/v2/reference/key-concepts/data-elements)
