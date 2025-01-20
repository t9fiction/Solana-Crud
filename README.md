```markdown
# Solana Journal CRUD dApp
```
A decentralized journaling application built on Solana blockchain that demonstrates basic CRUD (Create, Read, Update, Delete) operations.
This project serves as a learning resource for building on Solana using Anchor framework and Next.js.

## Features

- Create journal entries with title and message
- Read journal entries associated with your wallet
- Update existing journal entries
- Delete journal entries
- Input validation and error handling
- Secure data storage using PDAs (Program Derived Addresses)

## Technical Stack

- **Blockchain**: Solana
- **Smart Contract Framework**: Anchor
- **Frontend**: Next.js
- **Wallet Integration**: Solana Wallet Adapter
- **Development Environment**: Created using create-solana-dapp

## Smart Contract Details

The Solana program implements the following functionality:

- **Create**: Create a new journal entry with a title (max 50 chars) and message (max 280 chars)
- **Update**: Modify the message of an existing journal entry
- **Delete**: Remove a journal entry and recover rent
- **Storage**: Uses PDAs with seeds derived from title and owner's public key

## Prerequisites

- Node.js 14+ and npm
- Rust and Cargo
- Solana CLI tools
- Anchor Framework
- A Solana wallet (e.g., Phantom)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <project-name>
```

2. Install dependencies
```bash
# Install Anchor dependencies
cd program
anchor build

# Install frontend dependencies
cd app
npm install
```

3. Configure your Solana cluster
```bash
solana config set --url localhost
```

## Development

1. Start local Solana validator (in a separate terminal)
```bash
solana-test-validator
```

2. Deploy the program
```bash
cd program
anchor deploy
```

3. Start the frontend application
```bash
cd app
npm run dev
```

## Usage

1. Connect your Solana wallet
2. Create a new journal entry by providing a title and message
3. View your entries in the journal list
4. Update or delete entries as needed

## Project Structure

```
├── anchor/                # Solana program (smart contract)
│   ├── program
        ├── src/               
│       │   └── lib.rs         # Program logic
│       ├── Cargo.toml
│       └── Anchor.toml
├── app/                    # Next.js frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom hooks for program interaction
│   │   └── utils/        # Utility functions
│   └── package.json
└── README.md
```

## Smart Contract State

The program maintains the following state for each journal entry:

```rust
pub struct JournalEntryState {
    pub owner: Pubkey,
    pub title: String,     // Max 50 characters
    pub message: String,   // Max 280 characters
}
```

## Error Handling

The program includes comprehensive error handling for:
- Title length constraints (1-50 characters)
- Message length constraints (1-280 characters)
- Ownership verification
- Account validation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Acknowledgments

- Solana Foundation
- Anchor Framework
- create-solana-dapp

## Disclaimer

This is a learning project and should not be used in production without proper security audits and testing.
```

This README provides:
1. A clear overview of the project
2. Technical details of the implementation
3. Setup and usage instructions
4. Project structure
5. Development guidelines
6. Error handling information
