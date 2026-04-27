// worker.js

//SECCIÓN OPERACIONES RECURRENTES

// Helper to hash arrays as strings 
const arrayToString = (arr) => arr.join(',');

//Insert
function insertarOrdenado(arr, num, l = 1) {
    let i = 0;
    // Encontramos la posición adecuada para insertar
    while (i < arr.length & arr[i] < num) {
        i++;
    }
    // Insertamos `num` en la posición correcta `l` veces
    arr.splice(i, 0, ...Array(l).fill(num));
    return arr; // Devolvemos el arreglo modificado
}

//Multicombinatorio
//n! con n=0,...,8
const factorial = [1,1,2,6,24,120,720,5040,40320];
const cacheResultados = new Map(); // Mapa para almacenar los resultados

//function multicombinatorio_memorizado5(a, b, c, d, e, f) {
    // Normalizamos los números (los ordenamos) y creamos una clave única (a = b+c+d+e+f luego f es l.d.)
//    let arr = [a,b,c,d,e].sort();
//    const clave = (arr[0] << 16) | (arr[1] << 12) | (arr[2] << 8) | (arr[3] << 4) | arr[4];

    // Si el resultado ya está en el cache, lo devolvemos directamente
//    if (cacheResultados.has(clave)) {
//        return cacheResultados.get(clave);
//    }

    // Calculamos el resultado y lo almacenamos en el cache
//    const resultado = multicombinatorio5(a, b, c, d, e, f);
//    cacheResultados.set(clave, resultado);

//    return resultado;
//}

