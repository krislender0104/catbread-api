const Web3 = require('web3');
const ethers = require('ethers');
const fs = require('fs');

const provider = 'https://bsc-dataseed.binance.org/';
const pcs_ca = '0x17539cCa21C7933Df5c980172d22659B8C345C5A';
const cb_ca = '0xC448498DDC536ad6F5d437325725dCf504d2d964';
const cbMinter_ca = '0x207a548c031E1b306Fc6E971A5F8a747222c8a2A';
const askPrice = '400000000000000000';

const gasOverhead = 1;

let secrets = fs.readFileSync('secrets.json');
const privateKey = JSON.parse(secrets).privateKey;
const rpcProvider = new ethers.providers.JsonRpcProvider(provider, 56);

function getAccount() {
	const wallet = new ethers.Wallet(privateKey);
	return wallet.connect(rpcProvider);
}

async function createAskOrder(tokenId, nonce) {
	const pcs = new ethers.Contract(
			pcs_ca,
			[' function createAskOrder(\n' +
			'        address _collection,\n' +
			'        uint256 _tokenId,\n' +
			'        uint256 _askPrice\n' +
			'    ) external'],
			getAccount()
	);

	const gasPrice = await rpcProvider.getGasPrice();

	await pcs.createAskOrder(cb_ca, tokenId, askPrice,
			{
				gasPrice: gasPrice * gasOverhead,
				gasLimit: 250000,
				nonce: nonce,
			}
	);
}

async function mint(numberOfMints) {
	const cbMinter = new ethers.Contract(
			cbMinter_ca,
			['function mintOwner(uint256 numberOfMints) external returns (uint256)'],
			getAccount()
	);

	const gasPrice = await rpcProvider.getGasPrice();

	await cbMinter.mintOwner(numberOfMints,
			{
				gasPrice: gasPrice * gasOverhead,
				gasLimit: 2000000,
			}
	);
}

function range(start, stop, step) {
	var a = [start], b = start;
	while (b < stop) {
		a.push(b += step || 1);
	}
	return a;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


async function foo() {
	// await mint(100);

	let array = [
		8777,
		8858,
		8859,
		8860,
		8861
	]

	let nonce = 9625;

	let first = true;
	for (let i=0; i<=array.length; i++) {
		if ( !first && i % 10 === 0) await sleep(10000);
		else if ( !first && i % 30 === 0) await sleep(30000);
		first = false;
		
		const j = array[i];

		try {
			console.log("Doing tokenid:", j, ", nonce:", nonce);
			await createAskOrder(j, nonce++);
		} catch (e) {
			console.error(e);
			await sleep(10000);
		}
	}
}


foo();
