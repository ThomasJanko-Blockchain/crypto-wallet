import React, { createContext, useEffect, useState } from 'react';
import { ethers, parseEther } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider,
        signer,
        transactionContract
    });

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {

    const [connectedAccount, setConnectedAccount] = useState(null);
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}));
    }

    const checkIfWalletIsConnected = async () => {
        if(!ethereum) {return alert('Make sure you have metamask!');}

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if(accounts.length !== 0) {
            const account = accounts[0];
            setConnectedAccount(account);
            //getAlltransactions();
        } else {
            console.log('No authorized account found');
        }
        console.log(accounts);
    }

    const connectWallet = async () => {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log(accounts);
            setConnectedAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object found!');
        }
    }

    const sendTransaction = async () => {
        
        try{
            if(!ethereum) {return alert('Make sure you have metamask!');}
            const { addressTo, amount, keyword, message } = formData;
             const transactionContract = getEthereumContract();
             console.log(transactionContract);
             const parsedAmount = ethers.utils.parseEther(amount); //converts amount to wei

             await ethereum.request({ 
                method: 'eth_requestAccounts',
                params: [{
                   from: connectedAccount,
                   to: addressTo,
                   gas: '0x5208', //21000 GWEI
                   value: parsedAmount._hex, //0.00001
                }]
            });

           const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

           setIsLoading(true);
           console.log(`Loading - ${transactionHash.hash}`)
           await transactionHash.wait();
           setIsLoading(false);
           console.log(`Success - ${transactionHash.hash}`)

           const transactionCount = await transactionContract.getTransactionCount();
           setTransactionCount(transactionCount.toNumber());
        }
        catch (error) {
            console.log(error);
            throw new Error('No ethereum object found!');
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);
       


    return (
        <TransactionContext.Provider value={{
             connectWallet,
             connectedAccount,
             handleChange,
             formData,
             setFormData,
             sendTransaction
             
             }}>
            {children}
        </TransactionContext.Provider>
    )
}