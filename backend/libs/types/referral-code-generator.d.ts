declare module 'referral-code-generator' {
  interface AlphaNumericOptions {
    uppercase?: boolean;
    length?: number;
    prefix?: string;
    suffix?: string;
  }

  interface ReferralCodeGenerator {
    alphaNumeric(type: 'uppercase' | 'lowercase' | 'mixed', length: number, count?: number): string;
    alphaNumeric(options: AlphaNumericOptions): string;
  }

  const referralCodeGenerator: ReferralCodeGenerator;
  export default referralCodeGenerator;
}
