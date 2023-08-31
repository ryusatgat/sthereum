// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const { ethers } = require("hardhat");
const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }
  
  const provider = ethers.provider;
  // console.log(provider);
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    // await deployer.getAddress()
    
  );
  console.log(provider);
  console.log("haha", deployer);
  // console.log("Account balance:", (provider.getBalance(deployer)).toString());
  
  console.log("dd");

  const Token = await ethers.getContractFactory("Token");
  console.log("dd1");
  const token = await Token.deploy("hanwoo sto","HAN");
  
  console.log("dd2");
  console.log(token);
  console.log("Token address:", token.address);
  // console.log("Token address:", await token.totalSupply());
  await token.deployed();
  console.log("dd3");

  console.log("Token address:", token.address);
  console.log("Token address:", await token.totalSupply());

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "front", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    path.join(contractsDir, "Token.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
