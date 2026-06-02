import { relations } from 'drizzle-orm';
import { datetime, int, mysqlEnum, mysqlTable, text, timestamp, varchar, year } from 'drizzle-orm/mysql-core';


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

export const employers = mysqlTable('employers', {
    id: int('id').primaryKey().references(
        () => users.id,
        {
            onDelete: 'cascade',
        }
    ),

    name: varchar('name', { length: 255 }),
    description: text('description'),
    avatarUrl: text('avatar_url'),
    bannerImageUrl: text('banner_image_url'),
    organizationType: varchar('organization_type', 
        { length: 100 }),
    teamSize: varchar('team_size', { length: 50 }),
    yearOffStablishment: year('year_of_establishment'),
    websiteUrl: varchar('website_url', { length: 255 }),
    location: varchar('location', { length: 255 }),

    deleteAt: timestamp('deleted_at', { mode: 'string'}),
    createAt: timestamp('created_at', { mode: 'string'})
    .defaultNow().notNull(),
    updateAt: timestamp('updated_at', { mode: 'string'})
    .defaultNow().notNull(),
});


export const applicants = mysqlTable('applicants', {
    id: int('id').primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
    biography: text('biography'),
    dateOfBirth: datetime('date_of_birth'),
    nationality: varchar('nationality', { length: 100 }),
    maritalStatus: mysqlEnum('marital_status', ['single', 'married', 'divorced', 'widowed']),
    gender: mysqlEnum('gender', ['male', 'female', 'other']),
    education: mysqlEnum('education', ['high_school', 'bachelor', 'master', 'phd', 'other', "none"]),

    deleteAt: timestamp('deleted_at', { mode: 'string'})
    .defaultNow().notNull(),
    createAt: timestamp('created_at', { mode: 'string'})
    .defaultNow().notNull(),
    updateAt: timestamp('updated_at', { mode: 'string'})
    .defaultNow().notNull(),
});


// relations definitions

export const userRelations = relations(users, ({one, many}) => (
    {
        // one user can have one applicant profile (if the user is an employer)
        employer: one(employers, {
            fields: [users.id],
            references: [employers.id],
        }),
        // one user can have one applicant profile (if the user is an applicant)
        applicant: one(applicants, {
            fields: [users.id],
            references: [applicants.id],
        }),
        // one user can have many sessions
        sessions: many(sessions),
    })
);

// one session belongs to one user
export const sessionRelations = relations(sessions, ({one}) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

