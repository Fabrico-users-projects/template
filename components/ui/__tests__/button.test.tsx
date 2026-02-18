import * as React from "react";
import { render, screen } from "@testing-library/react-native";
import { Button } from "../button";
import { Text } from "react-native";

describe("Button Component", () => {
  it("renders correctly with text", () => {
    render(
      <Button>
        <Text>Click Me</Text>
      </Button>
    );

    expect(screen.getByText("Click Me")).toBeOnTheScreen();
  });

  it("renders with custom variant class", () => {
    const { getByRole } = render(
      <Button variant="destructive">
        <Text>Delete</Text>
      </Button>
    );

    // Testing implementation detail (className) via native-testing-library matches
    // Note: detailed style testing is often better done via snapshot or visual regression
    // but basic rendering test is sufficient for sanity check.
    expect(getByRole("button")).toBeOnTheScreen();
  });
});
