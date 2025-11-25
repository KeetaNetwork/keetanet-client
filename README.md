# KeetaNet Client (JavaScript / TypeScript SDK)

A simple and lightweight JavaScript client for interacting with the Keeta Network.

This README provides a beginner-friendly quick start guide so new developers can use the SDK without confusion.

---

## 🚀 Quick Start (Beginner Friendly)

### 1. Install the package

```bash
npm install @keetanetwork/keetanet-client
```

If you prefer yarn:

```bash
yarn add @keetanetwork/keetanet-client
```

---

## ▶️ Basic Example (Hello Keeta)

Create a file called `example.js`:

```javascript
import { KeetaClient } from "@keetanetwork/keetanet-client";

async function main() {
  // Create the client
  const client = new KeetaClient({
    network: "testnet" // or "mainnet" if available
  });

  // Fetch basic status from the network
  const status = await client.getStatus();
  console.log("Network Status:", status);
}

main().catch(console.error);
```

> 📝 NOTE  
> If the real API uses different method names (e.g., `getInfo()`, `ping()`, `status()`), adjust accordingly.  
> This example helps beginners understand how to structure their first script.

---

## ▶️ Run the Example

```bash
node example.js
```

If everything works, you should see some output about the network.

---

## 🧩 Project Structure (Simple Overview)

```
keetanet-client/
 ├── src/          # Source code
 ├── dist/         # Compiled output (after build)
 ├── package.json  # Package info
 └── README.md     # This file
```

---

## 📦 Build From Source

```bash
npm install
npm run build
```

---

## ❓ Troubleshooting

**Common issues:**

### 1. “Cannot find module @keetanetwork/keetanet-client”
Run:

```bash
npm install
npm run build
```

### 2. “TypeError: client.getStatus is not a function”
Check the SDK documentation or look in `src/` to confirm the correct method names.

---

## 🤝 Contributing

Contributions are welcome!

If you're new:

1. Fork the repo  
2. Create a branch  
3. Make simple fixes (readme, examples, docs)  
4. Submit a Pull Request  

---

## 📄 License

MIT License
