import * as ethUtil from 'ethereumjs-util';
import config from '../configs/config';

export const LOGIN_MESSAGE = 'Login Quant Fund';

export const verifyWalletAddress = async (publicAddress: string, signature: string, message: string = LOGIN_MESSAGE): Promise<boolean> => {
  try {
    const msgBuffer = Buffer.from(message, 'utf8');
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    const signatureParams = ethUtil.fromRpcSig(signature);
    const publicKey = ethUtil.ecrecover(
      msgHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s
    );
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const address = ethUtil.bufferToHex(addressBuffer);
    return address.toLowerCase() === publicAddress.toLowerCase();
  } catch (error) {
    return false;
  }
};

export const isAddressBlocked = (address: string): boolean => {
  return config.blockedAddresses.includes(address.toLowerCase());
};
