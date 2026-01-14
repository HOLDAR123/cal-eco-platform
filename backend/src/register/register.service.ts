import UserModel from '../user/models/user.model';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import referralCodeGenerator from 'referral-code-generator';
import config from '../../libs/configs/config';
import { verifyWalletAddress, isAddressBlocked } from '../../libs/utils/wallet';
import logger from '../../libs/utils/logger';
import {
  ErrorWithCode,
  UserData,
  TransactionData,
  StakingData,
  WithdrawRequestData,
  WithdrawRequestWithAddress
} from '../../libs/types';

interface Web3Constructor {
  new (provider: unknown): {
    eth: {
      getTransactionReceipt: (hash: string) => Promise<{
        from: string;
        to: string;
        logs: Array<{
          topics: string[];
          data: string;
        }>;
      }>;
      abi: {
        decodeParameter: (type: string, data: string) => Promise<string>;
      };
    };
  };
  providers: {
    HttpProvider: new (url: string) => unknown;
  };
}

let Web3: Web3Constructor | null;
try {
  Web3 = require('web3');
} catch (_e) {
  Web3 = null;
}

export class RegisterService {
  async userRegister(address: string, signature: string, referralAddress?: string): Promise<{
    success: boolean;
    msg?: string;
    data?: {
      id: number;
      address: string;
      referral_code: string;
      authToken: string;
      is_admin?: number;
    };
  }> {
    if (!address) {
      return { success: false, msg: "Wallet address required!!" };
    }

    const isValid = await verifyWalletAddress(address, signature);
    if (!isValid) {
      return { success: false, msg: "Invalid signature" };
    }

    if (isAddressBlocked(address)) {
      return { success: false, msg: "This address is blocked by admin" };
    }

    const getUsersaddress = await UserModel.getUsersDetailsAddress({ address });

    if (getUsersaddress.length > 0) {
      const jwtToken = jwt.sign({
        id: getUsersaddress[0].id,
        address: getUsersaddress[0].address
      }, config.JWT_SECRET_KEY, {
        expiresIn: config.SESSION_EXPIRES_IN as StringValue
      });

      return {
        success: true,
        msg: "Login successfully!!",
        data: {
          id: getUsersaddress[0].id,
          address: getUsersaddress[0].address,
          referral_code: getUsersaddress[0].referral_code,
          authToken: jwtToken,
          is_admin: getUsersaddress[0].is_admin,
        }
      };
    }

    let referral_id: number | null = null;
    if (referralAddress) {
      const getRefUsersDetails = await UserModel.getUserDetailsByAddress(referralAddress);
      if (getRefUsersDetails.length === 0) {
        return { success: false, msg: "Refferal code not valid please enter valid code!!" };
      }
      referral_id = getRefUsersDetails[0].id;
    }

    const referral_code = referralCodeGenerator.alphaNumeric('uppercase', 3, 2);
    const userData: UserData = {
      address: address,
      referral_id: referral_id,
      referral_code: referral_code
    };

    const saveUserDetails = await UserModel.saveUserAddressDetails(userData);
    if (saveUserDetails && saveUserDetails.insertId) {
      const jwtToken = jwt.sign({
        id: saveUserDetails.insertId,
        address: address
      }, config.JWT_SECRET_KEY, {
        expiresIn: config.SESSION_EXPIRES_IN as StringValue
      });

      return {
        success: true,
        msg: "User register successfully!!",
        data: {
          id: saveUserDetails.insertId,
          address: address,
          referral_code: referral_code,
          authToken: jwtToken
        }
      };
    }

    return { success: false, msg: "Something went wrong please try again." };
  }

  async getTransactionHistory(userId: number): Promise<{
    success: boolean;
    msg?: string;
    data?: unknown[];
  }> {
    try {
      const getTransactionDetail = await UserModel.getTransactionHistory({ user_id: userId });
      if (getTransactionDetail.length > 0) {
        return {
          success: true,
          msg: "Get Transaction History !!",
          data: getTransactionDetail
        };
      }
      return { success: false, msg: "No Data Found !!" };
    } catch (err) {
      return { success: false, msg: "User not registered due to internal error", data: [err] };
    }
  }

  async getWithdrawHistory(userId: number): Promise<{
    success: boolean;
    msg?: string;
    data?: unknown[];
  }> {
    try {
      const getTransactionDetail = await UserModel.getWithdrawHistory({ user_id: userId });
      if (getTransactionDetail.length > 0) {
        return {
          success: true,
          msg: "Get Withdraw History !!",
          data: getTransactionDetail
        };
      }
      return { success: false, msg: "No Data Found !!" };
    } catch (err) {
      return { success: false, msg: "User not registered due to internal error", data: [err] };
    }
  }

