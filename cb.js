const http = require('http');
const hostname = 'localhost';
const port = 3005;

const url = require('url');
const nStatic = require('node-static');
const Web3 = require('web3');
const ethers = require('ethers');

const provider = 'https://bsc-dataseed.binance.org/';
const pcs_ca = '0x17539cCa21C7933Df5c980172d22659B8C345C5A';
const cb_ca = '0xC448498DDC536ad6F5d437325725dCf504d2d964';

const mintedMetaResources = new nStatic.Server('./catbread_meta');
const preRevealMetaResources = new nStatic.Server('./catbread_meta-prereveal');
const imagesResources = new nStatic.Server('./catbread_images');
const prerevealImagesResources = new nStatic.Server('./catbread_images-prereveal');

const sold = [
	105 ,
	306 ,
	1039,
	105 ,
	1042,
	9952,
	304 ,
	105 ,
	1032,
	1073,
	1012,
	230 ,
	8859,
	8859,
	1043,
	1022,
	1404,
	1087,
	238 ,
	238 ,
	230 ,
	230 ,
	1039,
	1039,
	1039,
	1039,
	1039,
	1039,
	1102,
	9865,
	1039,
	1974,
	1042,
	6789,
	1050,
	1025,
	1040,
	1092,
	1020,
	1019,
	3615,
	364 ,
	1018,
	1017,
	207 ,
	2479,
	1907,
	306 ,
	284 ,
	305 ,
	304 ,
	305 ,
	305 ,
	284 ,
	304 ,
	304 ,
	306 ,
	306 ,
	306 ,
	306 ,
	1047,
	1907,
	2479,
	2479,
	1907,
	2479,
	1907,
	1015,
	9972,
	1851,
	8777,
	1149,
	1027,
	9989,
	6336,
	214 ,
	1666,
	284 ,
	284 ,
	1036,
	2018,
	1024,
	9267,
	998 ,
	1999,
	9900,
	319 ,
	1099,
	1023,
	1333,
	600 ,
	1061,
	1101,
	6942,
	7770,
	9991,
	9992,
	9993,
	9995,
	1039,
	8861,
	217 ,
	1449,
	1449,
	362 ,
	3434,
	1069,
	1449,
	1136,
	1   ,
	1197,
	1   ,
	1021,
	1337,
	7070,
	9990,
	2479,
	1907,
	1079,
	9980,
	1016,
	1014,
	245 ,
	615 ,
	1615,
	499 ,
	1984,
	8856,
	1009,
	1420,
	1008,
	1005,
	1004,
	4871,
	1998,
	1973,
	1919,
	1011,
	1511,
	1117,
	9889,
	5000,
	1003,
	8483,
	2222,
	1010,
	972 ,
	1012,
	1002,
	1188,
	9988,
	1888,
	8008,
	1234,
	9997,
	1313,
	9998,
	5555,
	3333,
	8080,
	1111,
	888,
	8888,
	1001,
	1000,
	9994,
	777,
	666,
	6666,
	7777,
	1134,
	6969,
	9999,
	10000
]

async function getOwnerOf(tokenId) {
	var web3 = new Web3(new Web3.providers.HttpProvider(provider));
	let minABI = [
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "tokenId",
					"type": "uint256"
				}
			],
			"name": "ownerOf",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	];
	let contract = new web3.eth.Contract(minABI, cb_ca);
	return await contract.methods.ownerOf(tokenId).call();
}

const server = http.createServer(async function (req, res) {
	// unknown resource
	if (!req.url.toLowerCase().endsWith(".json") && !req.url.toLowerCase().endsWith(".png") && !req.url.toLowerCase().endsWith(".gif")) return preRevealMetaResources.serve(req, res);

	try {
		var tokenId = parseInt(req.url.replace(/\//g, "").replace(/.json/g, "").replace(/.png/g, ""));
		const owner = await getOwnerOf(tokenId);

		if (owner !== pcs_ca || sold.indexOf(tokenId) !== -1) {
			if (req.url.toLowerCase().endsWith(".png") || req.url.toLowerCase().endsWith(".gif")) return imagesResources.serve(req, res);
			else return mintedMetaResources.serve(req, res);
		} else {
			if (req.url.toLowerCase().endsWith(".png") || req.url.toLowerCase().endsWith(".gif")) return prerevealImagesResources.serve(req, res);
			else return preRevealMetaResources.serve(req, res);
		}
	} catch (e) {
		console.error(e);

		if (req.url.toLowerCase().endsWith(".png") || req.url.toLowerCase().endsWith(".gif")) return prerevealImagesResources.serve(req, res);
		else return preRevealMetaResources.serve(req, res);
	}
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
