// worker.js

//SECCIÓN OPERACIONES RECURRENTES

//rango de una matriz

function rank(matrix) {
    
    // Get the number of rows and columns in the matrix
    const num_rows = matrix.length;
    const num_cols = matrix.length > 0 ? matrix[0].length : 0;
    let rank = 0;

    for (let i = 0; i < num_rows; i++) {
        let pivot_found = false;

        // Iterate over each column of the matrix
        for (let j = 0; j < num_cols; j++) {
            if (matrix[i][j] !== 0) {
                pivot_found = true;
                rank++; // Increment rank
                for (let k = 0; k < num_rows; k++) {
                    if (k !== i) {
                        const ratio = 
                            matrix[k][j] / matrix[i][j];
                        for (let l = 0; l < num_cols; l++) {
                            matrix[k][l] -= ratio * matrix[i][l];
                        }
                    }
                }
                break;
            }
        }
        if (!pivot_found) {
            break;
        }
    }

    return rank;
}

// Helper to hash arrays as strings 
const arrayToString = (arr) => arr.join(',');

//Insert
function insertarOrdenado(arr, num, l = 1) {
    let i = 0;
    // Encontramos la posición adecuada para insertar
    while (i < arr.length && arr[i] < num) {
        i++;
    }
    // Insertamos `num` en la posición correcta `l` veces
    arr.splice(i, 0, ...Array(l).fill(num));
    return arr; // Devolvemos el arreglo modificado
}

//Multicombinatorio
const cacheResultados = new Map(); // Mapa para almacenar los resultados

function multicombinatorio_memorizado(a, b, c, d) {
    // Normalizamos los números (los ordenamos) y creamos una clave única NO SUPERAN 8 LOS VALORES
    let arr = [a,b,c,d].sort();
    const clave = arr[0]+9*arr[1]+81*arr[2]+729*arr[3] >>> 0 // Hash IMPORTANTE, es 9 porque una coordenada es imposible que exceda 8 al ser numero de cartas.

    // Si el resultado ya está en el cache, lo devolvemos directamente
    if (cacheResultados.has(clave)) {
        return cacheResultados.get(clave);
    }

    // Calculamos el resultado y lo almacenamos en el cache
    const resultado = multicombinatorio(a, b, c, d);
    cacheResultados.set(clave, resultado);

    return resultado;
}

//Formas dividir conjunto de elementos distinguibles tamaño a en 4 cajas distinguibles de tamaños b,c,d,a-s en las que no importa el orden
function multicombinatorio(a, b, c, d) {
    const s = b + c + d;
    if (s > a) {
        return 0;
    } else if (s===0){
        return 1;
    }

    function factorial(n, min = 1) {
        let result = 1;
        for (let i = n; i >= min; i--) {
            result *= i;
        }
        return result;
    }

    let numerador = factorial(a, a - s + 1); // (a! / (a-s)!)
    let denominador = factorial(b) * factorial(c) * factorial(d); // b! * c! * d!
    
    return numerador / denominador;
}

function multicombinatorio_memorizado5(a, b, c, d, e, f) {
    // Normalizamos los números (los ordenamos) y creamos una clave única
    let arr = [a,b,c,d,e,f].sort();
    const clave = arr[0]+9*arr[1]+9^2*arr[2]+9^3*arr[3]+9^4*arr[4]+9^5*arr[5] >>> 0

    // Si el resultado ya está en el cache, lo devolvemos directamente
    if (cacheResultados.has(clave)) {
        return cacheResultados.get(clave);
    }

    // Calculamos el resultado y lo almacenamos en el cache
    const resultado = multicombinatorio5(a, b, c, d, e, f);
    cacheResultados.set(clave, resultado);

    return resultado;
}

//Formas dividir conjunto de elementos distinguibles tamaño a en 4 cajas distinguibles de tamaños b,c,d,a-s en las que no importa el orden
function multicombinatorio5(a, b, c, d, e, f) {
    if (a===f){
        return 1
    }

    function factorial(n, min = 0) {
        let result = 1;
        for (let i = n; i > min; i--) {
            result *= i;
        }
        return result;
    }

    let numerador = factorial(a); // (a! / f!)
    let denominador = factorial(b) * factorial(c) * factorial(d) * factorial(e) * factorial(f); // b! * c! * d! * e!
    
    return numerador / denominador;


}

//SECCIÓN RESPUESTA

// Recibir mensaje del hilo principal
self.addEventListener('message', (event) => {
    const { type, manoamiga1, manoamiga2, soymano, id, tiro, deseadas } = event.data;

    // Lógica para calcular las probabilidades 
    if (type === 'initial'){
        let Probabilidades = probabilidad_mus_musipaper(manoamiga1, manoamiga2, soymano, misValoresRed);
        Probabilidades[1] = 'Recuerda que son sólo probabilidades'
        let FtFtIndex = Probabilidades[0].findIndex(Juego => Juego.some(JJuego => (40<JJuego) && (JJuego<60)))
        if (Probabilidades[0][0][0]<0.5 ){
            if (Probabilidades[0][0][1]>90){
                Probabilidades[1] = FrasesChica[Math.floor(Math.random() * FrasesChica.length)]
            } else if (Probabilidades[0][1][2]<10){
                Probabilidades[1] = 'Mus sin verlas'
            } else{
                Probabilidades[1] = FrasesPerder[Math.floor(Math.random() * FrasesPerder.length)]
            }
        } else if (FtFtIndex != -1){
            if (FtFtIndex === 0){
                if (Probabilidades[0][0].findIndex(JJuego => (40<JJuego) && (JJuego<60))==0){
                    Probabilidades[1] = 'Fifti Fifti a Grande'
                } else{
                    Probabilidades[1] = 'Fifti Fifti a Chica'
                }
            } else if (FtFtIndex === 1){
                Probabilidades[1] = 'Fifti Fifti a Pares'
            } else if (FtFtIndex === 2){
                Probabilidades[1] = 'Fifti Fifti a Juego'
            }
        } else if (Probabilidades[0][1][2]>90){
            if (Probabilidades[0][0][0]>95){
                Probabilidades[1] = FrasesGanar[Math.floor(Math.random() * FrasesGanar.length)]
            } else{
                Probabilidades[1] = FrasesPares[Math.floor(Math.random() * FrasesPares.length)]
            }
            
        }
        Probabilidades = [...Probabilidades];
        // Enviar el resultado de vuelta al hilo principal
        self.postMessage({id, Probabilidades});
    } else if (type === 'sequential'){
        let Probabilidades = probabilidad_conmus(manoamiga1, manoamiga2, soymano, tiro, deseadas,  misValores)
        Probabilidades[1] = 'Recuerda que son sólo probabilidades'
        let FtFtIndex = Probabilidades[0].findIndex(Juego => Juego.some(JJuego => (40<JJuego) && (JJuego<60)))
        if (Probabilidades[0][0][0]<0.5 ){
            if (Probabilidades[0][0][1]>90){
                Probabilidades[1] = FrasesChica[Math.floor(Math.random() * FrasesChica.length)]
            } else if (Probabilidades[0][1][2]<10){
                Probabilidades[1] = 'Mus sin verlas'
            } else{
                Probabilidades[1] = FrasesPerder[Math.floor(Math.random() * FrasesPerder.length)]
            }
        } else if (FtFtIndex != -1){
            if (FtFtIndex === 0){
                if (Probabilidades[0][0].findIndex(JJuego => (40<JJuego) && (JJuego<60))==0){
                    Probabilidades[1] = 'Fifti Fifti a Grande'
                } else{
                    Probabilidades[1] = 'Fifti Fifti a Chica'
                }
            } else if (FtFtIndex === 1){
                Probabilidades[1] = 'Fifti Fifti a Pares'
            } else if (FtFtIndex === 2){
                Probabilidades[1] = 'Fifti Fifti a Juego'
            }
        } else if (Probabilidades[0][1][2]>90){
            if (Probabilidades[0][0][0]>95){
                Probabilidades[1] = FrasesGanar[Math.floor(Math.random() * FrasesGanar.length)]
            } else{
                Probabilidades[1] = FrasesPares[Math.floor(Math.random() * FrasesPares.length)]
            }
            
        }
        // Enviar el resultado de vuelta al hilo principal
        self.postMessage({id, Probabilidades});
    }
    
});

