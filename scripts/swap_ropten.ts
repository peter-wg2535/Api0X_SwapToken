import { ethers, network } from "hardhat";
import fetch from "node-fetch";

async function main() {

    console.log("Hello Ropsten");


    const ONE_ETHER_BASE_UNITS = "100000000000000000"; // 0.1 ETH
    const FUNCs_ERC20_ABI_X = ["function balanceOf(address account) external view returns (uint256)",]

    const sellToken = "ETH"; 
    const buyToken = "0xad6d458402f60fd3bd25163575031acdce07538d"; 
    const x_token_name="DAI"

    const sellAmount = ONE_ETHER_BASE_UNITS;

    const takerAddress = "0x9130aC7AeB7e74E7C3fc64B315DbD0EcAFe69e63"; 

    const swap_url= "https://ropsten.api.0x.org/swap/v1/quote?"
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


    //const private_key=process.env.PRIVATE_KEY  // error
    const private_key="xxxxxxxxxxxxxxxxxxxxxxx"  // run ok


    //   // Get a signer for the account we are impersonating
    const provider = new ethers.providers.InfuraProvider("ropsten", process.env.INFURA_PROJECT_ID)
    const wallet = new ethers.Wallet(private_key, provider)
    const signer = wallet.connect(provider)

    const token_contract = new ethers.Contract(buyToken,  FUNCs_ERC20_ABI_X, signer);

    const etherBalanceBefore = await signer.getBalance();
    const xBalalanceBefore = await  token_contract.balanceOf(takerAddress);
       
    console.log("Eth :"+ ethers.utils.formatEther(etherBalanceBefore));
    console.log(""+x_token_name+" :"+ ethers.utils.formatEther(xBalalanceBefore));
      
    // //   // Send the transaction
    const txResponse = await signer.sendTransaction({
        from: quote_data.from,
        to: quote_data.to,
        data: quote_data.data,
        value: ethers.BigNumber.from(quote_data.value || 0),
        // gasPrice: ethers.BigNumber.from(quote_data.gasPrice),
        // gasLimit: ethers.BigNumber.from(quote_data.gas),
      });
      // Wait for transaction to confirm
      const txReceipt = await txResponse.wait();

      console.log("Swaping.....")
      
      const etherBalanceAfter = await signer.getBalance();
      const xBalalanceAfter = await  token_contract.balanceOf(takerAddress);
       
      console.log("Eth :"+ ethers.utils.formatEther(etherBalanceAfter));
      console.log(""+x_token_name+" :"+ ethers.utils.formatEther(xBalalanceAfter));


  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  