  async getReferralUsersList(userId: number): Promise<{
    success: boolean;
    msg?: string;
    data?: unknown[];
  }> {
    try {
      const getUsersaddress = await UserModel.getReferralUsersList({ user_id: userId });
      if (getUsersaddress.length > 0) {
        return {
          success: true,
          msg: "Referral List!!",
          data: getUsersaddress
        };
      }
      return { success: false, msg: "Something went wrong please try again." };
    } catch (err) {
      return { success: false, msg: "User not registered due to internal error", data: [err] };
    }
  }

  async getPlanDetails(): Promise<{
    success: boolean;
    msg?: string;
    data?: unknown[];
  }> {
    try {
      const getplandetail = await UserModel.getPlanDetails();
      if (getplandetail.length > 0) {
        return {
          success: true,
          msg: "Plan List!!",
          data: getplandetail
        };
      }
      return { success: false, msg: "Something went wrong please try again." };
    } catch (err) {
      return { success: false, msg: "User not registered due to internal error", data: [err] };
    }
  }

  async depositBUSD(userId: number, address: string, busdAmount: number, hash: string): Promise<{
    success: boolean;
    msg?: string;
  }> {
    try {
      const checkHash = await UserModel.checkHash({ hash });
      if (checkHash.length > 0) {
        return { success: false, msg: "Forbidden!!." };
      }

      const userData: TransactionData = {
        user_id: userId,
        address: address,
        from_address: address,
        to_address: config.clientDepositAddress,
        busd_amount: busdAmount,
        token: parseFloat(busdAmount.toString()) * 10,
        hash: hash,
        transaction_type_id: 1,
        status: 1
      };

      const busdDeposit = await UserModel.saveDepositBUSDDetails(userData);
      if (busdDeposit) {
        return {
          success: true,
          msg: "Congratulations your deposit request is successful, once it will confirm by blockchain then the amount will reflect your wallet!!",
        };
      }
      return { success: false, msg: "Something went wrong please try again." };
    } catch (err) {
      return { success: false, msg: "User not registered due to internal error" };
    }
  }

  async addStaking(userId: number, address: string, stakingPeriodId: number, quantity: number, busdAmount: number, hash?: string): Promise<{
    success: boolean;
    msg?: string;
  }> {
    try {
      const checkPeriodId = await UserModel.checkPeriodId({ staking_period_id: stakingPeriodId });
      if (checkPeriodId.length === 0) {
        return { success: false, msg: "Invalid staking period!" };
      }

      const deductAmount = parseFloat(checkPeriodId[0].price.toString()) * quantity;
      const checkBalance = await UserModel.checkBalanceFromStaking({ user_id: userId });

      if (checkBalance.length === 0 || parseFloat(deductAmount.toString()) > parseFloat(checkBalance[0].MBUSD_balance.toString())) {
        return { success: false, msg: "You don't have sufficient balance for buy Plan!" };
      }

      const stakingData: StakingData & { address?: string; from_address?: string; to_address?: string } = {
        user_id: userId,
        token_amount: parseFloat(checkPeriodId[0].price.toString()),
        busd_amount: busdAmount,
        staking_period_id: stakingPeriodId,
        quantity: quantity,
        reward_token: parseFloat(checkPeriodId[0].token),
        staking_duration: checkPeriodId[0].duration,
        staking_percentage: checkPeriodId[0].staking_percentage,
        remaining_quantity: quantity,
        hash: hash || '',
        address: address,
        from_address: address,
        to_address: config.clientDepositAddress,
      };

      const stakingDetail = await UserModel.addStaking(stakingData);
      if (stakingDetail) {
        return { success: true, msg: "Plan  Successfully Buy!!" };
      }
      return { success: false, msg: "Something went wrong please try again." };
    } catch (err) {
      logger.error('Add staking error:', err);
      return { success: false, msg: "User not registered due to internal error" };
    }
  }

  async usersStakingIncome(): Promise<void> {
    try {
      await UserModel.usersStakingIncome();
      logger.info('Staking income processed successfully');
    } catch (error) {
      logger.error('Users staking income error:', error);
      throw error;
    }
  }

