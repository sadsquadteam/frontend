import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

export function renderWithProviders(ui, options = {}) {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>,
    options
  );
}