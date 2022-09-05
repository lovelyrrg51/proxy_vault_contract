const { assert, expect } = require("chai");
const { ethers, contract, artifacts } = require("hardhat");

const Vault = artifacts.require("Vault");

contract("Simple Vault Test", (accounts) => {
  // const deployer = accounts[0];

  beforeEach(async () => {
    const [owner, alice, bob] = await ethers.getSigners();

    this.owner = owner;
    this.alice = alice;
    this.bob = bob;

    // Vault Contract
    this.VaultInstance = await Vault.new();

    const vault = await ethers.getContractFactory("Vault");
    this.Vault = await vault.deploy();
    await this.Vault.deployed();

    // Proxy Contract
    const proxy = await ethers.getContractFactory("Proxy");
    this.Proxy = await proxy.deploy();
    await this.Proxy.deployed();

    // Set Implementation
    await this.Proxy.connect(this.owner).setImplementation(this.Vault.address);
  });

  describe("Test - Vault", async () => {
    it("Check Proxy Address", async () => {
      assert.equal(await this.Proxy.getImplementation(), this.Vault.address);
    });

    it("Check Deposit Logic", async () => {
      const updatedProxy = new ethers.Contract(
        this.Proxy.address,
        this.VaultInstance.abi,
        this.owner
      );

      // Deposit ETH
      await updatedProxy.connect(this.alice).depositETH({
        from: this.alice.address,
        value: ethers.utils.parseEther("0.1"),
        gasLimit: 100000,
      });

      // Check User Balance
      expect(await updatedProxy.userBalance(this.alice.address)).to.eq(
        ethers.utils.parseEther("0.1")
      );
    });

    it("Check Withdraw Logic", async () => {
      const updatedProxy = new ethers.Contract(
        this.Proxy.address,
        this.VaultInstance.abi,
        this.owner
      );

      // Deposit ETH
      await updatedProxy.connect(this.alice).depositETH({
        from: this.alice.address,
        value: ethers.utils.parseEther("0.1"),
        gasLimit: 100000,
      });

      // Check User Balance
      await expect(await updatedProxy.userBalance(this.alice.address)).to.eq(
        ethers.utils.parseEther("0.1")
      );

      // Try to withdraw 0 ETH
      await expect(
        updatedProxy.connect(this.alice).withdrawETH(this.bob.address, 0)
      ).to.be.revertedWith("The withdraw amount should be more than zero");

      // Try to withdraw over deposit amount
      await expect(
        updatedProxy
          .connect(this.alice)
          .withdrawETH(this.bob.address, ethers.utils.parseEther("0.2"))
      ).to.be.revertedWith(
        "The user balance should be more than withdraw amount"
      );

      // Withdraw 0.05 ETH to Bob's address
      await updatedProxy
        .connect(this.alice)
        .withdrawETH(this.bob.address, ethers.utils.parseEther("0.05"));

      // Check Alice's Balance
      await expect(await updatedProxy.userBalance(this.alice.address)).to.eq(
        ethers.utils.parseEther("0.05")
      );
    });
  });
});
