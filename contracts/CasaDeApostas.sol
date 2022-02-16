pragma solidity >=0.7.0 <0.9.0;

contract CasaDeApostas
{
    address payable owner;
    uint pote;

    event EventApostaCriada(uint idAposta);
    event EventQtdApostas(uint qtdApostas);

    struct Lance
    {
        uint pontosTime1;
        uint pontosTime2;
        address payable owner;
    }

    struct Aposta
    {
        uint time1;
        uint time2;
        address payable owner;
        uint valorMinimo;
        bool finalizada;
        Lance lanceCorreto;
        Lance [] lances;

        mapping ( address => Lance) winners;
        uint qtdVencedores;

    }

    // mapeia as apostas por codigo
    Aposta[] _apostas;

    constructor()
    {
        owner = payable(msg.sender);
    }

    modifier onlyOwner()
    {
        require(msg.sender == owner, "Only for the contract owner");
        _;
    }

    // cria uma aposta e retorna seu codigo unico
    function criarAposta(uint time1, uint pontosTime1, uint time2,  uint pontosTime2,uint valorMinimo) public
    {
        require(time1 != time2, "Nao pode apostar em times igueais");
                        
        uint apostaId = _apostas.length;

        _apostas.push();
        
        _apostas[apostaId].time1 = time1;
        _apostas[apostaId].time2 = time2;
        _apostas[apostaId].owner = payable(msg.sender);
        _apostas[apostaId].valorMinimo =  valorMinimo;
        _apostas[apostaId].finalizada = false;
        _apostas[apostaId].lanceCorreto.pontosTime1 = pontosTime1;
        _apostas[apostaId].lanceCorreto.pontosTime2 = pontosTime2;
        _apostas[apostaId].lanceCorreto.owner = payable(msg.sender);
        
        emit EventApostaCriada(apostaId);
    }

    function apostar(uint id, uint pontosTime1, uint pontosTime2) public payable
    {
        require(id < _apostas.length, "id maior que o total de apostas");
        require(_apostas[id].finalizada == false, "essa aposta ja foi finalizada");

        uint valorMinimo = _apostas[id].valorMinimo;

        require(msg.value >= valorMinimo, "sua aposta precisa ser maior que o valor minimo para dar um lance");

        Lance memory novoLance = Lance(pontosTime2,pontosTime1, payable(msg.sender));
        
        uint troco = msg.value - valorMinimo;

        _apostas[id].lances.push(novoLance);

        payable(msg.sender).transfer(troco);

        Lance memory lanceCorreto = _apostas[id].lanceCorreto;
        if(lanceCorreto.pontosTime1 == pontosTime1 && lanceCorreto.pontosTime2 == pontosTime2)
        {
            _apostas[id].winners[msg.sender].pontosTime1 = pontosTime1;
            _apostas[id].winners[msg.sender].pontosTime2 = pontosTime2;
            _apostas[id].winners[msg.sender].owner = payable(msg.sender);

            _apostas[id].qtdVencedores++;
        }

    }
    
    function finalizarAposta(uint id) public
    {
        require(_apostas[id].owner == msg.sender);
        _apostas[id].finalizada = true;

    }

    function isOwner(uint id) public view returns (bool){
        if(_apostas[id].owner == msg.sender){
            return true;
        } else return false;
      }

    function verRecompensa(uint id) public view returns (uint) 
    {
        uint recompensa = (_apostas[id].lances.length * _apostas[id].valorMinimo) / (_apostas[id].qtdVencedores +1 );

        return recompensa;
    }

    function receberMinhaRecompensa(uint id) public {
        
        require(_apostas[id].finalizada == true, "requer aposta finalizada");
        require(_apostas[id].winners[msg.sender].owner == msg.sender , "Voce precisa vencer para receber o premio");

        uint recompensa = verRecompensa(id);

        payable(msg.sender).transfer(recompensa);

        delete _apostas[id].winners[msg.sender]; 
        
        pote += recompensa;

    }
    function isWinner(uint id) public view returns (bool){
        if(_apostas[id].winners[msg.sender].owner == msg.sender){
            return true;
        } else return false;
    }

    function getApostaOwner(uint idAposta) public view returns(address)
    {
        return _apostas[idAposta].owner;
    }

    function getQtdApostas() public
    {
        uint qtdApostas = _apostas.length;
        emit EventQtdApostas(qtdApostas);
    }
}