function multicombinatorio5(a, b, c, d, e, f) {
    if (a===f){
        return 1
    }
    const numerador = factorial[a]; // (a! / f!)
    const denominador = factorial[b] * factorial[c] * factorial[d] * factorial[e] * factorial[f]; // b! * c! * d! * e!
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
        let FtFtIndex = Probabilidades[0].findIndex(Juego => Juego.some(JJuego => (40<JJuego) & (JJuego<60)))
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
                if (Probabilidades[0][0].findIndex(JJuego => (40<JJuego) & (JJuego<60))==0){
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
        let FtFtIndex = Probabilidades[0].findIndex(Juego => Juego.some(JJuego => (40<JJuego) & (JJuego<60)))
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
                if (Probabilidades[0][0].findIndex(JJuego => (40<JJuego) & (JJuego<60))==0){
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
const FrasesGanar = ['Les vamos a dar clases a esta pareja','Me juego la Naval Entera','Apriétate a la silla que vamos a levantar esto','Demasiado cortas tiene las patas el gorrión para bailar con la urraca']
const misValores = ['K', '3', 'Q', 'J', '7', '6', '5', '4', '2', '1'];
const misValoresRed = [['K', 'Q', 'J', '7', '6', '5', '4','1'],[8,4,4,4,4,4,4,8]];

//Funciones de comparación

//0 es mano sobre 2 y 3 y 1 es mano sobre 3. 0 y 1 amigos 2 y 3 contrincantes. Valores ha de estar ordenado en orden descendente de grande.
function relorden_musipaper(Cuatrimano, i, j, n_valores, soymano = undefined, grande = true) {
    for (let k = grande ? 0 : n_valores - 1; grande ? k < n_valores : k >= 0; k += grande ? 1 : -1) {
        if (Cuatrimano[k][i] > Cuatrimano[k][j]) {
            return 1;
        } else if (Cuatrimano[k][i] < Cuatrimano[k][j]) {
            return -1;
        }
    }
    return (soymano == undefined) ? 0 : soymano ? 1 : -1;
}

function valor_musipaper(carta) {
    if ([0,1,2].includes(carta)) {
        return 10;
    } else{
        return parseInt(misValoresRed[0][carta]);
    }
}

function relordenJ_musipaper(Cuatrimano,i,j,n_valores,soymano=undefined){
    let Juego_i = 0;
    let Juego_j = 0;
    for (let k=0; k<n_valores; k++){
        Juego_i += valor_musipaper(k)*Cuatrimano[k][i]
        Juego_j += valor_musipaper(k)*Cuatrimano[k][j]
    }
    if (Juego_i < 31 & Juego_j > 30) {
        return -1;
    } else if (Juego_i > 30 & Juego_j < 31) {
        return 1;
    } else if (Juego_i > 30 & Juego_j > 30) {
        if (Juego_i === 31) {
            return Juego_j === 31 ? (soymano == undefined) ? 0 : soymano ? 1 : -1 : 1;
        } else if (Juego_i === 32) {
            return Juego_j === 31 ? -1 : Juego_j === 32 ? (soymano == undefined) ? 0 : soymano ? 1 : -1 : 1;
        } else {
            return Juego_j === 31 || Juego_j === 32 ? -1 : Juego_i > Juego_j ? 1 : Juego_i === Juego_j ? (soymano == undefined) ? 0 : soymano ? 1 : -1 : -1;
        }
    } else {
        return Juego_i > Juego_j ? 1 : Juego_i === Juego_j ? (soymano == undefined) ? 0 : soymano ? 1 : -1 : -1;
    }
}

//No asume que las manos tienen 4 elementos. Asegurarse correcto orden de las entradas y correcta inserción de arrays
function relordenP_musipaper(Cuatrimano,i,j,n_valores,soymano=undefined,longitudmano=4){
    let seen_i = 0;
    let seen_j = 0;
    let duplex_i = false;
    let i_duplex = 0;
    let duplex_j = false;
    let j_duplex = 0;
    let max_i = 0;
    let i_max = 0;
    let max_j = 0;
    let j_max = 0;
    for (let k=0; k<n_valores; k++){
        seen_i+=Cuatrimano[k][i]
        seen_j+=Cuatrimano[k][j]
        //Esto utiliza que cuatrimano está ordenado, la posición con menor i indica la carta mas grande y sucesivamente
        if (Cuatrimano[k][i]>max_i){
            max_i = Cuatrimano[k][i];
            i_max = i;
            if (Cuatrimano[k][i]==4){
                duplex_i = true;
                i_duplex = i;
            }
        } else if (Cuatrimano[k][i]> 1 & (Cuatrimano[k][i] == max_i)){
            max_i = 4;
            duplex_i = true;
            i_duplex = i;
        }
        if (Cuatrimano[k][j]>max_j){
            max_j = Cuatrimano[k][j];
            j_max = j;
            if (Cuatrimano[k][j]==4){
                duplex_j = true;
            }
        } else if (Cuatrimano[k][j]> 1 & (Cuatrimano[k][j] == max_i)){
            max_j = 4;
            duplex_j = true;
            j_duplex = j;
        }
        if ((seen_i>longitudmano) & (seen_j>longitudmano)){
            break;
        }
    }

    return max_i>max_j ? 1 : max_j>max_i ? -1 : i_max < j_max ? 1 : j_max < i_max ? i_duplex < j_duplex ? 1 : j_duplex < i_duplex ? -1 : -1 : (soymano == undefined) ? 0 : soymano ? 1 : -1;
}

//Funcion que calcula si ganas o pierdes en la configuracion respectiva puesta en forma de matriz columnas: 
// fmax,[4-mano_amiga1.length,4-mano_amiga2.length,4,4,n_cartas_rest]
function actualizar_densidad(Cuatrimano,Juegos_Gano,Juegos_Pierdo,mano_amiga1_indeces,mano_amiga2_indeces,n_valores,soymano,fmax,valores=misValoresRed,cuatrimanostotales=1){
    const newFrec = valores[0].reduce((acc, _, i) => acc = acc * multicombinatorio5(fmax[i], Cuatrimano[i][0], Cuatrimano[i][1], Cuatrimano[i][2], Cuatrimano[i][3], Cuatrimano[i][4]),1)
    
    for(let i=0; i<n_valores; i++){
        Cuatrimano[i][0] += mano_amiga1_indeces[i];
        Cuatrimano[i][1] += mano_amiga2_indeces[i];
    }
    

    //Rehacemos las relaciones de orden
    //Claro, ahora tenemos que realizar casuística

    let a1e1 = relorden_musipaper(Cuatrimano,0,2,n_valores,soymano);
    let a2e2 = relorden_musipaper(Cuatrimano,1,3,n_valores,soymano);
    let e1a2 = relorden_musipaper(Cuatrimano,2,1,n_valores,true);
    let a1e2 = relorden_musipaper(Cuatrimano,0,3,n_valores,true);
    
    if ((a1e1 >= 0 & a1e2 >= 0) || (e1a2 === -1 & a2e2 >= 0)) {
        Juegos_Gano[0][0] += newFrec;
    } else {
        Juegos_Pierdo[0][0] += newFrec;
    }

    a1e1 = relorden_musipaper(Cuatrimano,0,2,n_valores,soymano,false);
    a2e2 = relorden_musipaper(Cuatrimano,1,3,n_valores,soymano,false);
    e1a2 = relorden_musipaper(Cuatrimano,2,1,n_valores,true,false);
    a1e2 = relorden_musipaper(Cuatrimano,0,3,n_valores,true,false);
    
    if ((a1e1 >= 0 & a1e2 >= 0) || (e1a2 === -1 & a2e2 >= 0)) {
        Juegos_Gano[0][1] += newFrec;
    } else {
        Juegos_Pierdo[0][1] += newFrec;
    }
    
    a1e1 = relordenP_musipaper(Cuatrimano,0,2,n_valores,soymano);
    a2e2 = relordenP_musipaper(Cuatrimano,1,3,n_valores,soymano);
    e1a2 = relordenP_musipaper(Cuatrimano,2,1,n_valores,true);
    a1e2 = relordenP_musipaper(Cuatrimano,0,3,n_valores,true);

    let mano_enemiga1_pares_bool = valores[0].some((_,i) =>  Cuatrimano[i][2]>1)
    let mano_enemiga2_pares_bool = valores[0].some((_,i) =>  Cuatrimano[i][3]>1)
    
    if (mano_enemiga1_pares_bool & !mano_enemiga2_pares_bool) {
        if ((a1e1 >= 0) || (e1a2 === -1)) {
            Juegos_Gano[1][0] += newFrec;
        } else {
            Juegos_Pierdo[1][0] += newFrec;
        }
    } else if (mano_enemiga2_pares_bool & !mano_enemiga1_pares_bool){
        if ((a1e2 >= 0) || (a2e2 >= 0)) {
            Juegos_Gano[1][1] += newFrec;
        } else {
            Juegos_Pierdo[1][1] += newFrec;
        }
    } else if (mano_enemiga1_pares_bool & mano_enemiga2_pares_bool) {
        if ((a1e1 >= 0 & a1e2 >= 0) || (e1a2 === -1 & a2e2 >= 0)) {
            Juegos_Gano[1][2] += newFrec;
        } else {
            Juegos_Pierdo[1][2] += newFrec;
        }
    } 
    
    a1e1 = relordenJ_musipaper(Cuatrimano,0,2,n_valores,soymano);
    a2e2 = relordenJ_musipaper(Cuatrimano,1,3,n_valores,soymano);
    e1a2 = relordenJ_musipaper(Cuatrimano,2,1,n_valores,true);
    a1e2 = relordenJ_musipaper(Cuatrimano,0,3,n_valores,true);
    
    let mano_enemiga1_juego = 0;
    let mano_enemiga2_juego = 0;
    
    for (let k=0; k<n_valores; k++){
        mano_enemiga1_juego += valor_musipaper(k)*Cuatrimano[k][2]
        mano_enemiga2_juego += valor_musipaper(k)*Cuatrimano[k][3]
    }

    if (mano_enemiga1_juego > 30 & mano_enemiga2_juego < 31) {
        if ((a1e1 >= 0) || (e1a2 < 0)) {
            Juegos_Gano[2][0] += newFrec;
        } else {
            Juegos_Pierdo[2][0] += newFrec;
        }
    } else if (mano_enemiga2_juego > 30 & mano_enemiga1_juego < 31) {
        if ((a1e2 >= 0) || (a2e2 >= 0)) {
            Juegos_Gano[2][1] += newFrec;
        } else {
            Juegos_Pierdo[2][1] += newFrec;
        }
    } else if (mano_enemiga1_juego > 30 & mano_enemiga2_juego > 30) {
        if ((a1e1 >= 0 & a1e2 >= 0) || (e1a2 === -1 & a2e2 >= 0)) {
            Juegos_Gano[2][2] += newFrec;
        } else {
            Juegos_Pierdo[2][2] += newFrec;
        }
    } else if (mano_enemiga1_juego < 31 & mano_enemiga2_juego < 31) {
        if ((a1e1 >= 0 & a1e2 >= 0) || (e1a2 === -1 & a2e2 >= 0)) {
            Juegos_Gano[2][3] += newFrec;
        } else {
            Juegos_Pierdo[2][3] += newFrec;
        }
    }
    //Nota: Podríamos probar con lógica bayesiana para evitarnos calcular frecuenciaPtotal y frecuenciaJtotal

    for(let i=0; i<n_valores; i++){
        Cuatrimano[i][0] -= mano_amiga1_indeces[i];
        Cuatrimano[i][1] -= mano_amiga2_indeces[i];
    }
}

//Fin funciones de comparación

//Musipaper
function LGconsec(v,n,i,j){
    if (j==n-1){
        if (i==v-1){
            throw new Error('No hay posible consecutivo lexicográfico')
        }
        return [i+1,0];
    } else{
        return [i,j+1];
    }
}
function parametrizar(v,n,i,j,Vertice,Juegos_Gano,Juegos_Pierdo,mano_amiga1_indeces,mano_amiga2_indeces,n_valores,soymano,fmax,valores,cuatrimanostotales,ascend='split',Aristas=undefined, seen=false) {
    //Vertice es un vértice de la frontera "virtual" F_{<_LG(i,j)} (MENOR ESTRICTO)
    //Actualizamos densidades en los casos base
    if (!seen){ 
        actualizar_densidad(Vertice,Juegos_Gano,Juegos_Pierdo,mano_amiga1_indeces,mano_amiga2_indeces,n_valores,soymano,fmax,valores,cuatrimanostotales);
        cuatrimanostotales++;
    }
    if (i==v-1){
        return cuatrimanostotales;
    }
    const Inew = LGconsec(v,n,i,j);
    cuatrimanostotales = parametrizar(v,n,Inew[0],Inew[1],Vertice,Juegos_Gano,Juegos_Pierdo,mano_amiga1_indeces,mano_amiga2_indeces,n_valores,soymano,fmax,valores,cuatrimanostotales,'split',undefined,true);    
    //Aplicamos algoritmo del simplex para recorrer todos los valores posibles que la coordenada i-esima puede tomar fijadas las anteriores
    //Mandamos un camino ascendente y uno descendente
    let arista_max = primeras_aristas_funcion_adicion_nocopy(Vertice,[i,j],[i,j],true);
    let arista_min = primeras_aristas_funcion_adicion_nocopy(Vertice,[i,j],[i,j],false);
    if (arista_max!=undefined & (ascend=='split'||ascend=='ascend')){
        const max_add = arista_max.maxadd(Vertice);
        if (max_add == Infinity){
            throw new Error('Fallo en primeras aristas');
        }
        for (let l=1;l<max_add;l++){
            Vertice = arista_max.addto(Vertice,l);
            cuatrimanostotales = parametrizar(v,n,Inew[0],Inew[1],Vertice,Juegos_Gano,Juegos_Pierdo,mano_amiga1_indeces,mano_amiga2_indeces,n_valores,soymano,fmax,valores,cuatrimanostotales,'split');
            Vertice = arista_max.addto(Vertice);
        }
        if (max_add>0){
            Vertice = arista_max.addto(Vertice,max_add);
            cuatrimanostotales = parametrizar(v,n,i,j,Vertice,Juegos_Gano,Juegos_Pierdo,mano_amiga1_indeces,mano_amiga2_indeces,n_valores,soymano,fmax,valores,cuatrimanostotales,'ascend');
            Vertice = arista_max.addto(Vertice,-max_add);
        }
    }
    if (arista_min!=undefined & (ascend=='split'||ascend=='descend')){
        const max_sub = arista_min.maxadd(Vertice);
        if (max_sub == Infinity){
            throw new Error('Fallo en primeras aristas');
        }
        for (let l=1;l<max_sub;l++){
            Vertice = arista_min.addto(Vertice,l);
            cuatrimanostotales = parametrizar(v,n,Inew[0],Inew[1],Vertice,Juegos_Gano,Juegos_Pierdo,mano_amiga1_indeces,mano_amiga2_indeces,n_valores,soymano,fmax,valores,cuatrimanostotales,'split');
            Vertice = arista_min.addto(Vertice,-l);
        }
        if (max_sub>0){
            Vertice = arista_min.addto(Vertice,max_sub);
            cuatrimanostotales = parametrizar(v,n,i,j,Vertice,Juegos_Gano,Juegos_Pierdo,mano_amiga1_indeces,mano_amiga2_indeces,n_valores,soymano,fmax,valores,cuatrimanostotales,'descend');
            Vertice = arista_min.addto(Vertice,-max_sub);
        }
    }
    return cuatrimanostotales;
}

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
    let Vertice = vertice_obj.vertice;
    let Juegos_Gano=[[0,0],[0,0,0],[0,0,0,0]];
    let Juegos_Pierdo=[[0,0],[0,0,0],[0,0,0,0]];
    //Musipaper! Hay que optimizar el procedimiento para reducir la "dimensionalidad" y en general reducir la parte del poliedro que hace falta visitar (uso de simetrias, tiene muchas)
    //Funfact para medir cuántas hay
    let cuatrimanostotales= 0;

    //Implementación "parametrización ortogonal" por medio de una recursión
    cuatrimanostotales = parametrizar(fmax.length,5,0,0,Vertice,Juegos_Gano,Juegos_Pierdo,mano_amiga1_indeces,mano_amiga2_indeces,n_valores,soymano,fmax,valores,cuatrimanostotales);

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
        
        if ((a1e1 >= 0 & a1e2 >= 0) || (e1a2 === -1 & a2e2 >= 0)) {
            Juegos_Gano[0][0] += frecuencia;
        } else {
            Juegos_Pierdo[0][0] += frecuencia;
        }

        a1e1 = relorden(mano_amiga1, mano_enemiga1, soymano, false);
        a2e2 = relorden(mano_amiga2, mano_enemiga2, soymano, false);
        e1a2 = relorden(mano_enemiga1, mano_amiga2, soymano, false);
        a1e2 = relorden(mano_amiga1, mano_enemiga2, soymano, false);
        
        if ((a1e1 >= 0 & a1e2 >= 0) || (e1a2 === -1 & a2e2 >= 0)) {
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
        
        if (mano_enemiga1_pares_bool & !mano_enemiga2_pares_bool) {
            if ((a1e1 >= 0) || (e1a2 === -1)) {
                Juegos_Gano[1][0] += frecuencia;
            } else {
                Juegos_Pierdo[1][0] += frecuencia;
            }
        } else if (mano_enemiga2_pares_bool & !mano_enemiga1_pares_bool){
            if ((a1e2 >= 0) || (a2e2 >= 0)) {
                Juegos_Gano[1][1] += frecuencia;
            } else {
                Juegos_Pierdo[1][1] += frecuencia;
            }
        } else if (mano_enemiga1_pares_bool & mano_enemiga2_pares_bool) {
            if ((a1e1 >= 0 & a1e2 >= 0) || (e1a2 === -1 & a2e2 >= 0)) {
                Juegos_Gano[1][2] += frecuencia;
            } else {
                Juegos_Pierdo[1][2] += frecuencia;
            }
        } 
        
        a1e1 = relordenJ(mano_amiga1_juego, mano_enemiga1_juego, soymano);
        a2e2 = relordenJ(mano_amiga2_juego, mano_enemiga2_juego, soymano);
        e1a2 = relordenJ(mano_enemiga1_juego, mano_amiga2_juego, soymano);
        a1e2 = relordenJ(mano_amiga1_juego, mano_enemiga2_juego, soymano);
        
        if (mano_enemiga1_juego > 30 & mano_enemiga2_juego < 31) {
            if ((a1e1 >= 0) || (e1a2 < 0)) {
                Juegos_Gano[2][0] += frecuencia;
            } else {
                Juegos_Pierdo[2][0] += frecuencia;
            }
        } else if (mano_enemiga2_juego > 30 & mano_enemiga1_juego < 31) {
            if ((a1e2 >= 0) || (a2e2 >= 0)) {
                Juegos_Gano[2][1] += frecuencia;
            } else {
                Juegos_Pierdo[2][1] += frecuencia;
            }
        } else if (mano_enemiga1_juego > 30 & mano_enemiga2_juego > 30) {
            if ((a1e1 >= 0 & a1e2 >= 0) || (e1a2 === -1 & a2e2 >= 0)) {
                Juegos_Gano[2][2] += frecuencia;
            } else {
                Juegos_Pierdo[2][2] += frecuencia;
            }
        } else if (mano_enemiga1_juego < 31 & mano_enemiga2_juego < 31) {
            if ((a1e1 >= 0 & a1e2 >= 0) || (e1a2 === -1 & a2e2 >= 0)) {
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

//Para las matrices, función vértice matriz para f y l dados y su estela para calcular aristas
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
        if (f[i + 1] !== 0 & l[j - 1] !== 0) {
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
            if (f[itemp] !== 0 & l[j - 1] !== 0) {
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
            if (f[i + 1] !== 0 & l[jtemp] !== 0) {
                EstelaMat[i + 1][jtemp] = 1;
            }
        }

        if (itemp === i + 1 & jtemp === j - 1) {
            break;
        }

        i++;
        j--;
    }
    //Parte de extendender
    let neg_idx = {};
    for (let i=1; i<f.length; i++){
        for (let j=1; j<l.length; j++){
            if (EstelaMat[i][j]==1 & VerticeMat[i][j]==0){
                neg_idx[JSON.stringify([i,j])]=-1;
            } else{
                neg_idx[JSON.stringify([i,j])]=-0;
            }
        }
    }

    return {vertice : VerticeMat, estela : EstelaMat, neg_idx : neg_idx};
}

// Algoritmo busca caminos 

// Función que obtiene las aristas de un VÉRTICE de una frontera especificada en IGNORE, cada vector arista es en realidad una función para acortar a O(n+v) de O(n*v) el proceso de sumar.
function primeras_aristas_funcion_adicion_nocopy(V,ignore=[],point=[],sign=true){
    function ignoring(i,j){
        const ig0 = ignore[0];
        const ig1 = ignore[1];
        return i !== ig0 ? i<ig0 : j<ig1;
    }
    const v = V.length
    const n = V[0].length
    const arista = find_all_balanced_paths_one(V,ignoring,point,sign);
    return arista == undefined ? undefined : new flat_matrix_to_adition(arista,v,n)
}

//TODAS las Aristas de un vértice general "positivas" tangentes a una frontera, algoritmo de musinator (la única parte realmente importante de todo el código)

function find_all_balanced_paths_one(V, ignoring=(i,j)=>{return false},point,sign) {
    let v = V.length;
    let n = V[0].length;

    //Encontramos las clases de zig-zag equivalencia (entradas no nulas conectadas por algún zig-zag)
    let ZZequivalenceclasses_rows = {};
    let ZZequivalenceclasses_cols = {};
    let ZZZequivalence_old = {};
    let currentclass = 0;
    let j0 = point[1];
    for (let i0=point[0];i0<v;(j0==(n-1)) ? [i0,j0]=[i0+1,0] : j0++){
        if (V[i0][j0]==0) continue;
        if (i0 in ZZequivalenceclasses_rows){
            if (j0 in ZZequivalenceclasses_cols){
                //Actualizamos el mapa que nos dice qué clases de equivalencia son en realidad la misma 
                let ZZZequivalence_current = {[ZZZequivalence_old[ZZequivalenceclasses_rows[i0]]]: ZZZequivalence_old[ZZequivalenceclasses_cols[j0]]};
                for (k=1;k<=currentclass;k++){
                    let p = ZZZequivalence_old[k];
                    ZZZequivalence_old[k] = ZZZequivalence_current[p] ?? p;
                }
            } 
            ZZequivalenceclasses_cols[j0]=ZZequivalenceclasses_rows[i0];
        } else if (j0 in ZZequivalenceclasses_cols){
            ZZequivalenceclasses_rows[i0]=ZZequivalenceclasses_cols[j0];
        } else {
            currentclass++;
            ZZZequivalence_old[currentclass]=currentclass;
            ZZequivalenceclasses_rows[i0]=currentclass;
            ZZequivalenceclasses_cols[j0]=currentclass;
        }
    }

    // No crear caminos con elementos cuyas aristas asociadas ya hemos encontrado
    // evitar duplicidades en el output, estos serán los menores en el LG.
    let [i1,j1] = point;
    const viable = ZZequivalenceclasses_cols[j1] ? ZZequivalenceclasses_rows[i1] ? true : false : false;
    if (!viable){ 
        return undefined
    }
    //Algoritmo Musipaper
    let paths = []; // Lista de caminos activos: {[camino, última coordenada], ...}
    const initial_parity = V[i1][j1]==0 ? 1 : -1;
    // Inicializa el primer camino con el punto inicial
    let initial_path = new Int8Array(v * n);
    const I=[i1,j1];
    let start_point = I;
    if (initial_parity==1 & sign){
        let zzequiv = new Set();
        if (ZZequivalenceclasses_rows[i1]){
            zzequiv.add(ZZZequivalence_old[ZZequivalenceclasses_rows[i1]])
        }
        initial_path[i1*n + j1] = 1;
        paths.push([initial_path, I, initial_parity, zzequiv, start_point, ZZequivalenceclasses_cols[j1]]);
    } else{
        let zzequiv = new Set();
        initial_path[i1*n + j1] = 1;
        if (sign){
            paths.push([initial_path, I, -initial_parity, zzequiv, start_point, ZZequivalenceclasses_cols[j1]]);
        } else{
            for (let j2=0; j2<n ; j2++){
                const objective = ZZequivalenceclasses_cols[j2] ? ZZequivalenceclasses_cols[j2] : undefined;
                if (!((!objective) || ignoring(i1,j2) || j2==j1)){
                    zzequiv = new Set();
                    if (ZZequivalenceclasses_rows[i1] & V[i1][j2]==0){
                        zzequiv.add(ZZZequivalence_old[ZZequivalenceclasses_rows[i1]])
                    }
                    let new_initial_path = new Int8Array(v * n);
                    new_initial_path[i1*n + j1] = -1;
                    new_initial_path[i1*n + j2] = 1;
                    start_point = [i1,j2];
                    //Es como si vinieramos de i1, j2
                    paths.push([new_initial_path, I, initial_parity, zzequiv, start_point, objective]);
                }
            }
        }
    }
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
            const start_point = current_path_data[4];
            const current_objective = current_path_data[5];
    
            const i = last_coords[0];
            const j = last_coords[1];
    
            // Expandir por fila
            if (current_parity == 1){ //Paso impar, añadir -1
                for (let col=0;col<n;col++){
                    if (V[i][col] == 0 || ignoring(i,col)) continue;
                    if (current_path[i*n + col] == 0){
                        // Crear un nuevo camino
                        let new_path = current_path.map(v=>v);
                        new_path[i*n + col] = -1; // Alterna paridad
    
                        // Agregar a la lista de nuevos caminos
                        new_paths.push([new_path, [i, col], -1, current_zzequiv, start_point, current_objective]);
                    }
                }
            }
    
            // Expandir por columna
            if (current_parity == -1){ // Paso par, añadir 1
                if (j==start_point[1]){
                    //Congratulaciones volviste a la posición original, has ganado, tienes una arista
                    return current_path;
                    continue;
                }
                for (let row = 0; row<v;row++){
                    if (ignoring(row,j)) continue;
                    if (current_path[row*n + j] == 0){
                        if (V[row][j] !== 0){
                            // Crear un nuevo camino
                            let new_path = current_path.map(v=>v);
                            new_path[row*n + j] = 1; // Alterna paridad
        
                            // Agregar a la lista de nuevos caminos
                            new_paths.push([new_path, [row, j], 1,current_zzequiv, start_point, current_objective]);
                        } else if (ZZequivalenceclasses_rows[row]!=undefined & !current_zzequiv.has(ZZZequivalence_old[current_objective])){ //Si estás en comunicación a través de los nonulos del vértice con la solución no inventes más ceros
                            if (current_zzequiv.has(ZZZequivalence_old[ZZequivalenceclasses_rows[row]])) continue; //Observar que si la fila no tiene clase asignada no hay elementos 
                            // no nulos del vértice de la frontera en dicha fila y por tanto en el siguiente paso no podría añadir un -1 luego ese posible camino se puede ignorar.
                            // Crear un nuevo camino
                            let new_path = current_path.map(v=>v);
                            new_path[row*n + j] = 1; // Alterna paridad
                            let new_zzequiv = new Set(current_zzequiv);
                            new_zzequiv.add(ZZZequivalence_old[ZZequivalenceclasses_rows[row]]);
                            // Agregar a la lista de nuevos caminos
                            new_paths.push([new_path, [row, j], 1,new_zzequiv, start_point, current_objective]);
                        } 
                    }
                }
            }
        }
    
        // Actualiza caminos
        paths = new_paths;
    }
    return undefined;
}

class flat_matrix_to_adition {
    constructor(M,v,n) {
        // Extraer las posiciones y valores de los elementos no nulos de M
        this.nonZeroElements = [];
        for (let i = 0; i < v; i++) {
            for (let j = 0; j < n; j++) {
                if (M[i*n + j] !== 0) {
                    this.nonZeroElements.push([i, j, M[i*n + j]]);
                }
            }
        }
    }

    // Devolver en add una función que dice si la suma de M con otra matriz N es válida (nonegativa excepto en los indices de neg_idx donde es mayor que -1)
    // y en maxadd una función que suma M con otra matriz N primero realizando un deepcopy de N
    addto = function (N,t=1) {
        // Sumar los elementos no nulos de M a la matriz N
        for (const element of this.nonZeroElements) {
            N[element[0]][element[1]] += t*element[2];
        }
        return N;
    };
    maxadd = function (N) {
        let max = Infinity;
        for (const element of this.nonZeroElements) {
            if (element[2]>0) continue;
            max = Math.min(max,Math.floor(-N[element[0]][element[1]]/element[2]));
        }
        return max;
    };
    maxsub = function (N) {
        let max = -Infinity;
        for (const element of this.nonZeroElements) {
            if (element[2]<0) continue;
            max = Math.max(max,Math.floor(-N[element[0]][element[1]]/element[2]));
        }
        return max;
    };
}