const FrasesPerder = ['Compañero, ¡abre el paraguas!','A ver si deja de llover','Juego con Gaitas']
const FrasesPares = ['¡Cómo chopos!']
const FrasesChica = ['Jugador de chica perdedor de mus']
const FrasesGanar = ['les vamos a dar clases a esta pareja','Me juego la Naval Entera','Apriétate a la silla que vamos a levantar esto','Demasiado cortas tiene las patas el gorrión para bailar con la urraca']
const misValores = ['K', '3', 'Q', 'J', '7', '6', '5', '4', '2', '1'];
const misValoresRed = [['K', 'Q', 'J', '7', '6', '5', '4','1'],[8,4,4,4,4,4,4,8]];

//Funciones de comparación

//0 es mano sobre 2 y 3 y 1 es mano sobre 3. 0 y 1 amigos 2 y 3 contrincantes. Valores ha de estar ordenado en orden descendente de grande.
function relorden_musipaper(Cuatrimano, i, j, n_valores, soymano = [], grande = true) {
    for (let k = grande ? 0 : n_valores - 1; grande ? k < n_valores : k >= 0; k += grande ? 1 : -1) {
        if (Cuatrimano[k][i] > Cuatrimano[k][j]) {
            return 1;
        } else if (Cuatrimano[k][i] < Cuatrimano[k][j]) {
            return -1;
        }
    }
    return Array.isArray(soymano) ? 0 : soymano ? 1 : -1;
}

function valor_musipaper(carta) {
    if ([0,1,2].includes(carta)) {
        return 10;
    } else{
        return parseInt(misValoresRed[0][carta]);
    }
}

function relordenJ_musipaper(Cuatrimano,i,j,n_valores,soymano=[]){
    let [Juego_i,Juego_j] = [0,0]
    for (let k=0; k<n_valores; k++){
        Juego_i += valor_musipaper(k)*Cuatrimano[k][i]
        Juego_j += valor_musipaper(k)*Cuatrimano[k][j]
    }
    if (Juego_i < 31 && Juego_j > 30) {
        return -1;
    } else if (Juego_i > 30 && Juego_j < 31) {
        return 1;
    } else if (Juego_i > 30 && Juego_j > 30) {
        if (Juego_i === 31) {
            return Juego_j === 31 ? Array.isArray(soymano) ? 0 : soymano ? 1 : -1 : 1;
        } else if (Juego_i === 32) {
            return Juego_j === 31 ? -1 : Juego_j === 32 ? Array.isArray(soymano) ? 0 : soymano ? 1 : -1 : 1;
        } else {
            return Juego_j === 31 || Juego_j === 32 ? -1 : Juego_i > Juego_j ? 1 : Juego_i === Juego_j ? Array.isArray(soymano) ? 0 : soymano ? 1 : -1 : -1;
        }
    } else {
        return Juego_i > Juego_j ? 1 : Juego_i === Juego_j ? Array.isArray(soymano) ? 0 : soymano ? 1 : -1 : -1;
    }
}

//No asume que las manos tienen 4 elementos. Asegurarse correcto orden de las entradas y correcta inserción de arrays
function relordenP_musipaper(Cuatrimano,i,j,n_valores,soymano=[],longitudmano=4){
    const repetpares_i = {};
    const repetpares_j = {};
    const mitad = longitudmano/2
    for (let k=0; k<n_valores; k++){
        if (Cuatrimano[k][i] < 2) continue;
        const l = Cuatrimano[k][i];
        repetpares_i[l] = l in repetpares_i ? insertarOrdenado(repetpares_i[l],k,l) : Array(l).fill(k);
        if (l > mitad){
            break;
        }
    }
    for (let k=0; k<n_valores; k++){
        if (Cuatrimano[k][j] < 2) continue;
        const l = Cuatrimano[k][j];
        repetpares_j[l] = l in repetpares_j ? insertarOrdenado(repetpares_j[l],k,l) : Array(l).fill(k);
        if (l > mitad){
            break;
        }
    }
    Object.keys(repetpares_i).forEach((clave) =>{
        const reps = Math.floor(repetpares_i[clave].length/clave);
        const lnew = reps*clave;
        if (!(lnew in repetpares_i)){
            repetpares_i[lnew] = []
        }
        if (reps>1){
            repetpares_i[clave].forEach((v,idx) => {
                if (idx%clave===0) {
                    insertarOrdenado(repetpares_i[lnew],v,parseInt(clave))
                    delete repetpares_i[clave]
                }
            });
        }
    });
    Object.keys(repetpares_j).forEach((clave) =>{
        const reps = Math.floor(repetpares_j[clave].length/clave);
        const lnew = reps*clave;
        if (!(lnew in repetpares_j)){
            repetpares_j[lnew] = []
        }
        if (reps>1){
            repetpares_j[clave].forEach((v,idx) => {
                if (idx%clave===0) {
                    insertarOrdenado(repetpares_j[lnew],v,parseInt(clave))
                    delete repetpares_j[clave]
                }
            });
        }
    });
    for (let l=longitudmano; l>1; l--){
        if (l in repetpares_i){
            if (!(l in repetpares_j)){
                return 1
            } else{
                for (let i = 0; i < repetpares_i[l].length; i++) {
                    if (repetpares_i[l][i] < repetpares_j[l][i]) {
                        return 1;  // Sale de la función completamente
                    } else if (repetpares_i[l][i] > repetpares_j[l][i]) {
                        return -1;
                    }
                }
                return Array.isArray(soymano) ? 0 : soymano ? 1 : -1 
            }
            
        } else if (l in repetpares_j){
            return -1
        }
    }
}

