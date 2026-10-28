# ProjectCraft — Especificació funcional completa d'una alternativa a Microsoft Project i Planner

Document de requisits funcionals · Octubre de 2026

L'objectiu és desenvolupar ProjectCraft, una aplicació web gratuïta que reuneixi les capacitats de planificació professional de Microsoft Project amb la facilitat d'ús de Microsoft Planner.

No es tracta únicament de reproduir un diagrama de Gantt. Microsoft Project és, sobretot, un motor de planificació que calcula dates, dependències, recursos, costos, desviacions i riscos. Si ProjectCraft només permet crear tasques i moure barres, serà un gestor de tasques visual, però no una alternativa real a Project.

## 1. Quins productes de Microsoft cal prendre com a referència?

Microsoft ha modificat la seva oferta, i és important no barrejar característiques que pertanyen a productes diferents.

| Producte                  | Què aporta a ProjectCraft                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| Microsoft Project Desktop | Planificació avançada, Gantt, recursos, calendaris, costos, ruta crítica, línies base i informes |
| Microsoft Planner Basic   | Taulers Kanban, tasques, responsables, etiquetes, llistes i seguiment visual                     |
| Microsoft Planner Premium | Gantt web, dependències, sprints, càrrega de treball, objectius i camps personalitzats           |
| Microsoft Project Online  | Gestió corporativa de projectes i carteres, històrics i recursos compartits                      |

Situació actual: Project for the web es va integrar a Planner l'agost de 2025. Microsoft Project Online es va retirar el 30 de setembre de 2026, però Microsoft Project d'escriptori continua disponible.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://techcommunity.microsoft.com\&sz=32)

Microsoft Community Hub+2



La proposta és combinar els elements més útils de tots aquests entorns en una única aplicació, sense reproduir les seves limitacions artificials de llicència.

## 2. Principis obligatoris de ProjectCraft

Aquests requisits són transversals: han d'aplicar-se a tota l'aplicació.

- Funcionament complet al navegador, sense instal·lació.
- Sense registre obligatori, sense subscripcions i sense pagaments.
- Projectes i tasques il·limitats a escala funcional, subjectes als recursos tècnics disponibles.
- Possibilitat de treballar localment, sense servidor propi obligatori.
- Desa i recupera projectes sense pèrdua de dades.
- Importació i exportació amb formats compatibles amb altres aplicacions.
- Interfície professional i familiar, inspirada en l'organització de Microsoft Project, però amb identitat pròpia.
- Tots els menús, botons i comandaments han de tenir una funció real.
- Qualsevol dada modificada s'ha d'actualitzar immediatament a totes les vistes.
- Facilitat per passar de la gestió senzilla de tasques a la planificació professional sense canviar de programa.

Criteri fonamental: les dades del projecte han de ser independents de la vista. Una tasca ha de ser la mateixa entitat tant si es modifica des de la graella, el Gantt, el Kanban o el calendari. Microsoft Project funciona amb aquest principi.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support



## 3. Gestió de projectes i informació general

Prioritat P0 — Imprescindible

| Requisit                               | Funcionament i valor                                         | Millora proposada                                    |
| -------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| Crear projectes                        | Dona d'alta un projecte amb la seva pròpia planificació      | Formulari inicial ràpid o avançat                    |
| Nom i descripció                       | Identificació, objectius i abast                             | Descripció amb text enriquit                         |
| Data d'inici                           | Defineix el començament de la planificació                   | Editable en qualsevol moment                         |
| Data de finalització                   | Estableix una data objectiu de finalització                  | Distingir data prevista, calculada i límit           |
| Planificació des de l'inici o el final | Project permet programar a partir d'una data inicial o final | Selector senzill amb explicació del resultat         |
| Calendari general                      | Estableix dies i hores laborables                            | Plantilles de calendaris per país i sector           |
| Responsable del projecte               | Identifica qui el dirigeix                                   | Afegir equip i altres interessats                    |
| Estat del projecte                     | Permet conèixer la situació                                  | Estats: esborrany, actiu, pausat, completat, arxivat |
| Prioritat                              | Serveix per ordenar projectes                                | Prioritat numèrica o visual                          |
| Plantilles                             | Reutilitza planificacions habituals                          | Biblioteca gratuïta de plantilles                    |
| Duplicar projecte                      | Crea un nou projecte a partir d'un altre                     | Escollir quines dades es copien                      |
| Arxivar i eliminar                     | Organitza els projectes antics                               | Paperera amb recuperació                             |
| Propietats generals                    | Centralitza la configuració                                  | Finestra específica amb totes les opcions            |

Millora important: en crear un projecte, ProjectCraft hauria de demanar explícitament la data inicial, la data objectiu final i el calendari. No hauria d'obrir un Gantt sense límits aparentment definits.

## 4. Gestió de tasques i subtasques

Aquesta és la funcionalitat central del programa. Ha de ser possible introduir informació sense haver d'aprendre primer com funciona un diagrama de Gantt.

| Requisit                   | Què fa i com funciona                                   | Millora per a ProjectCraft                           |
| -------------------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| 4.1 Crear tasques          | Afegeix activitats al projecte                          | Botó visible «+ Nova tasca», Enter i menú contextual |
| 4.2 Edició completa        | Modifica qualsevol propietat                            | Doble clic o panell lateral                          |
| 4.3 Nom i descripció       | Explica què s'ha de fer                                 | Editor ric, enllaços i instruccions                  |
| 4.4 Dates d'inici i final  | Controla el període de la tasca                         | Dos selectors independents i fàcils d'utilitzar      |
| 4.5 Durada                 | Temps necessari per executar-la                         | Dies, hores, minuts i setmanes laborables            |
| 4.6 Tasques resum          | Agrupa activitats subordinades                          | Càlcul automàtic de dates i progrés                  |
| 4.7 Subtasques             | Descompon activitats complexes                          | Nivells jeràrquics il·limitats en el model           |
| 4.8 Sagnat                 | Converteix tasques en subtasques                        | Botons i dreceres Tab / Shift+Tab                    |
| 4.9 Ordenació              | Canvia la seqüència de tasques                          | Arrossegar files sense perdre dependències           |
| 4.10 Codi EDT/WBS          | Numeració jeràrquica 1, 1.1, 1.1.1                      | Reenumeració automàtica o codis personalitzats       |
| 4.11 Fites                 | Esdeveniments de durada zero                            | Rombe visible al Gantt                               |
| 4.12 Tasques recurrents    | Repetició diària, setmanal, mensual o anual             | Editor avançat de recurrències                       |
| 4.13 Tasques dividides     | Permet interrompre i reprendre una activitat            | Visualització de diversos segments                   |
| 4.14 Tasques inactives     | Exclou activitats de la planificació sense esborrar-les | Comparar escenaris activant o desactivant tasques    |
| 4.15 Prioritat             | Influeix en la gestió del treball i dels recursos       | Escala senzilla i avançada                           |
| 4.16 Percentatge completat | Mesura l'avanç de cada activitat                        | Barra interior amb percentatge                       |
| 4.17 Estat                 | Pendent, en curs, completada                            | Afegir bloquejada, en revisió i cancel·lada          |
| 4.18 Etiquetes             | Classifica les activitats                               | Etiquetes múltiples amb colors                       |
| 4.19 Responsable           | Assigna qui executa la tasca                            | Múltiples responsables i funcions                    |
| 4.20 Notes i documents     | Afegeix informació complementària                       | Fitxers adjunts i enllaços                           |
| 4.21 Checklist             | Divideix una tasca en passos senzills, com a Planner    | Opcionalment, convertir punts en subtasques          |
| 4.22 Copiar i enganxar     | Duplica tasques                                         | També admet enganxar des d'Excel                     |
| 4.23 Edició múltiple       | Aplica canvis a diverses activitats                     | Selecció amb Ctrl o Shift                            |
| 4.24 Eliminar i recuperar  | Suprimeix activitats                                    | Desfés, paperera i comprovació de dependències       |
| 4.25 Cerca                 | Localitza tasques per contingut                         | Cerca global per ID, nom, responsable o etiqueta     |