  async getStakingHistory(userId: number): Promise<{
    success: boolean;
    msg?: string;
    data?: unknown[];
  }> {
    try {
      const getStakingDetail = await UserModel.getStakingHistory({ user_id: userId });
      if (getStakingDetail.length > 0) {
        return {
          success: true,
          msg: "Get Staking History !!",
          data: getStakingDetail
        };
      }
      return { success: false, msg: "No Data Found !!" };
    } catch (err) {
      return { success: false, msg: "User not registered due to internal error" };
    }
  }

  async singalClaimReward(userId: number, stakingId: number, stakingPeriodId: number): Promise<{
    success: boolean;
    msg?: string;
  }> {
    try {
      const rewardCheck = await UserModel.rewardClaimCheck({ user_id: userId, staking_id: stakingId, staking_period_id: stakingPeriodId });
      if (rewardCheck.length === 0) {
        return { success: false, msg: "Something went wrong, Please try again later." };
      }

      if (rewardCheck[0].isClaimAvailable === 0) {
        return { success: false, msg: "You need to wait sometime for claiming the reward!." };
      }

      const stakingQuantity = await UserModel.stakingQuantity({ user_id: userId, staking_id: stakingId, staking_period_id: stakingPeriodId });
      if (stakingQuantity.length === 0) {
        return { success: false, msg: "Something went wrong, Please try again later." };
      }

      const myToken = parseFloat(stakingQuantity[0].reward_token.toString()) * parseFloat(stakingQuantity[0].remaining_quantity.toString());
      if (myToken === 0) {
        return { success: false, msg: "Reward token should be greater than zero!" };
      }

      const claimData = {
        user_id: userId,
        staking_id: stakingId,
        staking_period_id: stakingPeriodId,
        token: myToken
      };

      const stakingDetail = await UserModel.singalRewardClaim(claimData);
      if (stakingDetail) {
        return { success: true, msg: "Claim Reward Successfully!!" };
      }
      return { success: false, msg: "Something went wrong please try again." };
    } catch (err) {
      return { success: false, msg: "Something went wrong please try again." };
    }
  }

  async sellPlan(userId: number, stakingId: number, stakingPeriodId: number): Promise<{
    success: boolean;
    msg?: string;
  }> {
    try {
      const checkSellPlan = await UserModel.checkSellPlan({ user_id: userId, staking_id: stakingId, staking_period_id: stakingPeriodId });
      if (checkSellPlan.length === 0) {
        return { success: false, msg: "Invalid staking details!" };
      }

      const rewardToken = parseFloat(checkSellPlan[0].reward_token.toString()) * parseFloat(checkSellPlan[0].remaining_quantity.toString());
      const sellPlanData = {
        user_id: userId,
        staking_id: stakingId,
        reward_token: rewardToken
      };

      const stakingDetail = await UserModel.sellPlan(sellPlanData);
      if (stakingDetail) {
        return { success: true, msg: "Sell Plan Successfully!!" };
      }
      return { success: false, msg: "Something went wrong please try again." };
    } catch (err) {
      logger.error('Sell plan error:', err);
      return { success: false, msg: "User not registered due to internal error" };
    }
  }

  async getTotalBalance(userId: number): Promise<{
    success: boolean;
    msg?: string;
    data?: number;
    data1?: number;
  }> {
    try {
      const totalBalanceDetail = await UserModel.getTotalBalance({ user_id: userId });
      if (totalBalanceDetail.length > 0) {
        return {
          success: true,
          msg: "Get Transaction History !!",
          data: totalBalanceDetail[0].total_balance,
          data1: totalBalanceDetail[0].MBUSD_total_balance
        };
      }
      return { success: false, msg: "No Data Found !!" };
    } catch (err) {
      return { success: false, msg: "User not registered due to internal error" };
    }
  }

  async getTotalInvested(): Promise<{
    success: boolean;
    msg?: string;
    data?: unknown;
  }> {
    try {
      const totalinvastedDetail = await UserModel.getTotalInvested();
      if (totalinvastedDetail.length > 0) {
        return {
          success: true,
          msg: "Get Transaction History !!",
          data: totalinvastedDetail[0]
        };
      }
      return { success: false, msg: "No Data Found !!" };
    } catch (err) {
      return { success: false, msg: "User not registered due to internal error" };
    }
  }

