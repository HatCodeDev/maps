document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const startInput = document.getElementById("start");
    const endInput = document.getElementById("end");
    const findPathButton = document.getElementById("findPath");
    const letters = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const size = 10; // Tamaño del tablero sin incluir los encabezados
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]  // Movimientos: arriba, abajo, izquierda, derecha
    ];

    // Crear el tablero
    for (let row = 0; row <= size; row++) {
        for (let col = 0; col <= size; col++) {
            const cell = document.createElement("div");

            if (row === 0 && col === 0) {
                // Esquina superior izquierda vacía
                cell.className = "cell empty";
            } else if (row === 0) {
                // Encabezado superior (letras)
                cell.className = "cell header";
                cell.textContent = letters[col];
            } else if (col === 0) {
                // Encabezado lateral izquierdo (números)
                cell.className = "cell header";
                cell.textContent = row;
            } else {
                // Celdas del tablero (coordenadas)
                cell.className = "cell coordinate";
                cell.dataset.coordinate = `${letters[col]}${row}`; // Ejemplo: A1, B2
            }

            board.appendChild(cell);
        }
    }

    // Convertir coordenadas de letras y números a índices
    function toIndex(coordinate) {
        const letter = coordinate.charAt(0).toUpperCase();
        const number = parseInt(coordinate.charAt(1), 10);
        const col = letters.indexOf(letter);
        const row = number;
        return { row, col };
    }

    // Función BFS actualizada para respetar sentidos de filas y columnas
function bfs(start, end) {
    const queue = [[start]];
    const visited = new Set();
    visited.add(`${start.row},${start.col}`);

    while (queue.length > 0) {
        const currentPath = queue.shift();
        const { row, col } = currentPath[currentPath.length - 1];

        // Si llegamos al punto final, devolvemos el camino
        if (row === end.row && col === end.col) {
            return currentPath;
        }

        // Movimientos válidos según las reglas
        const possibleMoves = [];
        if (row % 2 === 1) {
            // Filas impares -> Solo hacia la derecha
            possibleMoves.push([0, 1]); // Derecha
        } else {
            // Filas pares -> Solo hacia la izquierda
            possibleMoves.push([0, -1]); // Izquierda
        }

        if (col % 2 === 1) {
            // Columnas impares -> Solo hacia abajo
            possibleMoves.push([1, 0]); // Abajo
        } else {
            // Columnas pares -> Solo hacia arriba
            possibleMoves.push([-1, 0]); // Arriba
        }

        for (const [dRow, dCol] of possibleMoves) {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (
                newRow >= 1 && newRow <= size &&
                newCol >= 1 && newCol <= size &&
                !visited.has(`${newRow},${newCol}`)
            ) {
                visited.add(`${newRow},${newCol}`);
                queue.push([...currentPath, { row: newRow, col: newCol }]);
            }
        }
    }

    return []; // Si no hay camino
}

    // Función para destacar el camino en el tablero
    function highlightPath(path) {
        const cells = document.querySelectorAll(".cell.coordinate");
        cells.forEach(cell => cell.classList.remove("path"));

        path.forEach(({ row, col }) => {
            const cell = document.querySelector(`[data-coordinate="${letters[col]}${row}"]`);
            if (cell) {
                cell.classList.add("path");
            }
        });
    }

    // Mostrar camino actualizado para las nuevas reglas
function showPath(path) {
    const output = document.getElementById("pathOutput");
    if (path.length === 0) {
        output.textContent = "No hay camino disponible.";
    } else {
        let instructions = [];
        let currentDirection = null;
        let currentCount = 0;

        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const current = path[i];

            const rowDiff = current.row - prev.row;
            const colDiff = current.col - prev.col;
            let newDirection = null;

            if (rowDiff > 0) {
                newDirection = "calles hacia abajo";
            } else if (rowDiff < 0) {
                newDirection = "calles hacia arriba";
            } else if (colDiff > 0) {
                newDirection = "cuadras hacia la derecha";
            } else if (colDiff < 0) {
                newDirection = "cuadras hacia la izquierda";
            }

            if (newDirection === currentDirection) {
                currentCount++;
            } else {
                if (currentDirection) {
                    instructions.push(`${currentCount} ${currentDirection}`);
                }
                currentDirection = newDirection;
                currentCount = 1;
            }
        }

        if (currentDirection) {
            instructions.push(`${currentCount} ${currentDirection}`);
        }

        output.textContent = `Instrucciones: ${instructions.join(", ")}`;
    }
}

     // Lógica al presionar el botón para encontrar el camino con las nuevas reglas
    findPathButton.addEventListener("click", () => {
        const start = toIndex(startInput.value);
        const end = toIndex(endInput.value);

        const path = bfs(start, end);
        highlightPath(path);
        showPath(path);
});
});
