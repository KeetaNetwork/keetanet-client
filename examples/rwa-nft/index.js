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

/*
 * Create some local aliases for the KeetaNet Client SDK
 * use shorter names
 */
/**
 * Debug Print Object
 *
 * This is a utility function which is used to print objects
 * in a debuggable format.  It uses the util.inspect
 * to colorize the output and set the depth to 10.
 *
 * @param {Parameters<typeof KeetaNet.lib.Utils.Helper.debugPrintableObject>} args - The arguments to pass to the the KeetaNet Debug Printable Object method
 */
function DPO(...args) {
	return(util.inspect(KeetaNet.lib.Utils.Helper.debugPrintableObject(...args), {
		depth: 10,
		colors: true
	}));
}

/**
 * Many functions require an ArrayBuffer but some of our conversions are
 * Buffer objects, so we need to convert them to ArrayBuffer objects.
 *
 * @param {Buffer|string} buffer - The Buffer object to convert to an ArrayBuffer
 * @param {string} [encoding] - The encoding to use when a string an ArrayBuffer
 */
function toArrayBuffer(buffer, encoding) {
	if (typeof buffer === 'string') {
		if (encoding === undefined || encoding === null) {
			encoding = 'utf8';
		}
		// @ts-ignore
		buffer = Buffer.from(buffer, encoding);
	}

	if (!Buffer.isBuffer(buffer)) {
		throw(new Error('Buffer is not a Buffer object'));
	}

	const retval = new Uint8Array(buffer.length);
	buffer.copy(retval);

	return(retval);
}

/**
 * Create a non-fungible token (NFT) for a real-world asset (RWA).
 *
 * The real world asset is represented by a token on the KeetaNet network
 * with a supply of 1 and containing metadata which describes the asset
 * and is signed by the authority.
 *
 * @param {KeetaNet.UserClient} client - The KeetaNet UserClient which is used to
 * interact with the KeetaNet network.
 * @param {InstanceType<typeof KeetaNet.lib.Account>} signer_account - The account which is used to sign
 * the transaction.
 * @param {InstanceType<typeof KeetaNet.lib.Account>} authority_account - The account which is used to
 * sign the metadata for the token.
 * @param {string} asset_id - The ID of the asset which is represented by the
 * token.
 */
async function createNFTokenForRWA(client, signer_account, authority_account, asset_id) {
	/**
	 * Assert that the signer is of an account type which can
	 * sign transactions -- because we didn't specify the set
	 * of account types in the type definition it's too broad
	 * and could accept any kind of account -- such as a token
	 * or storage account, which cannot sign transactions.
	 */
	if (!signer_account.isAccount()) {
		throw(new Error('Signer account must be an account type which can sign transactions'));
	}

	/**
	 * Create the signed metadata
	 */
	/* convert the asset_id to an ArrayBuffer */
	const asset_id_buffer = toArrayBuffer(asset_id, 'utf-8');
	const signature = await authority_account.sign(asset_id_buffer);
	const metadata_object = {
		asset_id: asset_id,
		authority: authority_account.publicKeyString.get(),
		signature: signature.toString('base64')
	};
	const metadata_buffer = Buffer.from(JSON.stringify(metadata_object));
	const metadata_base64 = metadata_buffer.toString('base64');

	/**
	 * Create a builder which is used to construct a transaction.
	 */
	const builder = client.initBuilder();
	builder.updateAccounts({
		/*
		 *  We supply the signer here in case the client was
		 * constructed with a different client account.  This may not be
		 * needed depending on the specifics of the contract between
		 * the methods used in a real-world application.
		 */
		signer: signer_account,
		account: signer_account
	});

	/**
	 * Create a token which is used to represent the asset.
	 */
	const token = builder.generateIdentifier(KeetaNet.lib.Account.AccountKeyAlgorithm.TOKEN);

	/**
	 * We need to explicitly compute the blocks at this point to cause
	 * the token to be created, which will allow us to access the
	 * token address in order to set the supply and metadata.
	 *
	 * This will mutate the state of the builder and seal off the
	 * first block, however multiple blocks can be computed in a single
	 * builder and they can all be published atomically in a single
	 * Vote Staple.
	 */
	await client.computeBuilderBlocks(builder);

	/**
	 * Give the token a supply of 1, this is a non-fungible token.
	 * because the supply is indivisible and there can only one
	 * or zero owners of the token's entire supply.
	 */
	builder.modifyTokenSupply(1n, {
		account: token.account
	});

	/**
	 * Add the metadata to link the token to the real world asset
	 * on the authority of the authority account.
	 */
	builder.setInfo({
		name: 'DEMORWA',
		description: 'Demo Token for Real World Asset',
		/**
		 * Here we link the token to the real world asset by setting
		 * the signed metadata object as the token's metadata.
		 */
		metadata: metadata_base64,
		/**
		 * Set the default permissions for the token to allow
		 * all users to be able to hold the token -- if the set
		 * of desired holders needs to be more tightly controlled
		 * then the default permission can exlude the ACCESS flag
		 * and individual permissions can be set for each account
		 * or [future: based on parameters within a certificate]
		 *
		 * This would inhibit the ability to transfer the token to
		 * other users, but would allow the token to be held
		 * by a selected set of users.
		 */
		defaultPermission: new KeetaNet.lib.Permissions(['ACCESS'], [])
	}, {
		account: token.account
	});

	const blocks = await client.computeBuilderBlocks(builder);
	console.debug('Blocks to create token:', DPO(blocks.blocks));

	/**
	 * Publish the blocks to the network.
	 */
	await client.publishBuilder(builder);

	/**
	 * Return the token account
	 */
	return(token.account);
}