Microsoft Project ofereix estructures EDT/WBS, subtasques, tasques resum i tasques recurrents. Aquestes estructures són essencials per transformar una llista de treballs en un projecte planificable.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support+2



### Fitxa completa de tasca

En clicar una tasca, s'hauria d'obrir un panell amb pestanyes:

Informació de la tasca

General

Dates

Dependències

Recursos

Costos

Seguiment

Nom

Desenvolupar prototip

Estat

En curs

Inici previst

02/11/2026

Final previst

06/11/2026

Durada

5 dies laborables

Progrés

40%

Aquesta és una proposta conceptual del panell, no una captura de Microsoft Project.

Cap d'aquestes propietats hauria de dependre exclusivament d'arrossegar una barra temporal.

## 5. Diagrama de Gantt professional

Funcionalitat P0 · Referència principal: Microsoft Project Desktop

El Gantt combina una taula de tasques a l'esquerra amb una escala temporal a la dreta. Microsoft permet ajustar aquesta escala des d'hores fins a anys.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support



### Visualització interactiva proposada

Planificació del projecte

DiesSetmanesMesos

Destacar tasques crítiques

Tasca

S1

S2

S3

S4

S5

Anàlisi de requisits

Disseny funcional

Desenvolupament

Proves i validació

Lliurament

Exemple esquemàtic amb dades fictícies. Els controls il·lustren el canvi de vista; el motor de programació real hauria de governar les dates i les dependències.

### Requisits específics del Gantt

| Funcionalitat             | Com ha de funcionar                                               | Valor / millora                                     |
| ------------------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| Barres temporals          | Representen inici, final i durada                                 | Comprensió immediata de la planificació             |
| Arrossegar tasques        | Mou la barra amb el ratolí                                        | Modificació precisa amb confirmació de dates        |
| Redimensionar barres      | Canvia l'inici o final                                            | Actualització automàtica de durada                  |
| Dependències visuals      | Connectors entre activitats                                       | Identificar relacions entre treballs                |
| Fites                     | Rombe a la data prevista                                          | Control dels punts de lliurament                    |
| Tasques resum             | Barra que agrupa les subtasques                                   | Possibilitat de plegar i desplegar                  |
| Ruta crítica              | Destaca activitats crítiques                                      | Localització de riscos temporals                    |
| Progrés                   | Segment interior de cada barra                                    | Comparar treball acabat i pendent                   |
| Línies base               | Barres addicionals de referència                                  | Comparació amb el pla original                      |
| Data actual               | Línia vertical d'avui                                             | Identificació ràpida del moment actual              |
| Data d'estat              | Línia de control independent d'avui                               | Seguiment a una data determinada                    |
| Calendari visual          | Ombreja dies festius i no laborables                              | Evita interpretar dies no disponibles com a treball |
| Escala temporal           | Hores, dies, setmanes, mesos, trimestres i anys                   | Vàlid per a projectes de qualsevol durada           |
| Zoom                      | Amplia o redueix la representació                                 | Vista ajustada al projecte                          |
| Colors                    | Segons estat, prioritat, equip o categoria                        | Informació visual personalitzable                   |
| Etiquetes                 | Mostra nom, dates, recursos o percentatge al costat de les barres | Evita obrir constantment les propietats             |
| Panell ajustable          | Permet canviar l'amplada de la graella i del Gantt                | Treball còmode en pantalles diferents               |
| Desplaçament sincronitzat | Files de la taula i del Gantt sempre alineades                    | Evita errors d'interpretació                        |
| Impressió                 | Selecció de períodes i tasques                                    | Informes realment llegibles                         |

### Millora imprescindible: acabar amb el Gantt infinit

No s'hauria de generar una línia temporal desmesurada que obligui a desplaçar-se horitzontalment constantment.

El programa ha de permetre:

1. Ajustar al projecte: mostrar des de la primera tasca fins a l'última, amb un marge configurable.
2. Ajustar a pantalla: encabir tot el projecte dins l'amplada disponible, modificant l'escala.
3. Interval personalitzat: escollir una data inicial i final de visualització.
4. Anar a avui, a una tasca o a una fita: centrar automàticament el Gantt.
5. Conservar el nivell de zoom per projecte: en tornar a obrir-lo, recuperar la vista utilitzada.

Aquests controls no han d'alterar la durada de les tasques: només la manera com es representen.

## 6. Motor de planificació i dependències

Prioritat P0 per a la planificació bàsica · P1 per a la planificació avançada

Aquest és el component que diferencia Microsoft Project d'una simple eina de tasques.

### 6.1 Tipus de dependències

Microsoft Project admet quatre relacions principals entre activitats.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support



| Tipus                 | Significat                         | Exemple                                       |
| --------------------- | ---------------------------------- | --------------------------------------------- |
| FI — Final-Inici (FS) | B comença quan A acaba             | Acabar el disseny abans de fabricar           |
| II — Inici-Inici (SS) | B pot començar quan A ha començat  | Iniciar supervisió quan comença l'obra        |
| FF — Final-Final (FF) | B no pot acabar abans que A        | Tancar la revisió quan acaba el document      |
| IF — Inici-Final (SF) | B no pot acabar fins que A comenci | Finalització d'un torn quan comença el relleu |

També són necessaris:

