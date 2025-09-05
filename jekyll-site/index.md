---
title: "Inicio"
layout: default
---

# Bienvenido a {{ site.title }} 🌱

{{ site.description }}

## Colecciones
A continuación un índice rápido de tus colecciones (primeros ítems):

{%- assign cols = site.collections | where_exp: "c", "c.label != 'posts'" -%}
{%- for c in cols %}
  {%- assign label = c.label -%}
  {%- assign docs = c.docs | sort: "title" -%}
### {{ label }}
{%- if docs.size > 0 %}
- {%- for d in docs limit: 5 -%}
  [{{ d.title | default: d.name }}]({{ d.url | relative_url }}){%- if forloop.last == false -%}, {% endif %}
  {%- endfor -%}
{%- else %}
- *(vacío por ahora)*
{%- endif %}

{%- endfor %}
