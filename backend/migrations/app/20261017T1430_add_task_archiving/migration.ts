#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2e8c0e407e59044b7abf5e071712a2368b0feedd86175c928803c23966f7f2de/contract';
import endContract from '../../snapshots/2e8c0e407e59044b7abf5e071712a2368b0feedd86175c928803c23966f7f2de/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/7d1eb6a3c32840f4f6dece8b4268c352c393d1111e5991c3ed323bce06c7bb32/contract';
import startContract from '../../snapshots/7d1eb6a3c32840f4f6dece8b4268c352c393d1111e5991c3ed323bce06c7bb32/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'task',
        column: col('isArchived', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
