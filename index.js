import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

(async () => {
    // Step 1: Connect to cluster and generate a new Keypair
    const connection = new Connection(clusterApiUrl('devnet'), "confirmed");
    //const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const fromWallet = Keypair.generate();
    const toWallet = Keypair.generate();
    const adrophash = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
    //Wait till the Airdrop happens
    await connection.confirmTransaction(adrophash , { commitment: "confirmed" });
    console.log("From Wallet", fromWallet);
    console.log("To Wallet", toWallet);

    const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9); // Here we are creating a new coin inside from wallet, so we will need some SOL for the tx too..
    //createMint(connection,Wallet(Signer), public address of the wallet, Freeze Authority, decimals) // Follow this process.
    // Step 3: Create new token mint and get the token account of the fromWallet address
    //If the token account does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, fromWallet.publicKey);
    console.log("Mint Object", mint);
    console.log("From Token Account", fromTokenAccount);
    //Step 4: Mint a new token to the from account
    let signature = await mintTo(
	connection,
	fromWallet,
	mint,
	fromTokenAccount.address,
	fromWallet.publicKey,
	1000000000,
	[]
);
    console.log("Mint Tx: ", signature);

    //Step 5: Get the token account of the to-wallet address and if it does not exist, create it
const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet.publicKey);
console.log("To Token Account", toTokenAccount);
    //Step 6: Transfer the new token to the to-wallet's token account that was just created
    // Transfer the new token to the "toTokenAccount" we just created
    const transignature = await transfer(connection, fromWallet, fromTokenAccount.address, toTokenAccount.address, fromWallet.publicKey, 1000000000, []);
    console.log('transfer tx:', transignature);
})();