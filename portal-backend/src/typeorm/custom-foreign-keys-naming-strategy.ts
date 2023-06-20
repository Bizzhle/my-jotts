import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  foreignKeyName(
    tableOrName: string | Table,
    columnNames: string[],
    _referencedTablePath?: string,
    _referencedColumnNames?: string[],
  ): string {
    tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    const name = columnNames.reduce((name, column) => `${name}_${column}`, `${tableOrName}`);

    return name + '_fkey';
  }
}