//Funcion que calcula si ganas o pierdes en la configuracion respectiva puesta en forma de matriz columnas: 
// fmax,[4-mano_amiga1.length,4-mano_amiga2.length,4,4,n_cartas_rest]
function actualizar_densidad(Cuatrimano,Juegos_Gano,Juegos_Pierdo,mano_amiga1_indeces,mano_amiga2_indeces,n_valores,soymano,fmax,valores=misValoresRed,cuatrimanostotales=1){
    const newFrec = valores[0].reduce((acc, _, i) => acc = acc * multicombinatorio5(fmax[i], Cuatrimano[i][0], Cuatrimano[i][1], Cuatrimano[i][2], Cuatrimano[i][3], Cuatrimano[i][4]),1)
    let Cuatrimano_temp = Cuatrimano.map(row => row.slice());
    if (cuatrimanostotales === 0){
        console.log('hola1')
        console.log(mano_amiga1_indeces)
        console.log(mano_amiga2_indeces)
        console.log(Cuatrimano_temp)
        console.log(fmax)
        console.log(newFrec)
    }

    for(let i=0; i<n_valores; i++){
        Cuatrimano_temp[i][0] += mano_amiga1_indeces[i];
        Cuatrimano_temp[i][1] += mano_amiga2_indeces[i];
    }
    

    //Rehacemos las relaciones de orden
    //Claro, ahora tenemos que realizar casuística

    let a1e1 = relorden_musipaper(Cuatrimano_temp,0,2,n_valores,soymano);
    let a2e2 = relorden_musipaper(Cuatrimano_temp,1,3,n_valores,soymano);
    let e1a2 = relorden_musipaper(Cuatrimano_temp,2,1,n_valores,true);
    let a1e2 = relorden_musipaper(Cuatrimano_temp,0,3,n_valores,true);
    
    if ((a1e1 >= 0 && a1e2 >= 0) || (e1a2 === -1 && a2e2 >= 0)) {
        Juegos_Gano[0][0] += newFrec;
    } else {
        Juegos_Pierdo[0][0] += newFrec;
    }

    a1e1 = relorden_musipaper(Cuatrimano_temp,0,2,n_valores,soymano,false);
    a2e2 = relorden_musipaper(Cuatrimano_temp,1,3,n_valores,soymano,false);
    e1a2 = relorden_musipaper(Cuatrimano_temp,2,1,n_valores,true,false);
    a1e2 = relorden_musipaper(Cuatrimano_temp,0,3,n_valores,true,false);
    
    if ((a1e1 >= 0 && a1e2 >= 0) || (e1a2 === -1 && a2e2 >= 0)) {
        Juegos_Gano[0][1] += newFrec;
    } else {
        Juegos_Pierdo[0][1] += newFrec;
    }
    
    a1e1 = relordenP_musipaper(Cuatrimano_temp,0,2,n_valores,soymano);
    a2e2 = relordenP_musipaper(Cuatrimano_temp,1,3,n_valores,soymano);
    e1a2 = relordenP_musipaper(Cuatrimano_temp,2,1,n_valores,true);
    a1e2 = relordenP_musipaper(Cuatrimano_temp,0,3,n_valores,true);

    let mano_enemiga1_pares_bool = valores[0].some((_,i) =>  Cuatrimano_temp[i][2]>1)
    let mano_enemiga2_pares_bool = valores[0].some((_,i) =>  Cuatrimano_temp[i][3]>1)
    
    if (mano_enemiga1_pares_bool && !mano_enemiga2_pares_bool) {
        if ((a1e1 >= 0) || (e1a2 === -1)) {
            Juegos_Gano[1][0] += newFrec;
        } else {
            Juegos_Pierdo[1][0] += newFrec;
        }
    } else if (mano_enemiga2_pares_bool && !mano_enemiga1_pares_bool){
        if ((a1e2 >= 0) || (a2e2 >= 0)) {
            Juegos_Gano[1][1] += newFrec;
        } else {
            Juegos_Pierdo[1][1] += newFrec;
        }
    } else if (mano_enemiga1_pares_bool && mano_enemiga2_pares_bool) {
        if ((a1e1 >= 0 && a1e2 >= 0) || (e1a2 === -1 && a2e2 >= 0)) {
            Juegos_Gano[1][2] += newFrec;
        } else {
            Juegos_Pierdo[1][2] += newFrec;
        }
    } 
    
    a1e1 = relordenJ_musipaper(Cuatrimano_temp,0,2,n_valores,soymano);
    a2e2 = relordenJ_musipaper(Cuatrimano_temp,1,3,n_valores,soymano);
    e1a2 = relordenJ_musipaper(Cuatrimano_temp,2,1,n_valores,true);
    a1e2 = relordenJ_musipaper(Cuatrimano_temp,0,3,n_valores,true);
    
    let mano_enemiga1_juego = 0;
    let mano_enemiga2_juego = 0;
    
    for (let k=0; k<n_valores; k++){
        mano_enemiga1_juego += valor_musipaper(k)*Cuatrimano_temp[k][2]
        mano_enemiga2_juego += valor_musipaper(k)*Cuatrimano_temp[k][3]
    }

    if (mano_enemiga1_juego > 30 && mano_enemiga2_juego < 31) {
        if ((a1e1 >= 0) || (e1a2 < 0)) {
            Juegos_Gano[2][0] += newFrec;
        } else {
            Juegos_Pierdo[2][0] += newFrec;
        }
    } else if (mano_enemiga2_juego > 30 && mano_enemiga1_juego < 31) {
        if ((a1e2 >= 0) || (a2e2 >= 0)) {
            Juegos_Gano[2][1] += newFrec;
        } else {
            Juegos_Pierdo[2][1] += newFrec;
        }
    } else if (mano_enemiga1_juego > 30 && mano_enemiga2_juego > 30) {
        if ((a1e1 >= 0 && a1e2 >= 0) || (e1a2 === -1 && a2e2 >= 0)) {
            Juegos_Gano[2][2] += newFrec;
        } else {
            Juegos_Pierdo[2][2] += newFrec;
        }
    } else if (mano_enemiga1_juego < 31 && mano_enemiga2_juego < 31) {
        if ((a1e1 >= 0 && a1e2 >= 0) || (e1a2 === -1 && a2e2 >= 0)) {
            Juegos_Gano[2][3] += newFrec;
        } else {
            Juegos_Pierdo[2][3] += newFrec;
        }
    }
    //Nota: Podríamos probar con lógica bayesiana para evitarnos calcular frecuenciaPtotal y frecuenciaJtotal
}

