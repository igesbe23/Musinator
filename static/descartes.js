// Crear un contenedor para el gráfico 3D con dimensiones iniciales
            const graphContainer = document.createElement('div');
            graphContainer.id = 'graph-container';
            responseDiv.appendChild(graphContainer);

            // Crear un canvas dentro del contenedor
            const canvas = document.createElement('canvas');
            canvas.id = 'renderCanvas';
            graphContainer.appendChild(canvas);

            // Crear el motor de Babylon.js con el canvas
            const engine = new BABYLON.Engine(canvas, true);
            const scene = new BABYLON.Scene(engine);

            // Fondo negro
            scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

            // Configurar la cámara
            const camera = new BABYLON.ArcRotateCamera(
                "camera",
                BABYLON.Tools.ToRadians(45),
                BABYLON.Tools.ToRadians(45),
                50,
                new BABYLON.Vector3(0, 0, 0),
                scene
            );
            camera.attachControl(canvas, true);

            // Añadir luz
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

            // Añadir ejes de referencia
            const axesSize = 10;
            const makeAxis = (name, dir, color) => {
                const axis = BABYLON.MeshBuilder.CreateLines(
                    name,
                    { points: [BABYLON.Vector3.Zero(), dir.scale(axesSize)] },
                    scene
                );
                const axisMaterial = new BABYLON.StandardMaterial(name + "Mat", scene);
                axisMaterial.emissiveColor = color;
                axis.material = axisMaterial;
            };
            makeAxis("x", BABYLON.Axis.X, new BABYLON.Color3(1, 0, 0));
            makeAxis("y", BABYLON.Axis.Y, new BABYLON.Color3(0, 1, 0));
            makeAxis("z", BABYLON.Axis.Z, new BABYLON.Color3(0, 0, 1));

            // Función para calcular el producto
            function prod(coord, arista) {
                let result = 0;
                for (let k = 0; k < coord.length; k++) {
                    let result_temp = 0;
                    for (let ii = 0; ii < arista.length; ii++) {
                        for (let jj = 0; jj < arista[0].length; jj++) {
                            result_temp += arista[ii][jj] * aristas[k][ii][jj];
                        }
                    }
                    result_temp *= coord[k];
                    result += result_temp;
                }
                return result;
            }

            // Función sigmoide
            function sigmoid(z) {
                return 1 / (1 + Math.exp(-z));
            }

            // Crear un único cubo base
            const baseCube = BABYLON.MeshBuilder.CreateBox("baseCube", { size: 0.5 }, scene);
            baseCube.setEnabled(false); // Ocultar el cubo base

            // Crear instancias de cubos
            const cubeInstances = [];
            for (let i = 0; i < coords.length; i++) {
                const x = prod(coords[i], aristas[0]);
                const y = prod(coords[i], aristas[1]);
                const z = prod(coords[i], aristas[2]);

                // Normalizar los valores RGB al rango [0, 1]
                const r = sigmoid(prod(coords[i], aristas[3]));
                const g = sigmoid(prod(coords[i], aristas[4]));
                const b = sigmoid(prod(coords[i], aristas[5]));

                if (x === 0 && y === 0 && z === 0) continue;

                // Crear una instancia del cubo base
                const cubeInstance = baseCube.createInstance(`cubeInstance_${i}`);
                cubeInstance.position = new BABYLON.Vector3(x, y, z);

                // Asignar material y color
                const cubeMaterial = new BABYLON.StandardMaterial(`mat_${i}`, scene);
                cubeMaterial.emissiveColor = new BABYLON.Color3(r, g, b);
                cubeInstance.material = cubeMaterial;

                cubeInstances.push(cubeInstance);
            }

            // Ajustar el tamaño del canvas al contenedor
            const resizeObserver = new ResizeObserver(() => {
                canvas.width = graphContainer.offsetWidth;
                canvas.height = graphContainer.offsetHeight;
                engine.resize();
            });
            resizeObserver.observe(graphContainer);

            // Función de renderizado
            engine.runRenderLoop(() => {
                scene.render();
            });