  async withdrawCrypto(userId: number, address: string, token: number): Promise<{
    success: boolean;
    msg?: string;
  }> {
    try {
      const totalBalanceDetail = await UserModel.getTotalBalance({ user_id: userId });
      if (parseFloat(token.toString()) < 0) {
        return { success: false, msg: "Amount not validate!!" };
      }

      if (totalBalanceDetail.length === 0 || parseFloat(token.toString()) > parseFloat(totalBalanceDetail[0].total_balance.toString())) {
        return { success: false, msg: "You don't have sufficient balance." };
      }

      const busd_amount = (parseFloat(token.toString()) * 0.000166) - 0.3;
      if (parseFloat(busd_amount.toString()) < 1) {
        return { success: false, msg: "Mininmum withdraw amount : 10,000 Token (1 BUSD)" };
      }

      interface TrxHashResponse {
        hash?: string;
      }

      const response1: { json: () => Promise<TrxHashResponse> } = { json: async () => ({ hash: 'mock_transaction_hash' }) };
      const trx_hash = await response1.json();

      if (!trx_hash.hash) {
        return { success: false, msg: "Something went wrong please try again." };
      }

      const withdrawData: WithdrawRequestData = {
        user_id: userId,
        withdrawal_address: address,
        token: token,
        hash: trx_hash.hash,
        busd_amount: busd_amount,
        fee: 0.3,
        status: 1,
      };

      const busdDeposit = await UserModel.withdrawCrypto(withdrawData);
      if (busdDeposit && busdDeposit.insertId) {
        await UserModel.balanceUpdate({ id: busdDeposit.insertId, user_id: userId, busd_amount: busd_amount, token: token });
        return { success: true, msg: "Congratulations Your Withdraw Successfully!!" };
      }
      return { success: false, msg: "Something went wrong please try again." };
    } catch (error) {
      logger.error('Withdraw crypto error:', error);
      return { success: false, msg: "Something went wrong please try again." };
    }
  }

  async userBUSDDepositCheck(): Promise<void> {
    try {
      const data = await UserModel.userBUSDDepositCheck();
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          try {
            if (!Web3) {
              logger.warn('web3 not installed; skipping BUSD deposit check');
              break;
            }
            const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org'));
            const newhash = await web3.eth.getTransactionReceipt(data[i].hash || '');
            const from = newhash.from;
            const to = newhash.to;
            const BUSDContract = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';

            const clientAddress = await web3.eth.abi.decodeParameter('address', newhash.logs[0].topics[2]);
            const busdTokenString = await web3.eth.abi.decodeParameter('uint', newhash.logs[0].data);
            const busdToken = parseFloat(busdTokenString) / Math.pow(10, 18);

            if (from.toUpperCase() === (data[i].from_address || '').toUpperCase() &&
                to.toUpperCase() === BUSDContract.toUpperCase() &&
                clientAddress.toUpperCase() === (data[i].to_address || '').toUpperCase()) {
              const newData = {
                busd_amount: busdToken,
                token: busdToken * 10,
                id: data[i].id || 0,
                user_id: data[i].user_id || 0,
                address: data[i].address || ''
              };
              await UserModel.userBalanceUpdate(newData);

              const getUsersaddress = await UserModel.getUsersAddress(newData);
              if (getUsersaddress[0].referral_id && getUsersaddress[0].referral_id > 0) {
                const getReferralUser = await UserModel.getReferralUser(getUsersaddress[0].referral_id);
                const refTransaction: TransactionData = {
                  user_id: getReferralUser[0].id,
                  address: getReferralUser[0].address,
                  referred_by: getUsersaddress[0].id,
                  busd_amount: busdToken,
                  token: parseFloat((busdToken * 10).toString()),
                  transaction_type_id: 4,
                  status: 1
                };

                await UserModel.saveReferralIncome(refTransaction);
                const Reftoken = parseFloat(((busdToken * 10) * 5 / 100).toString());
                const newToken = {
                  token: Reftoken,
                  user_id: getReferralUser[0].id
                };

                await UserModel.addBalance(newToken);
              }
            } else {
              logger.debug(`Rejecting deposit for transaction ID: ${data[i].id}`);
              await UserModel.userBalanceReject({ id: data[i].id || 0 });
            }
          } catch (error) {
            logger.error(`Error processing deposit for transaction ID ${data[i].id}:`, error);
            await UserModel.userBalanceReject({ id: data[i].id || 0 });
          }
        }
      }
      logger.debug('BUSD deposit check completed');
    } catch (error: unknown) {
      const err = error as ErrorWithCode;
      if (err.code === 'ECONNREFUSED') {
        logger.warn('Skipping userBUSDDepositCheck: database connection refused');
        return;
      }
      logger.error('Error running userBUSDDepositCheck cron:', error);
    }
  }
}
