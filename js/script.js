import { times, idApostas } from "./data.js"
// ENDEREÇO EHTEREUM DO CONTRATO
var contractAddress = "0xc0AC0A2e41c7d4078e59865351ccB6b97bDA5D90";

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
  updateAccount: async function () {
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

// ---------------------------------------------------------------------------------------------


// *** MÉTODOS (de consulta - view) DO CONTRATO ** //
function verRecompensa() {
  return DApp.contracts.CasaDeApostas.methods.verRecompensa().call({ from: DApp.account });
}

function getApostaOwner() {
  return DApp.contracts.CasaDeApostas.methods.getApostaOwner().call({ from: DApp.account });
}

function ehDono() {
  return DApp.contracts.CasaDeApostas.methods.isOwner().call({ from: DApp.account });
}

function ehGanhador() {
  return DApp.contracts.CasaDeApostas.methods.isWinner().call({ from: DApp.account });
}

// *** MÉTODOS (de escrita) DO CONTRATO ** //
function criarAposta() {

  let time1 = times[document.getElementById("idtime01").value.toLowerCase()];
  let time2 = times[document.getElementById("idtime02").value.toLowerCase()];

  let pontos1 = parseInt(document.getElementById("pontos01").value);
  let pontos2 = parseInt(document.getElementById("pontos02").value);
  let valorMinimo = document.getElementById("valorMinimo").value;
  let valor = BigInt(100000000000000000 * valorMinimo);

  if (time1 == undefined || time2 == undefined || pontos1 == undefined || pontos2 == undefined
    || valor == undefined) {
    console.log({
      'time1': time1,
      'time2': time2,
      'pontos1': pontos1,
      'pontos2': pontos2,
      'valorMinimo': valor
    });
    alert('dado invalido');
  }

  return DApp.contracts.CasaDeApostas.methods.criarAposta(time1, pontos1, time2,
    pontos2, valor).send({ from: DApp.account }).then((transacao) => {

      let idAposta = parseInt(transacao.events['0'].raw.data);
      idApostas.push(idAposta);

      alert(`aposta ${idAposta} criada`)
    });
}

function apostar(apostaId) {
  let pontos1 = document.getElementById("pontos01").value;
  let pontos2 = document.getElementById("pontos02").value;
  return DApp.contracts.CasaDeApostas.methods.apostar(apostaId, pontos1, pontos2).
    send({ from: DApp.account }).then(atualizaInterface);
}

function finalizarAposta() {
  // tenta pegar o id da aposta
  return DApp.contracts.CasaDeApostas.method.finalizarAposta(apostaId).
    send({ from: DApp.account }).then(atualizaInterface);

}

// *** ATUALIZAÇÃO DO HTML *** //

function inicializaInterface() {
  document.getElementById("btnCriarAposta").onclick = criarAposta;
  atualizaInterface();
}

function atualizaInterface() {
}
