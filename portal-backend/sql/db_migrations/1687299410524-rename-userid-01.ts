import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserid011687299410524 implements MigrationInterface {
    name = 'RenameUserid011687299410524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "FK_fe30fdc515f6c94d39cd4bbfa76"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_43ebcd49fca84c2fda8c077ac68"`);
        await queryRunner.query(`ALTER TABLE "food" DROP CONSTRAINT "FK_5ed8e55796b747240eff8d82b8a"`);
        await queryRunner.query(`ALTER TABLE "food" DROP CONSTRAINT "FK_7c9492140866fe2a0867b381dcf"`);
        await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "user_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food" ADD CONSTRAINT "food_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food" ADD CONSTRAINT "food_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food" DROP CONSTRAINT "food_restaurantId_fkey"`);
        await queryRunner.query(`ALTER TABLE "food" DROP CONSTRAINT "food_userId_fkey"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "restaurant_userId_fkey"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "recipe_userId_fkey"`);
        await queryRunner.query(`ALTER TABLE "user_account" ALTER COLUMN "user_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "food" ADD CONSTRAINT "FK_7c9492140866fe2a0867b381dcf" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food" ADD CONSTRAINT "FK_5ed8e55796b747240eff8d82b8a" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_43ebcd49fca84c2fda8c077ac68" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "FK_fe30fdc515f6c94d39cd4bbfa76" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
