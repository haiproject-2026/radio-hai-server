import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Pool, QueryResult } from "pg";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool!: Pool;

  onModuleInit() {
    this.pool = new Pool({
      user: "postgres",
      host: "localhost",
      database: "radio_hai_db",
      password: "TON_MOT_DE_PASSE",
      port: 5432,
    });
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
