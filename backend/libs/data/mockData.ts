import { UserData, WalletData, StakingData, TransactionData, WithdrawRequestData, StakingEarningData, NotificationData, TicketData, TicketMessageData, ReferralTransactionData, SessionData, DatabaseResult, StakingWithReward , ReferralUserData, TotalInvestedData, TotalBalanceData } from '../types';

export interface User {
  id: number;
  address: string;
  referral_code: string;
  referral_id: number | null;
  token_balance: number;
  MBUSD_balance: number;
  is_admin: number;
  datetime: Date;
}

interface Wallet {
  id: number;
  user_id: number;
  address: string;
  chain: string;
  is_primary: number;
  created_at: Date;
}

interface StakingPlan {
  id: number;
  price: number;
  duration: number;
  token: string;
  staking_percentage: number;
  created_at: Date;
}

interface Staking {
  id: number;
  user_id: number;
  token_amount: number;
  busd_amount: number;
  staking_period_id: number;
  staking_duration: number;
  staking_percentage: number;
  reward_token: number;
  hash: string;
  quantity: number;
  remaining_quantity: number;
  is_claim: number;
  status: number;
  created_date: Date;
  plan_sell_date: Date | null;
}

interface StakingEarning {
  id: number;
  staking_id: number;
  user_id: number;
  staking_period_id: number;
  reward_token: number;
  is_claim: number;
  status: number;
  datetime: Date;
}

interface Transaction {
  id: number;
  user_id: number;
  address: string;
  staking_id: number | null;
  from_address: string;
  to_address: string;
  hash: string;
  busd_amount: number;
  token: number;
  transaction_type_id: number;
  status: number;
  isblockchainConfirm: number;
  referred_by: number | null;
  referral_level: number | null;
  referral_trx_id: number | null;
  referral_percent: number | null;
  created_at: Date;
}

interface WithdrawRequest {
  id: number;
  user_id: number;
  withdrawal_address: string;
  token: number;
  busd_amount: number;
  fee: number;
  hash: string | null;
  status: number;
  created_at: Date;
}

interface WithdrawRequestWithAddress extends WithdrawRequest {}

