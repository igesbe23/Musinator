// toma un vector f y un vector l y devuelve el conjunto de las matrices len(f),len(l) que suman esos vectores
//Creamos los f y l posibles para un s
function posibles_f(s,fmax) {
    //Creamos f vértice
    const initialArray = Array(fmax.length).fill(0)
    [imax,sum,dif] = posibles_f_first_greater(s,fmax)
    for (let i=0; i<imax; i++){
        initialArray[i] = fmax[i]
    }
    initialArray[imax] = fmax[imax]-dif
    const initialCoordinates = Array(fmax.length-1).fill(0)
    //Creamos las aristas del vértice, es broma, no hace falta al ser muy simples. 
    //Recorremos el conjunto con un algoritmo breath-first
    const queue = [];
    const visited = new Set();
    
    // Helper to check if an array has only non-negative numbers
    const inBounds = (arr) => arr.every((x,index) => (x >= 0 && x <= fmax[index]));
    
    // Helper to hash arrays as strings for visited set
    const arrayToString = (arr) => arr.join(',');
    
    // Start BFS with the initial array
    queue.push({ array: initialArray, coordinates: initialCoordinates });
    visited.add(arrayToString(initialCoordinates));
    
    const result = [];
    
    while (queue.length > 0) {
        const { array, coordinates } = queue.shift();
    
        // Add the current array to the result
        result.push( array );
    
        // Try adding each step
        for (let i = 0; i < imax; i++) {
            let newArray = [...array];
            newArray[i] = newArray[i]-1;
            newArray[imax] = newArray[imax]+1;
            const newCoordinates = [...coordinates];
            newCoordinates[i] += 1;

            // Check if the new array is valid and not visited
            if (inBounds(newArray) && !visited.has(arrayToString(newCoordinates))) {
                queue.push({ array: newArray, coordinates: newCoordinates });
                visited.add(arrayToString(newCoordinates));
            }
        }
        for (let i = imax+1; i < fmax.length; i++) {
            let newArray = [...array];
            newArray[i] = newArray[i]+1;
            newArray[imax] = newArray[imax]-1;
            const newCoordinates = [...coordinates];
            newCoordinates[i-1] += 1;

            // Check if the new array is valid and not visited
            if (inBounds(newArray) && !visited.has(arrayToString(newCoordinates))) {
                queue.push({ array: newArray, coordinates: newCoordinates });
                visited.add(arrayToString(newCoordinates));
            }
        }
    }
    
    return result;
    
}

function posibles_f_first_greater(s,fmax){
    let sum = 0
    for (let i=0; i<fmax.length; i++){
        const dif = sum+fmax[i]-s
        if (dif>=0){
            return [i,sum,dif]
        }
        sum += fmax[i]
    }
    throw new Error('s es demasiado grande');
}

