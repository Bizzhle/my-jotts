import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaForUserFoodRecipeRestaurantInitial1687247882058 implements MigrationInterface {
    name = 'SchemaForUserFoodRecipeRestaurantInitial1687247882058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "food" character varying NOT NULL, "ingredients" character varying array, "steps" character varying array, "comments" character varying NOT NULL, "dateCreated" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_account" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "emailAddress" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "enabled" boolean NOT NULL, "registrationDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_6acfec7285fdf9f463462de3e9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "restaurant" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "website" character varying, "rating" integer, "phoneNumber" character varying, "firstVisit" TIMESTAMP NOT NULL, "lastVisit" TIMESTAMP, "dateCreated" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_649e250d8b8165cb406d99aa30f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "food" ("id" SERIAL NOT NULL, "food" character varying NOT NULL, "ingredients" character varying array, "rating" character varying, "comments" character varying, "dateCreated" TIMESTAMP NOT NULL, "userId" integer, "restaurantId" integer, CONSTRAINT "PK_26d12de4b6576ff08d30c281837" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "FK_fe30fdc515f6c94d39cd4bbfa76" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_43ebcd49fca84c2fda8c077ac68" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food" ADD CONSTRAINT "FK_5ed8e55796b747240eff8d82b8a" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food" ADD CONSTRAINT "FK_7c9492140866fe2a0867b381dcf" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food" DROP CONSTRAINT "FK_7c9492140866fe2a0867b381dcf"`);
        await queryRunner.query(`ALTER TABLE "food" DROP CONSTRAINT "FK_5ed8e55796b747240eff8d82b8a"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_43ebcd49fca84c2fda8c077ac68"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "FK_fe30fdc515f6c94d39cd4bbfa76"`);
        await queryRunner.query(`DROP TABLE "food"`);
        await queryRunner.query(`DROP TABLE "restaurant"`);
        await queryRunner.query(`DROP TABLE "user_account"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
    }

}
