// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom/vitest";

import { EmptyState } from "../../src/components/ui/EmptyState";

// Remove rendered components after each test.
afterEach(() => {
  cleanup();
});

describe("EmptyState", () => {
  it("shows a useful message and action", () => {
    render(
      <EmptyState
        title="No subscriptions yet"
        description="Add your first recurring expense."
        actionHref="/subscriptions/new"
        actionLabel="Add subscription"
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "No subscriptions yet",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Add your first recurring expense."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Add subscription",
      }),
    ).toHaveAttribute("href", "/subscriptions/new");
  });

  it("does not render an action when one is absent", () => {
    render(
      <EmptyState
        title="No matching subscriptions"
        description="Try another search."
        kind="search"
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "No matching subscriptions",
      }),
    ).toBeInTheDocument();

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
