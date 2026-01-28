import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders top navigation", () => {
  render(<App />);
  // The app's header/nav should be present.
  expect(screen.getByText(/Trending Repos/i)).toBeInTheDocument();
});