//Para las matrices, función Creamos un vértice matriz para f y l dados y su estela para calcular aristas
function solVerticeFL(f, l) {
    // Inicializar matrices, es necesaria la matriz estela
    let EstelaMat = Array(f.length).fill(0).map(() => Array(l.length).fill(0));
    let VerticeMat = Array(f.length).fill(0).map(() => Array(l.length).fill(0));

    // Configurar valores iniciales
    if (f[0] != 0){
        for (let j = 0; j < l.length; j++) {
            if (l[j] != 0){
                EstelaMat[0][j] = 1;
            }
        }
    }
    if(l[l.length-1]!=0){
        for (let i = 0; i < f.length; i++) {
            if (f[i] != 0){
                EstelaMat[i][l.length - 1] = 1;
            }
        }
    }
    for (let j = 0; j < l.length; j++) {
        VerticeMat[0][j] = l[j];
    }
    for (let i = 0; i < f.length; i++) {
        VerticeMat[i][l.length - 1] = f[i];
    }
    VerticeMat[0][l.length - 1] = f[0] + l[l.length - 1] - f.reduce((acc, val) => acc + val, 0);

    let i = 0;
    let j = l.length - 1;

    while (true) {
        if (VerticeMat[i][j] >= 0) {
            break;
        }

        VerticeMat[i + 1][j] += VerticeMat[i][j];
        VerticeMat[i][j - 1] += VerticeMat[i][j];
        VerticeMat[i + 1][j - 1] -= VerticeMat[i][j];
        VerticeMat[i][j] = 0;

        EstelaMat[i][j] = 0;
        if (f[i+1]!==0 && l[j-1]!==0){
            EstelaMat[i + 1][j - 1] = 1;
        }
        // Coordenada i
        let itemp = i + 1;
        while (VerticeMat[itemp][j] < 0) {
            itemp++;
            VerticeMat[itemp][j] += VerticeMat[itemp - 1][j];
            VerticeMat[itemp][j - 1] -= VerticeMat[itemp - 1][j];
            VerticeMat[itemp - 1][j - 1] += VerticeMat[itemp - 1][j];
            VerticeMat[itemp - 1][j] = 0;

            EstelaMat[itemp - 1][j] = 0;
            if (f[itemp]!==0 && l[j-1]!==0){
                EstelaMat[itemp][j - 1] = 1;
            }
        }

        // Coordenada j
        let jtemp = j - 1;
        while (VerticeMat[i][jtemp] < 0) {
            jtemp--;
            VerticeMat[i][jtemp] += VerticeMat[i][jtemp + 1];
            VerticeMat[i + 1][jtemp + 1] += VerticeMat[i][jtemp + 1];
            VerticeMat[i + 1][jtemp] -= VerticeMat[i][jtemp + 1];
            VerticeMat[i][jtemp + 1] = 0;

            EstelaMat[i][jtemp + 1] = 0;
            if (f[i+1]!==0 && l[jtemp]!==0){
                EstelaMat[i + 1][jtemp] = 1;
            }
        }

        if (itemp === i && jtemp === j) {
            break;
        }

        i++;
        j--;
    }

    return { VerticeMat, EstelaMat };
}

// Escribimos nuestro algoritmo de caminos para crear las matrices arista a partir de una matriz "completa" - algoritmo del MUSIPAPER. 

// Función que obtiene las primeras aristas, cada vector arista es en realidad una función para acortar a O(n+v) de O(n*v) el proceso de sumar.
function primeras_aristas_funcion_adicion(V){
    const result = []
    const v = V.length
    const n = V[0].length
    for (let i = 0; i < v; i++) {
        for (let j = 0; j < n; j++) {
            if (V[i,j]===0){
                const Arista = find_balanced_paths(V, [i,j]);
                if (Arista[1]){
                    result.push(matrix_to_adition(Arista[0]))
                }
            }
        }
    }
    return result
}