- Retard positiu: començar B dos dies després d'acabar A.
- Avançament negatiu: permetre que B comenci abans que A acabi.
- Diverses predecessores i successores per tasca.
- Creació de dependències des de la graella o arrossegant connectors al Gantt.
- Detecció de dependències circulars, abans d'acceptar-les.
- Recàlcul de totes les activitats afectades per qualsevol canvi.

### 6.2 Planificació automàtica i manual

Automàtica: l'usuari introdueix durades, dependències, calendaris i restriccions. El programa calcula les dates.

Manual: l'usuari estableix directament dates o durades. El programa les conserva i avisa quan entren en conflicte amb les relacions del projecte.

Microsoft Project distingeix aquests dos modes.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support



Millora: oferir un selector per tasca i un paràmetre general, amb una explicació visible de per què una data s'ha recalculat o no.

### 6.3 Restriccions temporals

Cal reproduir les vuit restriccions de Project.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support



| Restricció                   | Comportament                                    |
| ---------------------------- | ----------------------------------------------- |
| Tan aviat com sigui possible | Programa al primer moment viable                |
| Tan tard com sigui possible  | Programa al darrer moment viable                |
| No començar abans de         | Impedeix iniciar abans de la data indicada      |
| No començar després de       | Limita l'última data admissible d'inici         |
| No acabar abans de           | Impedeix finalitzar abans de la data indicada   |
| No acabar després de         | Limita l'última data admissible de finalització |
| Ha de començar el            | Fixa obligatòriament una data d'inici           |
| Ha d'acabar el               | Fixa obligatòriament una data final             |

És imprescindible diferenciar data límit i restricció. Una data límit pot generar un avís sense bloquejar la programació; una restricció condiciona el càlcul de dates.

### 6.4 Tipus de tasca segons el treball

Microsoft Project utilitza tres modalitats: unitats fixes, durada fixa i treball fix.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support



| Modalitat     | Com funciona                                       | Utilitat                                         |
| ------------- | -------------------------------------------------- | ------------------------------------------------ |
| Unitats fixes | Conserva el percentatge d'assignació dels recursos | Tasques amb una dedicació establerta             |
| Durada fixa   | Conserva el temps assignat                         | Reunions, formacions o terminis temporals        |
| Treball fix   | Conserva la quantitat total de feina               | Activitats on més recursos poden reduir el temps |

En un cas simplificat, la relació és:

\\[ \text{Treball}=\text{Durada}\times\text{Unitats} \\]

Per exemple, una feina de 40 hores amb una persona al 100% necessita cinc jornades de vuit hores. Amb dues persones al 100%, podria reduir-se a dos dies i mig, sempre que el treball es pugui dividir i els calendaris ho permetin.

### 6.5 Càlculs obligatoris

Cal implementar un motor capaç de calcular:

- Inici i final primerencs i tardans.
- Durada en temps laborable.
- Dependències i retards en temps laborable o transcorregut segons la configuració.
- Ruta crítica.
- Marge total i marge lliure.
- Tasques que condicionen la finalització.
- Dates de les tasques resum a partir de les subtasques.
- Replanificació quan canvien recursos o calendaris.
- Detecció de conflictes entre restriccions.
- Avisos sobre tasques que no poden acabar dins la data objectiu.

La ruta crítica identifica les tasques sense marge temporal suficient per endarrerir-se sense afectar la finalització del projecte. Microsoft també permet configurar el llindar de marge considerat crític.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support



Millora proposada: un botó «Per què aquesta tasca comença aquest dia?» que expliqui les dependències, calendaris i restriccions que han determinat la data calculada.

## 7. Calendaris laborals i disponibilitat

El càlcul de dates no pot limitar-se a sumar dies naturals.

| Requisit              | Funcionament                         | Millora                                        |
| --------------------- | ------------------------------------ | ---------------------------------------------- |
| Calendari base        | Defineix l'horari general            | Configuracions reutilitzables                  |
| Calendari de projecte | Regula quan es pot treballar         | Permetre diversos torns                        |
| Calendari per recurs  | Reflecteix disponibilitat individual | Vacances, baixes i disponibilitats             |
| Calendari per tasca   | Restringeix hores d'execució         | Treballs nocturns o caps de setmana            |
| Dies festius          | Exclou dies no laborables            | Importació de festius per comunitat o municipi |
| Excepcions            | Permet dies especials                | Repeticions anuals                             |
| Jornada parcial       | Capacitat reduïda d'un recurs        | Percentatge i franges horàries                 |
| Jornada nocturna      | Treball que travessa la mitjanit     | Càlcul correcte entre dates                    |
| Calendari 24 hores    | Treballs continus                    | Útil per processos automatitzats               |
| Hores extres          | Treball fora de la jornada ordinària | Cost diferenciat                               |
| Calendari visual      | Consulta de disponibilitat           | Vista conjunta d'equip                         |

Project combina els calendaris de projecte, tasques i recursos, i pot utilitzar la intersecció de les seves disponibilitats per planificar una assignació.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support+1



La millora consistiria a explicar visualment per què una activitat s'ha desplaçat: per exemple, «La tasca s'inicia dilluns perquè el recurs no treballa divendres».

## 8. Gestió de recursos humans, materials i equips

Referència: Microsoft Project Professional · Prioritat P1

Una de les funcionalitats més potents de Project és que no només estableix quan es farà una tasca, sinó també qui la farà, amb quina disponibilitat i amb quin cost.

| Funcionalitat                | Com funciona                                        | Valor que aporta                      |
| ---------------------------- | --------------------------------------------------- | ------------------------------------- |
| Recursos de treball          | Persones, equips o maquinària que realitzen treball | Planificació segons la capacitat real |
| Recursos materials           | Consum de materials amb unitats i tarifes           | Control de quantitats i costos        |
| Recursos de cost             | Despeses assignades a activitats                    | Incorporació de despeses variables    |
| Full de recursos             | Taula amb tots els recursos del projecte            | Administració centralitzada           |
| Assignació de recursos       | Relaciona recursos amb tasques                      | Responsabilitats definides            |
| Unitats d'assignació         | 25%, 50%, 100%, 200%...                             | Mesura la dedicació assignada         |
| Disponibilitat               | Determina quan es pot utilitzar cada recurs         | Evita planificacions inviables        |
| Capacitat màxima             | Quantitat de treball simultani admissible           | Detecció de sobreassignacions         |
| Sobreassignació              | Identifica recursos amb excés de feina              | Prevenció de colls d'ampolla          |
| Anivellament automàtic       | Retarda o divideix tasques per resoldre conflictes  | Planificació executable               |
| Anivellament manual          | L'usuari decideix quines tasques moure              | Més control sobre les decisions       |
| Prioritat d'anivellament     | Determina quines tasques es poden retardar          | Protecció de treballs essencials      |
| Gràfic de recursos           | Mostra càrrega de treball al llarg del temps        | Localització de pics d'activitat      |
| Ús dels recursos             | Detalla hores per recurs i tasca                    | Seguiment de dedicacions              |
| Planificador d'equips        | Organitza visualment el treball de les persones     | Reassignació intuïtiva                |
| Disponibilitat variable      | Permet que una persona canviï de dedicació          | Planificació de contractes parcials   |
| Bossa compartida de recursos | Reutilitza recursos en diferents projectes          | Planificació conjunta                 |
| Distribució del treball      | Reparteix les hores entre diferents períodes        | Adaptació a càrregues no uniformes    |

