import { z } from "zod";
import type { Prisma } from "../../generated/prisma/client";
import { CATEGORIES, statusSchema } from "./schema";

const SORT_VALUES = [
  "newest",
  "price-asc",
  "price-desc",
  "renewal-asc",
  "renewal-desc",
] as const;

const sortSchema = z.enum(SORT_VALUES);

const querySchema = z.string().trim().max(120);

const categorySchema = z.union([z.literal(""), z.enum(CATEGORIES)]);

const statusFilterSchema = z.union([z.literal(""), statusSchema]);

export const SORT_OPTIONS = [
  { value: "newest", label: "Recently added" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "renewal-asc", label: "Renewal: earliest first" },
  { value: "renewal-desc", label: "Renewal: latest first" },
] as const;

export type SubscriptionFilterValues = {
  q: string;
  category: "" | (typeof CATEGORIES)[number];
  status: "" | z.infer<typeof statusSchema>;
  sort: z.infer<typeof sortSchema>;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseSubscriptionFilters(params: RawSearchParams): {
  filters: SubscriptionFilterValues;
  hasInvalidParams: boolean;
} {
  const query = querySchema.safeParse(params.q ?? "");

  const category = categorySchema.safeParse(params.category ?? "");

  const status = statusFilterSchema.safeParse(params.status ?? "");

  const sort = sortSchema.safeParse(params.sort ?? "newest");

  return {
    filters: {
      q: query.success ? query.data : "",
      category: category.success ? category.data : "",
      status: status.success ? status.data : "",
      sort: sort.success ? sort.data : "newest",
    },

    hasInvalidParams:
      !query.success || !category.success || !status.success || !sort.success,
  };
}

// PostgreSQL LIKE/ILIKE treats %, _ and \ as special.
// Escape them so a search matches literal characters.
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`);
}

export function buildSubscriptionQuery(
  userId: string,
  filters: SubscriptionFilterValues,
): {
  where: Prisma.SubscriptionWhereInput;
  orderBy: Prisma.SubscriptionOrderByWithRelationInput[];
} {
  const where: Prisma.SubscriptionWhereInput = {
    userId,
  };

  if (filters.q) {
    where.name = {
      contains: escapeLikePattern(filters.q),
      mode: "insensitive",
    };
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  let orderBy: Prisma.SubscriptionOrderByWithRelationInput[];

  switch (filters.sort) {
    case "price-asc":
      orderBy = [{ amountCents: "asc" }, { id: "asc" }];
      break;

    case "price-desc":
      orderBy = [{ amountCents: "desc" }, { id: "asc" }];
      break;

    case "renewal-asc":
      orderBy = [{ nextRenewalDate: "asc" }, { id: "asc" }];
      break;

    case "renewal-desc":
      orderBy = [{ nextRenewalDate: "desc" }, { id: "asc" }];
      break;

    default:
      orderBy = [{ createdAt: "desc" }, { id: "desc" }];
  }

  return {
    where,
    orderBy,
  };
}
