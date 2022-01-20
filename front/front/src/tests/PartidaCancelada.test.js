import { screen, render } from "@testing-library/react";
import PartidaCancelada from "../component/PartidaCancelada";

test("El boton habilitado para regresar al lobby", () => {
 
    render(<PartidaCancelada/>);
    
    const boton = screen.getByText(/Volver al lobby/i);
    
    expect(boton).not.toBeDisabled();

});