//DEL MUSINATOR PROPPER 
[function (N,t=1,neg_idx={},reviewnoneg=false){
        if (reviewnoneg){
            for (const element of nonZeroElements){
                if (N[element[0]][element[1]] + t*element[2] < 0){
                    return false;
                }
            }
        } else{
            for (const element of nonZeroElements){
            // Si en algún momento va a crear un elemento mas negativo que lo indicado en neg_idx
            // (si no estas como clave en neg_idx es porque tienes que ser >= 0), no lo hagas ^-^
            if (neg_idx[JSON.stringify([element[0],element[1]])]){
                if (N[element[0]][element[1]] + t*element[2] < neg_idx[JSON.stringify([element[0],element[1]])]){
                    return false;
                }   
            } else if (N[element[0]][element[1]] + t*element[2] < 0){
                return false;
            }
        }
        }
        return true;
        }
        , 

// Y devolver el conjunto de las matrices dados f y l
//ROTO POR EL CAMBIO EN ADITION NO COPY 
function matrices(f,l){
    if (2>f.length || 2>l.length){
        throw new Error('Checkeate las dimensiones heig, v,n>1');
    }
    if (f.reduce((acc,v) => acc += v,0) !== l.reduce((acc,v) => acc+=v,0)){
        console.log(f,l)
        throw new Error('l y f no suman lo mismo (you re cooked)')
    }
    //Creamos el vértice
    const initialArray = solVerticeFL(f,l);
    //Creamos sus aristas (funcion adicion) (se fía que initialArray es un vértice y por tanto su estela es buena)
    const aristas = primeras_aristas_funcion_adicion_nocopy(initialArray[1]);
    const n_aristas = aristas.length;
    const initialCoordinates = Array(n_aristas).fill(0)

    const queue = [];
    const visited = new Set();

    // Helper to hash arrays as strings for visited set
    const arrayToString = (arr) => JSON.stringify(arr);
    
    // Start BFS with the initial array
    queue.push({ arrayidx: 0, coordinates: initialCoordinates });
    visited.add(arrayToString(initialCoordinates));
    initialArray[0].f = f;
    initialArray[0].l = l;
    const result = [initialArray[0]];

    while (queue.length > 0) {
        const { arrayidx, coordinates } = queue.shift();

        // Try adding each step
        for (let i = 0; i < n_aristas; i++) {
            if (! aristas[i][0](result[arrayidx])) continue;
            // Add the new array to the result
            const newCoordinates = [...coordinates];
            newCoordinates[i] += 1;
        
            // Check if the new array is not visited
            if (!visited.has(arrayToString(newCoordinates))) {
                result.push( JSON.parse(JSON.stringify(result[arrayidx])) );
                result[result.length-1] = aristas[i][1](result[result.length-1]);
                queue.push({ arrayidx: result.length-1, coordinates: newCoordinates });
                visited.add(arrayToString(newCoordinates));
            }
        }
    }
    result.coords = visited;
    result.aristas = aristas;
    result.initialvert = initialArray
    return result;
}

//FINALMENTE, THE MOMENT YOU'VE BEEN WAITING FOR: la implementación completa del código que para un fmax, lmax y s dados devuelve el conjunto de matrices que cumplen

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
    let result = [];
    const f_posible = posibles_f(s,fmax);
    const l_posible = posibles_f(s,lmax);
    for (let i = 0; i<f_posible.length; i++){
        for (let j = 0; j<l_posible.length; j++){
            result = result.concat(matrices(f_posible[i],l_posible[j]));
        }
    }
    return result;
}

function matrices_Lfijo(fmax,lmax){
    const s = lmax.reduce((acc,v) => acc += v,0)
    //Edging Cases
    if (fmax.length===1){
        return [lmax];
    } else if (lmax.length===1){
        //Traspondremos para ser felices
        return fmax.map(val => [val]);
    } else if (fmax.length===0 || lmax.length===0){
        //Lol
        return []
    }
    let result = [];
    const f_posible = posibles_f(s,fmax);
    for (let i = 0; i<f_posible.length; i++){
        result = result.concat(matrices(f_posible[i],lmax));
    }
    return result;
}