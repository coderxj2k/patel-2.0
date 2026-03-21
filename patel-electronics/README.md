# Patel Electronics Clone

This project recreates the Patel Electronics landing page with a React front end, a Node/Express API, and Firebase (Firestore) as the backing database.

## Project Structure

- `client/` – React (Vite) single-page application.
- `server/` – Express API that pulls collection and product data from Firestore, with fallback datasets.

## Requirements

- Node.js 18+
- Firebase project (Firestore) credentials

## Setup

### 1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure Firebase

Copy the example env file and fill in your Firebase service account details:

```bash
cd server
cp .env.example .env
```

### 3. Run the servers

Start the API:

```bash
cd server
npm run dev
```

Start the client in another terminal:

```bash
cd client
npm run dev
```

The UI will be available at `http://localhost:5173` and will request collection + product data from `http://localhost:8080/api/collections` and `http://localhost:8080/api/products`.

## Firestore Data Shape

Create a `collections` collection with documents shaped like:

```json
{
  "title": "Fabric Care",
  "description": "Advanced washing systems for delicate textiles."
}
```

Create a `products` collection with documents shaped like:

```json
{
  "name": "Frostline Smart Fridge",
  "description": "Counter-depth cooling with adaptive humidity drawers.",
  "price": 1299
}
```

If Firestore is not configured or returns empty data, the API falls back to a predefined dataset.

## Payment Prototype

The checkout form posts to `POST /api/checkout`, which returns a mocked success response. Replace this endpoint with a real payment provider integration (Stripe, Razorpay, etc.) for production use.
