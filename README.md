Workshop - Desenvolvendo um DApp Ethereum para o setor AgriTech

<p align="center">
  <img src="./logo.png" alt="Wood logo"
       width="300">
</p>

wooD : Extração e exportação de madeiras auditáveis.

NOTA: O objetivo desse wokshop é ilustrar o processo de criação de uma aplicação descentralizada, com a construção de Smart Contracts em Solidity e um cliente em React para interação com a blockchain. Esse projeto não é destinado ao uso em Main Net.

- [Introdução](#introdu%C3%A7%C3%A3o)
- [Ambiente](#ambiente)
- [Desenvolvimento](#desenvolvimento)
    - [Estrutura de pastas](#estrutura-de-pastas)
    - [Escrevendo os Smart Contracts](#escrevendo-os-smart-contracts)
        - [Criando o contrato e definindo a versão do compilador](#criando-o-contrato-e-definindo-a-vers%C3%A3o-do-compilador)
        - [Criando variáveis](#criando-vari%C3%A1veis)
        - [Criando a primeira função: Registrar um lote](#criando-a-primeira-fun%C3%A7%C3%A3o-registrar-um-lote)
        - [Criando a segunda função: Retornar o número de lotes](#criando-a-segunda-fun%C3%A7%C3%A3o-retornar-o-n%C3%BAmero-de-lotes)
        - [Criando nosso primeiro modificador de funções](#criando-nosso-primeiro-modificador-de-fun%C3%A7%C3%B5es)
        - [Criando nossa terceira função: Retornar os dados de um lote](#criando-nossa-terceira-fun%C3%A7%C3%A3o-retornar-os-dados-de-um-lote)
        - [Criando nossa quarta função: Registrar o transporte de um lote](#criando-nossa-quarta-fun%C3%A7%C3%A3o-registrar-o-transporte-de-um-lote)
        - [Criando a quinta função: Recuperar os dados de transporte](#criando-a-quinta-fun%C3%A7%C3%A3o-recuperar-os-dados-de-transporte)
- [Compilando e publicando os contratos](#compilando-e-publicando-os-contratos)
    - [Compilando o contrato](#compilando-o-contrato)
    - [Publicando o contrato](#publicando-o-contrato)
- [Testando o contrato](#testando-o-contrato)
    - [Testando a função: addWoodLot](#testando-a-fun%C3%A7%C3%A3o-addwoodlot)
    - [Testando a função: getNumberOfLots](#testando-a-fun%C3%A7%C3%A3o-getnumberoflots)
    - [Testando a função: getWoodLot](#testando-a-fun%C3%A7%C3%A3o-getwoodlot)
    - [Testando a função: registerLotShipment](#testando-a-fun%C3%A7%C3%A3o-registerlotshipment)
    - [Testando a função: getLotShipment](#testando-a-fun%C3%A7%C3%A3o-getlotshipment)
    - [Testando a mudanda de estado do estado de entrega do lote](#testando-a-mudanda-de-estado-do-estado-de-entrega-do-lote)
    - [Executando os testes](#executando-os-testes)
- [Ajustando a interface web para a comunicação com os Smart Contracts](#ajustando-a-interface-web-para-a-comunica%C3%A7%C3%A3o-com-os-smart-contracts)
    - [Copiando os artefatos para a pasta do frontend](#copiando-os-artefatos-para-a-pasta-do-frontend)
- [Interagindo com o dapp no browser](#interagindo-com-o-dapp-no-browser)
    - [Instalando e configurando o MetaMask](#instalando-e-configurando-o-metamask)
- [Iniciando o servidor http local](#iniciando-o-servidor-http-local)
- [Usando o dapp](#usando-o-dapp)
- [Parte final](#parte-final)
    - [Desafio 1](#desafio-1)
    - [Desafio 2](#desafio-2)

  
## Introdução

Essa aplicação consiste em um sistema para o controle de transporte de lotes de madeiras em todo o seu ciclo produtivo e logístico. Para isso, esse tutorial aborda o processo de:

* Configuração do ambiente de desenvolvimento
* Escrita de Smart Contracts com a linguagem Solidity e o framework Truffle
* Compilação e deploy dos contratos
* Teste 
* Criaçao de uma interface web em React para o usuário
* Interação com o aplicativo descentralizado através do browser
 
## Ambiente

Antes de começarmos a desenvolver nossa aplicação existem alguns requisistos técnicos. Instale o que segue:

* [Node.js v10+ LTS e npm](https://nodejs.org/en/) e npm (é instalado junto com o Node)
* [Git](https://git-scm.com/)

Após isso, nós precisamos somente instalar o Truffle, o framework que auxiliará no desenvolvimento do nosso DApp:

```
npm install -g truffle
```
Para verificar se o Truffle está instalado corretamente, digite ``` truffle version ``` no seu terminal. Caso veja algum erro, certifique-se que seus módulos npm estão visíveis nas variáveis de ambiente 

Utilizaremos também a Ganache, uma blockchain privada que permite a publicação dos nossos contratos em ambiente de desenvolvimento e dará suporte para o uso e teste da nossa aplicação. Faça o download da mesma em http://truffleframework.com/ganache.

## Desenvolvimento

Primeiramente, utilize o Git para clonar este repositório em sua máquina, na pasta que desejar
```
git clone git@github.com:lesio/wood
```
Navegue até a pasta raiz do projeto e instale as dependências locais com
```
npm install
```

### Estrutura de pastas

A estrutura inicial de pastas fornecida pelo Truffle possui:

* ```contracts/```: Contém o código fonte dos nossos contratos na linguagem [Solidity](https://solidity.readthedocs.io/en/develop/)
* ```migrations/```: Responsável por migrar nossos contratos para o ambiente desejado. O Truffle possui um sistema de controle de alterações.
* ```test/```: Contém os testes em Javascript e Solidity
* ```truffle.js```: Arquivo de configuração onde é descrito, por exemplo, o host dos contratos. Utilizaremos a rede local fornecida pela Ganache 

Esse repositório possui outras pastas que não importam no momento e serão descritas no decorrer do tutorial.

### Escrevendo os Smart Contracts

Nós começaremos nosso aplicativo descentralizado escrevendo os contratos, que atuam como o "back-end" e criam a interface para o armazenamento na blockchain.

#### Criando o contrato e definindo a versão do compilador
1. Crie um novo arquivo de nome ```WoodManager.sol``` na pasta ```contracts/``` .

2. Adicione esse conteúdo ao arquivo:

```
pragma solidity ^0.5.0;

contract WoodManager {

}
```
Observações:

* A versão mínima requerida do Solidity é descrita no ínicio do contrato: ```pragma solidity ^0.5.0;```. A palavra-chave ```pragma``` significa "informação adicional que importa somente ao compilador", enquanto o símbolo ```^``` significa "A versão indicada ou superior".
* A sintaxe exige ```;``` ao final de cada comando.

#### Criando variáveis

O Solidity é uma linguagem estaticamente tipada, isso significa que variáveis como strings, integers e arrays devem ser definidas. 

1. Um lote de madeira será definido através da ```struct``` ```WoodLot```. Insira o código a seguir no contrato WoodManager

```
    /** 
     * Types
     */
    struct LotShipment {
        string destiny;
        uint dateTime;
        string description;
        ShipmentStatus status;
    }

    struct WoodLot {
        string description;
        string quantity;
        uint createdAt;
        string farmName;
        LotStatus status;
        uint totalShipment;
        mapping(uint => LotShipment) shipment;
    }

    enum LotStatus { AVAILABLE, IN_TRANSIT, DELIVERED }
    enum ShipmentStatus { STARTED, IN_TRANSIT, DELIVERED }

```

2. Para organização dos lotes criaremos um ```array``` do tipo ```ẀoodLot```.

```
    /**
     * Storage variables   
     */
    WoodLot[] public lots;
```

Observações:

* Definimos uma única variável ```lots``` . Arrays possuem um tipo e podem ter tamanho fixo ou variável. No caso, nossa lista é do tipo ```WoodLot``` e possui tamanho variável.

* Nossa variável é do tipo ```public```. Variáveis públicas possuem automaticamente um método getter associado a elas. Entretanto, no caso de arrays, o acesso é restrito a um item por vez, pela necessidade de passar uma chave na chamada do getter. 

* Os modificadores ```public``` e ```private``` não referem-se à confidencialidade do dado na blockchain. Todos os dados são visíveis.

#### Criando a primeira função: Registrar um lote

Vamos permitir a inserção de um lote à nossa lista ```lots```.

1. Adicione a seguinte função abaixo da variável que definimos anteriormente
```
    /**
     * Functions
     */

    // adding an wood lot
    function addWoodLot(string memory description, string memory quantity, string memory farmName) public returns(uint) {
        uint createdAt = block.timestamp;
        WoodLot memory newWoodLot = WoodLot(description, quantity, createdAt, farmName, LotStatus.AVAILABLE, 0);
        lots.push(newWoodLot);
        emit LogLotCreated(description, farmName, createdAt, quantity,  lots.length - 1);
        return lots.length - 1;
    }
```
Observações:

* Precisamos definir o tipo dos parâmetros e do retorno, quando existir, das funções no Solidity. Nesse caso, recebemos uma cadeia de ```bytes``` (string) que representa descrição da madeira, um ```int``` com a quantidade de madeiras nesse lote, e o endereço de registro do recurso; e retornamos um inteiro que indica o índice do novo registro na lista.

* Criamos um novo registro do tipo ```WoodLot``` .

* A palavra-chave ```memory``` aparece por uma necessidade da linguagem de se explicitar que essa variável está sendo criada na memória, até o momento.

* Inserimos então o lote à lista e retornamos seu índice.

#### Criando a segunda função: Retornar o número de lotes 

Como já foi dito ao definirmos nossa lista de lotes, só conseguimos acessar os itens individualmente. Dessa forma, incluiremos uma função para saber o tamanho da nossa lista e facilitar futuros controles através da aplicação cliente.

1. Adicione a seguinte função abaixo de ```addWoodLot```, definida no passo anterior
```
    // Retrieving number of lots
    function getNumberOfLots() public view returns (uint) {
        return lots.length;
    }
```
Observações:

* A presença do modificador ```view``` significa que essa função não altera o estado de nenhuma variável do nosso contrato ou realiza chamadas internas a outros contratos com esse propósito.

#### Criando nosso primeiro modificador de funções

Ao buscar um lote e/ou agir sobre ele, precisamos checar se o índice recebido por parâmetro é compreendido no array, ou seja, se o lote existe. Aproveitaremos então um recurso do Solidity que é o ```modifier```.  

1. Adicione a definição do modificador ```validLot``` acima da primeira função presente no contrato.
```
    modifier validLot(uint lotId) {
        require(lotId >= 0 && lotId < lots.length);
        _;
    }
```
Observações:

* ```require(<check>)``` é utilizado para lançar uma exceção e reverter a execução do código se ```<check>``` for falso.
* O símbolo ```_``` serve para injetar a execução da função interceptada pelo modificador após a validação, isso será melhor entendido no passo seguinte.

#### Criando nossa terceira função: Retornar os dados de um lote

Vamos permitir que nossa aplicação tenha acesso aos dados de um lote inserido.

1. Adicione a função ```getWoodLot(uint lotId)```.
```
    // Retrieving an wood lot
    function getWoodLot(uint lotId)
        validLot(lotId)
        public
        view
        returns(string memory, string memory, string memory, uint, uint, LotStatus)
    {   
        WoodLot memory lot = lots[lotId];
        return (lot.description, lot.quantity, lot.farmName, lot.createdAt, lot.totalShipment, lot.status);
    }
```
Observações: 

* Inserimos o modificador ```validLot``` na assinatura do método, passando o índice do lote requerido. Sendo assim, ele agirá como um interceptador da função e continuará sua execução se o lote existir na lista. 
* Tipos não primários da linguagem, como é o caso da nossa Struct ```WoodLot```, não conseguem ser lidos pelo client até o momento, por uma deficiência da tecnologia. Para contornar isso, precisamos retornar o lote em forma de tupla, representada por ```(lot.description, lot.quantity, lot.addressCompany, lot.createdAt, lot.totalShipment)```. Perceba que os tipos dos elementos que compõem a tupla também precisam ser descritos no retorno da função ```returns(string memory, uint256, string memory, uint, uint)```

#### Criando nossa quarta função: Registrar o transporte de um lote

Após adicionar um lote e conseguir visualiza-lo externamente, precisamos criar a funcionalidade de registrar a logistica de um lote.

1. Adicione o que segue após a declaração da função ```getWoodLot```.
```
    // Registering a lot shipment
    function registerLotShipment(uint lotId, string memory destiny, string memory description, ShipmentStatus status)
        validLot(lotId)
        public
        returns (bool)
    {
        WoodLot storage lot = lots[lotId];
        uint dateTime = block.timestamp;
        LotShipment memory newShipment = LotShipment(destiny, dateTime, description, status);
        if(status == ShipmentStatus.STARTED) {
            lot.status = LotStatus.IN_TRANSIT;
        } else if(status == ShipmentStatus.DELIVERED) {
            lot.status = LotStatus.DELIVERED;
        }
        lot.shipment[lot.totalShipment] = newShipment;
        lot.totalShipment++;
        emit LogLotShipment(lotId, destiny, dateTime, description, status);
        return true;
    }

```
Observações: 

* A palavra-chave ```storage``` indica que essa variável está sendo trabalhada no storage do contrato, ao contrário de ```memory```.
* A variável global ```block``` refere-se ao bloco no qual será processada a transação. Obtemos então o timestamp da transação através dele.

#### Criando a quinta função: Recuperar os dados de transporte

// Retrieving an wood lot
    function getLotShipment(uint lotId, uint shipmentId)
        validLot(lotId)
        public
        view
        returns(string memory, uint, string memory, ShipmentStatus)
    {   
        WoodLot storage lot = lots[lotId];
        LotShipment memory lotShipment = lot.shipment[shipmentId];
        return (lotShipment.description, lotShipment.dateTime, lotShipment.destiny, lotShipment.status);
    }

## Compilando e publicando os contratos

Agora que já desenvolvemos o contrato, os próximos passos são compilar e publicar na nossa rede local.

A partir desse momento utilizaremos o Truffle, que possui um console de desenvolvimento embutido com funções que nos auxiliam nos testes, compilação e publicação.

### Compilando o contrato

O Solidity é uma linguagem compilada, o que significa que temos que transformar nosso contrato em bytecodes para que EVM (Máquina virtual Ethereum) consiga executa-lo.

1. Navegue até a pasta raiz do projeto e digite o comando
```
truffle compile
```
O resultado deve ser parecido com o que segue
```
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/WoodManager.sol...
Writing artifacts to ./build/contracts
```

### Publicando o contrato

Após compilarmos nosso contrato, resta agora publica-lo na blockchain!

1. Navegue até a pasta ```migrations/```, você deve ver um arquivo JavaScript ```1_initial_migration.js```
2. Crie um arquivo de nome ```2_deploy_contracts.js``` nesse mesmo diretório.
3. Adicione o conteúdo que segue no arquivo criado anteriormente
```
var WoodManager = artifacts.require("WoodManager");

module.exports = function(deployer) {
  deployer.deploy(WoodManager);
};
```
4. Antes de publicarmos nosso contrato, precisamos que a nossa blockchain local esteja rodando. 
Como dito na configuração do ambiente, utilizaremos a Ganache como blockchain de desenvolvimento.
Certifique-se que ela está instalada em sua máquina e dê um clique duplo em seu ícone. Após isso, ela iniciará e criará nossa rede local na porta 7545.

![Ganache](http://truffleframework.com/tutorials/images/pet-shop/ganache-initial.png)

5. Voltando ao terminal, digite o comando

```
truffle migrate --reset
```
O resultado deve ser parecido com o que segue
```
Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0xcc1a5aea7c0a8257ba3ae366b83af2d257d73a5772e84393b0576065bf24aedf
  Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
Saving successful migration to network...
  ... 0xd7bc86d31bee32fa3988f1c1eabce403a1b5d570340a3a9cdba53a472ee8c956
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying WoodManager...
  ... 0x43b6a6888c90c38568d4f9ea494b9e2a22f55e506a8197938fb1bb6e5eaa5d34
  WoodManager: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
Saving successful migration to network...
  ... 0xf36163615f41ef7ed8f4a8f192149a0bf633fe1a2398ce001bf44c43dc7bdda0
Saving artifacts...
```
Ao lado do nome de cada contrato temos o endereço dele na rede.

6. Na Ganache, note que o estado da blockchain alterou. Agora a rede mostra que o bloco atual é o 4, e não mais o 0. Além disso, verificamos que o saldo anterior de 100 Ethers foi reduzido, devido ao custo para realizar transações na rede (GAS).

![Ganache2](http://truffleframework.com/tutorials/images/pet-shop/ganache-migrated.png)

Agora que temos nosso contrato disponível na blockchain, é o momento de interagirmos com ele.


## Testando o contrato

O Truffle é bastante flexível no que se refere aos testes de smart contracts. O desenvolvedor é livre para criar os testes em JavaScript ou na própria linguagem Solidity. Nesse tutorial escreveremos os testes em JavaScript.

1. Navegue até a pasta ```test/``` e crie um arquivo de nome ```TestWoodManager.js```

2. Adicione o código abaixo no arquivo criado
```

// helpers
const BigNumber = require("bignumber.js")

// --- Contracts
const WoodManager = artifacts.require("./WoodManager.sol")

// --- Test variables
let woodManager = null

// Lots
let lots = [{
    description: "Test lot",
    quantity: "1000,00",
    farmName: "Amazonas",
    shipment : [{
        lotId: 0,
        destiny: "Bahia",
        description: "Transferência para Madeireira Bahia",
        status: BigNumber(0)
    }, {
        lotId: 0,
        destiny: "Espirito Santo",
        description: "Transferência para Madeireira Espirito Santo",
        status: BigNumber(1)
    }, {
        lotId: 0,
        destiny: "Minas Gerais",
        description: "Chegada para Madeireira Minas Gerais",
        status: BigNumber(2)
    }]
}]

// Agents
let owner = null

contract('WoodManager', accounts => {

    before(async() => {

        // Get accounts and init contracts
        owner = accounts[0]
        woodManager = await WoodManager.new( { from: owner })
    
    })

})

```
Assim, iniciamos o arquivo de teste com nossas variáveis auxiliares, além de instanciarmos o contrato ```WoodManager```. Abaixo do bloco ```before```, adicione os testes que seguem.


### Testando a função: addWoodLot

```
    it('should register a new lot', async () => {
        const { logs } = await woodManager.addWoodLot(
            lots[0].description,
            lots[0].quantity,
            lots[0].farmName,
            { from: owner }
        )
        const event = logs.find(e => e.event === 'LogLotCreated')
        const args = event.args
        index = args.index

        assert.equal(index, 0, "The lot must be the first wood lot")
    })
```
### Testando a função: getNumberOfLots

```
    it('should retrieve the number of lots', async () => {
        const numberOfLots = await woodManager.getNumberOfLots()
        assert.equal(numberOfLots, 1, `The number of lots must be 1`)
    })

```
### Testando a função: getWoodLot

```
    it('should retrieve an wood lot', async () => {
        const woodLot = await woodManager.getWoodLot(0)
        assert.equal(woodLot[0], lots[0].description, `The lot description must be ${lots[0].description}`)
        assert.equal(woodLot[5].toNumber(), 0, `The lot must be available`)
    })
 
```
### Testando a função: registerLotShipment

```
    it('should register a shipment - STARTED', async () => {
       
        let lotShipment = lots[0].shipment[0];

        const { logs } = await woodManager.registerLotShipment(
           lotShipment.lotId,
           lotShipment.destiny,
           lotShipment.description,
           lotShipment.status,
           { from: owner }
        )
        const event = logs.find(e => e.event === 'LogLotShipment')
        const args = event.args
        lotId = args.lotId

        assert.equal(lotId, 0, "The shipment register must be added to the first wood lot")

    })

    it('should bring a new status for the wood lot - IN TRANSIT', async () => {
        const woodLot = await woodManager.getWoodLot(0)
        assert.equal(woodLot[4].toNumber(), 1, `The lot should have 1 shipment register`)
        assert.equal(woodLot[5].toNumber(), 1, `The lot must be in transit`)
    })
```
### Testando a função: getLotShipment

```
    it('should retrieve infos about shipment', async () => {
        const lotShipment = await woodManager.getLotShipment(0, BigNumber(0));
        assert.equal(lotShipment[0], lots[0].shipment[0].description, `The shipment description must be ${lots[0].shipment[0].description}`)
        lotShipment.description, lotShipment.dateTime, lotShipment.destiny, lotShipment.status
        assert.equal(lotShipment[3].toNumber(), 0, `The shipment spot must be a start location`)
    })
```

### Testando a mudanda de estado do estado de entrega do lote

Por fim, queremos testar se após o último registro de conclusão da logistica, o lote consta como
"entregue".

```
    it('should register a new shipment spot - IN TRANSIT', async () => {
       
        let lotShipment = lots[0].shipment[1];

        const { logs } = await woodManager.registerLotShipment(
            lotShipment.lotId,
            lotShipment.destiny,
            lotShipment.description,
            lotShipment.status,
            { from: owner }
        )
        const event = logs.find(e => e.event === 'LogLotShipment')
        const args = event.args
        lotId = args.lotId

        assert.equal(lotId, 0, "The shipment register must be added to the first wood lot")

    })

    it('should register a new shipment spot - DELIVERED', async () => {
       
        let lotShipment = lots[0].shipment[2];

        const { logs } = await woodManager.registerLotShipment(
            lotShipment.lotId,
            lotShipment.destiny,
            lotShipment.description,
            lotShipment.status,
            { from: owner }
        )
        const event = logs.find(e => e.event === 'LogLotShipment')
        const args = event.args
        lotId = args.lotId

        assert.equal(lotId, 0, "The shipment register must be added to the first wood lot")

    })

    it('should bring a new status for the wood lot - DELIVERED', async () => {
        const woodLot = await woodManager.getWoodLot(0)
        assert.equal(woodLot[4].toNumber(), 3, `The lot should have 3 shipment registers`)
        assert.equal(woodLot[5].toNumber(), 2, `The lot must be delivered`)
    })
```
### Executando os testes

Semelhante aos procedimentos ```compile``` e ```migrate```, utilizaremos o comando
```test``` fornecido pelo Truffle para rodarmos os testes.

1. Navegue até a pasta raiz do projeto e execute 
```
truffle test
```

2. Se todos os testes passarem, você verá um resultado similar ao que segue
```
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/WoodManager.sol...


  Contract: WoodManager
    ✓ should register a new lot (76ms)
    ✓ should retrieve the number of lots
    ✓ should retrieve an wood lot
    ✓ should register a shipment - STARTED (59ms)
    ✓ should bring a new status for the wood lot - IN TRANSIT
    ✓ should retrieve infos about shipment
    ✓ should register a new shipment spot - IN TRANSIT (60ms)
    ✓ should register a new shipment spot - DELIVERED (53ms)
    ✓ should bring a new status for the wood lot - DELIVERED


  9 passing (446ms)
```


## Ajustando a interface web para a comunicação com os Smart Contracts

### Copiando os artefatos para a pasta do frontend

Nessa etapa, é interessante destacar como o web3 consegue entender o smart contract e  se comunicar com ele: ao compilar o código solidity um arquivo `.json` é criado. Esse arquivo é chamado de [ABI (Application Binary Interface)](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI). Ele contém metadados do contrato, como as suas variáveis, sua funções e os respectivos tipos e retornos. Dessa forma, se o seu contrato possui a seguinte função: 

```solidity
function sum(uint x, uint y) public returns (uint) {
  return x + y;
}
```

Através da ABI, o web3 vai entender que o contrato possui uma função `sum` que deve receber dois inteiros por parâmetro e retornar outro inteiro:

```javascript
myContractInstance.sum.call(x, y, (error, result) => {
  assert(!error);
  assert(result).equals(x + y);
});
```
Para que a interface tenha acesso ao ABI do contrato ```WoodManager``` execute o comando abaixo na pasta raiz
do projeto.

```
cp build/contracts/WoodManager.json src/build-contracts/WoodManager.json
```

## Interagindo com o dapp no browser

Agora estamos prontos para usar o dapp!

### Instalando e configurando o MetaMask

O jeito mais fácil de interagir com o nosso dapp no browser é utilizando a extensão [MetaMask](https://metamask.io).

1. Instale o MetaMask no seu browser
2. Após finalizar a instalação, você verá o ícone da raposa próximo a barra de endereço. Clique nele e você verá essa tela:

![Privacy note](http://truffleframework.com/tutorials/images/pet-shop/metamask-privacy.png)

3. Clique em `Accept` para aceitar a *Privacy Notice*.
4. Após isso você verá os Termos de Uso. Leia-os, role até o final e clique em `Accept`.

![Terms of use](http://truffleframework.com/tutorials/images/pet-shop/metamask-terms.png)

5. Agora você verá a tela inicial o MetaMask. Clique em **Import Existing DEN**.

![Tela inicial do MetaMask](http://truffleframework.com/tutorials/images/pet-shop/metamask-initial.png)

6. Na caixa de texto `Wallet Seed`, coloque o *mnemônico* que é mostrado no ganache

> candy maple cake sugar pudding cream honey rich smooth crumble sweet treat

```
WARNING:
Não use esse mnemônico na mainnet. Se você enviar ETH para qualquer conta criada com esse mnemônico você provavelmente irá perder tudo!
```
Digite uma senha abaixo e clique em **OK**.

![Seed](http://truffleframework.com/tutorials/images/pet-shop/metamask-seed.png)

7. Agora precisamos conectar o MetaMask na blockchain do Ganache. Clique no menu que mostra `Main Network` e selecione **Custom RPC**.


![Menu de networks do MetaMask](http://truffleframework.com/tutorials/images/pet-shop/metamask-networkmenu.png)

8. Na caixa de texto chamada "New RPC URL" digite `http://127.0.0.1:7545` e clique em **Save**.

![MetaMask Custom RPC](http://truffleframework.com/tutorials/images/pet-shop/metamask-customrpc.png)


O nome da network no topo irá mudar para "Private Network".

9. Clique na seta para retornar para a página de "Accounts".

Cada carteira criada com o comando Truffle Develop possui 100 ether. Você irá perceber um pouco menos do que isso na primeira conta, porque para fazer o deploy do contrato e rodar os testes, um pouco de ether foi gasto.

![Conta do MetaMask](http://truffleframework.com/tutorials/images/pet-shop/metamask-account1.png)

A configuração está completa agora!

## Iniciando o servidor http local

Para iniciá-lo utilize o comando `npm start`.

## Usando o dapp

1. Para cada transação de escrita à blockchain, o MetaMask irá abrir um popup contendo informações sobre a transação a ser feita. Clique em **Submit** para aprovar a transação.

![Informações da transação](http://truffleframework.com/tutorials/images/pet-shop/metamask-transactionconfirm.png)

2. Após isso, você verá a transação listada na sua conta do MetaMask

![Transações do MetaMask](http://truffleframework.com/tutorials/images/pet-shop/metamask-transactionsuccess.png). 

Pronto! Agora que você viu como tudo funciona na prática, vamos propor um desafio.

## Parte final

Agora que você já entendeu a dinâmica do desenvolvimento para Ethereum, antes de atualizar o seu LinkedIn, vamos aprofundar um pouco mais o conhecimento com alguns desafios.

### Desafio 1

O Smart Contract ao final do tutorial possui um problema de segurança. Somente o criador do lote pode adicionar um registro 
de transporte para o mesmo.

Implemente um owner para o contrato WoodManager.

>Dica: estude a definição de um tipo ```address``` e o objeto global ```msg```;

### Desafio 2

Implemente a opção de troca do owner do owner de um lote. 

Somente o dono atual do lote pode executar essa transação.