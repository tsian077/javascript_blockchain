//rewards & transactions

const sma256 = require('crypto-js/sha256')

const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); //algorithm of bitcoin wallets

class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return sma256(this.fromAddress + this.toAddress + this.amount).toString()
    }

    signTRansaction(signingKey){
        
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallet');

        }

        const hashTx = this.calculateHash(); //將fromaddress和toaddress和amount計算hash
        const sig = signingKey.sign(hashTx,'base64');
        this.signature = sig.toDER('hex');

    }

    isValid(){
        if(this.fromAddress === null) return true;

        if(this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress,'hex');

        return publicKey.verify(this.calculateHash(),this.signature);
    }
}
    

class Block{

    constructor(timestamp,transactions,previousHash=''){
         //這邊不需要index因為因為block的位置取決於在array中的index
        this.timestamp = timestamp; //這個block何時被製作
        this.transactions=transactions;  //transactions為交易紀錄。
        this.previousHash=previousHash;  //前一個hash
        this.hash=this.calculateHash();
        this.nonce = 0;
    }
    //計算這個block的hash
    calculateHash(){
        
        return sma256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        //當前五個子字串不全為0時就執行while
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash  =this.calculateHash();
        }
        console.log('previoushash',this.previousHash)
        console.log("Block mined " + this.hash);
    } 

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGensisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
        
    }

    createGensisBlock(){
        return new Block("01/01/2019","Genesis block","0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    isChainValid(){
        for(let i =1 ;i<this.chain.length;i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }
            
            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
        }
        return true;
    }
    //挖掘待定的交易紀錄
    minePendingTransactions(miningRewardAddress){
        //新創的一個block
        let block = new Block(Date.now(),this.pendingTransactions);
        block.previousHash=this.getLatestBlock().hash;
        //開始計算，將前幾個數字化為0。
        block.mineBlock(this.difficulty)

        // console.log("Block successfullt mined");
        //將block加到chain中
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null,miningRewardAddress,this.miningReward)
        ];
        console.log('minePendingTransactions:',this.pendingTransactions)
    }

    addTransaction(transaction){
        this.pendingTransactions.push(transaction)
        console.log(this.pendingTransactions)
    }

    getBalanceOfAddress(address){
        let balance =  0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
//     addBLock(newBlock){
//         newBlock.previousHash = this.getLatestBlock().hash;
//         // newBlock.hash = newBlock.calculateHash();
//         newBlock.mineBlock(this.difficulty);
//         this.chain.push(newBlock);
//     }
}


module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;