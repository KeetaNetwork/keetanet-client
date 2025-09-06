---
Title: Getting Started
Category: Guides
---

# KeetaNet Client SDK Getting Started

## Documentation

See the full documentation for the KeetaNet Client JavaScript/TypeScript SDK at [https://static.test.keeta.com/docs/](https://static.test.keeta.com/docs/).

## Installation

The KeetaNet Client JavaScript/TypeScript SDK can be loaded with:
```bash
$ npm install @keetanetwork/keetanet-client
```

## Concepts
### Accounts

{@link KeetaNetSDK.Referenced.Account | Accounts} in the KeetaNet SDK are the way in which key pairs or identifiers are
represented.

For key pairs, they securely store the private key (where applicable) and
provide operations like {@link KeetaNetSDK.Referenced.Account#sign | digital signing} and {@link KeetaNetSDK.Referenced.Account#verify | verification},
{@link KeetaNetSDK.Referenced.Account.fromSeed | key derivation from seed} and {@link KeetaNetSDK.Referenced.Account.seedFromPassphrase | passphrase}, and
{@link KeetaNetSDK.Referenced.Account#encrypt | encryption} and {@link KeetaNetSDK.Referenced.Account#decrypt | decryption} using ECIES.

For identifiers, they are used to represent the identity of a specific kind of
address, such as a Token, the Network Address, or a Storage account.

Additionally, for key pair accounts the key may be held internally or
externally using an external key provider.  No particular external key provider
interface (e.g. PKCS#11) is specified but users may implement their own
provider using the {@link KeetaNetSDK.Referenced.ExternalKeyPair | ExternalKeyPair} interface.

### Blocks

{@link KeetaNetSDK.Referenced.Block | Blocks} are used within KeetaNet to represent a collection of operations
(transactions) by an account.  They contain the {@link KeetaNetSDK.Referenced.Block#account | account identifier}, the
{@link KeetaNetSDK.Referenced.Block#network | network identifier}, the {@link KeetaNetSDK.Referenced.Block#previous | previous block identifier}, an optional
{@link KeetaNetSDK.Referenced.Block#signer | signer} (if different from the account), a {@link KeetaNetSDK.Referenced.Block#date | timestamp}, and a list of
{@link KeetaNetSDK.Referenced.Block#operations | operations}.

The block is digitally signed by the signer (if present, otherwise the account)
and the signature is included in the block.  The block is identified by its
{@link KeetaNetSDK.Referenced.Block#hash | hash} which is the hash of the block
not including the signature.

The KeetaNet SDK also provides a block builder method which allows the user to
create blocks in an incremental fashion.  The block builder is created using the
{@link KeetaNetSDK.Referenced.BlockBuilder | BlockBuilder} class, however in
most cases a {@link KeetaNetSDK.Referenced.UserClientBuilder | UserClientBuilder}
from a {@link KeetaNetSDK.UserClient#initBuilder | UserClient} should be used
because it will handle things like getting the correct network and previous
block hash.

### Operations

{@link KeetaNetSDK.Referenced.BlockOperation | Operations} describe the actions performed by an account on the ledger.  They
are fundamentally composed of effects, which are the specific changes or
constraints performed on the ledger.

An example operation is a {@link KeetaNetSDK.Referenced.BlockOperationSEND | Send}
operation which has the effects of decrementing the balance of the sender,
incrementing the balance of the receiver, and validating that the sender's
balance does not drop below zero.

The KeetaNet SDK provides {@link KeetaNetSDK.Referenced.BlockOperation | a number of operations}
which are used to perform actions on the ledger.

### Votes

{@link KeetaNetSDK.Referenced.Vote | Votes} in KeetaNet are used for consensus forming among "representatives".
Each vote is an assertion by a representative that a specific group of blocks
(identified by their hashes) are valid and conform to the rules of the
ledger of that representative.

Votes are used to form a consensus on the state of the ledger and are
aggregated by the representatives to form a "vote staple".  A vote staple is
a collection of votes and the blocks which are referenced by those vote.

Votes come in two flavors: temporary and permanent.  Temporary votes are
used to get initial consensus on a set of blocks.  A quorum of temporary votes
can be "traded in" for permanent votes.

When a temporary vote is issued by a representative the vote and block are
stored on the representative's "side ledger", which is a non-synchronized
portion of the ledger.  The client can request a copy of the block from the
representative {@link KeetaNetSDK.Client#getPendingBlock | Client.getPendingBlock}
or {@link KeetaNetSDK.UserClient#pendingBlock | UserClient.pendingBlock} method,
or the {@link KeetaNetSDK.Client#getVoteStaple | Client.getVoteStaple} method to
with the "`side`" parameter set to `side` to retrieve the vote staple from the
representative's side ledger.

Additionally, the {@link KeetaNetSDK.UserClient#recover | UserClient.recover} method
can be used to query all known representatives for side ledger vote staples
to complete any partially completed consensus rounds.

### Vote Staples

{@link KeetaNetSDK.Referenced.VoteStaple | Vote Staples}, as discussed above, are a
collection of votes and the blocks.  Every vote in a vote staple must be for the same
set of blocks in the same order.

Vote Staples are the unit of transaction in the KeetaNet network.  The set of
blocks in a vote staple are applied altogether as a single atomic transaction
acting on the ledger.

### Networks

{@link KeetaNetSDK.Referenced.src/config.networksArray | Networks} in KeetaNet
a group of representative nodes and clients which all agree to a common set of
rules and initial ledger state.  There can be many different networks, such as
the "test" network, "main" network, and "dev" network.  Each network has its
own set of representatives and clients.

The network is identified within each block by the {@link KeetaNetSDK.Referenced.Block#network | network identifier}
property, which is an integer.

Each network also has a {@link KeetaNetSDK.UserClient.networkAddress | Network Address},
which is a special kind of account derived from the network identifier.  The
purpose of the network address is to define permissions which apply to the
network as a whole, such as the permission to create tokens, or create storage
accounts.

### Tokens

{@link KeetaNetSDK.Referenced.AccountKeyAlgorithm.TOKEN | Tokens} in KeetaNet are a
special kind of account which is used to represent a fungible asset.  Tokens can be
created using the {@link KeetaNetSDK.Referenced.BlockOperationCREATE_IDENTIFIER | Create Identifier}
method though the {@link KeetaNetSDK.Referenced.UserClientBuilder#generateIdentifier | UserClientBuilder.generateIdentifier}
method is recommended.

Each network also has a base token which is used for consensus and other
management functions.  The base token can be thought of as the native currency
of the network and is derived from the network identifier.

### Ledger

The ledger within KeetaNet refers to a couple of different things:

- The live state of accounts and their balances of tokens, as well as other attributes
- The record of how that state came to be, represented by vote staples

#### The ledger state

The ledger state is the current state of all accounts and their balances of tokens,
it can be thought of like this:

| Account | Base Token | Token 1 | Token 2 | Token 3
| ------- | ---------- | ------- | ------- | -------
| kta1    |          1 | 100     | 200     | 300
| kta2    |          5 |         | 0       | 3
| kta3    |            | 90      |         |

Where `kta1`, `kta2`, and `kta3` are the account identifiers, and the columns
represent the balance of that account for the base token and other tokens.

#### The ledger history

The ledger history is the record of how the ledger state came to be.  It is
represented by the set of vote staples which have been applied to the ledger.

This is expressed in two different ways in the KeetaNet SDK

- The {@link KeetaNetSDK.UserClient#history | UserClient.history} method which returns a list of
  {@link KeetaNetSDK.Referenced.VoteStaple | vote staples} which have affected
  the given account.
- The {@link KeetaNetSDK.UserClient#chain | UserClient.chain} method which returns a list of
  {@link KeetaNetSDK.Referenced.Block | blocks} which have been applied for a given
  account.

These two differ in that the history method returns all vote staples which
affected an account, even if they were not issued by the account -- for
example if a transfer was made to the account, the history method would return
the vote staple which included the transfer, but the chain method would not
because it was not issued by the account.

Additionally there is a method to {@link KeetaNetSDK.UserClient.filterStapleOperations | filter a list of vote staples}
to a list of operations which are relevant to a specific account.  This is useful
because the list of operations in a vote staple may include changes that are uninteresting
from an account perspective.

### Permissions

{@link KeetaNetSDK.Referenced.Permissions | Permissions} in KeetaNet are used
to allow users and operators to manage access to resources on the network.
They are used to control who can create tokens, create storage accounts, as well
as delegate permissions to other accounts.

There are two kinds of permissions:

- {@link KeetaNetSDK.Referenced.BaseSet | Base} permissions are the permissions which are
  defined by the network.  These are the permissions which the network representatives
  will look at to grant or deny access
- {@link KeetaNetSDK.Referenced.ExternalSet | External} permissions are the permissions which
  applications can define.  These are the permissions which are defined by the
  users of KeetaNet and the network representatives will not process them.
  These are useful for applications which want to define their own permissions and in
  the future may be used with Smart Contracts.

Additionally, permissions may be applied to a specific account or set as
default permissions on some the following resources:

- Network Account: `ACCESS`, `STORAGE_CREATE`, `TOKEN_ADMIN_CREATE`
- Token Accounts: `ACCESS`
- Storage Accounts: `ACCESS`, `STORAGE_CAN_HOLD`, `STORAGE_DEPOSIT`

Setting default permissions is done with the {@link KeetaNetSDK.UserClient#setInfo | UserClient.setInfo}
method.  Setting permission on an account are set with the
{@link KeetaNetSDK.UserClient#updatePermissions | UserClient.updatePermissions} method.

#### Base Permissions

The base permissions are defined by the network and are used to control access
to the network.  Each base permission has a {@link KeetaNetSDK.Referenced.BaseFlag | flag name}
which can be used to identify the permission.  The base permissions are:

- `ACCESS` - The permission to access the resource it is granted on -- if this
  permission is missing then no access to the resource is granted, this is
  useful as to create deny-list or permit-list resources.
- `ADMIN` - The `ADMIN` permission allows the `principal` to perform all actions
  on the resource, excluding deleting the resource and transferring ownership.
  For example, administrators of Token resources can mint and burn tokens and
  set the permissions of the token.
- `OWNER` - The owner permission grants all the privileges of the `ADMIN`
  permission but also the ability to delete the resource and transfer
  ownership.  All resources have exactly 1 owner.
- `UPDATE_INFO` - The update info permission allows the `principal` to update the
  information of the resource.  See {@link KeetaNetSDK.UserClient#setInfo | UserClient.setInfo}
  for more information on how to set the info.
- `STORAGE_CREATE` - This permission on the network account allows the
  specified account to create storage accounts.  As a default permission it
  allows everyone to create storage accounts.
- `TOKEN_ADMIN_CREATE` - This permission on the network account allows the
  specified account to create token accounts.  As a default permission it
  allows everyone to create token accounts.
- `TOKEN_ADMIN_SUPPLY` - This permission on a token account allows the specified
  specified account to mint and burn tokens.  This is useful for fungible tokens
  where the supply can be changed.
- `TOKEN_ADMIN_MODIFY_BALANCE` - This permission on a token account allows the
  specified specified account to modify the balance of holders of this token's
  balance.
- `STORAGE_DEPOSIT` - This permission on a storage account allows the specified
  specified account to deposit the specified tokens into the storage account.
- `STORAGE_CAN_HOLD` - This permission on a storage account allows the specified
  specified account to hold the specified token in the storage account.
- `SEND_ON_BEHALF` - This permission of an account allows the specified principal
  account to send the specified token on behalf of the account.  This is useful for
  shared accounts where multiple accounts can send on behalf of the account.
  To use this feature see the {@link KeetaNetSDK.Referenced.UserClientConfig#signer | signer} option
  to specify a different signatory for the transaction from the specified
  {@link KeetaNetSDK.Referenced.UserClientConfig#account | account}.
- `PERMISSION_DELEGATE_ADD` - This permission grants a subset of the abilities
  of the current account to some other account.  Must be used with
  {@link KeetaNetSDK.Referenced.AdjustMethod.ADD | AdjustMethod.ADD}.
- `PERMISSION_DELEGATE_REMOVE` - This permission revokes a subset of the abilities
  that have been delegated.  Must be used with {@link KeetaNetSDK.Referenced.AdjustMethod.SUBTRACT | AdjustMethod.SUBTRACT}
- `MANAGE_CERTIFICATE` - This permission allows the specified account to manage
  the certificate of the account.  This is used to set the certificate of the
  account, which is used to verify the identity of the account.

### Clients

{@link KeetaNetSDK.UserClient | Clients} in the KeetaNet SDK are the ways in
which applications primarily interact with the KeetaNet network.  There are
two different clients supported:

- {@link KeetaNetSDK.UserClient | UserClient} is the main client which is used to
  interact with the network.  It is used to send transactions, query the ledger,
  and perform other operations through the {@link KeetaNetSDK.Referenced.UserClientBuilder | UserClientBuilder}.
- {@link KeetaNetSDK.Client | Client} is a lower level client which is used to
  by the {@link KeetaNetSDK.UserClient | UserClient} to interact with the
  network.

## Usage

The KeetaNet SDK is designed to be used in a variety of environments, including
NodeJS, the browser, and other JavaScript environments.  It has TypeScript
type definitions.

### NodeJS

The KeetaNet SDK can be used in NodeJS by importing the package:

```javascript
import * as KeetaNet from '@keetanetwork/keetanet-client';
```

From there, the SDK can be used to create a {@link KeetaNetSDK.UserClient | UserClient} and
interact with the KeetaNet network.  See the {@link KeetaNetSDK.UserClient | UserClient}
documentation for more information on how to use the client.

Many other functions needed to support usage of the SDK are also in the
`@keetanetwork/keetanet-client` package, such as the {@link KeetaNetSDK.Referenced.Account | Account}
class, which is used to represent key pairs and identifiers, and the
{@link KeetaNetSDK.Referenced.Block | Block} class, which is used to represent
blocks on the ledger -- these are all imported with the `KeetaNet` import
and accessed with the {@link KeetaNetSDK.lib} namespace.

### Browser

The KeetaNet SDK can be used in the browser by including the script tag:

```html
<script src="https://static.test.keeta.com/keetanet-browser.js"></script>
```

The KeetaNet SDK can then be accessed using the `KeetaNet` global variable.

## Examples
### Basic usage (NodeJS)

The {@link KeetaNetSDK.UserClient} is the main entry point to interact with
the KeetaNet network. It is initialized with a network name and an account
using the {@link KeetaNetSDK.UserClient.fromNetwork} constructor.

```javascript
import * as KeetaNet from '@keetanetwork/keetanet-client';

const seed = KeetaNet.lib.Account.generateRandomSeed({ asString: true });
const account = KeetaNet.lib.Account.fromSeed(seed, 0);
const client = KeetaNet.UserClient.fromNetwork('test', account);

async function main() {
	console.debug(await client.chain());
}

main().then(function() {
	process.exit(0);
}, function(error) {
	console.error(error);
	process.exit(1);
});
```

### Basic usage (Browser)

The SDK can be loaded in the browser with a script tag:
```html
<html>
	<head>
		<script src="https://static.test.keeta.com/keetanet-browser.js"></script>
	</head>
	<body>
		<script>
			const seed = KeetaNet.lib.Account.generateRandomSeed({ asString: true });
			const account = KeetaNet.lib.Account.fromSeed(seed, 0);
			const client = KeetaNet.UserClient.fromNetwork('test', account);

			client.chain().then(console.debug);
		</script>
	</body>
</html>
```

### Full examples
- [Basic Example](./examples/basic/index.js)
- [Real World Assets with NFT](./examples/rwa-nft/index.js)
