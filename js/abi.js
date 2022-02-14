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
				"name": "apostaId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "jogador1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "jogador2",
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
				"name": "jogador1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "jogador2",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "valorMinimo",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "taxa",
				"type": "uint256"
			}
		],
		"name": "criarAposta",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pagarApostas",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sacarLucroDoContrato",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
]