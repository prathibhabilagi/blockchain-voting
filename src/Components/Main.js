import {
  useSDK,
} from '@metamask/sdk-react-ui';
import Wallet from "./Wallet";

function Main() {
  const { ready } = useSDK();

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Wallet/>
      </div>
        <p className='header'>
          Blockchain Voting System 
        </p>
    </div>
  );
}

export default Main;