/**
 * Try to find an existing token which represents the asset.
 *
 * @param {KeetaNet.UserClient} client - The KeetaNet UserClient which is used to
 * interact with the KeetaNet network.
 * @param {InstanceType<typeof KeetaNet.lib.Account>} search_account - The account to search for the token
 * @param {InstanceType<typeof KeetaNet.lib.Account>} authority_account - The account which is used to
 * sign the metadata for the token.
 * @param {string} asset_id - The ID of the asset which is represented by the
 * token.
 * @returns {Promise<InstanceType<typeof KeetaNet.lib.Account<typeof KeetaNet.lib.Account.AccountKeyAlgorithm.TOKEN>> | null>} - The token account which represents the asset.
 */
async function lookupTokenForRWA(client, search_account, authority_account, asset_id) {
	/**
	 * Look for an existing token which represents the asset.
	 */
	const all_tokens = await client.listACLsByPrincipalWithInfo({
		account: search_account
	});

	/**
	 * Filter all the tokens to find the one which matches the asset_id --
	 * [future: This method will be updated to allow searching based on
	 * saved information].
	 */
	const found_token_info = all_tokens.find(function(entry) {
		try {
			/**
			 * We only want to consider tokens
			 */
			if (!entry.entity.isToken()) {
				return(false);
			}

			const check_data_buffer = Buffer.from(entry.info.metadata, 'base64');
			/** @type {unknown} */
			const check_data = JSON.parse(check_data_buffer.toString('utf8'));
			/**
			 * Check the asset_id and authority account
			 * against the token's metadata.
			 */
			if (typeof check_data !== 'object' || check_data === null || check_data === undefined) {
				return(false);
			}


			if (!('asset_id' in check_data) || !('authority' in check_data) || !('signature' in check_data)) {
				return(false);
			}

			if (check_data.asset_id !== asset_id) {
				return(false);
			}

			if (typeof check_data.authority !== 'string') {
				return(false);
			}

			if (typeof check_data.signature !== 'string') {
				return(false);
			}

			const check_data_authority = KeetaNet.lib.Account.fromPublicKeyString(check_data.authority);
			if (!authority_account.comparePublicKey(check_data_authority)) {
				return(false);
			}

			/* Verify the signature */
			const asset_id_buffer = toArrayBuffer(check_data.asset_id, 'utf-8');
			const check_signature = toArrayBuffer(check_data.signature, 'base64');
			const valid_signature = check_data_authority.verify(asset_id_buffer, check_signature);
			if (!valid_signature) {
				return(false);
			}

			return(true);
		} catch {
			return(false);
		}
	});

	if (found_token_info !== undefined) {
		/**
		 * We previously checked that the token was a token, but that
		 * type information is lost so we need to re-assert it here
		 */
		if (!found_token_info.entity.isToken()) {
			throw(new Error('internal error: Found token is not a token'));
		}

		return(found_token_info.entity);
	}

	return(null);
}


