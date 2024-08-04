/* eslint-disable drizzle/enforce-delete-with-where */
/* eslint-disable no-console */

import { fakerPT_BR as faker } from "@faker-js/faker";
import chalk from "chalk";
import { db } from "./connection";
import { UserRole, users } from "./schema";

async function resetDatabase() {
  await db.delete(users);

  console.log(chalk.yellow("✓ Database reset!"));
}

async function createUsers() {
  const [userAdmin, userManager] = await db
    .insert(users)
    .values([
      {
        name: faker.person.fullName(),
        email: faker.internet.email().toLocaleLowerCase(),
        password: "secret",
        role: UserRole.ADMIN,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email().toLocaleLowerCase(),
        password: "secret",
        role: UserRole.MANAGER,
      },
    ])
    .returning();

  console.log(chalk.yellow("✓ Created users!"));

  return [userAdmin, userManager];
}

try {
  await resetDatabase();

  await createUsers();

  console.log(chalk.green("✓ Database seeded successfully!"));
} catch (error) {
  await resetDatabase();
  console.log(chalk.red("✗ Database seeding failed!"));
} finally {
  process.exit();
}
