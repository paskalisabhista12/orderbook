# 📈 Orderbook

This project is a demonstration of a **stock trading orderbook system**
It simulates how buy and sell orders are placed, matched, and updated in real time.

---

## 🚀 Features
- Order submission (Buy/Sell)
- Real-time orderbook updates
- WebSocket support for live trades and orderbook snapshots
- Dockerized for easy setup

---

## 🛠️ Tech Stack
- **Datafeed Backend**: Django (Python)
- **Backend**: Spring Boot (Java)
- **Frontend**: Next.js
- **Message Queue**: RabbitMQ
- **DB**: PostgreSQL
- **Containerization**: Docker

---

## 📦 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/paskalisabhista12/orderbook.git
cd orderbook
```
### 2. Configure Environment Variables
Fill in all required environment variables in the **root directory** and the **apps/datafeed directory**.
### 3. Run with Docker
```bash
# Run applications
docker compose up

# Run migration
docker compose --profile migrate up
```
