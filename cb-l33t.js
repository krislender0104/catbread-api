const Web3 = require('web3');
const ethers = require('ethers');
const fs = require('fs');

const provider = 'https://bsc-dataseed.binance.org/';

const hackedWallet = '0xF7056D7E9167f7D3da8cA08c69faFA7d5D75914f';
const gnosis = '0xC9A81c56eb07397989907fa6BcC121B593d8f141';
const wbnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

const gasOverhead = 1;

let secrets = fs.readFileSync('secrets.json');
const privateKey = JSON.parse(secrets).privateKey;
const rpcProvider = new ethers.providers.JsonRpcProvider(provider, 56);

function getAccount() {
	const wallet = new ethers.Wallet(privateKey);
	return wallet.connect(rpcProvider);
}

async function balanceOf() {
	const bnb = new ethers.Contract(
			wbnb,
			['function balanceOf(address account) external view returns (uint256)'],
			getAccount()
	);

	return parseInt(await bnb.balanceOf(hackedWallet));
}

async function transfer(balance) {
	const bnb = new ethers.Contract(
			wbnb,
			['function transfer(address recipient, uint256 amount) external returns (bool)'],
			getAccount()
	);

	const gasPrice = await rpcProvider.getGasPrice();

	await bnb.transfer(gnosis, "" + balance,
			{
				gasPrice: gasPrice * gasOverhead,
				gasLimit: 2000000,
			});
}


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


async function foo() {

	while (true) {
		let balance = await balanceOf();
		if (balance > 0) {
			await transfer(balance);
		}
		await sleep(60000);
	}

}


foo();
