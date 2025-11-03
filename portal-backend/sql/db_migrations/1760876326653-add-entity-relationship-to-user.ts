import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEntityRelationshipToUser1760876326653 implements MigrationInterface {
  name = 'AddEntityRelationshipToUser1760876326653';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // add temporary uuid user column
    await queryRunner.query(`ALTER TABLE "activity" ADD COLUMN "newUserId" UUID`);
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN "newUserId" UUID`);
    await queryRunner.query(`ALTER TABLE "image_file" ADD COLUMN "newUserId" UUID`);
    await queryRunner.query(`ALTER TABLE "subscription" ADD COLUMN "newUserId" UUID`);
    await queryRunner.query(`ALTER TABLE "invoice" ADD COLUMN "newUserId" UUID`);

    // Map old integer user_id → new UUIDs
    // We’ll rely on email matching between user_account and user (since IDs changed)
    await queryRunner.query(`
      UPDATE "activity" a
      SET "newUserId" = u.id
      FROM "user" u
      JOIN "user_account" ua ON ua.email_address = u.email
      WHERE a.user_id = ua.id
    `);
    await queryRunner.query(`
      UPDATE "category" a
      SET "newUserId" = u.id
      FROM "user" u
      JOIN "user_account" ua ON ua.email_address = u.email
      WHERE a.user_id = ua.id
    `);
    await queryRunner.query(`
      UPDATE "image_file" a
      SET "newUserId" = u.id
      FROM "user" u
      JOIN "user_account" ua ON ua.email_address = u.email
      WHERE a.user_id = ua.id
    `);
    await queryRunner.query(`
      UPDATE "subscription" a
      SET "newUserId" = u.id
      FROM "user" u
      JOIN "user_account" ua ON ua.email_address = u.email
      WHERE a.user_id = ua.id
    `);
    await queryRunner.query(`
      UPDATE "invoice" inv
      SET "newUserId" = u.id
      FROM "user" u
      JOIN "user_account" ua ON ua.email_address = u.email
      WHERE inv."userId" = ua.id
    `);

    await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "category_user_id_fkey"`);
    await queryRunner.query(`ALTER TABLE "image_file" DROP CONSTRAINT "image_file_user_id_fkey"`);
    await queryRunner.query(
      `ALTER TABLE "image_file" DROP CONSTRAINT "image_file_activityId_fkey"`,
    );
    await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "activity_category_id_fkey"`);
    await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "activity_user_id_fkey"`);
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "subscription_user_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "subscription_paymentPlanId_fkey"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "invoice_userId_fkey"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "invoice_subscriptionId_fkey"`);
    await queryRunner.query(
      `ALTER TABLE "user_session" DROP CONSTRAINT "user_session_user_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pasword-reset-token" DROP CONSTRAINT "pasword-reset-token_user_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_permission_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_role_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account_role" DROP CONSTRAINT "user_account_role_role_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account_role" DROP CONSTRAINT "user_account_role_user_account_id_fkey"`,
    );
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "newUserId" TO "userId"`);
    // await queryRunner.query(`ALTER TABLE "category" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "image_file" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "image_file" RENAME COLUMN "newUserId" TO "userId"`);
    // await queryRunner.query(`ALTER TABLE "image_file" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "activity" RENAME COLUMN "newUserId" TO "userId"`);
    // await queryRunner.query(`ALTER TABLE "activity" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "subscription" RENAME COLUMN "newUserId" TO "userId"`);
    // await queryRunner.query(`ALTER TABLE "subscription" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "invoice" RENAME COLUMN "newUserId" TO "userId"`);
    // await queryRunner.query(`ALTER TABLE "invoice" ADD "userId" uuid`);
    // await queryRunner.query(`ALTER TABLE "image_file" DROP COLUMN "user_id"`);
    // await queryRunner.query(`ALTER TABLE "image_file" RENAME COLUMN "newUserId" TO "userId"`);
    // await queryRunner.query(`ALTER TABLE "image_file" ADD "user_id" integer NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "user_id"`);
    // await queryRunner.query(`ALTER TABLE "subscription" RENAME COLUMN "newUserId" TO "userId"`);
    // await queryRunner.query(`ALTER TABLE "subscription" ADD "user_id" integer NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "userId"`);
    // await queryRunner.query(`ALTER TABLE "invoice" ADD "userId" integer`);

    // set userId to not null
    // await queryRunner.query(`ALTER TABLE "activity" ALTER COLUMN "userId" SET NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "userId" SET NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "userId" SET NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "image_file" ALTER COLUMN "userId" SET NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "userId" SET NOT NULL`);

    await queryRunner.query(
      // `ALTER TABLE "category" ADD CONSTRAINT "FK_6562e564389d0600e6e243d9604" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      `ALTER TABLE "category" ADD CONSTRAINT "FK_32b856438dffdc269fa84434d9f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "image_file" ADD CONSTRAINT "FK_7670bdd0fe768615e9505483247" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      // `ALTER TABLE "image_file" ADD CONSTRAINT "FK_360c9db8fdddf202c2d028b55c7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      `ALTER TABLE "image_file" ADD CONSTRAINT "FK_c79f6c117725fdbd676c8783679" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity" ADD CONSTRAINT "FK_5d3d888450207667a286922f945" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      // `ALTER TABLE "activity" ADD CONSTRAINT "FK_10bf0c2dd4736190070e8475119" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      `ALTER TABLE "activity" ADD CONSTRAINT "FK_3571467bcbe021f66e2bdce96ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      // `ALTER TABLE "subscription" ADD CONSTRAINT "FK_940d49a105d50bbd616be540013" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_d4c430f68d08338f006eae83f76" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_1ca5dce89a3293e6b88cd14c0ca" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      // `ALTER TABLE "invoice" ADD CONSTRAINT "FK_f8e849201da83b87f78c7497dde" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_f8e849201da83b87f78c7497dde" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_session" ADD CONSTRAINT "FK_13275383dcdf095ee29f2b3455a" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pasword-reset-token" ADD CONSTRAINT "FK_eab95e3e413f252aa473f911d13" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "image_file" ADD CONSTRAINT "FK_360c9db8fdddf202c2d028b55c7" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "subscription" ADD CONSTRAINT "FK_940d49a105d50bbd616be540013" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "invoice" ADD CONSTRAINT "FK_f8e849201da83b87f78c7497dde" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account_role" ADD CONSTRAINT "FK_9e8c26b174473cbfc9c707aecdf" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account_role" ADD CONSTRAINT "FK_b4aa9e30f52e19cce26cd96ee99" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    // await queryRunner.query(`DROP TABLE "user_account"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_account_role" DROP CONSTRAINT "FK_b4aa9e30f52e19cce26cd96ee99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account_role" DROP CONSTRAINT "FK_9e8c26b174473cbfc9c707aecdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_f8e849201da83b87f78c7497dde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_940d49a105d50bbd616be540013"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image_file" DROP CONSTRAINT "FK_360c9db8fdddf202c2d028b55c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pasword-reset-token" DROP CONSTRAINT "FK_eab95e3e413f252aa473f911d13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_session" DROP CONSTRAINT "FK_13275383dcdf095ee29f2b3455a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_f8e849201da83b87f78c7497dde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_1ca5dce89a3293e6b88cd14c0ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_d4c430f68d08338f006eae83f76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_940d49a105d50bbd616be540013"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity" DROP CONSTRAINT "FK_10bf0c2dd4736190070e8475119"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity" DROP CONSTRAINT "FK_5d3d888450207667a286922f945"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image_file" DROP CONSTRAINT "FK_360c9db8fdddf202c2d028b55c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image_file" DROP CONSTRAINT "FK_7670bdd0fe768615e9505483247"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_6562e564389d0600e6e243d9604"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "invoice" ADD "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "subscription" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "image_file" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "image_file" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "invoice" ADD "userId" integer`);
    await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "subscription" ADD "user_id" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "activity" ADD "user_id" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "image_file" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "image_file" ADD "user_id" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "category" ADD "user_id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user_account_role" ADD CONSTRAINT "user_account_role_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account_role" ADD CONSTRAINT "user_account_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "pasword-reset-token" ADD CONSTRAINT "pasword-reset-token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "subscription_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity" ADD CONSTRAINT "activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity" ADD CONSTRAINT "activity_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "image_file" ADD CONSTRAINT "image_file_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "image_file" ADD CONSTRAINT "image_file_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
