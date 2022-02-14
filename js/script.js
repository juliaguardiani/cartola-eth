// ENDEREÇO EHTEREUM DO CONTRATO
var contractAddress = "copiar e colar o end do contrato";

// Inicializa o objeto DApp
document.addEventListener("DOMContentLoaded", onDocumentLoad);
function onDocumentLoad() {
  DApp.init();
}

// Nosso objeto DApp que irá armazenar a instância web3
const DApp = {
  web3: null,
  contracts: {},
  account: null,

  init: function () {
    return DApp.initWeb3();
  },

  // Inicializa o provedor web3
  initWeb3: async function () {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ // Requisita primeiro acesso ao Metamask
          method: "eth_requestAccounts",
        });
        DApp.account = accounts[0];
        window.ethereum.on('accountsChanged', DApp.updateAccount); // Atualiza se o usuário trcar de conta no Metamaslk
      } catch (error) {
        console.error("Usuário negou acesso ao web3!");
        return;
      }
      DApp.web3 = new Web3(window.ethereum);
    } else {
      console.error("Instalar MetaMask!");
      return;
    }
    return DApp.initContract();
  },

  // Atualiza 'DApp.account' para a conta ativa no Metamask
  updateAccount: async function() {
    DApp.account = (await DApp.web3.eth.getAccounts())[0];
    atualizaInterface();
  },

  // Associa ao endereço do seu contrato
  initContract: async function () {
    DApp.contracts.CasaDeApostas = new DApp.web3.eth.Contract(abi, contractAddress);
    return DApp.render();
  },

  // Inicializa a interface HTML com os dados obtidos
  render: async function () {
    inicializaInterface();
  },
};


// *** MÉTODOS (de consulta - view) DO CONTRATO ** //

function verGanhador() {
 // return DApp.contracts.CasaDeApostas.methods.verGanhador().call();
}


// *** MÉTODOS (de escrita) DO CONTRATO ** //

function criarAposta() {
  let valor = document.getElementById("apostar").value;
  let preco = 100000000000000000 * valor;
  // document.getElementById("1").onclick = jogo1;
  // document.getElementById("2").onclick = jogo2;
  // document.getElementById("3").onclick = jogo3;

  return DApp.contracts.CasaDeApostas.methods.
    criarAposta("falta passar os parametros corretos").
        send({ from: DApp.account, value: preco }).then(atualizaInterface);;
}

function apostar() {
  return DApp.contracts.CasaDeApostas.methods.apostar().
    send({ from: DApp.account }).then(atualizaInterface);;
}

// *** ATUALIZAÇÃO DO HTML *** //

function inicializaInterface() {
    document.getElementById("btnApostar").onclick = realizarAposta;
    document.getElementById("btnPagarAposta").onclick = pagarAposta;
    atualizaInterface(); 
}

function atualizaInterface() {
   verTaxa().then((result) => {                         //criar funcao 
    document.getElementById("taxa").innerHTML = result;
    });

  verPremio().then((result) => {               //criar funcao 
    document.getElementById("premio").innerHTML =
      result / 1000000000000000000 + " ETH";
  });

  document.getElementById("endereco").innerHTML = DApp.account;

  document.getElementById("btnPagarAposta").style.display = "none";
  ehDono().then((result) => {
    if (result) {
      document.getElementById("btnPagarAposta").style.display = "block";
    }
  });
}