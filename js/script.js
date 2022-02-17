import { times, apostas, valorAposta } from "./data.js"
// ENDEREÇO EHTEREUM DO CONTRATO
var contractAddress = "0x1365dAb14Ac6624aFF122Be4c42720F3A83BeAC8"; 

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
        console.log("conectado ao contrato")
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

function verRecompensa(id) {
  return DApp.contracts.CasaDeApostas.methods.verRecompensa(id).call();
}

// *** MÉTODOS (de escrita) DO CONTRATO ** //
function criarAposta() {

  let time1 = times[document.getElementById("idtime01").value.toLowerCase()];
  let time2 = times[document.getElementById("idtime02").value.toLowerCase()];

  let pontos1 = parseInt(document.getElementById("pontos01").value);
  let pontos2 = parseInt(document.getElementById("pontos02").value);
  //let valorMinimo = document.getElementById("valorMinimo").value;
  let valor = valorAposta;

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
    return;
  }

  return DApp.contracts.CasaDeApostas.methods.criarAposta(time1, pontos1, time2,
    pontos2, valor).send({ from: DApp.account }).then((transacao) => {

      let idAposta = parseInt(transacao.events['0'].raw.data);
      const aposta = {
        'idAposta': idAposta,
        'time1': time1,
        'pontosTime1': pontos1,
        'time2': time2,
        'pontosTime2': pontos2,
        'valorMinimo': valor,
        'finalizada': false,
      };
      apostas.push(aposta);

      alert(`aposta ${idAposta} criada`)
      atualizaInterface()
    });
}

function apostar() {
  let select = document.getElementById("ApostarIdAposta");
  let apostaId = parseInt(select.options[select.selectedIndex].text);


  let pontos1 = parseInt(document.getElementById("ApostarPontuacao1").value);
  let pontos2 = parseInt(document.getElementById("ApostarPontuacao2").value);

  if (pontos1 == undefined || pontos2 == undefined) {
    console.log({
      pontos1: pontos1,
      pontos2: pontos2
    });
    alert("pontuacao invalida")
    return;
  }
  console.log('valor da aposta: ' + valorAposta)
  return DApp.contracts.CasaDeApostas.methods.apostar(apostaId, pontos1, pontos2).
    send({ from: DApp.account, value: valorAposta }).then((transaction) => {
      alert("Aposta realizada!");
    
      verRecompensa(apostaId).then((result) => {
        document.getElementById("idValorRecompensaGeral").innerHTML = result;
        });
    });
}

function finalizarAposta() {
  let select = document.getElementById("FinalizarIdAposta");
  let apostaId = parseInt(select.options[select.selectedIndex].text);

  return DApp.contracts.CasaDeApostas.methods.finalizarAposta(apostaId).
    send({ from: DApp.account }).then((transaction) => {
      alert("Aposta finalizada!");
      atualizaInterface()
    });

}
function receberMinhaRecompensa(){
  let select = document.getElementById("RRIdAposta");
  let apostaId = parseInt(select.options[select.selectedIndex].text);

  return DApp.contracts.CasaDeApostas.methods.receberMinhaRecompensa(apostaId).
    send({ from: DApp.account }).then((transaction) => {
      atualizaInterface()
  });
}

// *** ATUALIZAÇÃO DO HTML *** //

function inicializaInterface() {
  document.getElementById("btnCriarAposta").onclick = criarAposta;
  document.getElementById("btnApostar").onclick = apostar;
  document.getElementById("btnFinalizar").onclick = finalizarAposta;
  document.getElementById("btnRR").onclick = receberMinhaRecompensa;
  
  atualizaInterface();
}

function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}

function atualizaInterface() {

  removeOptions(document.getElementById("ApostarIdAposta"));
  removeOptions(document.getElementById("FinalizarIdAposta"));

  apostas.forEach(aposta => {

    let selectorsIdAposta = document.getElementsByClassName("selectorsIdAposta");

    Array.from(selectorsIdAposta).forEach(selector => {
      let option = document.createElement("option");
      option.value = aposta.idAposta;
      option.innerHTML = aposta.idAposta;
      selector.append(option);
    })

    console.log(`aposta  ${aposta.idAposta} adicionada a lista`)
  })
}
