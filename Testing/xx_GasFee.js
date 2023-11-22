import { ethers } from "ethers";

const INFURA_ID = '2535f2daaefa46e49efd9c49a4acd9bb';

const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`);

const getGasPrice = async () => {
    try {
        const feeData = await provider.getFeeData();

        // 对于非 EIP-1559 交易，使用 `feeData.gasPrice`
        if (feeData.gasPrice) {
            console.log(`Current Gas Price: ${ethers.utils.formatUnits(feeData.gasPrice, 'gwei')} Gwei`);
        }

        // 对于 EIP-1559 交易，使用 `feeData.maxFeePerGas` 和 `feeData.maxPriorityFeePerGas`
        if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
            console.log(`Current Max Fee Per Gas: ${ethers.utils.formatUnits(feeData.maxFeePerGas, 'gwei')} Gwei`);
            console.log(`Current Max Priority Fee Per Gas: ${ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, 'gwei')} Gwei`);
        }
    } catch (e) {
        console.error(`Error fetching Gas Price: ${e}`);
    }
}

getGasPrice();
