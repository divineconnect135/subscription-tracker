import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  create: vi.fn(),
  updateMany: vi.fn(),
  deleteMany: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("@/lib/require-user", () => ({
  requireUser: mocks.requireUser,
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    subscription: {
      create: mocks.create,
      updateMany: mocks.updateMany,
      deleteMany: mocks.deleteMany,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import {
  createSubscriptionAction,
  updateSubscriptionAction,
  deleteSubscriptionAction,
  changeSubscriptionStatusAction,
} from "../../src/features/subscriptions/actions";

import { initialActionState } from "../../src/features/subscriptions/action-state";

function makeForm(overrides: Record<string, string> = {}): FormData {
  const values = {
    name: "Netflix",
    amount: "16.99",
    billingCycle: "MONTHLY",
    category: "Entertainment",
    nextRenewalDate: "2026-11-15",
    status: "ACTIVE",
    notes: "",
    ...overrides,
  };

  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

beforeEach(() => {
  vi.clearAllMocks();

  mocks.requireUser.mockResolvedValue({
    id: "account-a",
    name: "Account A",
  });

  mocks.create.mockResolvedValue({
    id: "new-record",
  });

  mocks.updateMany.mockResolvedValue({
    count: 1,
  });

  mocks.deleteMany.mockResolvedValue({
    count: 1,
  });
});

describe("createSubscriptionAction", () => {
  it("uses the authenticated user as owner", async () => {
    await expect(
      createSubscriptionAction(initialActionState, makeForm()),
    ).rejects.toThrow("REDIRECT:/subscriptions?notice=created");

    expect(mocks.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "account-a",
        name: "Netflix",
        amountCents: 1699,
        currency: "CAD",
        billingCycle: "MONTHLY",
        status: "ACTIVE",
      }),
    });

    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it("ignores a forged userId", async () => {
    const formData = makeForm();

    formData.set("userId", "account-b");

    await expect(
      createSubscriptionAction(initialActionState, formData),
    ).rejects.toThrow("REDIRECT:");

    expect(mocks.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "account-a",
      }),
    });
  });

  it("rejects invalid prices without writing", async () => {
    const result = await createSubscriptionAction(
      initialActionState,
      makeForm({ amount: "-10" }),
    );

    expect(result.status).toBe("error");
    expect(result.fieldErrors.amount).toBeDefined();

    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("does not write without authentication", async () => {
    mocks.requireUser.mockRejectedValueOnce(new Error("Not authenticated"));

    await expect(
      createSubscriptionAction(initialActionState, makeForm()),
    ).rejects.toThrow("Not authenticated");

    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("returns a safe error for a database failure", async () => {
    mocks.create.mockRejectedValueOnce(
      new Error("Private database connection detail"),
    );

    const result = await createSubscriptionAction(
      initialActionState,
      makeForm(),
    );

    expect(result.status).toBe("error");
    expect(result.message).not.toContain("Private database connection detail");
  });
});

describe("updateSubscriptionAction", () => {
  it("updates only a record owned by the user", async () => {
    await expect(
      updateSubscriptionAction(
        "record-a",
        initialActionState,
        makeForm({ amount: "22.99" }),
      ),
    ).rejects.toThrow("REDIRECT:/subscriptions?notice=updated");

    expect(mocks.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "record-a",
          userId: "account-a",
        },
        data: expect.objectContaining({
          amountCents: 2299,
        }),
      }),
    );
  });

  it("refuses to update a missing or foreign record", async () => {
    mocks.updateMany.mockResolvedValueOnce({
      count: 0,
    });

    const result = await updateSubscriptionAction(
      "foreign-record",
      initialActionState,
      makeForm(),
    );

    expect(result.status).toBe("error");
    expect(result.message).toMatch(/not found|access denied/i);

    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});

describe("deleteSubscriptionAction", () => {
  it("deletes only the user's matching record", async () => {
    await expect(
      deleteSubscriptionAction("record-a", initialActionState, new FormData()),
    ).rejects.toThrow("REDIRECT:/subscriptions?notice=deleted");

    expect(mocks.deleteMany).toHaveBeenCalledWith({
      where: {
        id: "record-a",
        userId: "account-a",
      },
    });
  });

  it("refuses to delete a foreign record", async () => {
    mocks.deleteMany.mockResolvedValueOnce({
      count: 0,
    });

    const result = await deleteSubscriptionAction(
      "foreign-record",
      initialActionState,
      new FormData(),
    );

    expect(result.status).toBe("error");
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});

describe("changeSubscriptionStatusAction", () => {
  it("updates only status and enforces ownership", async () => {
    const formData = new FormData();
    formData.set("status", "PAUSED");

    const result = await changeSubscriptionStatusAction(
      "record-a",
      initialActionState,
      formData,
    );

    expect(result.status).toBe("success");

    expect(mocks.updateMany).toHaveBeenCalledWith({
      where: {
        id: "record-a",
        userId: "account-a",
      },
      data: {
        status: "PAUSED",
      },
    });
  });

  it("rejects unsupported status values", async () => {
    const formData = new FormData();
    formData.set("status", "EXPIRED");

    const result = await changeSubscriptionStatusAction(
      "record-a",
      initialActionState,
      formData,
    );

    expect(result.status).toBe("error");
    expect(mocks.updateMany).not.toHaveBeenCalled();
  });
});
