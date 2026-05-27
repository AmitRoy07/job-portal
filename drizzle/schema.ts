import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';


export const users = mysqlTable('users', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    userName: varchar('username', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phoneNumber: varchar('phone_number', { length: 20 }),
    role: mysqlEnum('role', ['applicant', 'employer']).default('applicant').notNull(),
    deletedAt: timestamp('deleted_at'),
    createAt: timestamp('created_at').defaultNow().notNull(),
    updateAt: timestamp('updated_at').defaultNow().notNull().onUpdateNow(),
});

export const sessions = mysqlTable('sessions', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    userAgent: text('user_agent').notNull(),
    ip: varchar('ip', { length: 255 }).notNull(),
    expireAt: timestamp('expire_at').notNull(),
    createAt: timestamp('created_at').defaultNow().notNull(),
    updateAt: timestamp('updated_at').defaultNow().notNull().onUpdateNow(),
});
