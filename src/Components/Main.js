import { useSDK, useAccount } from "@metamask/sdk-react-ui";
import Voting from "../artifacts/voting.json";
import Wallet from "./Wallet";
import web3 from "web3";
import React, { useEffect, useState } from "react";
import { calculateTimeRemaining, formatTime } from "../utils/timer";

function Main() {
  const { provider, ready, account, balance } = useSDK();
  const { isConnected } = useAccount();
  const [candidates, setCandidates] = useState();
  const [selectedCandidate, setSelectedCandidate] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [targetTimestamp, setTargetTimestamp] = useState();
  const [winner, setWinner] = useState({});
  const Web3 = new web3(provider);
  const accountBalance = balance ? Web3.utils.fromWei(balance, "ether") : 0;
  var contract = new Web3.eth.Contract(
    Voting,
    "0x1500113835e785d3965BC417d216a6436e13033F"
  );

  //get end time
  const getEndTime = async () => {
    const endTime = await contract.methods.endTime().call();
    const timestampWithoutNanoseconds = endTime.toString().replace(/n$/, "");
    const time = Number(timestampWithoutNanoseconds);
    setTargetTimestamp(time);
  };

  //get Winner
  const getWinner = async () => {
    const winner = await contract.methods.getWinner().call();
    setWinner(winner);
  };

  //Timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const remaining = calculateTimeRemaining(targetTimestamp);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(timerInterval);
        // Trigger your "It has ended" logic here
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [targetTimestamp]);

  //get all candidates
  const getCandidatesDetails = async () => {
    const totalcandidatesCount = await contract.methods
      .candidatesCount()
      .call();
    const results = [];

    for (let i = 1; i <= totalcandidatesCount; i++) {
      const result = await contract.methods.candidates(i).call();
      results.push(result);
    }
    setCandidates(results);
  };

  useEffect(() => {
    if (provider) {
      getCandidatesDetails();
      getEndTime();
    }
  }, [provider]);

  //handle candidate selection
  const handleCandidateChange = (e) => {
    const details = candidates.filter((item) => item[1] === e.target.innerText);
    setSelectedCandidate(details[0]);
  };

  //vote for candidate
  const handleVoting = async () => {
    // const gasPrice = await Web3.eth.getGasPrice();
    await contract.methods
      .vote(selectedCandidate.id)
      .send({
        from: account,
        gas: 200000,
      })
      .then(function (receipt) {
        console.log(receipt);
      });
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  //End Voting
  const handleEndVoting = async () => {
    await contract.methods
      .endVoting()
      .send({
        from: account,
        gas: 200000,
      })
      .then(function (receipt) {
        console.log(receipt);
      });
  };

  return (
    <div>
      <div>
        <Wallet />
      </div>
      <p className="header">Blockchain Voting System</p>
      {isConnected && (
        <div>
          <p className="vote-text">Account: {account}</p>
          <p className="vote-text">
            Balance: {Number(accountBalance).toFixed(4)} ETH
          </p>
        </div>
      )}

      <div className="vote">
        {isConnected && (
          <>
            {timeRemaining === 0 ? (
              <>
                <button className="vote-button" onClick={() => getWinner()}>
                  Get Winner
                </button>
                {winner[0] && <p className="vote-timer">{winner[0]}</p>}
              </>
            ) : (
              <div>
                <div>
                  <p className="vote-timer">
                    Time remaining: {formatTime(timeRemaining)}
                  </p>
                </div>
                {candidates && (
                  <div className="dropdown">
                    <div className="dropbtn">
                      <p className="drop">
                        <span>
                          {!Object.keys(selectedCandidate).length
                            ? "Select Candidate"
                            : selectedCandidate[1]}
                        </span>

                        <span>
                          <i className="arrow down"></i>
                        </span>
                      </p>
                    </div>

                    <div className="dropdown-content">
                      {candidates.map((item, index) => (
                        <button
                          key={index}
                          onClick={(e) => handleCandidateChange(e)}
                        >
                          {item[1]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="vote">
                  {selectedCandidate[1] && (
                    <p className="vote-timer">
                      Voting for {selectedCandidate[1]}
                    </p>
                  )}
                  <button className="vote-button" onClick={handleVoting}>
                    Vote
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Main;
