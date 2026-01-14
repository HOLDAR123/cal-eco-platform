import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import config from '../../libs/configs/config';
import UserModel from '../user/models/user.model';
import { verifyWalletAddress, isAddressBlocked } from '../../libs/utils/wallet';
import logger from '../../libs/utils/logger';

export class AuthService {
  async loginWithSignature(address: string, signature: string, referralAddress?: string): Promise<{
    success: boolean;
    message?: string;
    data?: {
      id: number;
      address: string;
      referral_code: string;
      authToken: string;
      is_admin: number;
    };
  }> {
    if (!address || !signature) {
      return { success: false, message: 'Address and signature are required' };
    }

    if (config.blockedAddresses.includes(address.toLowerCase())) {
      return { success: false, message: 'This address is blocked' };
    }

    const isValid = await verifyWalletAddress(address, signature);
    if (!isValid) {
      return { success: false, message: 'Wallet signature verification failed' };
    }

    let users = await UserModel.getUsersDetailsAddress({ address });

    if (users.length === 0) {
      let referralId: number | null = null;
      if (referralAddress) {
        const refUsers = await UserModel.getUserDetailsByAddress(referralAddress);
        if (refUsers.length === 0) {
          return { success: false, message: 'Invalid referral code' };
        }
        referralId = refUsers[0].id;
      }

      const referralCode = 'REF' + Math.random().toString(36).substr(2, 5).toUpperCase();
      const saved = await UserModel.saveUserAddressDetails({
        address,
        referral_id: referralId,
        referral_code: referralCode
      });
      users = [{ id: saved.insertId || 0, address, referral_code: referralCode, is_admin: 0 } as typeof users[0]];
    }

    const user = users[0];
    const token = jwt.sign(
      { id: user.id, address: user.address },
      config.JWT_SECRET_KEY,
      { expiresIn: config.SESSION_EXPIRES_IN as StringValue }
    );

    return {
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        address: user.address,
        referral_code: user.referral_code,
        authToken: token,
        is_admin: user.is_admin,
      }
    };
  }

  async getMe(userId: number, address: string): Promise<{
    success: boolean;
    message?: string;
    data?: {
      id: number;
      address: string;
      token_balance: number;
      MBUSD_balance: number;
      referral_code: string;
    };
  }> {
    try {
      const users = await UserModel.getUsersAddress({ address });
      if (users.length === 0) {
        return { success: false, message: 'User not found' };
      }

      const user = users[0];
      return {
        success: true,
        data: {
          id: user.id,
          address: user.address,
          token_balance: user.token_balance,
          MBUSD_balance: user.MBUSD_balance,
          referral_code: user.referral_code,
        }
      };
    } catch (error) {
      logger.error('Get user error:', error);
      return { success: false, message: 'Internal server error' };
    }
  }
}