//Fin funciones de comparación

//CLAVES DE COORDENADAS
function getKey(coord) {
    let key = 0n;
    for (let val of coord) {
        if (val>9){
            throw new Error('Hay un punto con coordenadas demasiado grandes',coord);
        }
        key = key * 10n + BigInt(val);
    }
    return key;
}

class Uint8ArrayOf5x8Array {
    constructor(n){
        if (n>2500000){
            throw new Error('Pérdida de precision para arrays > 2500000, has metido:', n) 
        }
        this.array = new Uint8Array(n*8*5);
    }
    element(idx){
        //Devuelve el array guardado en la posición idx
        //idx * 8 * 5 es donde empieza
        return Array.from({length: 8},(_,i) => 
            Array.from({length: 5}, (_,j) => 
                this.array[40*idx+5*i+j]
            )
        )
    };
    modify_value(idx,i,j,value){
        //Modifica el array en la posición idx, i, j
        this.array[40*idx+5*i+j]=value;
    }
    modify_array(idx,array){
        //Cambia el array en la posición idx
        let bool=false
        for (let i=0; i<8; i++){
            for (let j=0; j<5; j++){
                if (this.array[40*idx+5*i+j]!=0){
                    bool=true
                }
                this.array[40*idx+5*i+j]=array[i][j];
            }
        }
        if (bool){
            console.warn('Sobreescribiendo el siguiente array sobre valor no nulo',array);
        }
    }
}

class TreeUint8ArrayOf5x8Array {
    constructor(arraylength,treewidth){
        this.tree = {};  
        this.arraylength = arraylength;      
        for (let i=0;i<treewidth;i++){
            this.tree[i]= new Uint8ArrayOf5x8Array(arraylength);
        }
    }
    element(idx){
        //Devuelve el array guardado en la posición idx
        const sidx = idx % this.arraylength;
        return this.tree[Math.round((idx-sidx)/this.arraylength)].element(sidx)
    };
    modify_value(idx,i,j,value){
        const sidx = idx % this.arraylength;
        //Modifica el array en la posición idx, i, j
        this.tree[Math.round((idx-sidx)/this.arraylength)].modify_value(sidx,i,j,value);
    }
    modify_array(idx,array){
        //Cambia el array en la posición idx
        const sidx = idx % this.arraylength;
        this.tree[Math.round((idx-sidx)/this.arraylength)].modify_array(sidx,array);
    }
}

class Uint8ArrayOfArray {
    constructor(n,nested_array_size){
        if (n*nested_array_size>100000000){
            throw new Error('Pérdida de precision para arrays > 100000000, has metido:', n) 
        }
        this.array = new Uint8Array(n*nested_array_size);
        this.nested_array_size = nested_array_size;
    }
    element(idx){
        //Devuelve el array guardado en la posición idx
        //idx * this.nested_array_size es donde empieza
        return Array.from({length: this.nested_array_size},(_,i) => 
            this.array[this.nested_array_size*idx+i]
        )
    };
    modify_value(idx,i,value){
        //Modifica el array en la posición idx, i
        this.array[this.nested_array_size*idx+i]=value;
    }
    modify_array(idx,array){
        //Cambia el array en la posición idx
        let bool=false;
        for (let i=0; i<this.nested_array_size; i++){
            if (this.array[this.nested_array_size*idx+i]!=0){
                bool = true;
            }
            this.array[this.nested_array_size*idx+i]=array[i];
        }
        if (bool){
            console.warn('Sobreescribiendo el siguiente array sobre valor no nulo',array);
        }
    }
}

class TreeUint8ArrayOfArray{
    constructor(arraylength,treewidth,nested_array_size){
        this.tree = {};  
        this.arraylength = arraylength;      
        this.nested_array_size = nested_array_size;
        for (let i=0;i<treewidth;i++){
            this.tree[i]= new Uint8ArrayOfArray(arraylength,nested_array_size);
        }
    }
    element(idx){
        //Devuelve el array guardado en la posición idx
        const sidx = idx % this.arraylength;
        return this.tree[Math.round((idx-sidx)/this.arraylength)].element(sidx)
    };
    modify_value(idx,i,value){
        //Modifica el array en la posición idx, i
        const sidx = idx % this.arraylength;
        this.tree[Math.round((idx-sidx)/this.arraylength)].modify_value(sidx,i,value);
    }
    modify_array(idx,array){
        //Cambia el array en la posición idx
        const sidx = idx % this.arraylength;
        this.tree[Math.round((idx-sidx)/this.arraylength)].modify_array(sidx,array);
    }
}

class TreeUint8Array{
    constructor(arraylength,treewidth){
        this.tree = {};  
        this.arraylength = arraylength;      
        for (let i=0;i<treewidth;i++){
            this.tree[i]= new Uint8Array(arraylength);
        }
    }
    element(idx){
        //Devuelve el valor guardado en la posición idx
        const sidx = idx % this.arraylength;
        return this.tree[Math.round((idx-sidx)/this.arraylength)][sidx]
    };
    modify_value(idx,value){
        //Modifica el valor en la posición idx
        const sidx = idx % this.arraylength;
        if (this.tree[Math.round((idx-sidx)/this.arraylength)][sidx]!=0){
            console.warn('Sobreescribiendo el siguiente array sobre valor no nulo',array);
        }
        this.tree[Math.round((idx-sidx)/this.arraylength)][sidx]=value;
    }
}
//Musipaper

