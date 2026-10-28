# ProjectCraft — seguiment del desenvolupament

La font completa de requisits aportada per l’usuari es conserva sense omissions a [MSProject-Planner.md](MSProject-Planner.md). És l’abast objectiu, no una declaració de funcionalitats ja disponibles. Les afirmacions de producte que conté queden registrades tal com s’han aportat i no constitueixen una verificació de fonts.

## Actualització del 28 d’octubre de 2026

| Àrea | Estat d’aquesta entrega | Límits pendents |
| --- | --- | --- |
| Columnes | Ajust al contingut, arrossegament, doble clic per autoajust, teclat i amplades desades per projecte/vista | Ocultar, fixar i reordenar columnes arbitràriament |
| IDs | Número de fila automàtic, UUID intern estable i UID numèric automàtic per a intercanvi | Migrar les dependències natives de text/número de fila a referències internes estables |
| Recursos | Catàleg de treball, materials i costos; noms, grups, correus, tarifes, capacitats | Calendaris individuals, disponibilitat variable, hores extres |
| Tasques i subtasques | Jerarquia amb identificadors estables, sagnat i anul·lació, resums amb dates, progrés i costos agregats, codis EDT i plegat | Les tasques resum no admeten predecessors ni recursos propis; la ruta crítica encara no funciona amb jerarquies |
| Assignacions | Diversos recursos per tasca, dedicació %, quantitats o imports segons tipus | Distribució temporal, treball real i calendari per assignació |
| Costos | Cost fix més recursos; treball = durada × 8 h × dedicació × tarifa | Cost real, desviacions, precisió decimal monetària avançada, EVM |
| Càrrega | Detecció diària de sobreassignacions respecte a capacitat % | No modifica dates ni fa anivellament; jornada assumida de 8 hores |
| MPP14 | Lector/escriptor local experimental amb `mppwriter` 0.4.3, previsualització i projecte nou; exportació amb plantilla aportada per l’usuari | No equival a compatibilitat completa amb Microsoft Project. Proves amb dues mostres MPP14 independents de MPXJ i anada/tornada binària. Pendent validació oberta en versions de Microsoft Project |
| Documentació | Text íntegre registrat en Markdown i estat separat | Desglossar cada requisit ampli en incidències amb proves pròpies |

## Compatibilitat MPP: contracte explícit

- El lector s’adreça al format **MPP14 (Project 2010 i posteriors)**. Altres versions i fitxers protegits poden ser rebutjats.
- La biblioteca s’empaqueta amb l’aplicació; no s’envien projectes ni plantilles a cap servidor.
- La importació mostra les dades abans d’acceptar-les, no substitueix el projecte actual i permet cancel·lar-la.
- El motor actual treballa per dies laborables complets, amb calendari general de dilluns a divendres. Les durades i els retards fraccionaris es normalitzen amb un avís. Les dates es recalculen i la previsualització n’avisa si canvien.
- Recursos de treball, assignacions i dependències es mapen als models locals. El model llegit original queda al JSON com a `mppSource`; aquest snapshot no és una garantia que tots els fluxos binaris originals s’hagin conservat.
- La jerarquia, calendaris particulars, restriccions, camps personalitzats i altres dades avançades no governen encara el motor local. Costos i dades distribuïdes en el temps no són retornats pel lector utilitzat. No es pot prometre una importació sense pèrdues.
- L’exportació exigeix una plantilla MPP14 pròpia amb registres de tasca, resum, subtasca i dependència. No es distribueix una plantilla de Microsoft.
- L’exportació rebutja expressament els projectes amb subtasques fins que se’n pugui validar la jerarquia. Reprodueix el subconjunt implementat: tasques planes, dates, durades, progrés, dependències, recursos de treball i assignacions. No exporta recursos materials/de cost, costos, línies base ni els camps avançats originals.
- Abans de descarregar, el fitxer generat es torna a llegir amb el mateix lector i se’n contrasten tasques, dates, durades i dependències. Això detecta errors interns, però **no substitueix una prova en Microsoft Project**.
- El format JSON continua sent la còpia completa recomanada de les dades de ProjectCraft.

Font del conversor i límits: <https://github.com/kevinmcaleer/pymppwriter/tree/main/js> (MIT). La biblioteca és primerenca; l’etiqueta «experimental» és necessària.

## Prioritats següents

1. Dependències per identificadors estables i suport complet de dependències sobre tasques resum.
2. XML MSPDI amb contracte de camps, previsualització i proves d’anada i tornada.
3. Calendaris i jornada configurables; ruta crítica per totes les relacions.
4. Validació externa dels MPP importats i exportats amb Project 2010/M365 i fitxers reals.
5. Hores i calendaris de recursos, anivellament previsualitzat, costos reals i seguiment.

## Mostres de prova externes

Les proves descarreguen temporalment `mpp14task.mpp` i `mpp14relations.mpp` del projecte [MPXJ](https://github.com/joniles/mpxj/tree/e043353984c092034295880b336f46d6e8800285/junit/data), amb commit fix i SHA-256 comprovats. No es distribueixen dins del web. Es valida la lectura nativa, el mapatge local i una exportació binària amb tasques, dependències, recursos i assignacions rellegida pel mateix conversor. Això continua sense provar que totes les versions de Microsoft Project acceptin tots els projectes exportats.
