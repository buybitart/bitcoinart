# BitcoinArt

**An open-source solution giving Bitcoin artists, makers, and independent creators their own customizable, self-hosted website complete with e-commerce and auction tools to showcase and sell handmade, Bitcoin-inspired artworks directly to collectors. Because an independently hosted site is the only place you fully control your content and presentation and the only place immune to deletion or censorship, it becomes your forever home on the web.**
![image](https://github.com/user-attachments/assets/57f6c1dc-3b35-4bfa-a229-512b137d788c)
---

## Table of Contents

1. [About](#about)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Prerequisites](#prerequisites)  
5. [Installation & Startup](#installation--startup)  
6. [Usage](#usage)  
7. [Directory Structure](#directory-structure)  
8. [Configuration](#configuration)  
9. [Architecture](#architecture)  
10. [Principles & Values](#principles--values)  
11. [Roadmap](#roadmap)  
12. [Contributing](#contributing)  
13. [Code of Conduct](#code-of-conduct)  
14. [License](#license)  
15. [Contact](#contact)  

---

## About

Hi, I'm Aksana (aka 5Ksana), a Bitcoin artist and fashion designer from Poland. Since 2017, I've been creating physical Bitcoin-inspired art, and I have over 22 years of experience as a professional tailor. Learn more about me here: [https://buybitart.com/about](https://buybitart.com/about)

![image](https://github.com/user-attachments/assets/473fd674-02d5-48c0-a5a6-84f1cb21fc76)

We recently launched [buybitart.com](https://buybitart.com), a simple, open-source site for Bitcoin artists, as well as for independent creators:

- Showcase original, handmade artwork
- Sell via an online store or auctions
- Accept BTC payments via BTCPay Server
- Support USDT and credit card payments through Stripe

My husband Aliaksandr [GitHub](https://github.com/Berichicko), a few close friends, and I built this from scratch using our personal savings. Our goal is to empower artists, especially in restrictive countries, to share and sell their work globally without banks or middlemen, promoting creative freedom and financial independence with open-source Bitcoin tools.

---

## Features

- **Gallery & Storefront**  
  Browse, filter, search and purchase original artworks.  
- **Auction System**  
  Place bids, view bid history, receive notifications.  
- **Payment Integration**  
  - BTC (Bitcoin network - BTC) or USDT  (Tron network -TRC20) via [BTCPay Server](https://btcpayserver.org)  
  - USD & credit cards via [Stripe](https://stripe.com)  
- **Responsive Design**  
  Works seamlessly on desktop and mobile.  
- **Static Content**  
  Bio, exhibitions, and contact pages.

---

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS  
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL  
- **Payments:** BTCPay Server, Stripe  
- **Containerization:** Docker, Docker Compose  

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) ≥ 20.10  
- [Docker Compose](https://docs.docker.com/compose/install/) ≥ 1.29  

---

## Installation & Startup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/buybitart/bitcoinart.git
   cd bitcoinart
   ```

2. **Copy environment templates**  
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Edit `.env` files**  
   - `backend/.env`: set your `DATABASE_URL`, `BTCPAY_URL`, `BTCPAY_API_KEY`  
   - `frontend/.env`: set `VITE_API_BASE_URL`  

4. **Launch with Docker Compose**  
   ```bash
   docker-compose up -d
   ```

5. **Verify**  
   - Frontend: localhost:3000 
   - API:      localhost:4000/api 

---

## Usage

- **Browse Art:** Explore the gallery on the homepage.  
- **Purchase:** Add to cart or participate in auctions.  
- **Payments:** Follow on-screen instructions for BTC or Stripe checkout.  
- **Admin:** Extend or customize via environment variables and API endpoints.

---

## Directory Structure

```
bitcoinart/
├── backend/              # Express API server
│   ├── src/
│   ├── .env.example
│   └── Dockerfile
├── frontend/             # React SPA (Vite)
│   ├── src/
│   ├── .env.example
│   └── Dockerfile
├── docker-compose.yml
├── architecture-diagram.png
├── LICENSE
└── README.md
```

---

## Configuration

Sample environment variables:

```dotenv
# backend/.env
PORT=4000
DATABASE_URL=postgres://user:pass@db:5432/bitcoinart
BTCPAY_URL=https://your-btcpay-server
BTCPAY_API_KEY=your_btcpay_api_key

# frontend/.env
VITE_API_BASE_URL=localhost:4000/api
```

Ensure real credentials are secured and never committed to Git. `.gitignore` excludes all `.env` files by default.

---

## Architecture

1. **User Browser** → requests UI from **Frontend** (React, Vite)  
2. **Frontend** → interacts with **Backend** (Node.js, Express)  
3. **Backend** → reads/writes to **PostgreSQL**, and routes payments to **BTCPay Server** (BTC) & **Stripe** (USDT & cards)

For example

The main ideas are:

- **Low cost**
- **Modular (you can add or remove parts easily)**
- **Full control (you control all content and payments)**



The goal is to give artists and creators an independent, customizable website that they host themselves.
This way, there is no risk of censorship.

![buybitart](https://github.com/user-attachments/assets/32b47a56-8b2e-4ffd-955e-23e29520db7b)

---

## Principles & Values

We align with UNESCO’s definition of **artistic freedom** the right “to imagine, create and distribute diverse cultural expressions free of governmental censorship, political interference or pressures of non-state actors,” and “the ability of individuals to access diverse cultural expressions” 

---

## Roadmap

- **Localization & Internationalization**  
  Add support for multiple languages, locale-aware formatting, and right-to-left layouts where needed.  
- **Accessibility Enhancements**  
  Improve compliance with WCAG guidelines: keyboard navigation, screen-reader labels, color contrast, and assistive technologies support.  
- **User Experience (UX) Improvements**  
  Refine user flows, optimize performance, enhance mobile and low-bandwidth experiences, and gather user feedback for iterative design. 
- **Login with NOSTR**  
  Censorship resistant open source communication protocol that is incredibly  
- **New CMS panel with KeystoneJS**  
  Self-hosted, open-source headless CMS 

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repo  
2. Create your branch: `git checkout -b feature/YourFeature`  
3. Commit your changes: `git commit -m 'Add some feature'`  
4. Push to the branch: `git push origin feature/YourFeature`  
5. Open a Pull Request  

See [CONTRIBUTING.md](https://github.com/buybitart/bitcoinart/blob/main/CONTRIBUTING.md) for detailed guidelines and code style.

---

## Code of Conduct

This project follows the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to abide by its terms.

---

## License

Distributed under the **MIT License**. See [LICENSE](https://github.com/buybitart/bitcoinart/blob/main/LICENSE.md) for details.

---

## Contact

- **Aksana (5Ksana)** — Bitcoin Artist & Fashion Designer  
- Website: [buybitart.com](https://buybitart.com)  
- GitHub: [buybitart/bitcoinart](https://github.com/buybitart/bitcoinart)  
- Email: [contact@buybitart.com](mailto:contact@buybitart.com)

If you'd like to support the project, please visit the [donation page](https://buybitart.com/support) 