Microsoft Project pot resoldre sobreassignacions retardant o dividint tasques, en funció de les opcions configurades.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support+2



### Millora de ProjectCraft

Crear una vista Càrrega de treball amb una matriu com aquesta:

| Recurs | Setmana 1 | Setmana 2 | Setmana 3 | Capacitat |
| ------ | --------- | --------- | --------- | --------- |
| Anna   | 30 h      | 40 h      | 20 h      | 40 h/set. |
| Marc   | 35 h      | 48 h      | 42 h      | 40 h/set. |
| Laura  | 20 h      | 25 h      | 35 h      | 40 h/set. |

Quan hi hagi sobreassignació, el programa ha de presentar alternatives: reprogramar l'activitat, dividir-la, reduir la dedicació o assignar un recurs disponible. No ha de modificar silenciosament el projecte.

## 9. Costos, pressupostos i control econòmic

Prioritat P1

| Requisit                 | Funcionament i aportació                                  |
| ------------------------ | --------------------------------------------------------- |
| Pressupost inicial       | Defineix el límit econòmic del projecte                   |
| Tarifes horàries         | Estableix el cost de treball de cada persona o equip      |
| Tarifes extraordinàries  | Calcula el cost diferenciat de les hores extres           |
| Cost per utilització     | Registra una despesa cada vegada que s'utilitza un recurs |
| Costos fixos             | Assigna imports independents de les hores treballades     |
| Costos materials         | Calcula el preu segons quantitat i tarifa                 |
| Costos de tasca          | Suma costos directes i recursos assignats                 |
| Costos resum             | Agrega els costos de les subtasques sense duplicar-los    |
| Cost total del projecte  | Agrega totes les despeses                                 |
| Cost previst             | Quantifica el pressupost planificat                       |
| Cost real                | Registra les despeses executades                          |
| Cost pendent             | Estima la despesa per completar el treball                |
| Cost final estimat       | Projecció del cost total quan acabi                       |
| Cost acumulat            | Visualitza la despesa al llarg del temps                  |
| Desviació pressupostària | Compara costos actuals amb la referència                  |
| Distribució temporal     | Imputa costos a l'inici, durant l'execució o al final     |
| Gràfic de flux de caixa  | Representa la previsió temporal de desemborsaments        |
| Moneda                   | Permet definir símbol, decimals i format                  |

Microsoft Project permet configurar el moment en què s'imputen els costos i generar informes econòmics, inclosos fluxos de caixa i desviacions.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support+1



### Valor afegit

ProjectCraft hauria de tenir un simulador de costos. Per exemple: «Què passa si afegim una persona, augmentem les hores extraordinàries o retardem el projecte dues setmanes?».

El sistema mostraria simultàniament l'impacte sobre la data final, el cost i les sobreassignacions.

## 10. Línies base, seguiment i desviacions

Prioritat P1 · Essencial per a projectes professionals

Una línia base és una fotografia del pla aprovat en un moment determinat.

Microsoft Project Desktop permet conservar fins a 11 conjunts de línies base, comparant, entre d'altres, les dates, durades, treball i costos planificats amb les dades actuals.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support



### Requisits

| Funcionalitat              | Funcionament                                    | Millora                                |
| -------------------------- | ----------------------------------------------- | -------------------------------------- |
| Guardar línia base         | Desa els valors previstos                       | Nom i descripció de cada versió        |
| Diverses línies base       | Permet comparar successives revisions           | Historial sense un límit funcional fix |
| Línia base parcial         | Guarda només activitats seleccionades           | Control de fases independents          |
| Gantt de seguiment         | Mostra pla original i actual                    | Dues barres superposades               |
| Dates reals                | Recull l'inici i final efectius                 | Distinció clara de dates planificades  |
| Durada real                | Registra el temps consumit                      | Comparació amb la durada prevista      |
| Treball real               | Registra les hores efectuades                   | Seguiment d'esforç                     |
| Treball pendent            | Quantifica l'esforç restant                     | Previsió actualitzada                  |
| Progrés                    | Percentatge de completitud                      | Càlcul per durada o per treball        |
| Data d'estat               | Estableix el moment de referència del seguiment | Consultes històriques                  |
| Desviació d'inici          | Compara inici previst i actual                  | Identificació de retards               |
| Desviació de final         | Compara final previst i actual                  | Control del calendari                  |
| Variació de costos         | Compara pressupost i estimació actual           | Control econòmic                       |
| Actualització del projecte | Replanifica el treball pendent                  | Respectar la feina realitzada          |
| Historial de canvis        | Registra modificacions                          | Possibilitat de recuperar versions     |

### Exemple

Una tasca estava prevista del 2 al 6 de novembre, però finalment es calcula que acabarà l'11 de novembre.

ProjectCraft ha de permetre veure les dues barres i mostrar la desviació en temps laborable. També ha de recalcular les tasques dependents i advertir si es modifica la data final del projecte.

## 11. Valor guanyat (Earned Value Management)

Prioritat P2 · Gestió professional avançada

Microsoft Project incorpora dades per analitzar el valor guanyat, una tècnica que relaciona pressupost, treball executat i progrés previst.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support+1



Cal incorporar els indicadors següents:

| Indicador | Significat                   | Càlcul                                              |
| --------- | ---------------------------- | --------------------------------------------------- |
| PV        | Valor planificat             | Cost pressupostat del treball programat             |
| EV        | Valor guanyat                | Cost pressupostat del treball efectivament executat |
| AC        | Cost real                    | Despesa del treball executat                        |
| CV        | Variació de cost             | EV − AC                                             |
| SV        | Variació de programació      | EV − PV                                             |
| CPI       | Índex de rendiment de costos | EV / AC                                             |
| SPI       | Índex de rendiment temporal  | EV / PV                                             |
| BAC       | Pressupost total aprovat     | Cost de la línia base                               |
| EAC       | Cost final estimat           | Estimació segons el rendiment                       |
| ETC       | Cost pendent estimat         | EAC − AC                                            |
| VAC       | Variació prevista en acabar  | BAC − EAC                                           |

Cal indicar la metodologia utilitzada per calcular EAC i gestionar correctament els casos en què un denominador és zero.

