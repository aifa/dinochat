import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const FUN_WAITING_MESSAGES = [
  "on chain ai is slow lol",
  "join us to make this faster",
  "waiting for the ai to think",
  "cleaning up blockspace",
  "waking up the agi",
  "burning gpus",
  "ever tried putting an LLM on-chain?",
  "op or zk?",
  "don't worry about the vase",
  "calling up nvidia",
  "emitting tokens... no, not *those* tokens",
  "actually, schmidhuber invented it in 1991",
  "help I am trapped in a web3 factory",
  "tbh just ELIZA with extra steps",
];

interface ProgressBarProps {
  duration: number; // Total duration of progress in seconds
  message: string;
  avatar_url: string | undefined;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ duration, message, avatar_url }) => {
  const [progress, setProgress] = useState(1);
  const [randomMessage, setRandomMessage] = useState("");

  useEffect(() => {
    setRandomMessage(
      FUN_WAITING_MESSAGES[Math.floor(Math.random() * FUN_WAITING_MESSAGES.length)]
    );

    const intervalTime = (duration * 1000) / 100;
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + 1;
        if (nextProgress > 100) {
          //clearInterval(interval);
          //return 100;
          setRandomMessage(
            FUN_WAITING_MESSAGES[Math.floor(Math.random() * FUN_WAITING_MESSAGES.length)]
          );
          return 0;
        }
        return nextProgress;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <>
      <p className='mb-2'>
        <span className="">{message}&nbsp;</span>
        <span className="text-brand-neongreen">{randomMessage}</span>
      </p>
      <div className="w-full bg-white h-2.5 dark:bg-gray-700">
        {/*avatar_url !== undefined && avatar_url !== "" && (
          <Image
            src={avatar_url}
            alt="My Dino Assistant"
            className="h-60 w-200"
            width="300"
            height="400"
        />)*/}
        <div
          className="bg-[#00ff66] h-2.5"
          style={{ width: `${progress}%` }}
        ></div>
      </div >
    </>
  );
};

export default ProgressBar;