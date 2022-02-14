pragma solidity ^0.8.7;

contract CasaDeApostas{

    address _contract_owner;
    address payable [] _winners;

    struct Lance{
        uint jogador1;
        uint jogador2;
        address payable lanceOwner;
    }

    struct Aposta{
        uint jogador1;
        uint jogador2;
        uint valorMinimo;
        uint qtdApostadores;
        bool isValid;
        uint taxa;
        address apostaOwner;
        Lance[] lances;
    }

    Aposta[] private _apostas;
    mapping(address => uint) private _qtdApostasDoUsuario;
    uint private _qtdApostasGlobal;
    uint private _contractOwnerLucro;

    constructor() 
    {
        _contract_owner = msg.sender;
        _qtdApostasGlobal = 0;
    }

    modifier onlyContractOwner()
    {
        require(msg.sender == _contract_owner, "Essa funcao so pode ser acessada pelo dono do contrato");
    _;
    }

    modifier onlyApostaOwner()
    {
        require(_qtdApostasDoUsuario[msg.sender]  > 0 , "Essa funcao so pode ser acessada por donos de aposta");
    _;
    }

    function criarAposta(uint jogador1,uint jogador2, uint valorMinimo, uint taxa) external
    {
        require(taxa < valorMinimo, "A taxa precisa ser menor que a quantidade minima");
        require(jogador1 != jogador2, "O jogador1 precisa ser diferente do jogador2");

        address apostaOwner = msg.sender;
        uint apostaId = _qtdApostasGlobal;
        _apostas.push();
        _apostas[apostaId].jogador1 = jogador1;
        _apostas[apostaId].jogador2 = jogador2;
        _apostas[apostaId].valorMinimo = valorMinimo;
        _apostas[apostaId].taxa = taxa;

        _qtdApostasDoUsuario[apostaOwner]++;
        _qtdApostasGlobal++;
    }

    function pagarAposta(uint idAposta) private onlyApostaOwner
    {
        require(idAposta < _apostas.length);
        // não podemos pagar uma aposta que não foi finalizadas
        require(_apostas[idAposta].isValid);

        Aposta storage aposta = _apostas[idAposta];
        address payable [] memory winners;

        uint totalWinners = 0;
        
        for(uint i = 0; i < aposta.lances.length; i++)
        {
            Lance memory lance = aposta.lances[i];
            if (lance.jogador1 == aposta.jogador1 && lance.jogador2 == aposta.jogador2 )
            {
                winners[totalWinners] = lance.lanceOwner;
                totalWinners++;
            }
        }

        uint premio = aposta.lances.length*(aposta.valorMinimo - aposta.taxa);

        for(uint i = 0; i < totalWinners ; i++)
        {
            winners[i].transfer(premio);
        }

        _contractOwnerLucro += aposta.taxa * aposta.lances.length;
    }

    function pagarApostas() external onlyApostaOwner
    {
        // pagamos todas as apostas possíveis de serem pagadas
        for(uint i = 0; i < _apostas.length; i++)
        {
            pagarAposta(i);
        }
    }

    function sacarLucroDoContrato() external payable onlyContractOwner 
    {
        address payable payableOwner;

        payableOwner =  payable(_contract_owner);

        payableOwner.transfer(_contractOwnerLucro);
        
    }
    function apostar(uint apostaId, uint jogador1, uint jogador2) external payable
    {
        Aposta memory aposta = _apostas[apostaId];

        uint qtdApostasDoUsuario = msg.value / aposta.valorMinimo;

        for (uint i = 0; i < qtdApostasDoUsuario; i++)
        {
            _apostas[apostaId].lances.push(Lance(jogador1,jogador2, payable(msg.sender)));
            
        }

    }
}