Millora: traduir aquests indicadors tècnics a explicacions comprensibles, sense perdre'n el detall matemàtic.

## 12. Vistes disponibles: Project + Planner

Project disposa de diferents representacions de tasques, recursos i assignacions. Planner també incorpora graella, tauler, gràfics, cronograma, persones i objectius, en funció del tipus de pla.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support+2



ProjectCraft hauria d'incorporar les vistes següents:

| Vista                | Funció                                                | Prioritat |
| -------------------- | ----------------------------------------------------- | --------- |
| Graella de tasques   | Edició en format taula, semblant a Excel              | P0        |
| Gantt                | Planificació temporal i dependències                  | P0        |
| Kanban               | Targetes agrupades per estat, responsable o categoria | P0        |
| Calendari            | Tasques sobre dies, setmanes o mesos                  | P0        |
| Cronologia executiva | Resum de fases i fites                                | P1        |
| Diagrama de xarxa    | Relacions entre tasques com a graf                    | P1        |
| Gantt de seguiment   | Comparació amb línies base                            | P1        |
| Gantt detallat       | Marges, desviacions i informació addicional           | P1        |
| Graella de recursos  | Catàleg de persones, equips i materials               | P1        |
| Ús de recursos       | Hores assignades per període                          | P1        |
| Ús de tasques        | Treball de cada recurs dins de cada tasca             | P1        |
| Gràfic de recursos   | Histograma de dedicació                               | P1        |
| Planificador d'equip | Treballs distribuïts per persona                      | P1        |
| Vista de persones    | Càrrega de treball individual                         | P1        |
| Objectius            | Vinculació entre tasques i resultats                  | P1        |
| Backlog              | Treball pendent prioritzat                            | P1        |
| Sprint               | Tasques d'un cicle de treball                         | P1        |
| Costos               | Pressupost i desviacions                              | P1        |
| Informes             | Indicadors i resums executius                         | P1        |
| Cartera de projectes | Seguiment conjunt de projectes                        | P2        |
| Formulari de tasques | Fitxa detallada d'una activitat                       | P0        |
| Vista dividida       | Dos panells amb dades relacionades                    | P1        |

### Requisits específics de la graella

La graella no ha de ser una simple llista de noms. Ha de permetre editar dades de manera semblant a un full de càlcul:

- Inserir, ocultar, fixar, reordenar i redimensionar columnes.
- Ordenar i filtrar per qualsevol camp.
- Seleccionar cel·les, files o intervals.
- Copiar i enganxar des d'Excel.
- Editar amb doble clic i navegar amb Tab, Enter i fletxes.
- Agrupar tasques per fase, responsable, estat o categoria.
- Desplegar i plegar nivells de subtasques.
- Guardar configuracions de vista personalitzades.
- Combinar seleccions múltiples amb operacions massives.
- Mostrar cel·les calculades i distingir-les de les editables.

### Columnes disponibles

Com a mínim: ID, WBS, nom, tipus, mode de programació, durada, inici, final, inici real, final real, inici de línia base, final de línia base, predecessores, successores, marge, crítica, data límit, recurs, esforç, esforç real, esforç pendent, progrés, prioritat, estat, calendari, cost, cost real, cost pendent, desviació, etiqueta, notes, data de creació i data de modificació.

També han de poder aparèixer els camps personalitzats que defineixi l'usuari.

## 13. Microsoft Planner: Kanban, treball àgil i organització d'equips

Prioritat P1 · Referència: Planner Basic i Premium

A més de Project Desktop, cal incorporar el model de treball de Planner, que és més accessible per a equips que no necessiten dominar la programació avançada.

| Requisit              | Com funciona                              | Què milloraria                       |
| --------------------- | ----------------------------------------- | ------------------------------------ |
| Taulers Kanban        | Tasques en columnes amb targetes          | Columnes configurables               |
| Cubells o buckets     | Agrupa activitats en categories           | Classificació independent de l'estat |
| Drag & drop           | Mou targetes entre grups                  | Canvis immediats a les altres vistes |
| Prioritats            | Classifica la importància del treball     | Criteris visuals personalitzables    |
| Etiquetes de colors   | Permet localitzar categories              | Diverses etiquetes per activitat     |
| Progrés per targeta   | Mostra informació de completitud          | Indicador de feina pendent           |
| Checklist             | Passos interns d'una tasca                | Convertir passos en tasques          |
| Backlog               | Llista prioritzada de treball futur       | Ordenació per valor, risc o urgència |
| Sprints               | Agrupa tasques en iteracions              | Seguiment de velocitat i objectius   |
| Objectius             | Relaciona treball i resultats             | Mesurar progrés dels objectius       |
| Vista de persones     | Organitza tasques segons responsable      | Detectar desequilibris de càrrega    |
| Les meves tasques     | Agrega activitats assignades              | Consulta entre diferents projectes   |
| El meu dia            | Selecció de feina immediata               | Priorització diària                  |
| Tasques recurrents    | Repetició automàtica d'activitats         | Patrons complexos de recurrència     |
| Converses             | Comentaris vinculats a una tasca          | Historial contextual                 |
| Historial de tasques  | Registra canvis                           | Auditoria amb diferències detallades |
| Camps personalitzats  | Adapta les tasques a cada equip           | Més tipus i fórmules                 |
| Coloració condicional | Destaca tasques segons dades              | Regles configurables                 |
| Gràfics de Planner    | Resums per estat, responsable i prioritat | Panell de control configurable       |

Microsoft diferencia actualment entre Planner Basic i Premium. Entre les funcions Premium hi ha les dependències, el Gantt, els sprints, els objectius, la vista de persones, els calendaris personalitzats i la ruta crítica.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support+1



### Millora decisiva

No crear dos tipus de projectes incompatibles. A ProjectCraft, un projecte creat en mode Kanban s'hauria de poder visualitzar en Gantt o graella sense convertir-lo.

Això exigeix separar clarament l'estat de la tasca, el bucket, la seva posició en l'EDT i les dates. Són propietats diferents i no s'han de confondre.

## 14. Projectes mestres, subprojectes i carteres

Prioritat P2

Microsoft Project Desktop permet relacionar diversos fitxers en un projecte mestre, amb subprojectes vinculats i dependències externes.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support



Requisits per incorporar:

- Projecte mestre amb diversos projectes vinculats.
- Subprojectes editables de manera independent.
- Tasques predecessores de projectes diferents.
- Recursos compartits entre projectes.
- Identificació de conflictes de disponibilitat entre projectes.
- Vista Gantt conjunta amb fases i fites.
- Cartera de projectes amb filtres per responsable, estat i prioritat.
- Pressupost i progrés acumulats.
- Comparació de projectes.
- Consolidació d'informes.
- Dependències entre projectes.
- Roadmap de fites estratègiques.
- Escenaris alternatius de cartera.
- Detecció de projectes que competeixen pels mateixos recursos.