function find_balanced_paths(V, I) {
    // Verifica que la entrada es válida
    if (V[I[0]][I[1]] !== 0) {
        throw new Error('La posición inicial (i, j) debe contener un 0.');
    }

    const v = V.length;
    const n = V[0].length;
    let paths = []; // Lista de caminos activos: [{ camino, última coordenada, paridad }]
    let result = Array.from({ length: v }, () => Array(n).fill(0)); // Matriz de resultado final

    // Inicializa el primer camino con el punto inicial
    let initialPath = Array.from({ length: v }, () => Array(n).fill(0));
    initialPath[I[0]][I[1]] = 1; // Marca la posición inicial con un 1
    paths.push({ path: initialPath, coords: I, parity: 1 }); // Incluye camino, coordenadas y paridad

    while (paths.length > 0) {
        let newPaths = []; // Nuevos caminos generados en esta iteración

        // Procesa cada camino activo
        for (let p = 0; p < paths.length; p++) {
            const currentPathData = paths[p];
            const currentPath = currentPathData.path;
            const lastCoords = currentPathData.coords;
            const currentParity = currentPathData.parity;

            const i = lastCoords[0];
            const j = lastCoords[1];

            // Expandir por fila
            if (currentParity % 2 === 1) { // Paso impar
                for (let col = 0; col < n; col++) {
                    if (i === I[0] && col === I[1] && ((-2 * (currentParity % 2) + 1) === 1)) {
                        result = currentPath;
                        return result, true;
                    } else if (V[i][col] !== 0 && currentPath[i][col] === 0) {
                        // Crear un nuevo camino
                        let newPath = currentPath.map(row => row.slice());
                        newPath[i][col] = -2 * (currentParity % 2) + 1; // Alterna paridad

                        // Agregar a la lista de nuevos caminos
                        newPaths.push({ path: newPath, coords: [i, col], parity: currentParity + 1 });
                    }
                }
            }

            // Expandir por columna
            if (currentParity % 2 === 0) { // Paso par
                for (let row = 0; row < v; row++) {
                    if (row === I[0] && j === I[1] && ((-2 * (currentParity % 2) + 1) === 1)) {
                        result = currentPath;
                        return result, true;
                    } else if (V[row][j] !== 0 && currentPath[row][j] === 0) {
                        // Crear un nuevo camino
                        let newPath = currentPath.map(row => row.slice());
                        newPath[row][j] = -2 * (currentParity % 2) + 1; // Alterna paridad

                        // Agregar a la lista de nuevos caminos
                        newPaths.push({ path: newPath, coords: [row, j], parity: currentParity + 1 });
                    }
                }
            }
        }

        // Actualiza caminos
        paths = newPaths;
    }

    return result, false;
}

function matrix_to_adition(M) {
    // Extraer las posiciones y valores de los elementos no nulos de M
    const nonZeroElements = [];
    for (let i = 0; i < M.length; i++) {
        for (let j = 0; j < M[i].length; j++) {
            if (M[i][j] !== 0) {
                nonZeroElements.push([i, j, M[i][j]]);
            }
        }
    }

    // Devolver una función que suma M con otra matriz N
    return function (N) {
        // Crear una copia de N para no modificarla directamente
        const result = N.map(row => row.slice());
        
        // Sumar los elementos no nulos de M a la matriz N
        // Si en algún momento va a crear un elemento negativo, no lo hagas ^-^
        for (const element of nonZeroElements) {
            result[element[0]][element[1]] += element[2];
            if (result[element[0]][element[1]]<0){
                return result, false
            }
        }
        
        return result, true;
    };
}

// Y devolver el conjunto de las matrices dados f y l
function matrices(f,l){
    if (f.length>1 || l.length>1){
        throw new Error('Checkeate las dimensiones heig, v,n>1');
    }
    //Creamos el vértice
    const initialArray = solVerticeFL(f,l);

    //Creamos sus aristas (funcion adicion) (se fía que initialArray es un vértice y por tanto su estela es buena)
    const aristas = primeras_aristas_funcion_adicion(initialArray[1]);
    const n_aristas = aristas.length;
    const initialCoordinates = Array(n_aristas).fill(0)

    const queue = [];
    const visited = new Set();

    // Helper to hash arrays as strings for visited set
    const arrayToString = (arr) => arr.join(',');

    // Start BFS with the initial array
    queue.push({ array: initialArray, coordinates: initialCoordinates });
    visited.add(arrayToString(initialCoordinates));

    const result = [];

    while (queue.length > 0) {
        const { array, coordinates } = queue.shift();

        // Add the current array to the result
        result.push({ array });

        // Try adding each step
        for (let i = 0; i < n_aristas; i++) {
            const newArray = aristas[i](array)
            const newCoordinates = [...coordinates];
            newCoordinates[i] += 1;
        
            // Check if the new array is valid and not visited
            if (newArray[1] && !visited.has(arrayToString(newCoordinates))) {
                queue.push({ array: newArray[0], coordinates: newCoordinates });
                visited.add(arrayToString(newCoordinates));
            }
        }
    }

    return result;
}

