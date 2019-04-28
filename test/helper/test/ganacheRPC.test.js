const { should } = require('../setup');
const { ganache_evm_mine,  ganache_evm_increaseTime } = require('../ganacheRPC');

describe('test ganache custom RPC', function () {
    it('increase the block number by one', async function () {
		startingBlock = await web3.eth.getBlockNumber();
		ganache_evm_mine();
		newBlock = await web3.eth.getBlockNumber();
		newBlock.should.be.equal(startingBlock + 1);	
    });	

   	it('increases time to a time in the future', async function(){
   		const toleranceSecond = 1;
   		const forwardTimeInSec = 60;
		var latestBlock = await web3.eth.getBlockNumber();
		var current = await web3.eth.getBlock(latestBlock);
		var increaseTime = current.timestamp + forwardTimeInSec;
		ganache_evm_increaseTime(forwardTimeInSec);
		ganache_evm_mine();
		var newBlock = await web3.eth.getBlockNumber();
		var latest = await web3.eth.getBlock(newBlock)
		latest.timestamp.should.be.closeTo(increaseTime, toleranceSecond);
   	});
  });
