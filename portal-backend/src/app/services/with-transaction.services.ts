import { DataSource, QueryRunner } from 'typeorm';

export abstract class WithTransactionService {
  public async createTransaction(connection: DataSource): Promise<QueryRunner> {
    const transaction = connection.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    return transaction;
  }

  public async closeTransaction(transaction: QueryRunner) {
    await transaction.release();
  }
}
