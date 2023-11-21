// 監聽合約事件
// 1. 持續監聽
// contractUSDT.on("Event Name", Listener)
// 2. 只監聽一次
// contractUSD.once("Event Name", Listener)

import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊网络
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.g.alchemy.com/v2/S2JZo8sBezYi2DrE3gV-ln2zU6WArQNO';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 2. 聲明合約變量
// USDT Contract Address
const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// 構建 USDT 的 Transfer ABI
const abi = [
    "event Transfer(address indexed from, address indexed to, uint value)"
];
// 生成 USDT 合約對象
const contractUSDT = new ethers.Contract(contractAddress, abi, provider);

const main = async () => {
    // 3. 只監聽一次 - contract.once()
    try {
        console.log("\n1. 利用contract.once()，監聽一次Tranfer事件")
        contractUSDT.once('Transfer', (from, to, value) => {
            console.log(`${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value), 6)}`)
        })

        // 4. 持續監聽 - contract.on()
        console.log("\n2. 利用contract.on()，持续监听Transfer事件");
        contractUSDT.on('Transfer', (from, to, value)=>{
        console.log(
            // 打印结果
            `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
        )
        })
    } catch(e) {
        console.log(e)
    }
}

main()