//FINALMENTE, THE MOMENT YOU'VE BEEN WAITING FOR: la implementación completa del código que para un fmax, lmax y s dados devuelve el conjunto de matrices que cumplen
//IMPORTANTE: Evitar entradas nulas en fmax o lmax, es ineficiente. 

function matrices_sumaFL(fmax,lmax,s){
    //Edging Cases
    if (fmax.length===1){
        return posibles_f(s,lmax).map(vect => [vect]);
    } else if (lmax.length===1){
        //Traspondremos para ser felices
        return posibles_f(s,fmax).map(vect => vect.map(val => [val]));
    } else if (fmax.length===0 || lmax.length===0){
        //Lol
        return []
    }
    const result = [];
    const f_posible = posibles_f(s,fmax);
    const l_posible = posibles_f(s,lmax);
    for (let i = 0; i<f_posible.length; i++){
        for (let j = 0; j<l_posible.length; j++){
            result.concat(matrices(f_posible[i],l_posible[j]))
        }
    }
}

//TODAS las Aristas de un vértice general "positivas" tangentes a una frontera, algoritmo de musinator (la única parte realmente importante de todo el código)
function find_all_balanced_paths_bis(V, ignoring=(i,j)=>{return false}, options='',optionsargument=[]) {
    let v = V.length;
    let n = V[0].length;
    let A = []; //A de aristas, es el result

    //Encontramos las clases de zig-zag equivalencia (entradas no nulas conectadas por algún zig-zag)
    let Visited = new Set;
    let ZZequivalenceclasses_rows = {};
    let ZZequivalenceclasses_cols = {};
    let currentclass = 0;
    for (let i=0;i<v;i++){
        for (let j=0;j<n;j++){
            if (V[i][j]==0 || Visited.has(i+v*j) || ignoring(i,j)) continue;
            currentclass++;
            Visited.add(i+v*j)
            ZZequivalenceclasses_rows[i]=currentclass;
            ZZequivalenceclasses_cols[j]=currentclass;
            let queue = [];
            queue.push([i,j,0])
            while (queue.length>0){
                const [inew,jnew,parity] = queue.shift();
                for (let ii=0;ii<v;ii++){
                    if (parity==1) break;
                    if (V[ii][jnew]==0 || Visited.has(ii+v*jnew) || ignoring(ii,jnew)) continue;
                    Visited.add(ii+v*jnew)
                    ZZequivalenceclasses_rows[ii]=currentclass;
                    ZZequivalenceclasses_cols[jnew]=currentclass;
                    queue.push([ii,jnew,1])
                }
                for (let jj=0;jj<n;jj++){
                    if (parity==2) break;
                    if (V[inew][jj]==0 || Visited.has(inew+v*jj) || ignoring(inew,jj)) continue;
                    Visited.add(inew+v*jj)
                    ZZequivalenceclasses_rows[inew]=currentclass;
                    ZZequivalenceclasses_cols[jj]=currentclass;
                    queue.push([inew,jj,2])
                }
            }
        }
    }

    // No crear caminos con elementos cuyas aristas asociadas ya hemos encontrado
    // evitar duplicidades en el output, estos serán los menores en el LG.
    let visited = new Set();
    for (i1=0;i1<v;i1++){
        for (j1=0;j1<n;j1++){
            // Verifica que la entrada es válida
            const objective = ZZequivalenceclasses_cols[j1] ? ZZequivalenceclasses_cols[j1] : undefined;
            if (options=='one'){
                [i1,j1]=optionsargument;
                if (!objective) return [];
            } else if (ignoring(i1,j1) || V[i1][j1]!= 0 || !objective) continue; 
            visited.add(i1+v*j1);
            let paths = []; // Lista de caminos activos: {[camino, última coordenada], ...}
        
            // Inicializa el primer camino con el punto inicial
            let initial_path = Array.from({ length: v }, () => new Array(n).fill(0));
            initial_path[i1][j1] = 1; // Marca la posición inicial con un 1
            let zzequiv = new Set();
            if (ZZequivalenceclasses_rows[i1]){
                zzequiv.add(ZZequivalenceclasses_rows[i1])
            }
            const I=[i1,j1];
            paths.push([initial_path, I, 1, zzequiv]); 
            //Incluye camino, coordenadas, paridad y clases de equivalencia con las que conecta
            //Si llegamos a la clase de equivalencia de la columna hemos terminado, si no la hay es que no hay aristas posibles.
            
            while (paths.length>0){
                let new_paths = []; // Nuevos caminos generados en esta iteración
                // Procesa cada camino activo
                for (let p=0;p<paths.length;p++){
                    const current_path_data = paths[p];
                    const current_path = current_path_data[0];
                    const last_coords = current_path_data[1]; // Coordenadas del último cambio
                    const current_parity = current_path_data[2];
                    const current_zzequiv = current_path_data[3];
            
                    const i = last_coords[0];
                    const j = last_coords[1];
            
                    // Expandir por fila
                    if (current_parity == 1){ //Paso impar, añadir -1
                        for (let col=0;col<n;col++){
                            if (visited.has(i+v*col) || ignoring(i,col)) continue;
                            if (current_path[i][col] == 0){
                                if (V[i][col] != 0){
                                    // Crear un nuevo camino
                                    let new_path = current_path.map(row=>[...row]);
                                    new_path[i][col] = -1; // Alterna paridad
                
                                    // Agregar a la lista de nuevos caminos
                                    new_paths.push([new_path, [i, col], 0, current_zzequiv]);
                                } 
                            }
                        }
                    }
            
                    // Expandir por columna
                    if (current_parity == 0){ // Paso par, añadir 1
                        if (j==I[1]){
                            //Congratulaciones volviste a la posición original, has ganado, tienes una arista
                            if (options=='anynonzero'){
                                if (current_path[optionsargument[0]][optionsargument[1]]!=0){
                                    return [current_path];
                                }
                            } else {
                                A.push(current_path);
                                if (options=='one'){
                                    return A;
                                }
                            }
                            continue;
                        }
                        for (let row = 0; row<v;row++){
                            if (visited.has(row+v*j) || ignoring(row,j)) continue;
                            if (current_path[row][j] == 0){
                                if (V[row][j] !== 0){
                                    // Crear un nuevo camino
                                    let new_path = current_path.map(row=>[...row]);
                                    new_path[row][j] = 1; // Alterna paridad
                
                                    // Agregar a la lista de nuevos caminos
                                    new_paths.push([new_path, [row, j], 1,current_zzequiv]);
                                } else if (ZZequivalenceclasses_rows[row]!=undefined & !current_zzequiv.has(objective)){ //Si estás en comunicación a través de los nonulos del vértice con la solución no inventes más ceros
                                    if (current_zzequiv.has(ZZequivalenceclasses_rows[row])) continue; //Observar que si la fila no tiene clase asignada no hay elementos 
                                    // no nulos del vértice de la frontera en dicha fila y por tanto en el siguiente paso no podría añadir un -1 luego ese posible camino se puede ignorar.
                                    // Crear un nuevo camino
                                    let new_path = current_path.map(row=>[...row]);
                                    new_path[row][j] = 1; // Alterna paridad
                                    let new_zzequiv = new Set(current_zzequiv);
                                    new_zzequiv.add(ZZequivalenceclasses_rows[row]);
                                    // Agregar a la lista de nuevos caminos
                                    new_paths.push([new_path, [row, j], 1,new_zzequiv]);
                                } 
                            }
                        }
                    }
                }
            
                // Actualiza caminos
                paths = new_paths;
            }
            if (options=='one'){
                return A;
            }
        }
    }
    return A;
}