Millora: un panell que permeti veure ràpidament quins projectes estan endarrerits, quins consumeixen més pressupost del previst i quins competeixen pels mateixos recursos.

## 15. Informes, estadístiques i indicadors

Prioritat P1

Microsoft Project inclou informes de situació, costos, recursos i valor guanyat, així com informes visuals exportables.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support



ProjectCraft hauria de generar automàticament:

| Informe                 | Informació que ofereix                           |
| ----------------------- | ------------------------------------------------ |
| Resum general           | Dates, durada, cost i progrés del projecte       |
| Estat actual            | Activitats completades, en curs i pendents       |
| Tasques endarrerides    | Treballs que han superat les dates previstes     |
| Properes activitats     | Treball previst per als dies o setmanes següents |
| Fites                   | Fites aconseguides, pendents i endarrerides      |
| Ruta crítica            | Activitats que condicionen la finalització       |
| Desviacions temporals   | Diferències respecte de les línies base          |
| Recursos sobreassignats | Persones o equips amb excés de feina             |
| Càrrega de treball      | Dedicació per recurs i període                   |
| Costos de projecte      | Prevists, reals i pendents                       |
| Flux de caixa           | Distribució temporal de despeses                 |
| Valor guanyat           | Indicadors EV, PV, AC, CPI i SPI                 |
| Riscos                  | Incidències i riscos registrats                  |
| Comparació de versions  | Canvis entre dues versions                       |
| Informe executiu        | Resum per a direcció, sense detall innecessari   |

### Formats de sortida

PDF, Excel, CSV, HTML, imatge PNG o SVG per als gràfics i una vista imprimible.

Millores: informes que es poden personalitzar, guardar com a plantilla i generar amb un interval temporal determinat. També possibilitat de preparar un informe de situació setmanal sense haver de reconstruir-lo manualment.

## 16. Personalització, filtres i camps calculats

Prioritat P1

Project Desktop disposa de camps personalitzats, llistes de valors, fórmules i indicadors gràfics. Planner també té camps personalitzats, però les seves capacitats no són idèntiques.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support+1



ProjectCraft hauria de permetre:

- Crear camps de text, nombre, moneda, data, hora, percentatge, booleà, llista i selecció múltiple.
- Assignar valors predeterminats i camps obligatoris.
- Definir fórmules basades en altres camps.
- Calcular valors agregats en tasques resum.
- Crear regles de coloració condicional.
- Guardar filtres simples i avançats.
- Combinar filtres amb operadors AND / OR.
- Agrupar activitats per diversos nivells.
- Crear taules amb columnes predefinides o personalitzades.
- Guardar vistes amb noms propis.
- Compartir la configuració de les vistes a través del fitxer.
- Exportar i importar plantilles de camps i vistes.

Millora: implementar fórmules sense executar JavaScript arbitrari introduït per l'usuari. Un petit motor d'expressions validat és més segur i permet mantenir consistents els càlculs.

## 17. Interfície i menús superiors

Prioritat P0

Per resultar familiar als usuaris de Microsoft Project, ProjectCraft hauria de tenir una cinta superior amb grups d'accions contextuals.

ProjectCraft

Fitxer

Tasca

Recurs

Projecte

Vista

Format

Informe

Ajuda

Nova tasca

Sagnar

Vincular

Calendari

Línia base

Gantt

Exportar

Proposta conceptual de distribució de la cinta d'eines.

Els menús haurien de contenir les accions següents:

| Menú     | Funcionalitats                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Fitxer   | Nou, obrir, guardar, guardar com, importar, exportar, plantilles, imprimir, propietats, recuperar versions                      |
| Tasca    | Afegir, editar, duplicar, eliminar, sagnar, anul·lar sagnat, vincular, desvincular, fita, resum, dividir, completar, informació |
| Recurs   | Crear recurs, assignar, full de recursos, disponibilitat, tarifes, anivellar, càrrega, calendari del recurs                     |
| Projecte | Informació general, calendari, data d'estat, línia base, EDT, ruta crítica, reprogramar, comparació                             |
| Vista    | Graella, Gantt, Kanban, calendari, xarxa, ús de recursos, panells, filtres, grups, zoom                                         |
| Format   | Colors, fonts, barres, columnes, etiquetes, quadrícula, escala temporal, estils                                                 |
| Informe  | Resum executiu, progrés, costos, recursos, desviacions, informes personalitzats                                                 |
| Ajuda    | Documentació, dreceres, exemples, diagnòstic del projecte, informació de la versió                                              |

Altres requisits de l'entorn:

- Barra d'accés ràpid amb Desfés, Refés i Desa.
- Pestanyes per a diversos projectes oberts.
- Menús contextuals amb clic dret.
- Cercador de comandaments.
- Dreceres de teclat.
- Barra inferior amb estat del desament, vista actual i zoom.
- Finestra de configuració general.
- Tema clar i fosc.
- Adaptació a pantalles petites.
- Accessibilitat mitjançant teclat, etiquetes i lectors de pantalla.
- Diàlegs de confirmació en operacions destructives.
- Cap comandament aparentment habilitat que no faci res.

La cinta pot ser similar en estructura, però no s'hauria de copiar la marca, els recursos gràfics ni la identitat visual protegida de Microsoft.

## 18. Importació, exportació i compatibilitat amb Microsoft Project

Prioritat P0 per al format propi i XML · P1/P2 per a compatibilitat avançada

Aquest apartat és especialment important per a l'objectiu d'oferir una alternativa real.

Microsoft Project utilitza el format `.mpp` com a format habitual de projecte, però també permet intercanviar dades mitjançant XML, Excel i CSV. No tots aquests formats conserven el mateix nivell d'informació.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support+1



| Format                           | Importar                             | Exportar                             | Prioritat |
| -------------------------------- | ------------------------------------ | ------------------------------------ | --------- |
| JSON propi versionat             | Sí                                   | Sí                                   | P0        |
| XML de Microsoft Project (MSPDI) | Sí                                   | Sí                                   | P1        |
| Excel XLSX                       | Sí                                   | Sí                                   | P1        |
| CSV                              | Sí                                   | Sí                                   | P1        |
| PDF                              | No com a projecte editable           | Sí                                   | P1        |
| PNG/SVG del Gantt                | No                                   | Sí                                   | P1        |
| iCalendar ICS                    | Sí, per a dades compatibles          | Sí                                   | P2        |
| Microsoft Project MPP            | Desitjable, amb conversió verificada | Desitjable, amb conversió verificada | P2        |
| Plantilles ProjectCraft          | Sí                                   | Sí                                   | P0        |

