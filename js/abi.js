var abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pontosTime1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pontosTime2",
				"type": "uint256"
			}
		],
		"name": "apostar",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "time1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pontosTime1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "time2",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pontosTime2",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "valorMinimo",
				"type": "uint256"
			}
		],
		"name": "criarAposta",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "finalizarAposta",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "idAposta",
				"type": "uint256"
			}
		],
		"name": "getApostaOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "receberMinhaRecompensa",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "verRecompensa",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]