import { screen, render, fireEvent } from "@testing-library/react";
import SuperCheckbox from "../component/SuperCheckbox";

test("El checkbox pasa por los 4 estados correctamente", () => {
    render(<SuperCheckbox />);

    const div = screen.getByTestId("supercheckbox");

    expect(screen.queryByRole("img", { hidden: true })).toBeNull();

    fireEvent.click(div);

    const check = screen.getByRole("img", { hidden: true });

    expect(check).toHaveStyle("color: #0F9D58");

    fireEvent.click(div);

    const cross = screen.getByRole("img", { hidden: true });

    expect(cross).toHaveStyle("color: #DB4437");

    fireEvent.click(div);

    const question = screen.getByRole("img", { hidden: true });

    expect(question).toHaveStyle("color: #F4B400");

    fireEvent.click(div);

    expect(screen.queryByRole("img", { hidden: true })).toBeNull();
});