### Precaució tècnica amb `.mpp`

No és correcte prometre compatibilitat total amb `.mpp` simplement perquè es pugui generar un XML o canviar l'extensió d'un fitxer.

Per aconseguir-ho cal un lector/escriptor realment compatible, preservar els camps que admeti el conversor i validar els fitxers amb versions de Microsoft Project. És una tasca d'enginyeria independent.

Estratègia recomanada: implementar primer una importació i exportació MSPDI XML fidel, documentant quines dades es conserven i quines no. Després estudiar la conversió a `.mpp`.

### Regles d'importació

- Detectar el format del fitxer.
- Permetre mapar columnes d'Excel als camps del projecte.
- Validar dates, durades, costos, codis i dependències.
- Mostrar una previsualització abans de la importació.
- Importar recursos i assignacions, no només noms de tasques.
- Detectar duplicats i referències inexistents.
- Informar sobre camps no compatibles.
- Conservar dades originals quan sigui possible.
- Evitar sobreescriure el projecte actual sense confirmació.
- Permetre cancel·lar la importació sense deixar dades parcials.

Un criteri essencial és superar proves de round-trip: exportar un projecte, reimportar-lo i comprovar que es mantenen les dates, calendaris, dependències, recursos, costos i identificadors esperats.

## 19. Persistència, privadesa i col·laboració

Prioritat P0 per a desament local · P2 per a sincronització compartida

### Funcionament sense servidor obligatori

Per a una aplicació allotjada a GitHub Pages, proposo:

- Emmagatzematge local estructurat amb IndexedDB.
- Desament automàtic després dels canvis.
- Historial d'operacions per desfer i refer.
- Còpies de seguretat exportables.
- Recuperació davant errors o tancaments inesperats.
- Projectes diferenciats per identificadors únics.
- Possibilitat d'utilitzar l'aplicació sense connexió després de carregar-la, mitjançant PWA.
- Validació dels fitxers importats.
- Gestió explícita dels límits d'emmagatzematge del navegador.
- Opció d'exportar tots els projectes conjuntament.

### Col·laboració opcional

Una aplicació completament local no pot oferir, per si sola, edició simultània persistent entre dispositius. Per això caldria separar la versió local d'un mòdul opcional de col·laboració.

Aquest mòdul podria incorporar:

- Compartició de projectes.
- Rols de lectura, edició i administració.
- Edició simultània.
- Historial de canvis per usuari.
- Resolució de conflictes.
- Comentaris, mencions i notificacions.
- Assignacions entre persones.
- Enllaços de consulta.
- Sincronització amb un servei extern opcional.

Millora respecte d'un sistema completament al núvol: qui només vulgui gestionar projectes personals no necessitarà crear cap compte ni cedir dades a un servidor.

## 20. Funcionalitats avançades que també cal preveure

Aquestes característiques completen l'abast d'una alternativa professional i incorporen algunes millores que no són funcions estàndard de Microsoft Project.

| Funcionalitat                    | Utilitat                                                      | Prioritat |
| -------------------------------- | ------------------------------------------------------------- | --------- |
| Escenaris «Què passaria si...? » | Comparar diferents terminis, recursos i pressupostos          | P2        |
| Anàlisi de riscos                | Registrar probabilitat, impacte i plans de resposta           | P2        |
| Gestió d'incidències             | Seguiment de problemes que afecten el projecte                | P2        |
| Sol·licituds de canvi            | Controlar modificacions d'abast, cost i calendari             | P2        |
| Comparador de versions           | Mostrar què ha canviat entre dos projectes                    | P1        |
| Registre d'auditoria             | Historial de modificacions amb marca temporal                 | P1        |
| Automatitzacions                 | Accions basades en condicions, dates o estats                 | P2        |
| Notificacions locals             | Avisar sobre fites i terminis en obrir l'aplicació            | P1        |
| Centre de diagnòstic             | Localitzar dependències errònies i configuracions incoherents | P1        |
| Camp de cerca de comandaments    | Executar funcions sense navegar pels menús                    | P1        |
| Importador de plantilles         | Reutilitzar estructures de treball                            | P0        |
| Biblioteca de recursos           | Reutilitzar persones, materials i tarifes                     | P1        |
| Organitzador de configuracions   | Copiar calendaris, taules, filtres i vistes entre projectes   | P2        |
| Comparació de línies base        | Veure l'evolució de successives planificacions                | P1        |
| Automatització amb scripts       | API documentada per ampliar el programa                       | P2        |
| Integracions externes            | Calendari, Excel, eines de gestió i API                       | P2        |
| Assistència amb IA               | Proposar tasques, detectar riscos i ajudar a planificar       | P3        |
| Traduccions                      | Català, castellà i anglès, entre altres                       | P1        |

Les integracions de col·laboració, l'edició simultània i les funcions d'IA que requereixin serveis externs han de quedar fora del nucli que funciona localment.

## 21. Model de dades necessari

Un error arquitectònic habitual és construir primer la interfície i afegir-hi després les dades. Per a ProjectCraft cal fer-ho a l'inrevés: definir el model de projecte i el motor de càlcul, i construir-hi les diferents vistes al damunt.

PROJECTE

Identitat · Configuració · Dates · Calendari · Moneda

TASQUES

Jerarquia · Dates · Durades · Estat

DEPENDÈNCIES

Origen · Destí · Tipus · Retard

RECURSOS

Disponibilitat · Tarifes · Calendaris

ASSIGNACIONS

Tasca · Recurs · Unitats · Treball

LÍNIES BASE

Versions · Dates · Costos · Esforç

SEGUIMENT

Progrés · Temps real · Desviacions

VISTES

Columnes · Filtres · Zoom · Colors

HISTORIAL

Canvis · Versions · Recuperacions

Motor de càlcul compartit

Planificació · Ruta crítica · Recursos · Costos · Informes

### Regles tècniques essencials

1. Cada projecte, tasca i recurs ha de tenir un identificador intern estable, independent de la seva posició visual o codi WBS.
2. Les dependències han de referenciar identificadors estables, mai simplement el número de fila.
3. Cal diferenciar dades introduïdes per l'usuari, dades calculades, dades reals i dades de línia base.
4. El càlcul de dates ha de centralitzar-se en un únic motor de planificació.
5. Totes les vistes han de compartir el mateix estat del projecte.
6. Els fitxers propis han d'incloure una versió d'esquema i migracions entre versions.
7. Les operacions han de ser reversibles quan sigui possible.
8. Els càlculs econòmics han d'utilitzar precisió decimal adequada.
9. Els calendaris han de gestionar correctament zones horàries, canvis d'hora i jornades nocturnes.
10. La interfície ha d'utilitzar virtualització de files i representació eficient del Gantt per suportar projectes grans.

