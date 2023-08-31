// Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
// Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

// Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
// Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

// Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
// Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

// Account #3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (10000 ETH)
// Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6




// const { ethers } = require("ethers");
// const { providers } = require("ethers");
require("@nomicfoundation/hardhat-toolbox");
require("./tasks/faucet");

const { task } = require("hardhat/config");


// require("@nomiclabs/hardhat-waffle");


task("check", "checkt contact amounts", async () => {
  
  const [deployers, next, three] = await ethers.getSigners();
  const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/6EouPO3zdu2Y92tupQEHPe7uVg9HOm1s")
  // deployers = "f39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  // three = "3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
  // const contractAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"; smart1
  // const contractAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";
  // const contractAddress = "0xD85cF680C7D0B6694d8A4ef23239367eCBCF682C"; //besu
  // const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; //local
  const contractAddress = "0x430Bf26ace7708D601139508Ea8c37748140DEd4"; //local
  const { abi : ABI } = require("./artifacts/contracts/token.sol/Token.json")
    
  const contractInterface = new ethers.utils.Interface(ABI)
  const sc = new ethers.Contract(contractAddress,ABI,deployers);


  console.log("total_supply : ", ethers.utils.formatUnits(await sc.totalSupply(),18));

  console.log("name : ", await sc.name());
  console.log("symbol : ", await sc.symbol());
  // console.log("deployers address :", deployers.address);
  // console.log("to address :", next.address);

  await sc.transfer(next.address,50);
  console.log(ethers.utils.formatUnits (await sc.balanceOf(deployers.address),18));
  console.log(ethers.utils.formatUnits (await sc.balanceOf(next.address),18));
  console.log(await sc.callFoo(100));
  // console.log(await sc.totalSupply());
  // console.log("approve : ",await sc.approve(next.address, 10000000));

  // console.log("allow : ", await sc.allowance(deployers.address, next.address));
  // console.log(await sc.transferFrom(deployers.address, three.address ,70 ))
  // console.log(await sc.balanceOf(next.address));
  // console.log(await sc.balanceOf(three.address));

  const eventName = "foo(uint256)";
  const eventFilter = {
    
    topics :[ethers.utils.id(eventName),
    null ],
    fromBlock : 0,
    toBlock : "latest",
    address : contractAddress,
  };

  async function seeLog() {
    console.log('BB')
    const logs = await provider.getLogs(eventFilter);
    console.log('CC')
    const blocks = await provider.getBlockNumber();
    console.log(blocks);
    console.log(logs);
    // logs.forEach(log => {
    //   const parsedLog = contractInterface.parsedLog(log);
    //   console.log('past event:', parsedLog.values);
    // });
  }
  
  await seeLog();
  console.log("aa")

});


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.1",

  networks : {
    sepolia : {
      url : "https://eth-sepolia.g.alchemy.com/v2/6EouPO3zdu2Y92tupQEHPe7uVg9HOm1s",
      accounts :[
        "4b4ab429999707db388bda64f5653a26c908447522a3055a277a5d9daf567e9a",
        "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
      ],
      gas: 2100000,
      gasPrice: 8000000000,
      chainID : 11155111,
    },

    localhost : { 
      allowUnlimitedContractSize: true,
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"],
      gas: 2100000,
      gasPrice: 8000000000,
    },
    besu : {
      // chainID: 1337,
      chainID: 1977,
      url : "http://192.168.0.10:8545",
      // allowUnlimitedContractSize: true, // Enable unlimited contract size
      accounts: ["0x32f9bf1acce5f00960254a0a7b17672b14b68df2b3b1bfd62bfa6a504b86983a"] // besu
      //       account.address:  0x84Abb55017E78D6936B81f9Dad8a054DA42Ba755
      // account.privKey:  0x60a76434070ef938914b5e45e9fdfadeb4e3da65e18526a6294b7479d5c445bf

      // account.address:  0xf972Cf4cF3cedA53Cf272542F1b8f5ce5461a24d
      // account.privKey:  0x32f9bf1acce5f00960254a0a7b17672b14b68df2b3b1bfd62bfa6a504b86983a

      //0xD85cF680C7D0B6694d8A4ef23239367eCBCF682C
    },
    hardhat : {
      chainID: 1977,
      forking : {
        url:"http://besu@192.168.0.10:8545"
      }

    }
  }
};


