import { randomBytes } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateUserAccountToBetterAutb1760818827526 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userAccounts = await queryRunner.query(`
      SELECT 
        id,
        email_address,
        password,
        first_name,
        last_name,
        enabled,
        registration_date,
        last_logged_in,
        verification_token
      FROM user_account
    `);

    for (const account of userAccounts) {
      const userId = this.generateBetterAuthId();
      const accountId = this.generateBetterAuthId();

      // Determine email verification status
      const emailVerified = account.verification_token === null || account.enabled === true;
      const name = [account.first_name, account.last_name].filter(Boolean).join(' ') || 'Test User';

      try {
        await queryRunner.query(
          `
            INSERT INTO "user" (
                id,
                email,
                "emailVerified",
                name,
                image,
                "createdAt",
                "updatedAt"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            `,
          [
            userId,
            account.email_address,
            emailVerified,
            name,
            null, // image
            account.registration_date || new Date(),
            account.last_logged_in || new Date(),
          ],
        );

        await queryRunner.query(
          `
          INSERT INTO "account" (
            id,
            "userId",
            "accountId",
            "providerId",
            password,
            "accessToken",
            "refreshToken",
            "idToken",
            "accessTokenExpiresAt",
            "refreshTokenExpiresAt",
            "scope",
            "createdAt",
            "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `,
          [
            accountId,
            userId,
            account.email_address, // accountId = email for credential provider
            'credential', // providerId for email/password
            account.password, // Keep existing password hash
            null, // accessToken
            null, // refreshToken
            null, // idToken
            null, // accessTokenExpiresAt
            null, // refreshTokenExpiresAt
            null, // scope
            account.registration_date, // createdAt
            account.registration_date, // updatedAt
          ],
        );
      } catch (err) {}
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}

  private generateBetterAuthId(): string {
    return `${randomBytes(16).toString('hex')}`;
  }
}