class MockDataService {
  private users: Map<number, User>;
  private wallets: Map<number, Wallet>;
  private stakingPlans: StakingPlan[];
  private staking: Map<number, Staking>;
  private stakingEarnings: Map<number, StakingEarning>;
  private transactions: Map<number, Transaction>;
  private withdrawRequests: Map<number, WithdrawRequest>;
  private referralTransactions: Map<number, ReferralTransactionData>;
  private notifications: Map<number, NotificationData>;
  private tickets: Map<number, TicketData>;
  private ticketMessages: Map<number, TicketMessageData>;
  private sessionsMap: Map<string, SessionData>;
  private counters: {
    users: number;
    wallets: number;
    staking: number;
    stakingEarnings: number;
    transactions: number;
    withdrawRequests: number;
    referralTransactions: number;
    notifications: number;
    tickets: number;
    ticketMessages: number;
  } = {
    users: 1,
    wallets: 1,
    staking: 1,
    stakingEarnings: 1,
    transactions: 1,
    withdrawRequests: 1,
    referralTransactions: 1,
    notifications: 1,
    tickets: 1,
    ticketMessages: 1,
  };

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.stakingPlans = [];
    this.staking = new Map();
    this.stakingEarnings = new Map();
    this.transactions = new Map();
    this.withdrawRequests = new Map();
    this.referralTransactions = new Map();
    this.notifications = new Map();
    this.tickets = new Map();
    this.ticketMessages = new Map();
    this.sessionsMap = new Map();

    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    this.stakingPlans = [
      { id: 1, price: 100, duration: 30, token: '100', staking_percentage: 5, created_at: new Date() },
      { id: 2, price: 500, duration: 60, token: '550', staking_percentage: 10, created_at: new Date() },
      { id: 3, price: 1000, duration: 90, token: '1200', staking_percentage: 15, created_at: new Date() },
    ];
  }

  getUserById(id: number): User[] {
    const user = this.users.get(id);
    return user ? [user] : [];
  }

  getUserByAddress(address: string): User[] {
    return Array.from(this.users.values()).filter(u => u.address.toLowerCase() === address.toLowerCase());
  }

  getUserByReferralCode(referralCode: string): User[] {
    return Array.from(this.users.values()).filter(u => u.referral_code === referralCode);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  createUser(data: UserData): DatabaseResult {
    const id = this.counters.users++;
    const user: User = {
      id,
      address: data.address || '',
      referral_code: data.referral_code || 'REF' + id,
      referral_id: data.referral_id || null,
      token_balance: 0,
      MBUSD_balance: 0,
      is_admin: 0,
      datetime: new Date(),
    };
    this.users.set(id, user);
    return { insertId: id };
  }

  updateUserBalance(userId: number, field: 'token_balance' | 'MBUSD_balance', amount: number): DatabaseResult {
    const user = this.users.get(userId);
    if (user) {
      user[field] = (user[field] || 0) + amount;
      if (user[field] < 0) user[field] = 0;
    }
    return { affectedRows: 1 };
  }

  getWalletsByUserId(userId: number): Wallet[] {
    return Array.from(this.wallets.values()).filter(w => w.user_id === userId);
  }

  createWallet(data: Partial<WalletData>): DatabaseResult {
    const id = this.counters.wallets++;
    const isPrimary = data.is_primary !== undefined 
      ? (typeof data.is_primary === 'boolean' ? (data.is_primary ? 1 : 0) : data.is_primary)
      : 1;
    const wallet: Wallet = {
      id,
      user_id: data.user_id || 0,
      address: data.address || '',
      chain: data.chain || 'BSC',
      is_primary: isPrimary,
      created_at: new Date(),
    };
    this.wallets.set(id, wallet);
    return { insertId: id };
  }

  deleteWallet(id: number, userId: number): DatabaseResult {
    const wallet = this.wallets.get(id);
    if (wallet && wallet.user_id === userId) {
      this.wallets.delete(id);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  getStakingPlans(): StakingPlan[] {
    return this.stakingPlans;
  }

  getStakingPlanById(id: number): StakingPlan | null {
    return this.stakingPlans.find(p => p.id === id) || null;
  }

  getStakingByUserId(userId: number): StakingWithReward[] {
    return Array.from(this.staking.values())
      .filter(s => s.user_id === userId)
      .map(s => ({
        ...s,
        reward_token: s.reward_token,
        remaining_quantity: s.remaining_quantity,
      }));
  }

  getStakingById(stakingId: number, periodId: number, userId: number): Staking[] {
    return Array.from(this.staking.values()).filter(
      s => s.id === stakingId && s.staking_period_id === periodId && s.user_id === userId
    );
  }

  getAllStaking(): Staking[] {
    return Array.from(this.staking.values());
  }

  createStaking(data: StakingData): DatabaseResult {
    const id = this.counters.staking++;
    const staking: Staking = {
      id,
      user_id: data.user_id,
      token_amount: data.token_amount,
      busd_amount: data.busd_amount,
      staking_period_id: data.staking_period_id,
      staking_duration: data.staking_duration,
      staking_percentage: data.staking_percentage,
      reward_token: data.reward_token,
      hash: data.hash || '',
      quantity: data.quantity,
      remaining_quantity: data.remaining_quantity,
      is_claim: data.is_claim || 1,
      status: data.status || 1,
      created_date: new Date(),
      plan_sell_date: null,
    };
    this.staking.set(id, staking);
    return { insertId: id };
  }

  updateStakingStatus(stakingId: number, userId: number, data: Partial<Staking>): DatabaseResult {
    const staking = this.staking.get(stakingId);
    if (staking && staking.user_id === userId) {
      Object.assign(staking, data);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  getAllStakingEarnings(): StakingEarning[] {
    return Array.from(this.stakingEarnings.values());
  }

  getStakingEarningsByStakingId(stakingId: number): StakingEarning[] {
    return Array.from(this.stakingEarnings.values()).filter(se => se.staking_id === stakingId);
  }

  createStakingEarning(data: StakingEarningData): DatabaseResult {
    const id = this.counters.stakingEarnings++;
    const earning: StakingEarning = {
      id,
      staking_id: data.staking_id,
      user_id: data.user_id,
      staking_period_id: data.staking_period_id,
      reward_token: data.reward_token,
      is_claim: data.is_claim || 0,
      status: data.status || 1,
      datetime: new Date(),
    };
    this.stakingEarnings.set(id, earning);
    return { insertId: id };
  }

  getTransactionsByUserId(userId: number, typeId?: number): Transaction[] {
    let transactions = Array.from(this.transactions.values()).filter(t => t.user_id === userId);
    if (typeId !== undefined) {
      transactions = transactions.filter(t => t.transaction_type_id === typeId);
    }
    return transactions;
  }

  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values());
  }

  getTransactionByHash(hash: string): Transaction[] {
    return Array.from(this.transactions.values()).filter(t => t.hash === hash);
  }

  getPendingDeposits(): Transaction[] {
    return Array.from(this.transactions.values()).filter(
      t => t.transaction_type_id === 1 && t.isblockchainConfirm === 0
    );
  }

  createTransaction(data: TransactionData): DatabaseResult {
    const id = this.counters.transactions++;
    const transaction: Transaction = {
      id,
      user_id: data.user_id,
      address: data.address || '',
      staking_id: data.staking_id || null,
      from_address: data.from_address || '',
      to_address: data.to_address || '',
      hash: data.hash || '',
      busd_amount: data.busd_amount || 0,
      token: typeof data.token === 'number' ? data.token : 0,
      transaction_type_id: data.transaction_type_id,
      status: data.status || 1,
      isblockchainConfirm: data.isblockchainConfirm || 0,
      referred_by: data.referred_by || null,
      referral_level: data.referral_level || null,
      referral_trx_id: data.referral_trx_id || null,
      referral_percent: data.referral_percent || null,
      created_at: new Date(),
    };
    this.transactions.set(id, transaction);
    return { insertId: id };
  }

  updateTransaction(id: number, data: Partial<Transaction>): DatabaseResult {
    const transaction = this.transactions.get(id);
    if (transaction) {
      Object.assign(transaction, data);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  getAllWithdrawRequests(): WithdrawRequestWithAddress[] {
    return Array.from(this.withdrawRequests.values()).map(wr => {
      const user = this.users.get(wr.user_id);
      return {
        ...wr,
        address: user ? user.address : null,
      } as WithdrawRequestWithAddress;
    });
  }

  getWithdrawRequestsByUserId(userId: number): WithdrawRequestWithAddress[] {
    return Array.from(this.withdrawRequests.values())
      .filter(wr => wr.user_id === userId)
      .map(wr => {
        const user = this.users.get(wr.user_id);
        return {
          ...wr,
          address: user ? user.address : null,
        } as WithdrawRequestWithAddress;
      });
  }

  createWithdrawRequest(data: WithdrawRequestData): DatabaseResult {
    const id = this.counters.withdrawRequests++;
    const request: WithdrawRequest = {
      id,
      user_id: data.user_id,
      withdrawal_address: data.withdrawal_address,
      token: data.token,
      busd_amount: data.busd_amount,
      fee: data.fee || 0,
      hash: data.hash || null,
      status: data.status || 0,
      created_at: new Date(),
    };
    this.withdrawRequests.set(id, request);
    return { insertId: id };
  }

  updateWithdrawRequest(id: number, data: Partial<WithdrawRequest>): DatabaseResult {
    const request = this.withdrawRequests.get(id);
    if (request) {
      Object.assign(request, data);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  createReferralTransaction(data: ReferralTransactionData): DatabaseResult {
    const id = this.counters.referralTransactions++;
    this.referralTransactions.set(id, data);
    return { insertId: id };
  }

  getNotificationsByUserId(userId: number): NotificationData[] {
    return Array.from(this.notifications.values()).filter(n => n.user_id === userId);
  }

  createNotification(data: NotificationData): DatabaseResult {
    const id = this.counters.notifications++;
    this.notifications.set(id, { ...data, id, created_at: new Date() });
    return { insertId: id };
  }

  getTicketsByUserId(userId: number): TicketData[] {
    return Array.from(this.tickets.values()).filter(t => t.user_id === userId);
  }

  createTicket(data: TicketData): DatabaseResult {
    const id = this.counters.tickets++;
    this.tickets.set(id, { ...data, id, created_at: new Date(), status: data.status || 'open' });
    return { insertId: id };
  }

  getTicketMessagesByTicketId(ticketId: number): TicketMessageData[] {
    return Array.from(this.ticketMessages.values()).filter(tm => tm.ticket_id === ticketId);
  }

  createTicketMessage(data: TicketMessageData): DatabaseResult {
    const id = this.counters.ticketMessages++;
    this.ticketMessages.set(id, { ...data, id, created_at: new Date() });
    return { insertId: id };
  }

  get sessions(): Map<string, SessionData> {
    return this.sessionsMap;
  }

  getReferralUsers(userId: number): ReferralUserData[] {
    const users = Array.from(this.users.values()).filter(u => u.referral_id === userId);

    return users.map(u => {
      const userTransactions = Array.from(this.transactions.values()).filter(t => t.user_id === u.id);
      const totalToken = userTransactions
        .filter(t => t.transaction_type_id === 4)
        .reduce((sum, t) => sum + (t.token || 0), 0);

      return {
        referral_user: u.id,
        address: u.address,
        datetime: u.datetime,
        token: totalToken,
      };
    });
  }

  getTotalInvested(): TotalInvestedData[] {
    const depositTransactions = Array.from(this.transactions.values())
      .filter(t => t.transaction_type_id === 1);

    const invested = depositTransactions.reduce((sum, t) => sum + (t.busd_amount || 0), 0);
    const investors = new Set(depositTransactions.map(t => t.user_id)).size;
    const reward = Array.from(this.transactions.values())
      .filter(t => t.transaction_type_id === 4)
      .reduce((sum, t) => sum + (t.token || 0), 0);

    return [{ invested, investors, reward }];
  }

  getTotalBalance(userId: number): TotalBalanceData[] {
    const user = this.users.get(userId);
    if (!user) return [];
    return [{
      total_balance: user.token_balance,
      MBUSD_total_balance: user.MBUSD_balance,
    }];
  }
}

export default new MockDataService();