function probabilidad_mus_musipaper(mano_amiga1,mano_amiga2=[],soymano=true,valores = misValoresRed){
    mano_amiga1 = mano_amiga1.split('');
    mano_amiga2 = mano_amiga2.split('');
    mano_amiga1 = mano_amiga1.map(v => v=='3' ? 'K' : v=='2' ? '1' : v);
    mano_amiga2 = mano_amiga2.map(v => v=='3' ? 'K' : v=='2' ? '1' : v);
    console.log(mano_amiga1)
    console.log(mano_amiga2)
    const n_valores = valores[0].length;
    const fmax = valores[0].map((v,i) => valores[1][i] - mano_amiga1.reduce((acc,vv) => acc += (vv==v ? 1: 0),0) - mano_amiga2.reduce((acc,vv) => acc += (vv==v ? 1: 0),0));
    console.log(fmax);
    const n_cartas_rest = fmax.reduce((acc,v) => acc += v,0)-16+mano_amiga1.length+mano_amiga2.length;
    const mano_amiga1_indeces = caracteres_to_indeces(mano_amiga1,valores[0]);
    const mano_amiga2_indeces = caracteres_to_indeces(mano_amiga2,valores[0]);
    // Ahora voy a recorrer el poliedro "agrandado" de manos posibles
    //Creamos el vértice expandido
    const vertice_obj = solVertice_extend_FL(fmax,[4-mano_amiga1.length,4-mano_amiga2.length,4,4,n_cartas_rest]);
    //Creamos sus aristas (funcion adicion) (se fía que initialArray es un vértice y por tanto su estela es buena)
    const Aristas = primeras_aristas_funcion_adicion_nocopy(vertice_obj.estela,vertice_obj.neg_idx);
    let Juegos_Gano=[[0,0],[0,0,0],[0,0,0,0]];
    let Juegos_Pierdo=[[0,0],[0,0,0],[0,0,0,0]];
    //Funfact para medir cuántas hay
    let cuatrimanostotales= 0;

    //Musipaper! Hay que optimizar el procedimiento para reducir la "dimensionalidad" y en general reducir la parte del poliedro que hace falta visitar (uso de simetrias, tiene muchas)
    //Implementa BFS con lista circular como queue
    let Vertice = vertice_obj.vertice;
    let arrayqueuesize = 100000; //1.000.000
    let treewidth = 100;
    let queuesize = Number(BigInt(arrayqueuesize)*BigInt(treewidth))
    let arrayqueue = new TreeUint8ArrayOf5x8Array(arrayqueuesize,treewidth); //Numero de coordenadas enteras en el simplice con vértices permutaciones de [9,0,...(28 coordeanads)...,0] es de 94.143.280<100.000.000, podría bajarse varios ordenes con mejores estimaciones,
    let sizequeue = new TreeUint8Array(arrayqueuesize,treewidth);
    let coordqueue = new TreeUint8ArrayOfArray(arrayqueuesize,treewidth,Aristas.length);
    // es un upperbound exagerado al tamaño de la seccion || ||_1 = algo de un poliedro en la piramide ||coordenadas||_1<= 9 a la que pertenece nuestro poliedro, por si acaso. (9 porque puede que se permita -1 en alguna entrada)
    let head = 0, tail = 1;
    let coord_init = new Uint8Array(Aristas.length).fill(0);   
    arrayqueue.modify_array(head,Vertice);
    coordqueue.modify_array(head,coord_init);
    sizequeue.modify_value(head,0);

    let norm=0;
    let Visited = new Set;
    let dist_head_tail = 1;

    while (dist_head_tail>0){
        const array = arrayqueue.element(head);
        const coord = coordqueue.element(head);
        const suma = sizequeue.element(head);

        head = (head +1) % queuesize;
        dist_head_tail--;
        if (suma>norm){
            norm = suma;
            Visited.clear();
        } else if (suma < norm){
            throw new Error('No recorre de forma ordenada el poliedro');
        }
        for (let i = 0; i < Aristas.length; i++) {
            let new_coord = new Uint8Array(coord);
            new_coord[i] += 1;
            if (new_coord.length != Aristas.length){
                throw new Error('Las coordenadas están cambiando de tamaño');
            }
            const key = getKey(new_coord);
            if (!Visited.has(key)){ 
                if (Aristas[i][0](array,1,vertice_obj.neg_idx,true)){
                    const array_new = Aristas[i][1](array);
                    //array_new es un relleno posible 
                    actualizar_densidad(array_new,Juegos_Gano,Juegos_Pierdo,mano_amiga1_indeces,mano_amiga2_indeces,n_valores,soymano,fmax,valores,cuatrimanostotales);
                    cuatrimanostotales++;
                    arrayqueue.modify_array(tail,array_new);
                    coordqueue.modify_array(tail,new_coord);
                    sizequeue.modify_value(tail,suma+1);
                    tail = (tail +1) % queuesize;
                    dist_head_tail++;
                    Visited.add(key);
                } else if (Aristas[i][0](array,1,vertice_obj.neg_idx)){
                    const array_new = Aristas[i][1](array);
                    arrayqueue.modify_array(tail,array_new);
                    coordqueue.modify_array(tail,new_coord);
                    sizequeue.modify_value(tail,suma+1);
                    tail = (tail +1) % queuesize;
                    dist_head_tail++;
                    Visited.add(key);
                }
            } 
        }
        if (dist_head_tail>queuesize){
            throw new Error('El perro se mordió la cola, insuficiente longitud de lista circular: ',queuesize)
        }
    }
    console.log('adiós')
    const result = [Juegos_Gano.map((Juego,Index) => Juego.map((ganadas, index) => 100*ganadas/(ganadas + Juegos_Pierdo[Index][index]))),true,cuatrimanostotales];
    return result;
}


function caracteres_to_indeces(L,valores = misValores){
    const result = Array(valores.length).fill(0);
    for (const letra of L){
        result[valores.findIndex(v => v==letra)] += 1;
    }
    return result;
}

