const sma256 = require('crypto-js/sha256')
class Block{

    constructor(index,timestamp,data,previousHash=''){
        this.index =index;  //index代表這個block在chain中的位置
        this.timestamp = timestamp; //這個block何時被製作
        this.data=data;  //這個block包含的data
        this.previousHash=previousHash;  //前一個hash
        this.hash=this.calculateHash();
        this.nonce = 0;
    }
    //計算這個block的hash
    calculateHash(){
        return sma256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        //當前五個子字串不全為0時就執行while
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash  =this.calculateHash();
        }

        console.log("Block mined " + this.hash);
    } 
}

class BlockChain{
    constructor(){
        this.chain = [this.createGensisBlock()];
        this.difficulty = 3;
        
    }

    createGensisBlock(){
        return new Block(0,"01/01/2019","Genesis block","0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    isChainValid(){
        for(let i =1 ;i<this.chain.length;i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            
            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return 'curr false';
            }
            if(currentBlock.previousHash !== previousBlock.hash)
            {
                return 'pre false';
            }
        }
        return true;
    }
    addBLock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
}


let jimmycoin = new BlockChain();


//pow
// console.log("Mining block 1...")
// jimmycoin.addBLock(new Block(1,'10/07/2017',{amount:4}));

// console.log("Mining block 2...")
// jimmycoin.addBLock(new Block(2,'12/09/2017',{amount:10}));


//simple blockchain
// console.log("Is blockchain valid?"+jimmycoin.isChainValid())
// console.log(JSON.stringify(jimmycoin,null,4))
// jimmycoin.chain[1].data = {amount:100};
// jimmycoin.chain[1].hash = jimmycoin.chain[1].calculateHash();
// jimmycoin.chain[2].previousHash = jimmycoin.chain[1].hash;


// console.log("Is blockchain valid?"+jimmycoin.isChainValid())
// console.log(JSON.stringify(jimmycoin,null,4))