const hre = require("hardhat");

async function main() {
  // Deploy Vault Contract
  const Vault = await hre.ethers.getContractFactory("Vault");
  const VaultInstance = await Vault.deploy();
  await VaultInstance.deployed();

  // Deploy Proxy Contract
  const Proxy = await hre.ethers.getContractFactory("Proxy");
  const ProxyInstance = await Proxy.deploy();
  await ProxyInstance.deployed();

  // Update setImplementation on Proxy Contract
  await ProxyInstance.setImplementation(VaultInstance.address);

  console.log(ProxyInstance.address, VaultInstance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