/**
 * Try to find an existing token which represents the asset.  If it does not
 * exist, create a new token using {@link createNFTokenForRWA}.
 *
 * @param {KeetaNet.UserClient} client - The KeetaNet UserClient which is used to
 * interact with the KeetaNet network.
 * @param {InstanceType<typeof KeetaNet.lib.Account>} signer_account - The account which is used to sign
 * the transaction.
 * @param {InstanceType<typeof KeetaNet.lib.Account>} authority_account - The account which is used to
 * sign the metadata for the token.
 * @param {string} asset_id - The ID of the asset which is represented by the
 * token.
 */
async function createOrLookupTokenForRWA(client, signer_account, authority_account, asset_id) {
	const found_token = await lookupTokenForRWA(client, signer_account, authority_account, asset_id);
	if (found_token !== null) {
		return(found_token);
	}

	/**
	 * If the token does not exist, create a new token using
	 * {@link createNFTokenForRWA}.
	 */
	const token = await createNFTokenForRWA(client, signer_account, authority_account, asset_id);
	return(token);
}

/**
 * Determine which account owns the token
 *
 * [future: This method will be updated to allow searching based on
 * the network address of the token, which is not currently available
 * in the KeetaNet Client SDK]
 *
 * @param {KeetaNet.UserClient} client - The KeetaNet UserClient which is used
 * to interact with the KeetaNet network.
 * @param {InstanceType<typeof KeetaNet.lib.Account<typeof KeetaNet.lib.Account.AccountKeyAlgorithm.TOKEN>>} token - The token which
 * is used to represent the asset.
 * @param {Array<InstanceType<typeof KeetaNet.lib.Account>>} accounts - The
 * accounts which are used to check the ownership of the token.
 */
async function checkNFTokenOwnership(client, token, accounts) {
	/**
	 * Check the ownership of the token by checking the balance
	 * of each account.
	 */
	for (const account of accounts) {
		const balance = await client.balance(token, {
			account: account
		});
		if (balance > 0n) {
			return(account);
		}
	}

	return(null);
}

/**
 * Perform an atomic swap of the token between two accounts.  The {@link from}
 * account will send the Non-Fungible Token (NFT) to the {@link to} account and
 * it will swap that for some of the base token.
 *
 * Any token could be used in the swap, but in this case we will use the
 * base token for simplicity.
 *
 * The swap is atomic, meaning that either both the token and the base
 * token are transferred or neither is transferred.  This is done by
 * using a single transaction to perform the swap using the "Receive"
 * constraining operation.
 *
 * @param {KeetaNet.UserClient} client - The KeetaNet UserClient which is used
 * to interact with the KeetaNet network.
 * @param {InstanceType<typeof KeetaNet.lib.Account<typeof KeetaNet.lib.Account.AccountKeyAlgorithm.TOKEN>>} token - The token which to swap
 * @param {InstanceType<typeof KeetaNet.lib.Account>} from - The account which
 * is used to swap the token from -- i.e., the current holder.
 * @param {InstanceType<typeof KeetaNet.lib.Account>} to - The account which
 * is used to swap the token to -- i.e., the destination holder.
 * @param {InstanceType<typeof KeetaNet.lib.Account>} [from_signer] - The
 * account which is used to sign the transaction on the behalf of the
 * {@link from} account.  This is optional and if not provided then the
 * {@link from} account will be used to sign the transaction.
 */
