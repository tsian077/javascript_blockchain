const {BlockChain,Transaction} = require('./blockchain')
let jimmycoin = new BlockChain();

//新增交易紀錄 address1 給 address2 100 
jimmycoin.createTransaction(new Transaction('address1','address2',100))
//address2 給 address1 50
jimmycoin.createTransaction(new Transaction('address2','address1',50))



console.log('\nStarting the miner')
//新增一個block並開始計算hash
jimmycoin.minePendingTransactions('xaviers-address')
jimmycoin.minePendingTransactions('jimmy-address')
//查看目前xaviers-address的餘額
console.log('\nBalance of xavier is ',jimmycoin.getBalanceOfAddress('xaviers-address'))

console.log('\nStarting the miner again...');
jimmycoin.minePendingTransactions('xaviers-address')

console.log('\nBalance of xavier is ',jimmycoin.getBalanceOfAddress('xaviers-address'))

// jimmycoin.createTransaction(new Transaction('address','address2',100))



//pow
// console.log("Mining block 1...")
// jimmycoin.addBLock(new Block(1,'10/07/2017',{amount:4}));

// console.log("Mining block 2...")
// jimmycoin.addBLock(new Block(2,'12/09/2017',{amount:10}));


//simple blockchain
//這邊可以看出假如我們自行更改amount那blockchain就會傳一個false
// console.log("Is blockchain valid?"+jimmycoin.isChainValid())
// console.log(JSON.stringify(jimmycoin,null,4))
// jimmycoin.chain[1].data = {amount:100};
// jimmycoin.chain[1].hash = jimmycoin.chain[1].calculateHash();
// jimmycoin.chain[2].previousHash = jimmycoin.chain[1].hash;


// console.log("Is blockchain valid?"+jimmycoin.isChainValid())
// console.log(JSON.stringify(jimmycoin,null,4))