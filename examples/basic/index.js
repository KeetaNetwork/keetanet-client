#! /usr/bin/env node

/**
 * Load the KeetaNet Client SDK
 */
const KeetaNet = require('@keetanetwork/keetanet-client');
const util = require('node:util');

/**
 * This is the seed for the demo account. It is used to generate a public key
 * and private key pair.
 *
 * DO NOT USE THIS FOR ANY OTHER PURPOSES OTHER THAN DEMONSTRATION.
 *
 */
const DEMO_ACCOUNT_SEED = 'D3M0D3M0D3M0D3M0D3M0D3M0D3M0D3M0D3M0D3M0D3M0D3M0D3M0D3M0D3M0D3M0';

async function main() {
	/**
	 * Construct a signer account which is used to sign transactions.
	 */
	const signer_account = KeetaNet.lib.Account.fromSeed(DEMO_ACCOUNT_SEED, 0);
	console.log('Signer account:', signer_account.publicKeyString.get());

	/**
	 * Construct a KeetaNet UserClient which is used to interact with the
	 * KeetaNet network as a user.
	 *
	 * We will use the test network for this demo, and the account we just
	 * created.
	 */
	const client = KeetaNet.UserClient.fromNetwork('test', signer_account);

	/**
	 * Get the account information for the demo account.
	 * This will return the account information for the demo account.
	 */
	const account_state = await client.state();
	console.log('Account state:', KeetaNet.lib.Utils.Helper.debugPrintableObject(account_state));

	/**
	 * Get the history for the demo account.
	 */
	const account_history = await client.history();
	console.log('Account history:', util.inspect(KeetaNet.lib.Utils.Helper.debugPrintableObject(account_history), { depth: 10, colors: true }));

	/**
	 * Send a token from the demo account to faucet using a Builder
	 */
	/**
	 * Create a builder which is used to construct a transaction.
	 */
	const builder = client.initBuilder();

	/**
	 * Add a transaction to the builder. This will send 1 token from the demo
	 * account to the faucet account.
	 */
	const faucet_account = KeetaNet.lib.Account.fromPublicKeyString('keeta_aabszsbrqppriqddrkptq5awubshpq3cgsoi4rc624xm6phdt74vo5w7wipwtmi');
	builder.send(faucet_account, 1n, client.baseToken);

	/**
	 * Compute and log the transaction -- this is optional
	 * but useful to get the final blocks for recording
	 * locally in case they are needed later.
	 */
	const computed_builder = await client.computeBuilderBlocks(builder);
	console.log('Blocks:', computed_builder.blocks);

	/**
	 * Send the transaction to the network.
	 */
	const transaction = await client.publishBuilder(builder);
	console.log('Transaction:', transaction);
}

main().then(function() {
	process.exit(0);
}, function(err) {
	console.error(err);
	process.exit(1);
});