async function performNFTokenAtomicSwap(client, token, from, to, from_signer) {
	const builder = client.initBuilder();

	/**
	 * Have the sender send the tokens to the receiver.
	 *
	 * We do this first because the block ordering requires
	 * that the receive operation be after the send operation.
	 */
	builder.updateAccounts({
		signer: to.assertAccount(),
		account: to
	});
	builder.send(from_signer ?? from, 30n, client.baseToken);

	/**
	 * Add a send operation to the builder which will send the Non-Fungible
	 * Token (NFT) to the {@link to} account.
	 */
	builder.updateAccounts({
		/**
		 * The signer is the account which is used to sign the
		 * transaction, because the {@link from} account may be a token
		 * account which cannot sign transactions we provide for
		 * an alternate signer.
		 */
		signer: (from_signer ?? from).assertAccount(),
		account: from
	});
	builder.send(to, 1n, token);

	/**
	 * Enforce that we receive 30 of the base token in exchange for the
	 * NFT.
	 */
	if (from_signer !== undefined) {
		/**
		 * Since the token cannot hold a balance of another
		 * token we must swap that with a different account
		 * which can hold the base token -- we will re-use
		 * the signer account for this purpose.
		 */
		builder.updateAccounts({
			account: from_signer
		});
	}
	builder.receive(to, 30n, client.baseToken);

	/**
	 * Compute the blocks for the transaction.
	 */
	const block_info = await client.computeBuilderBlocks(builder);
	console.debug('Blocks to perform atomic swap:', DPO(block_info.blocks));

	await client.publishBuilder(builder);
}

async function main() {
	/**
	 * Create an account to act as the authority for issuing the mapping
	 * between the asset and the token.  The asset is represented by a token,
	 * but in order to prove ownership of the asset, the authority must sign the
	 * metadata for the token.
	 */
	const authority_account = KeetaNet.lib.Account.fromSeed(DEMO_ACCOUNT_SEED, 0);

	/**
	 * In this demonstration we will use the same account to sign the transaction
	 * as the authority over the mapping between the asset and the token.
	 *
	 * In a real-world application, this might be seperated for business
	 * concerns.
	 */
	const signer_account = authority_account;

	/**
	 * Create an account to represent an initial owner of the token/asset.
	 */
	const user1_account = KeetaNet.lib.Account.fromSeed(DEMO_ACCOUNT_SEED, 1);

	/**
	 * Create an account to represent the final owner of the token/asset after
	 * exchange.
	 */
	const user2_account = KeetaNet.lib.Account.fromSeed(DEMO_ACCOUNT_SEED, 2);

	/**
	 * Log the public keys of the accounts for demonstration purposes.
	 */
	console.log('Authority Account:', DPO(authority_account));
	console.log('Signer Account:', DPO(signer_account));
	console.log('User 1 Account:', DPO(user1_account));
	console.log('User 2 Account:', DPO(user2_account));

	/**
	 * Construct a KeetaNet UserClient which is used to interact with the
	 * KeetaNet network as a user.
	 *
	 * We will use the test network for this demo, and the account we just
	 * created.
	 */
	const client = KeetaNet.UserClient.fromNetwork('test', signer_account);

	/**
	 * Create or search for an asset to represent the real-world asset.
	 */
	const token = await createOrLookupTokenForRWA(client, signer_account, authority_account, 'asset://1f0ccae9-5666-4f38-be24-36605630ac45/1');
	console.log('Token:', DPO(token));

	/**
	 * Find out which, if either, of the two users owns the token
	 */
	const user_token_owner = await checkNFTokenOwnership(client, token, [user1_account, user2_account, token]);
        let user_token_nonowner;
	let user_token_owner_signer;
	if (user1_account.comparePublicKey(user_token_owner)) {
		/* User 1 has the token */
		user_token_nonowner = user2_account;
	} else if (user2_account.comparePublicKey(user_token_owner)) {
		/* User 2 has the token */
		user_token_nonowner = user1_account;
	} else if (token.comparePublicKey(user_token_owner)) {
		/* The token has the token */
		user_token_nonowner = user1_account;
		user_token_owner_signer = signer_account;
	} else {
		/* No one has the token */
		throw(new Error('No one has the token'));
	}
	console.log('User which owns the token:', DPO(user_token_owner));
	console.log('User which does not own the token:', DPO(user_token_nonowner));

	/**
	 * Transfer the token from the owner to the non-owner.
	 */
	await performNFTokenAtomicSwap(client, token, user_token_owner, user_token_nonowner, user_token_owner_signer);

	const new_user_token_owner = await checkNFTokenOwnership(client, token, [user1_account, user2_account, token]);
	console.log('New User which owns the token:', DPO(new_user_token_owner));
}

main().then(function() {
	process.exit(0);
}, function(err) {
	console.error(err);
	process.exit(1);
});