Si només s'implementen components visuals i cadascun modifica les dates amb les seves pròpies regles, acabaran apareixent contradiccions entre la graella, el Gantt i els informes.

## 22. Proves d'acceptació imprescindibles

Aquests casos haurien de formar part dels tests automatitzats de ProjectCraft.

| Prova                                         | Resultat esperat                                                        |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| Crear una tasca                               | Apareix a graella, Gantt i Kanban                                       |
| Modificar-ne el nom                           | S'actualitza a totes les vistes                                         |
| Fixar inici i final                           | Calcula la durada segons calendari i mode                               |
| Canviar la durada                             | Recalcula la data corresponent segons el mode de programació            |
| Enllaçar A amb B                              | B respecta la dependència establerta                                    |
| Allargar A                                    | B es reprograma si el seu mode i restriccions ho permeten               |
| Crear dependència circular                    | El sistema la rebutja i explica el problema                             |
| Afegir un festiu                              | Les tasques afectades es reprogramen quan correspon                     |
| Crear una tasca resum                         | Agrega correctament la informació de les subtasques                     |
| Assignar dues tasques simultànies a un recurs | Detecta sobreassignació quan supera la capacitat                        |
| Guardar una línia base                        | Conserva les dades originals encara que canviï el projecte              |
| Importar XML                                  | Reconstrueix la informació compatible                                   |
| Exportar i reimportar                         | Manté la coherència de les dades                                        |
| Desfer una eliminació                         | Recupera les tasques i les relacions                                    |
| Recarregar el navegador                       | Recupera l'última versió desada                                         |
| Canviar de vista                              | No modifica les dades del projecte                                      |
| Ajustar el Gantt a pantalla                   | Mostra l'interval escollit sense alterar tasques                        |
| Obrir un projecte antic                       | Migra les dades o mostra un error recuperable sense destruir l'original |

A aquests tests funcionals cal afegir proves de rendiment, accessibilitat, seguretat, persistència i compatibilitat amb navegadors.

## 23. Priorització del desenvolupament de ProjectCraft

Intentar implementar totes les funcionalitats simultàniament no és una estratègia eficient. El resultat habitual és una interfície aparentment completa amb molts botons, però amb comportaments parcials o inconsistents.

Proposo aquesta seqüència:

## P0

Nucli

Fase 1. ProjectCraft funcional i fiable

Projectes, propietats generals, dates inicial i final, tasques, subtasques, graella editable, Gantt ajustable, dependències bàsiques, calendari laboral, motor de programació, Kanban, desament local, JSON, plantilles i interfície de menús funcional.

## P1

Professional

Fase 2. Capacitats principals de Microsoft Project

Quatre dependències, restriccions, ruta crítica, marges, fites, calendaris avançats, recursos, anivellament, costos, línies base, seguiment, informes, vistes avançades, camps personalitzats, XML, Excel i PDF.

## P2

Avançat

Fase 3. Capacitats corporatives

Projectes mestres, carteres, recursos compartits, valor guanyat, escenaris, simulació, riscos, automatitzacions, compatibilitat `.mpp` verificada i col·laboració opcional.

## P3

Evolució

Fase 4. Diferenciació

Assistència amb IA, predicció de retards, optimització de recursos, integracions especialitzades i automatitzacions avançades.

## 24. Què faria millor que Microsoft?

Aquestes són les diferències que considero més interessants per convertir ProjectCraft en un producte realment atractiu.

| Microsoft Project / Planner                                    | Oportunitat de ProjectCraft                                                       |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Productes amb diferents conjunts de funcions                   | Una sola aplicació amb totes les vistes sobre les mateixes dades                  |
| Algunes funcions avançades requereixen llicències Premium      | Funcionalitats gratuïtes sense barreres de pagament                               |
| Project Desktop té una corba d'aprenentatge considerable       | Mode senzill i avançat dins del mateix programa                                   |
| La configuració de dates i restriccions pot resultar complexa  | Explicacions clares dels canvis de planificació                                   |
| La graella i el Gantt requereixen dominar diferents operacions | Edició directa i fitxa de tasca sempre accessible                                 |
| La gestió de sobreassignacions pot modificar el calendari      | Simulació i previsualització abans d'aplicar canvis                               |
| Formats i serveis diferents segons el producte                 | Fitxer propi obert, exportació i compatibilitat documentada                       |
| L'ecosistema afavoreix els serveis de Microsoft                | Ús local sense compte ni servidor obligatori                                      |
| Planner té límits de tasques per pla                           | Sense límits comercials fixats en l'aplicació; rendiment dependent del dispositiu |
| Molts camps tècnics són difícils d'interpretar                 | Diagnòstic explicatiu dels càlculs i conflictes                                   |

Microsoft documenta, per exemple, límits de 9.000 tasques per pla Basic i 3.000 per pla Premium a la seva comparativa actual.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://support.microsoft.com\&sz=32)

Microsoft Support



## 25. Criteris finals per considerar ProjectCraft una alternativa real

Checklist de validació

0 de 12 criteris marcats

Reiniciar

Crear i editar tasques completes des de la graella i la fitxa

Configurar inici, final i calendari del projecte

Utilitzar un Gantt acotat i ajustable a pantalla

Implementar dependències amb reprogramació correcta

Disposar de graella, Gantt, Kanban i calendari coherents

Gestionar recursos i detectar sobreassignacions

Calcular costos, línies base i desviacions

Calcular ruta crítica i marges temporals

Importar i exportar formats estructurats sense perdre dades compatibles

Desar, recuperar i migrar projectes antics

Fer funcionar tots els menús i accions visibles

Superar proves automàtiques de planificació i persistència

&#x20;Copiar checklist

### Conclusió

Per a ProjectCraft, l'ordre correcte és: primer la coherència de les dades, després el motor de planificació, després les vistes i finalment les funcionalitats avançades.

El nivell de fidelitat amb Microsoft Project no s'ha de mesurar pel nombre de botons que s'assemblen als de Microsoft, sinó pel nombre de comportaments reals que es poden reproduir i validar.

La primera fita seria aconseguir que un usuari pugui construir un projecte complex amb tasques jeràrquiques, dates, calendaris i dependències, visualitzar-lo en graella i Gantt, modificar-lo sense inconsistències i guardar-lo amb garanties. A partir d'aquí, afegir recursos, costos, control i compatibilitat és una evolució sòlida.

Aquest document és un inventari funcional ampli dels principals mòduls de Microsoft Project Desktop i Planner, més ampliacions proposades, no una reproducció exhaustiva de tots els camps interns, comandaments VBA o comportaments històrics de cada versió. Per convertir-lo en una especificació implementable, cada requisit hauria de tenir un identificador, casos límit i proves d'acceptació pròpies.