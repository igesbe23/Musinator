import math
import math
from flask import Flask, render_template, request
import re  # Módulo para expresiones regulares

MusScript = Flask(__name__, static_folder='static')

@MusScript.route('/', methods=['GET', 'POST'])
def index():
    user_input = None
    resultado = None
    error = None

    if request.method == 'POST':
        # Capturar el input del usuario
        user_input = request.form['user_input']

        # Definir el patrón regex para la validación
        pattern = r'^([1-7QKJ]{4}) ([1-7QKJ]{4}) (True|False)$'

        # Definir la función
        valores = ['K','Q','J','7','6','5','4','3','2','1']
        def relorden(L1,L2):
            L1 = list(L1)
            L2 = list(L2)
            if L1.count('K')+L1.count('3') > L2.count('K')+L2.count('3'):
                return 1  # L1 es mayor que L2
            elif L1.count('K')+L1.count('3') < L2.count('K')+L2.count('3'):
                return -1   # L1 es menor que L2ç
            for letra_index in [1,2,3,4,5,6]:
                if L1.count(valores[letra_index]) > L2.count(valores[letra_index]):
                    return 1  # L1 es mayor que L2
                elif L1.count(valores[letra_index]) < L2.count(valores[letra_index]):
                    return -1   # L1 es menor que L2ç
            if L1.count('1')+L1.count('2') > L2.count('1')+L2.count('2'):
                return 1  # L1 es mayor que L2
            elif L1.count('1')+L1.count('2') < L2.count('1')+L2.count('2'):
                return -1   # L1 es menor que L2ç
            return 0  # Son iguales
                    
        def relordenP(L1,L2): #L1 mano sobre L2
            ParesL1 = [[i,L1.count(i)] for i in set(L1) if L1.count(i)>1]
            ParesL2 = [[i,L2.count(i)] for i in set(L2) if L2.count(i)>1]
            if (len(ParesL2)==0):
                return 1
            elif (len(ParesL1)==0):
                return -1
                
            if len(ParesL1)>1 or ParesL1[0][1]==4:
                if len(ParesL2)>1 or ParesL2[0][1]==4:
                    return relorden([i[0] for i in ParesL1]*int(2/len(ParesL1)),[i[0] for i in ParesL2]*int(2/len(ParesL2)))
                else:
                    return 1
                    
            if ParesL1[0][1]==3:
                if len(ParesL2)>1 or ParesL2[0][1]==4:
                    return -1
                elif ParesL2[0][1]==3:
                    return relorden([i[0] for i in ParesL1 if i[1]==3],[i[0] for i in ParesL2 if i[1]==3])
                else:
                    return 1
                
            if len(ParesL2)>1 or ParesL2[0][1]==4:
                return -1
            elif ParesL2[0][1]==3:
                return -1
            return relorden([ParesL1[0][0]],[ParesL2[0][0]])
        
        def valor(carta):
            if carta=='K' or carta=='Q' or carta=='J':
                return 10
            elif carta=='1' or carta=='2':
                return 1
            else:
                return int(carta)

        def relordenJ(L1,L2): #Tanto a 31 como al punto
            JuegoL1 = sum(valor(i) for i in L1)
            JuegoL2 = sum(valor(i) for i in L2)

            if JuegoL1 < 31 and JuegoL2 > 30:
                return -1
            elif JuegoL1 > 30 and JuegoL2 < 31:
                return 1
            elif JuegoL1 > 30 and JuegoL2 > 30:
                if JuegoL1 == 31:
                    if JuegoL2 == 31:
                        return 0
                    else:
                        return 1
                elif JuegoL1 == 32:
                    if JuegoL2 == 31:
                        return -1
                    elif JuegoL2 == 32:
                        return 0
                    else:
                        return 1
                else:
                    if JuegoL2 == 31 or JuegoL2 ==32:
                        return -1
                    else:
                        if JuegoL1 > JuegoL2:
                            return 1
                        elif JuegoL1 == JuegoL2:
                            return 0
                        else:
                            return -1
            else:
                if JuegoL1 > JuegoL2:
                    return 1
                elif JuegoL1 == JuegoL2:
                    return 0
                else:
                    return -1

        def combinaciones_de_cuatro_con_repeticion_unicas(valores):
            Valor_de_repetición = dict()
            combinaciones = set()
            n = len(valores)
            # Generador de combinaciones
            for i in range(n):
                for j in range(i, n):
                    for k in range(j, n):
                        for l in range(k, n):
                            mano = tuple((valores[i], valores[j], valores[k], valores[l]))
                            combinaciones.add(mano)
                            amplia=1
                            for cartas in set(mano):
                                amplia *= math.comb(4,list(mano).count(cartas))
                            Valor_de_repetición[mano] = amplia
            return [list(i) for i in combinaciones],Valor_de_repetición

        ManosOrdenadas = combinaciones_de_cuatro_con_repeticion_unicas(valores)
        print(len(ManosOrdenadas))
        def probabilidad_nomus(mano_amiga1,mano_amiga2=[],soymano=True):
            Nuestras_Manos = []
            if len(mano_amiga2) == 0:
                Nuestras_Manos = [mano_amiga1]
            else:
                Nuestras_Manos = [mano_amiga1,mano_amiga2]
            Reductor_frecuencias = dict()
            for carta in valores:
                quitar = sum(list(i).count(carta) for i in Nuestras_Manos)
                if quitar != 0:
                    Reductor_frecuencias[carta] = quitar
                else:
                    Reductor_frecuencias[carta] = 0
            #Actualizamos las frecuencias dadas nuestras manos 
            Frecuencias = ManosOrdenadas[1]
            Frecuencias1 = dict()
            for manos_potenciales in ManosOrdenadas[0]:
                reducción = 1
                for carta in set(manos_potenciales):
                    reductor = Reductor_frecuencias[carta]
                    if reductor != 0:
                        reduciendo = list(manos_potenciales).count(carta)
                        reducción *= math.comb(4-reductor,reduciendo)/math.comb(4,reduciendo)
                    if reducción == 0:
                        break
                Frecuencias1[tuple(manos_potenciales)] = Frecuencias[tuple(manos_potenciales)]*reducción
                
            las_pierdo = 0
            las_gano = 0
            las_ganoP1 = 0
            las_pierdoP1 = 0
            las_ganoP2 = 0
            las_pierdoP2 = 0
            las_ganoJ1 = 0
            las_pierdoJ1 = 0
            las_ganoJ2 = 0
            las_pierdoJ2 = 0
            las_ganoJ3 = 0
            las_pierdoJ3 = 0

            Frecuencias2 = dict()
            for mano_enemiga1 in Frecuencias1:
                frecuencia1 = Frecuencias1[tuple(mano_enemiga1)]
                if frecuencia1 == 0:
                    continue
                Reductor_frecuencias = dict()
                for carta in valores:
                    quitar_previo = sum(list(i).count(carta) for i in Nuestras_Manos)
                    quitar = list(mano_enemiga1).count(carta)+sum(list(i).count(carta) for i in Nuestras_Manos)
                    if quitar != 0:
                        Reductor_frecuencias[carta] = [quitar,quitar_previo]
                    else:
                        Reductor_frecuencias[carta] = 0
                for manos_potenciales in ManosOrdenadas[0]:
                    if Frecuencias1[tuple(manos_potenciales)] == 0:
                        continue
                    reducción = 1
                    for carta in set(manos_potenciales):
                        reductor = Reductor_frecuencias[carta]
                        if reductor != 0:
                            reduciendo = list(manos_potenciales).count(carta)
                            reducción *= math.comb(4-reductor[0],reduciendo)/math.comb(4-reductor[1],reduciendo)
                        if reducción == 0:
                            break
                    Frecuencias2[tuple(manos_potenciales)] = Frecuencias1[tuple(manos_potenciales)]*reducción
                for mano_enemiga2 in Frecuencias2:
                    frecuencia2 = Frecuencias2[tuple(mano_enemiga2)]
                    if frecuencia2 == 0:
                        continue
                            
                    if soymano:

                        a1e1 = relorden(mano_amiga1,mano_enemiga1)
                        a2e2 = relorden(mano_amiga2,mano_enemiga2)
                        e1a2 = relorden(mano_enemiga1,mano_amiga2)
                        a1e2 = relorden(mano_amiga1,mano_enemiga2)

                        if (a1e1 >=0 and a1e2 >=0) or (e1a2 == -1 and a2e2 >= 0):
                            las_gano += frecuencia1*frecuencia2
                        else:
                            las_pierdo += frecuencia1*frecuencia2
                            
                        a1e1 = relordenP(mano_amiga1,mano_enemiga1)
                        a2e2 = relordenP(mano_amiga2,mano_enemiga2)
                        e1a2 = relordenP(mano_enemiga1,mano_amiga2)
                        a1e2 = relordenP(mano_amiga1,mano_enemiga2)

                        if (any(mano_enemiga1.count(i)>1 for i in mano_enemiga1) and not any(mano_enemiga2.count(i)>1 for i in mano_enemiga2)) or (any(mano_enemiga2.count(i)>1 for i in mano_enemiga2) and not any(mano_enemiga1.count(i)>1 for i in mano_enemiga1)):
                            if (a1e1 >=0 and a1e2 >=0) or (e1a2 == -1 and a2e2 >= 0):
                                las_ganoP1 += frecuencia1*frecuencia2
                            else:
                                las_pierdoP1 += frecuencia1*frecuencia2
                        elif any(mano_enemiga1.count(i)>1 for i in mano_enemiga1) and any(mano_enemiga2.count(i)>1 for i in mano_enemiga2):
                            if (a1e1 >=0 and a1e2 >=0) or (e1a2 == -1 and a2e2 >= 0):
                                las_ganoP2 += frecuencia1*frecuencia2
                            else:
                                las_pierdoP2 += frecuencia1*frecuencia2

                        a1e1 = relordenJ(mano_amiga1,mano_enemiga1)
                        a2e2 = relordenJ(mano_amiga2,mano_enemiga2)
                        e1a2 = relordenJ(mano_enemiga1,mano_amiga2)
                        a1e2 = relordenJ(mano_amiga1,mano_enemiga2)

                        if (sum(valor(i) for i in mano_enemiga1)>30 and not sum(valor(i) for i in mano_enemiga2)>30) or (sum(valor(i) for i in mano_enemiga2)>30 and not sum(valor(i) for i in mano_enemiga1)>30):
                            if (a1e1 >=0 and a1e2 >=0) or (e1a2 == -1 and a2e2 >= 0):
                                las_ganoJ1 += frecuencia1*frecuencia2
                            else:
                                las_pierdoJ1 += frecuencia1*frecuencia2
                        elif sum(valor(i) for i in mano_enemiga1)>30 and sum(valor(i) for i in mano_enemiga2)>30:
                            if (a1e1 >=0 and a1e2 >=0) or (e1a2 == -1 and a2e2 >= 0):
                                las_ganoJ2 += frecuencia1*frecuencia2
                            else:
                                las_pierdoJ2 += frecuencia1*frecuencia2
                        elif sum(valor(i) for i in mano_enemiga1)<30 and sum(valor(i) for i in mano_enemiga2)<30:
                            if (a1e1 >=0 and a1e2 >=0) or (e1a2 == -1 and a2e2 >= 0):
                                las_ganoJ3 += frecuencia1*frecuencia2
                            else:
                                las_pierdoJ3 += frecuencia1*frecuencia2
                    else:
                        e1a1 = relorden(mano_enemiga1,mano_amiga1)
                        e2a2 = relorden(mano_enemiga2,mano_amiga2)
                        e1a2 = relorden(mano_enemiga1,mano_amiga2)
                        a1e2 = relorden(mano_amiga1,mano_enemiga2)

                        if (e1a1 >=0 and e1a2 >=0) or (a1e2 == -1 and e2a2 >= 0):
                            las_pierdo += frecuencia1*frecuencia2
                        else:
                            las_gano += frecuencia1*frecuencia2

                        a1e1 = relordenP(mano_amiga1,mano_enemiga1)
                        a2e2 = relordenP(mano_amiga2,mano_enemiga2)
                        e1a2 = relordenP(mano_enemiga1,mano_amiga2)
                        a1e2 = relordenP(mano_amiga1,mano_enemiga2)

                        if (any(mano_enemiga1.count(i)>1 for i in mano_enemiga1) and not any(mano_enemiga2.count(i)>1 for i in mano_enemiga2)) or (any(mano_enemiga2.count(i)>1 for i in mano_enemiga2) and not any(mano_enemiga1.count(i)>1 for i in mano_enemiga1)):
                            if (e1a1 >=0 and e1a2 >=0) or (a1e2 == -1 and e2a2 >= 0):
                                las_pierdoP1 += frecuencia1*frecuencia2
                            else:
                                las_ganoP1 += frecuencia1*frecuencia2
                        elif any(mano_enemiga1.count(i)>1 for i in mano_enemiga1) and any(mano_enemiga2.count(i)>1 for i in mano_enemiga2):
                            if (e1a1 >=0 and e1a2 >=0) or (a1e2 == -1 and e2a2 >= 0):
                                las_pierdoP2 += frecuencia1*frecuencia2
                            else:
                                las_ganoP2 += frecuencia1*frecuencia2

                        a1e1 = relordenJ(mano_amiga1,mano_enemiga1)
                        a2e2 = relordenJ(mano_amiga2,mano_enemiga2)
                        e1a2 = relordenJ(mano_enemiga1,mano_amiga2)
                        a1e2 = relordenJ(mano_amiga1,mano_enemiga2)

                        if (sum(valor(i) for i in mano_enemiga1)>30 and not sum(valor(i) for i in mano_enemiga2)>30) or (sum(valor(i) for i in mano_enemiga2)>30 and not sum(valor(i) for i in mano_enemiga1)>30):
                            if (e1a1 >=0 and e1a2 >=0) or (a1e2 == -1 and e2a2 >= 0):
                                las_pierdoJ1 += frecuencia1*frecuencia2
                            else:
                                las_ganoJ1 += frecuencia1*frecuencia2
                        elif sum(valor(i) for i in mano_enemiga1)>30 and sum(valor(i) for i in mano_enemiga2)>30:
                            if (e1a1 >=0 and e1a2 >=0) or (a1e2 == -1 and e2a2 >= 0):
                                las_pierdoJ2 += frecuencia1*frecuencia2
                            else:
                                las_ganoJ2 += frecuencia1*frecuencia2
                        elif sum(valor(i) for i in mano_enemiga1)<30 and sum(valor(i) for i in mano_enemiga2)<30:
                            if (e1a1 >=0 and e1a2 >=0) or (a1e2 == -1 and e2a2 >= 0):
                                las_pierdoJ3 += frecuencia1*frecuencia2
                            else:
                                las_ganoJ3 += frecuencia1*frecuencia2

            return las_gano/(las_gano+las_pierdo),las_ganoP1/(las_ganoP1+las_pierdoP1),las_ganoP2/(las_ganoP2+las_pierdoP2),las_ganoJ1/(las_ganoJ1+las_pierdoJ1),las_ganoJ2/(las_ganoJ2+las_pierdoJ2),las_ganoJ3/(las_ganoJ3+las_pierdoJ3)

        
        # Verificar si el input cumple con el patrón
        if re.match(pattern, user_input):
            # Descomponer el input en manoamiga1, manoamiga2 y B
            partes = user_input.split(" ")
            manoamiga1 = list(partes[0])  # Convertir los primeros 4 caracteres en una lista
            manoamiga2 = list(partes[1])  # Convertir los segundos 4 caracteres en una lista
            manoamiga1esmano = True if partes[2] == "True" else False

            # Calcular las probabilidades con la función probabilidad_nomus
            probabilidades = probabilidad_nomus(manoamiga1, manoamiga2, manoamiga1esmano)

            # Formatear el resultado como el texto deseado
            resultado = f"Probabilidad de ganar con yo {manoamiga1} y mi compa {manoamiga2} {'siendo mano' if manoamiga1esmano else 'no siendo mano'} yo: a grande = {probabilidades[0]} a pares (uno de ellos tiene) = {probabilidades[1]} a pares (ambos tienen) = {probabilidades[2]} a 31 (uno de ellos tiene) = {probabilidades[3]} a 31 (ambos tienen) = {probabilidades[4]} al punto = {probabilidades[5]}"
        else:
            # Si no cumple, se muestra un mensaje de error
            error = "El input no cumple con el formato requerido. Use: XXXX XXXX B"

    # Renderizar la plantilla HTML con el resultado o el error
    return render_template('index.html', resultado=resultado, error=error)

if __name__ == '__main__':
    MusScript.run(debug=True)


