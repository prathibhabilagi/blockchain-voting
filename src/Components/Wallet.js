import {
    MetaMaskButton,
    useAccount
  } from "@metamask/sdk-react-ui";
  
  function Wallet() {
    const { isConnected } = useAccount();
  
    return (
      <div>
        <header className="App-header">
          <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
        </header>
      </div>
    );
  }
  
  export default Wallet;
  