---
title: "Application types"
layout: default
---

## Application Types in Backend Development

1. **Full-Stack Web Applications**  
   - Render HTML, include authentication, ORM, forms, admin panels.  
   - Examples: ERP systems, e-commerce platforms, management portals.  

2. **REST APIs**  
   - Expose endpoints for web, mobile, or other services.  
   - Return JSON/HTTP, focused on CRUD and resource management.  

3. **Microservices (RPC / Service-to-Service)**  
   - Independent services communicating with each other.  
   - Use protocols like gRPC for strict contracts and high performance.  

4. **Real-Time Applications**  
   - Live communication with clients.  
   - Use WebSockets, Server-Sent Events (SSE), or streaming.  
   - Examples: chat apps, live dashboards, financial trading systems.  

5. **Prototypes / MVPs (Minimum Viable Products)**  
   - Small or experimental applications.  
   - Prioritize **development speed** over optimization.  

6. **Data-Driven / AI-Driven Applications**  
   - Focus on processing data or serving ML/AI models.  
   - Examples: prediction APIs, recommendation systems, classification services.  

7. **High-Performance / Low-Latency Services**  
   - Backends that must respond in milliseconds.  
   - Examples: adtech platforms, gaming servers, financial APIs.  

8. **Background Jobs / Task Queues**  
   - Asynchronous processing in the background.  
   - Examples: sending emails, generating reports, ETL pipelines.  

9. **GraphQL APIs**  
   - APIs with a flexible schema where the client defines the query.  
   - Useful to avoid over-fetching or under-fetching with REST.  

10. **Monoliths with SSR (Server-Side Rendering)**  
    - Large applications combining frontend and backend on a single server.  
    - Render HTML directly on the server side.  

11. **Event-Driven Systems**  
    - Based on queues or message brokers (Kafka, RabbitMQ, NATS).  
    - Designed for distributed and resilient architectures.  


## My totally unbiased opinion on the best framework choices: Python vs Go

| Application Type               | Best Choice           | Language | Why it wins                                                                 |
|--------------------------------|-----------------------|----------|-----------------------------------------------------------------------------|
| **Full-Stack Web Applications** | **Django**            | Python   | Complete “batteries-included”: ORM, auth, admin, forms, mature ecosystem.   |
| **REST APIs**                   | **FastAPI**           | Python   | Modern, declarative, automatic docs, type hints; faster DX than Go.         |
| **Microservices (RPC)**         | **gRPC (grpc-go)**    | Go       | Native concurrency, streaming, strongly typed contracts, cloud standard.    |
| **Real-Time Applications**      | **Go + nhooyr/websocket** | Go    | Goroutines + lightweight WS library scale better for high concurrency.      |
| **Prototypes / MVPs**           | **Flask**             | Python   | Minimal setup, fastest to get an MVP running.                               |
| **Data-Driven / AI-Driven**     | **FastAPI**           | Python   | Seamless integration with ML/AI libraries (TensorFlow, PyTorch, scikit).    |
| **High-Performance Services**   | **Fiber**             | Go       | Ultra-fast (fasthttp-based), ergonomic API, designed for low-latency APIs.  |
| **Background Jobs / Queues**    | **Asynq**             | Go       | Redis-backed, retries, scheduling, dashboard; robust for production.        |
| **GraphQL APIs**                | **gqlgen**            | Go       | Strong typing, schema-first, widely adopted in Go GraphQL ecosystem.        |
| **Monoliths with SSR**          | **Django**            | Python   | Mature templating, ORM, admin panel, proven in enterprise monoliths.        |
| **Event-Driven Systems**        | **Go + gRPC/Kafka libs** | Go    | Strong ecosystem for distributed, event-driven, cloud-native architectures. |
