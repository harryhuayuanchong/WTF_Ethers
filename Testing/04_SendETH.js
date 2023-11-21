// 利用Wallet类发送ETH
// 由于playcode不支持ethers.Wallet.createRandom()函数，我们只能用VScode运行这一讲代码
import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊测试网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.g.alchemy.com/v2/S2JZo8sBezYi2DrE3gV-ln2zU6WArQNO';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 创建随机的wallet对象
const wallet1 = ethers.Wallet.createRandom();
const wallet1WithProvider = wallet1.connect(provider);
const mnemonic = wallet1.mnemonic

// 利用私钥和Provider实例创建Wallet对象。这种方法创建的钱包不能获取助记词
const privateKey = "0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b"
const wallet2 = new ethers.Wallet(privateKey, provider);

// 从助记词穿件wallet对象
const wallet3 = ethers.Wallet.fromPhrase(mnemonic.phrase);

const wallet4 = '0xfe4770c483cbc7c1b207a972be8bd1472bfa94b7';

const main = async () => {
    // 获取钱包地址 - getAddress()
    const address1 = await wallet1.getAddress();
    const address2 = await wallet2.getAddress();
    const address3 = await wallet3.getAddress();

    console.log(`1. 获取钱包地址`);
    console.log(`钱包1地址: ${address1}`);
    console.log(`钱包2地址: ${address2}`);
    console.log(`钱包3地址: ${address3}`);
    console.log(`钱包1和钱包3的地址是否相同: ${address1 === address3}`);

    // 获取助记词 - mnemonic.phrase
    console.log(`钱包1助记词: ${wallet1.mnemonic.phrase}`)
    // console.log(`钱包2助记词: ${wallet2.mnemonic.phrase}`)
    console.log(`钱包3助记词: ${wallet3.mnemonic.phrase}`)

    // 获取私钥 - privateKey
    console.log(`钱包1助记词: ${wallet1.privateKey}`)
    console.log(`钱包2助记词: ${wallet2.privateKey}`)
    console.log(`钱包3助记词: ${wallet3.privateKey}`)

    // 获取交互次数 - getTransactionCount()
    // const txCount1 = await wallet1WithProvider.getTransactionCount();
    // const txCount2 = await wallet2.getTransactionCount();

    // console.log(`钱包1发送交易次数: ${txCount1}`)
    // console.log(`钱包2发送交易次数: ${txCount2}`)

    // 发送ETH
    // 如果这个钱包没goerli测试网ETH了，去水龙头领一些，钱包地址: 0xe16C1623c1AA7D919cd2241d8b36d9E79C1Be2A2
    // 1. chainlink水龙头: https://faucets.chain.link/goerli
    // 2. paradigm水龙头: https://faucet.paradigm.xyz/
    console.log(`\n5. 发送ETH（测试网）`);
    // i. 打印交易前余额
    console.log(`i. 发送前余额`)
    console.log(`钱包1：${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`)
    console.log(`钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`)
    console.log(`钱包4: ${ethers.formatEther(await provider.getBalance(wallet4))} ETH`)

    // ii. 构造交易请求，参数：to为接收地址，value为ETH数额
    const tx = {
        to: address1,
        value: ethers.parseEther("0.001")
    }

    // iii. 发送交易，获得收据
    console.log(`\nii. 等待交易在区块链确认（需要几分钟）`)
    // const receipt = await wallet2.sendTransaction(tx);
    const receipt = await wallet4.sendTransaction(tx);
    await receipt.wait();
    console.log(receipt)

    // iv. 打印交易后余额
    console.log(`\niii. 发送后余额`)
    console.log(`钱包1: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`)
    console.log(`钱包4: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`)
}   

main()