//mano_amiga1 es la mano después de mus, mano_amiga2 es las cartas de la mano amiga 2 q conoces se ha quedado de antes del mus
function probabilidad_conmus(mano_amiga1,mano_amiga2=[],soymano=true,tiro,cartasDeseadas=['K','3'],valores=misValores){
    mano_amiga1 = mano_amiga1.split('')
    mano_amiga2 = mano_amiga2.split('')
    tiro = tiro.split('')
    const cartasDeseadasIndeces = caracteres_to_indeces(cartasDeseadas.split(''))
    console.log(cartasDeseadas)
    console.log(valores);
    const fmax = valores.map((v,i) => 4 - mano_amiga1.reduce((acc,vv) => acc += (vv==v ? 1: 0),0) - mano_amiga2.reduce((acc,vv) => acc += (vv==v ? 1: 0),0) - tiro.reduce((acc,vv) => acc += (vv==v ? 1: 0),0))
    console.log(fmax);
    const FrecuenciasPostMusTriosdeManos = new Map();
    const FrecuenciasPreMusTriosdeManos = new Map();
    const ManosReducidasDeManosRellenasDeseadas = new Map();
    const n_valores = valores.length;
    fmax.forEach(v => {
        if (v<0){
            throw new Error('Hay demasiados',v)
        }
    })
    const fdeseados = Array(valores.length).fill(0).map((v,i) => cartasDeseadasIndeces[i] ===1 ? fmax[i] : 0);
    const fnodeseados =  Array(valores.length).fill(0).map((v,i) => cartasDeseadasIndeces[i] ===0 ? fmax[i] : 0);
    const point_cartasdeseadas = {};
    const point_cartasnodeseadas = {};
    let k=0;
    let r=0;
    for (let i=0; i<valores.length; i++){
        if (fdeseados[i]!==0){
            point_cartasdeseadas[k] = i;
            k++
        } else if (fmax[i]!==0){
            point_cartasnodeseadas[r] = i;
            r++
        }
    }
    const n_cartasdeseadas = Object.keys(point_cartasdeseadas).length;
    const n_cartasnodeseadas = Object.keys(point_cartasnodeseadas).length;
    const smax = Math.min(fdeseados.reduce((acc, v) => acc + v, 0),12-mano_amiga2.length);
    const n_disponiblesma2 = 4-mano_amiga2.length;
    console.log(smax)

    //Para cada suma total de cartas en manos reducidas... A recorrer! (ATENCIÓN s tiene que ir ascendiendo para asegurar más eficiencia en el cálculo de probabilidades post)
    for (let s=0; s<=smax; s++){
        const Triosmanosreducidas_indeces = matrices_sumaFL(fdeseados,[n_disponiblesma2,4,4],s);
        Triosmanosreducidas_indeces.forEach((TrimanoIndeces,idx) =>{
            //Para cada trio de manos calculamos su frecuencia natural antes de mus, no hay mus completamente negro computacionalmente (tendrá probabilidad 0).
            TrimanoIndeces.probabilidad_red = 1;
            //Calculamos la primera mitad de la frecuencia (PARA PROBABILIDAD PRE-1ºMUS)
            for (let i = 0; i<n_cartasdeseadas; i++){
                //Teniendo fdeseados[ii] elementos, de cuántas formas pueden repartirse en las tres cajas distinguibles (manos) sin importar el orden, conociendo su tamaño --> Multicombinatorio (fdeseados[ii] : iim2, iime1, iime2, fdeseados[ii]-iim2-iime1-iime2)
                ii = point_cartasdeseadas[i];
                if (TrimanoIndeces.f[ii] === 0) continue;
                TrimanoIndeces.probabilidad_red *= multicombinatorio_memorizado(fdeseados[ii],TrimanoIndeces[ii][0],TrimanoIndeces[ii][1],TrimanoIndeces[ii][2]);
                if (TrimanoIndeces.probabilidad_red < 0){
                    throw new Error('1º Cálculo para probabilidad premus mano reducida', TrimanoIndeces, 'sale negativo', TrimanoIndeces.probabilidad_red);
                }
            }
            TrimanoIndeces.adicion = matrix_to_adition(TrimanoIndeces);
            TrimanoIndeces.identificador = Array(n_cartasdeseadas).fill(0).map((v,i) => TrimanoIndeces.f[point_cartasdeseadas[i]]);
            //Recorremos sus rellenos posibles
            const Triosmanosrellenas_indeces = matrices_Lfijo(fnodeseados,[n_disponiblesma2-TrimanoIndeces.l[0],4-TrimanoIndeces.l[1],4-TrimanoIndeces.l[2]]);
            Triosmanosrellenas_indeces.forEach((TriosmanorellenaIndices,iidx) =>{
                TriosmanorellenaIndices.probabilidad_red = TrimanoIndeces.probabilidad_red;
                for (let j = 0; j<n_cartasnodeseadas; j++){
                    jj = point_cartasnodeseadas[j];
                    if (TriosmanorellenaIndices.f[jj] === 0) continue;
                    TriosmanorellenaIndices.probabilidad_red *= multicombinatorio_memorizado(fnodeseados[jj],TriosmanorellenaIndices[jj][0],TriosmanorellenaIndices[jj][1],TriosmanorellenaIndices[jj][2]);
                    if (TriosmanorellenaIndices.probabilidad_red < 0){
                        throw new Error('2º Cálculo para probabilidad premus mano reducida', TriosmanorellenaIndices, 'sale negativo', TriosmanorellenaIndices.probabilidad_red);
                    }
                }
                const FullTriosmanorellenaIndices = TrimanoIndeces.adicion(TriosmanorellenaIndices)[0];  
                FullTriosmanorellenaIndices.probabilidad_red = TriosmanorellenaIndices.probabilidad_red
                const clave = JSON.stringify(FullTriosmanorellenaIndices)
                FrecuenciasPreMusTriosdeManos.set(clave,FullTriosmanorellenaIndices.probabilidad_red);
                if (!FrecuenciasPostMusTriosdeManos.has(clave)){
                    FrecuenciasPostMusTriosdeManos.set(clave,0)
                }
                //El identificador tiene la fdeseadas correspondiente a la trimano, el otro tiene la fnodeseadas. 
                ManosReducidasDeManosRellenasDeseadas.set(clave,[TrimanoIndeces.identificador,TriosmanorellenaIndices.f])
                FrecuenciasPreMusTriosdeManos.forEach((frec,TrimanoIndecesString) =>{
                    //Actualizo MI frecuencia Post MUS si mi trimano pudo surgir de su trimano
                    if (ManosReducidasDeManosRellenasDeseadas.get(TrimanoIndecesString)[0].every((v,i) => v>=TrimanoIndeces.identificador[i])){
                        //Sabemos que se han tirado total - s cartas, por lo que hay 40 - total + s cartas en la baraja. Tenemos que calcular la probabilidad de obtener esas cartas otra vez con multiconjuntos. 
                        //Como para cada trimano el nº de cartas tiradas es distinto, depende de s, tenemos que el espacio muestral no es constante como ocurría con la probabilidad pre-mus. Por lo que no podemos hacer
                        //el truco de no dividir entre el tamaño del espacio muestral. Para que esa división salga más precisa vamos a multiplicar por la probabilidad_red antes en vez de lo último, sería hacer lo siguiente:
                        let newFrec = frec;
                        for (let j = 0; j<n_cartasnodeseadas; j++){
                            jj = point_cartasnodeseadas[j];
                            if (ManosReducidasDeManosRellenasDeseadas.get(TrimanoIndecesString)[1][jj] === 0) continue;
                            newFrec *= multicombinatorio_memorizado(fnodeseados[jj]-ManosReducidasDeManosRellenasDeseadas.get(TrimanoIndecesString)[1][jj],TriosmanorellenaIndices[jj][0],TriosmanorellenaIndices[jj][1],TriosmanorellenaIndices[jj][2]);
                            if (newFrec < 0){
                                throw new Error('2º Cálculo para probabilidad premus mano reducida', TriosmanorellenaIndices, 'sale negativo', TriosmanorellenaIndices.probabilidad_red);
                            } else if (newFrec === 0){
                                break;
                            }
                        }
                        for (let j = 0; j<n_cartasdeseadas; j++){
                            jj = point_cartasdeseadas[j];
                            if (ManosReducidasDeManosRellenasDeseadas.get(TrimanoIndecesString)[0][j] === 0) continue;
                            newFrec *= multicombinatorio_memorizado(fdeseados[jj]-ManosReducidasDeManosRellenasDeseadas.get(TrimanoIndecesString)[0][j],TriosmanorellenaIndices[jj][0],TriosmanorellenaIndices[jj][1],TriosmanorellenaIndices[jj][2]);
                            if (newFrec < 0){
                                throw new Error('2º Cálculo para probabilidad premus mano reducida', TriosmanorellenaIndices, 'sale negativo', newFrec);
                            } else if (newFrec === 0){
                                break;
                            }
                        }
                        FrecuenciasPostMusTriosdeManos.set(clave,FrecuenciasPostMusTriosdeManos.get(clave) + newFrec);
                    } 
                    //Actualizo SU frecuencia Post MUS si su trimano pudo surgir de mi trimano
                    if (ManosReducidasDeManosRellenasDeseadas.get(TrimanoIndecesString).every((v,i) => v<=TrimanoIndeces.identificador[i])){
                        let newFrec = FullTriosmanorellenaIndices.probabilidad_red;
                        const TrimanoIndecesStringDeString = JSON.parse(TrimanoIndecesString);
                        for (let j = 0; j<n_cartasnodeseadas; j++){
                            jj = point_cartasnodeseadas[j];
                            if (FullTriosmanorellenaIndices.f[jj] === 0) continue;
                            newFrec *= multicombinatorio_memorizado(fnodeseados[jj]-FullTriosmanorellenaIndices.f[jj],TrimanoIndecesStringDeString[jj][0],TrimanoIndecesStringDeString[jj][1],TrimanoIndecesStringDeString[jj][2]);
                            if (newFrec < 0){
                                throw new Error('2º Cálculo para probabilidad premus mano reducida', TrimanoIndecesStringDeString, 'sale negativo', newFrec);
                            } else if (newFrec === 0){
                                break;
                            }
                        }
                        for (let j = 0; j<n_cartasdeseadas; j++){
                            jj = point_cartasdeseadas[j];
                            if (TrimanoIndeces.identificador[j] === 0) continue;
                            newFrec *= multicombinatorio_memorizado(fdeseados[jj]-TrimanoIndeces.identificador[j],TrimanoIndecesStringDeString[jj][0],TrimanoIndecesStringDeString[jj][1],TrimanoIndecesStringDeString[jj][2]);
                            if (newFrec < 0){
                                throw new Error('2º Cálculo para probabilidad premus mano reducida', TrimanoIndecesStringDeString, 'sale negativo', newFrec);
                            } else if (newFrec === 0){
                                break;
                            }
                        }
                        FrecuenciasPostMusTriosdeManos.set(TrimanoIndecesString,FrecuenciasPostMusTriosdeManos.get(TrimanoIndecesString) + newFrec);
                    }
                })
            });
        });
    }
    //Corremos el código que cuenta victorias
    const Juegos_Gano=[[0,0],[0,0,0],[0,0,0,0]]
    const Juegos_Pierdo=[[0,0],[0,0,0],[0,0,0,0]]
    console.log(FrecuenciasPostMusTriosdeManos.length)
    FrecuenciasPostMusTriosdeManos.forEach((TrimanoIndecesString) =>{
        const frecuencia = FrecuenciasPostMusTriosdeManos.get(TrimanoIndecesString)
        //Primero frecuencia luego desestringizar

        const TrimanoIndeces = JSON.parse(TrimanoIndecesString)
        
        mano_amiga2 = mano_amiga2.concat(Array(n_valores).fill(0).map((v,i) => TrimanoIndeces[i][0]).reduce((acc,v,i) => acc.concat(Array(v).fill(valores[i])),[]))
        const mano_amiga2_juego = mano_amiga2.reduce((acc, i) => acc + valor(i), 0)
        const mano_enemiga1 = Array(n_valores).fill(0).map((v,i) => TrimanoIndeces[i][1]).reduce((acc,v,i) => acc.concat(Array(v).fill(valores[i])),[]);
        const mano_enemiga2 = Array(n_valores).fill(0).map((v,i) => TrimanoIndeces[i][2]).reduce((acc,v,i) => acc.concat(Array(v).fill(valores[i])),[]);
        const mano_enemiga1_juego = mano_enemiga1.reduce((acc, i) => acc + valor(i), 0);
        const mano_enemiga2_juego = mano_enemiga2.reduce((acc, i) => acc + valor(i), 0);
        //Claro, ahora tenemos que realizar casuística
        
        let a1e1 = relorden(mano_amiga1, mano_enemiga1, soymano);
        let a2e2 = relorden(mano_amiga2, mano_enemiga2, soymano);
        let e1a2 = relorden(mano_enemiga1, mano_amiga2, soymano);
        let a1e2 = relorden(mano_amiga1, mano_enemiga2, soymano);
        
        if ((a1e1 >= 0 && a1e2 >= 0) || (e1a2 === -1 && a2e2 >= 0)) {
            Juegos_Gano[0][0] += frecuencia;
        } else {
            Juegos_Pierdo[0][0] += frecuencia;
        }

        a1e1 = relorden(mano_amiga1, mano_enemiga1, soymano, false);
        a2e2 = relorden(mano_amiga2, mano_enemiga2, soymano, false);
        e1a2 = relorden(mano_enemiga1, mano_amiga2, soymano, false);
        a1e2 = relorden(mano_amiga1, mano_enemiga2, soymano, false);
        
        if ((a1e1 >= 0 && a1e2 >= 0) || (e1a2 === -1 && a2e2 >= 0)) {
            Juegos_Gano[0][1] += frecuencia;
        } else {
            Juegos_Pierdo[0][1] += frecuencia;
        }
        
        a1e1 = relordenP(mano_amiga1, mano_enemiga1, soymano);
        a2e2 = relordenP(mano_amiga2, mano_enemiga2, soymano);
        e1a2 = relordenP(mano_enemiga1, mano_amiga2, soymano);
        a1e2 = relordenP(mano_amiga1, mano_enemiga2, soymano);

        let mano_enemiga1_pares_bool = repet(mano_enemiga1)
        let mano_enemiga2_pares_bool = repet(mano_enemiga2)
        
        if (mano_enemiga1_pares_bool && !mano_enemiga2_pares_bool) {
            if ((a1e1 >= 0) || (e1a2 === -1)) {
                Juegos_Gano[1][0] += frecuencia;
            } else {
                Juegos_Pierdo[1][0] += frecuencia;
            }
        } else if (mano_enemiga2_pares_bool && !mano_enemiga1_pares_bool){
            if ((a1e2 >= 0) || (a2e2 >= 0)) {
                Juegos_Gano[1][1] += frecuencia;
            } else {
                Juegos_Pierdo[1][1] += frecuencia;
            }
        } else if (mano_enemiga1_pares_bool && mano_enemiga2_pares_bool) {
            if ((a1e1 >= 0 && a1e2 >= 0) || (e1a2 === -1 && a2e2 >= 0)) {
                Juegos_Gano[1][2] += frecuencia;
            } else {
                Juegos_Pierdo[1][2] += frecuencia;
            }
        } 
        
        a1e1 = relordenJ(mano_amiga1_juego, mano_enemiga1_juego, soymano);
        a2e2 = relordenJ(mano_amiga2_juego, mano_enemiga2_juego, soymano);
        e1a2 = relordenJ(mano_enemiga1_juego, mano_amiga2_juego, soymano);
        a1e2 = relordenJ(mano_amiga1_juego, mano_enemiga2_juego, soymano);
        
        if (mano_enemiga1_juego > 30 && mano_enemiga2_juego < 31) {
            if ((a1e1 >= 0) || (e1a2 < 0)) {
                Juegos_Gano[2][0] += frecuencia;
            } else {
                Juegos_Pierdo[2][0] += frecuencia;
            }
        } else if (mano_enemiga2_juego > 30 && mano_enemiga1_juego < 31) {
            if ((a1e2 >= 0) || (a2e2 >= 0)) {
                Juegos_Gano[2][1] += frecuencia;
            } else {
                Juegos_Pierdo[2][1] += frecuencia;
            }
        } else if (mano_enemiga1_juego > 30 && mano_enemiga2_juego > 30) {
            if ((a1e1 >= 0 && a1e2 >= 0) || (e1a2 === -1 && a2e2 >= 0)) {
                Juegos_Gano[2][2] += frecuencia;
            } else {
                Juegos_Pierdo[2][2] += frecuencia;
            }
        } else if (mano_enemiga1_juego < 31 && mano_enemiga2_juego < 31) {
            if ((a1e1 >= 0 && a1e2 >= 0) || (e1a2 === -1 && a2e2 >= 0)) {
                Juegos_Gano[2][3] += frecuencia;
            } else {
                Juegos_Pierdo[2][3] += frecuencia;
            }
        }
    })
    //Nota: Podríamos probar con lógica bayesiana para evitarnos calvular frecuenciaPtotal y frecuenciaJtotal
    return [Juegos_Gano.map((Juego,Index) => Juego.map((ganadas, index) => 100*ganadas/(ganadas + Juegos_Pierdo[Index][index]))),false]
}

