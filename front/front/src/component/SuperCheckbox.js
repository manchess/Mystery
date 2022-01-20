import {
    faCheck,
    faQuestion,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

/**
 * Componente que renderiza un checkbox de 4 estados
 */
export default function SuperCheckbox() {
    const [estado, setEstado] = useState(0);

    const aumentarEstado = () => {
        setEstado((e) => (e + 1) % 4);
    };

    switch (estado) {
        case 0:
            return (
                <div
                    className="superCheckbox"
                    onClick={(e) => aumentarEstado()}
                    data-testid="supercheckbox"
                />
            );
        case 1:
            return (
                <div
                    className="superCheckbox"
                    onClick={(e) => aumentarEstado()}
                    data-testid="supercheckbox"
                >
                    <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: "#0F9D58" }}
                    />
                </div>
            );
        case 2:
            return (
                <div
                    className="superCheckbox"
                    onClick={(e) => aumentarEstado()}
                    data-testid="supercheckbox"
                >
                    <FontAwesomeIcon
                        icon={faTimes}
                        style={{ color: "#DB4437" }}
                    />
                </div>
            );
        case 3:
            return (
                <div
                    className="superCheckbox"
                    onClick={(e) => aumentarEstado()}
                    data-testid="supercheckbox"
                >
                    <FontAwesomeIcon
                        icon={faQuestion}
                        style={{ color: "#F4B400" }}
                    />
                </div>
            );
        default:
            return null;
    }
}
