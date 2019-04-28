
function loadGanacheRPC() {
  web3.extend({
      property: 'ganache',
      methods: [{
          name: 'evm_mine',
          call: 'evm_mine',
      },{
        name: 'evm_increaseTime',
        call: 'evm_increaseTime',
        params: 1,
      }]
  });
}

loadGanacheRPC();

module.exports = {
  ganache_evm_mine: web3.ganache.evm_mine,
  ganache_evm_increaseTime: web3.ganache.evm_increaseTime,
};








