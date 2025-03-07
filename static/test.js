const misValoresRed = [['K', 'Q', 'J', '7', '6', '5', '4','1'],[8,4,4,4,4,4,4,8]];
const n_valores = misValoresRed[0].length

function valor_musipaper(carta) {
    if ([0,1,2].includes(carta)) {
        return 10;
    } else{
        return parseInt(misValoresRed[0][carta]);
    }
}
function relordenJ_musipaper(Cuatrimano,i,j,n_valores,soymano=[],invertir){
    let [Juego_i,Juego_j] = [0,0]
    if (invertir){
        const c = i;
        i = j;
        j = c;
    }
    for (let k=0; k<n_valores; k++){
        Juego_i += valor_musipaper(k)*Cuatrimano[k][i]
        Juego_j += valor_musipaper(k)*Cuatrimano[k][j]
    }
    console.log(Juego_i,Juego_j)
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
const Cuatrimano = [[2,3,2,0],[0,0,2,0],[0,0,0,2],[1,1,0,0],[1,0,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
const i=0
const j=3
console.log(relordenJ_musipaper(Cuatrimano,i,j,n_valores,true,false))