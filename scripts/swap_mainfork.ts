import { ethers, network } from "hardhat";
import fetch from "node-fetch";

async function main() {

    console.log("Hello Type Script");


    const ONE_ETHER_BASE_UNITS = "1000000000000000000"; // 1 ETH
    const FUNCs_ERC20_ABI_X = [
   "function balanceOf(address account) external view returns (uint256)",]

    const sellToken = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"; // ETH
    const buyToken = "0x6b175474e89094c44da98b954eedeac495271d0f"; // DAI
    const x_token_name="DAI"

    const sellAmount = ONE_ETHER_BASE_UNITS;

    const takerAddress = "0xab5801a7d398351b8be11c439e05c5b3259aec9b"; 
    // An account with sufficient balance on mainnet
    const swap_url= "https://api.0x.org/swap/v1/quote?"
    const swap_params="buyToken="+buyToken+"&sellAmount="+sellAmount+"&sellToken="+sellToken+"&takerAddress="+takerAddress
    const swap_api=swap_url+swap_params
    console.log(swap_api)

    const  quote_response= await fetch(swap_api)

    if (quote_response.status!=200){
       const error_msg=await quote_response.text()
        throw new Error(error_msg)

    }

    const quote_data=await quote_response.json()
    console.log(quote_data)

    // Impersonate the taker account so that we can submit the quote transaction
    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [takerAddress]
      });
  
    //   // Get a signer for the account we are impersonating
      const signer = await ethers.getSigner(takerAddress);
      const token_contract = new ethers.Contract(buyToken,  FUNCs_ERC20_ABI_X, signer);

      const etherBalanceBefore = await signer.getBalance();
      const xBalalanceBefore = await  token_contract.balanceOf(takerAddress);
       
      console.log("Eth :"+ ethers.utils.formatEther(etherBalanceBefore));
      console.log(""+x_token_name+" :"+ ethers.utils.formatEther(xBalalanceBefore));
      
    // //   // Send the transaction
    // const txResponse = await signer.sendTransaction({
    //     from: quote_data.from,
    //     to: quote_data.to,
    //     data: quote_data.data,
    //     value: ethers.BigNumber.from(quote_data.value || 0),
    //     // gasPrice: ethers.BigNumber.from(quote_data.gasPrice),
    //     // gasLimit: ethers.BigNumber.from(quote_data.gas),
    //   });
    //   // Wait for transaction to confirm
    //   const txReceipt = await txResponse.wait();

    //   console.log("Swaping.....")
      
    //   const etherBalanceAfter = await signer.getBalance();
    //   const xBalalanceAfter = await  token_contract.balanceOf(takerAddress);
       
    //   console.log("Eth :"+ ethers.utils.formatEther(etherBalanceAfter));
    //   console.log(""+x_token_name+" :"+ ethers.utils.formatEther(xBalalanceAfter));


  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  