//SECCIÓN MUSIPAPER

// toma un vector f y un vector l y devuelve el conjunto de las matrices len(f),len(l) que suman esos vectores, NO PASA NADA SI HAY 0's
//Creamos los f y l posibles para un s
function posibles_f(s,fmax) {
    //Creamos f vértice
    const initialArray = Array(fmax.length).fill(0)
    const [imax,dif] = posibles_f_first_greater(s,fmax)
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
        sum += fmax[i]
        const dif = sum-s
        if (dif>=0){
            return [i,dif]
        }
        
    }
    throw new Error('s es demasiado grande');
}

//Para las matrices, función Creamos un vértice matriz para f y l dados y su estela para calcular aristas
function solVertice_extend_FL(f, l) {
    let EstelaMat = Array.from({ length: f.length }, () => new Array(l.length).fill(0));
    let VerticeMat = Array.from({ length: f.length }, () => new Array(l.length).fill(0));

    // Inicialización de EstelaMat
    if (f[0] !== 0) {
        for (let j = 0; j < l.length; j++) {
            if (l[j] !== 0) {
                EstelaMat[0][j] = 1;
            }
        }
    }

    if (l[l.length - 1] !== 0) {
        for (let i = 0; i < f.length; i++) {
            if (f[i] !== 0) {
                EstelaMat[i][l.length - 1] = 1;
            }
        }
    }

    // Inicialización de VerticeMat
    VerticeMat[0] = [...l];
    for (let i = 0; i < f.length; i++) {
        VerticeMat[i][l.length - 1] = f[i];
    }
    VerticeMat[0][l.length - 1] = f[0] + l[l.length - 1] - f.reduce((a, b) => a + b, 0);

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
        if (f[i + 1] !== 0 && l[j - 1] !== 0) {
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
            if (f[itemp] !== 0 && l[j - 1] !== 0) {
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
            if (f[i + 1] !== 0 && l[jtemp] !== 0) {
                EstelaMat[i + 1][jtemp] = 1;
            }
        }

        if (itemp === i + 1 && jtemp === j - 1) {
            break;
        }

        i++;
        j--;
    }
    //Parte de extendender
    let neg_idx = {};
    for (let i=1; i<f.length; i++){
        for (let j=1; j<l.length; j++){
            if (EstelaMat[i][j]==1 && VerticeMat[i][j]==0){
                neg_idx[JSON.stringify([i,j])]=-1;
            }
        }
    }

    return {vertice : VerticeMat, estela : EstelaMat, neg_idx : neg_idx};
}

