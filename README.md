# Supply Chain Tracking App
Blockchain-Based Supply Chain Tracking System  
Built with Solidity, React, MetaMask, and Ethers v6

---

## Overview

The Supply Chain Transparency DApp is a blockchain-powered system that tracks products throughout multiple supply chain stages. All transitions are recorded immutably on the Ethereum Sepolia testnet.

System roles:

- Admin – manages users, configures contract address, updates admin ETH address  
- Producer – creates products and publishes them on-chain  
- Supplier – purchases approved products and becomes their new on-chain owner  
- Consumer – purchases from suppliers and views complete product history  

Product lifecycle:

Producer → Supplier → Consumer

---

## Features

### User Role System
- Four distinct roles (Admin, Producer, Supplier, Consumer)  
- Admin can create or delete users  
- Each user automatically receives an Ethereum keypair  
- Admin may update their ETH address  

### Smart Contract on Sepolia
Contract file: `ProductsChain.sol`

Supports:
- Product registration  
- Ownership transfer  
- On-chain metadata hashing  
- Full product history retrieval  

### MetaMask Integration
MetaMask is used for:
- Signing blockchain transactions  
- Switching to the Sepolia network  
- Reading the transaction signer address  

MetaMask is not used for logging into the DApp.  
Each user has an ETH address stored locally inside the application.

### Contract Configuration Modal
The contract address is not hardcoded.  
Admins can paste the deployed address through a modal.  
The address is stored per network in LocalStorage.

### Role-Based Dashboards
| Role | Capabilities |
|------|--------------|
| Admin | User management, update admin ETH address, set contract |
| Producer | Add products → pending → approve on-chain |
| Supplier | View and purchase approved products |
| Consumer | Purchase products and view on-chain history |

---

## Installation

```bash
git clone <your-repo-url>
cd supply-chain-dapp
npm install
npm start
Open in browser:

http://localhost:3000

Smart Contract Deployment (Remix)
Open Remix: https://remix.ethereum.org

Create file ProductsChain.sol

Paste contract code

Compile using Solidity version 0.8.20

Deploy using the following:

Environment: Injected Provider (MetaMask)

Network: Sepolia

Copy the deployed contract address (example below):

0xA1B2c3D4e5F607890123456789aBCdEF1234abcd

Configuring the DApp
Step 1: Admin Login
makefile
username: admin
password: admin
Step 2: Set Contract Address
Click “Set Contract” in the header

Paste the deployed contract address

Save the configuration

The address is stored per network in LocalStorage.

Role-Based User Guide
Admin
Admin capabilities:

Create or delete users

Edit the admin ETH address

Configure the smart contract address

View all registered users and their ETH addresses

The admin ETH address is separate from the MetaMask address.

Producer
Producers can:

Add new local products

View products in the Pending list (temporary IDs such as #1, #2, etc.)

Approve products to publish them on-chain

Confirm MetaMask transactions

After approval, products appear in the Approved list with real on-chain IDs

Supplier
Suppliers can:

View all approved products

Purchase products via MetaMask

Become the on-chain owner of purchased products

Consumer
Consumers can:

View products available from suppliers

Purchase products via MetaMask

View the complete on-chain product history, including:

Previous owners

Transfer timestamps

Transfer roles (REGISTER, TO_SUPPLIER, TO_CONSUMER)

MetaMask Integration Summary
MetaMask is used for:

Signing transactions

Switching to Sepolia

Reading sender address

MetaMask is not used for:

User authentication

Storing user identity

Users have their own ETH identity stored in LocalStorage.

Local Storage Usage
Storage Key	Description
sc_users_v1	User accounts and their ETH keypairs
sc_products_v1	All pending and approved products
productsChainContractAddresses_v1	Smart contract address saved per chainId

A backend server is not required.

Testing Workflow
1. Admin
Log in

Create a Producer, Supplier, and Consumer

2. Producer
Add products

Approve them on-chain using MetaMask

Confirm that products move to the Approved list

3. Supplier
View approved products

Purchase products (confirm MetaMask transaction)

4. Consumer
Purchase products from suppliers

View complete on-chain history

Troubleshooting
“invalid ENS name”
A non-Ethereum address was entered in the Contract modal.
Enter a valid address (0x + 40 hex characters).

“wrong network”
MetaMask must be set to Sepolia.

Product remains pending
The MetaMask transaction was not confirmed.
Approve the product again and confirm the transaction.

Admin ETH address not updating
Ensure the address is a valid Ethereum address.

License
This project is intended for academic and educational use.
You may modify or extend it as needed.