// Escribimos nuestro algoritmo de caminos para crear las matrices arista a partir de una matriz "completa" - algoritmo del MUSIPAPER. 

// Función que obtiene las primeras aristas, cada vector arista es en realidad una función para acortar a O(n+v) de O(n*v) el proceso de sumar.
function primeras_aristas_funcion_adicion_nocopy(V,neg_idx={}){
    const result = []
    const v = V.length
    const n = V[0].length
    for (let i = 0; i < v; i++) {
        for (let j = 0; j < n; j++) {
            if (V[i][j]===0){
                const Arista = find_balanced_paths(V, [i,j]);
                if (Arista[1]){
                    const Aristafun = matrix_to_adition_nocopy(Arista[0],neg_idx);
                    Aristafun.arista = Arista[0]
                    result.push(Aristafun);
                }
            }
        }
    }
    return result
}

//SOLO CORRECTO PARA VERTICES ESTELA
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
                        return [result, true];
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
                        return [result, true];
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

    return [result, false];
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
    return function (N,t=1) {
        // Crear una copia de N para no modificarla directamente
        const result = N.map(row => row.slice());
        
        // Sumar los elementos no nulos de M a la matriz N
        // Si en algún momento va a crear un elemento negativo, no lo hagas ^-^
        for (const element of nonZeroElements) {
            result[element[0]][element[1]] += t*element[2];
            if (result[element[0]][element[1]]<0){
                return [result, false]
            }
        }
        
        return [result, true];
    };
}

function matrix_to_adition_nocopy(M) {
    // Extraer las posiciones y valores de los elementos no nulos de M
    const nonZeroElements = [];
    for (let i = 0; i < M.length; i++) {
        for (let j = 0; j < M[i].length; j++) {
            if (M[i][j] !== 0) {
                nonZeroElements.push([i, j, M[i][j]]);
            }
        }
    }

    // Devolver en [0] una función que dice si la suma de M con otra matriz N es válida (nonegativa excepto en los indices de neg_idx donde es mayor que -1)
    // y en [1] una función que suma M con otra matriz N primero realizando un deepcopy de N
    return [function (N,t=1,neg_idx={},reviewnoneg=false){
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
        , function (N,t=1) {
        // Sumar los elementos no nulos de M a la matriz N
        let NN = N.map(row => row.slice());
        for (const element of nonZeroElements) {
            NN[element[0]][element[1]] += t*element[2];
        }
        return NN;
    }]
}

// Y devolver el conjunto de las matrices dados f y l
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