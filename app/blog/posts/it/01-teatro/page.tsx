import ViewCounter from "@/components/ViewCounter";
import Link from "next/link";

export const metadata = {
  title: "Merda merda merda! — Anna's Notebook",
  description: "Dietro le quinte: teatro, famiglia e l'impronta lasciata sulla mia vita da liceale.",
};

export default function ArticlePage() {
  return (
    <main className="max-w-[670px] mx-auto px-6 py-20 min-h-screen">

      {/* Link back */}
      <Link 
        href="/blog" 
        className="inline-block mb-4 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors opacity-70"
      >
        ← Back
      </Link>

      {/* Titolo */}
      <h1 className="text-3xl font-semibold tracking-tight my-0 mb-2 text-neutral-900 dark:text-neutral-100">
        Merda merda merda!
      </h1>

      {/* Data */}
      <p className="text-[14px] text-neutral-600 dark:text-neutral-400 italic mb-10 opacity-70">
        November 24, 2025 • <ViewCounter slug="01-teatro" />
      </p>

      <article className="prose prose-neutral dark:prose-invert">

        {/* Introduzione personale */}
        <p>
          Sono passati ormai più di tre anni da quando ho finito il liceo e, con lui, è stata messa in pausa anche una delle mie passioni più grandi: il teatro.
        </p>

        <p>
          Il mio primo “vero” spettacolo risale alla terza media, quando interpretavo <em>Lucignolo</em> in <em>Pinocchio</em>. Con una salopette azzurra e una maglietta arancio.
        </p>
        
        <p>
          Poi è arrivato il liceo. Il primo anno ero ancora in fase di orientamento, ma in seconda ho preso coraggio e mi sono iscritta al corso della scuola, ne avevo sentito parlare molto bene: avevamo vinto le ultime edizioni di <em>Inventari Superiori</em>, la rassegna teatrale in cui si sfidavano tutte le scuole superiori di Brescia. 
        </p>

        <p>
          Ovviamente, la sfortuna ha voluto che quello fosse il primo e unico anno in cui hanno diviso i gruppi: biennio da una parte, triennio dall’altra. Essendo finita in quello del biennio, eravamo pochi e non siamo riusciti a mettere in piedi un vero spettacolo. 
        </p>

        <p>
          Capirete quindi che, appena iniziata la terza, non vedevo l’ora di entrare nel “corso vero, quello dei grandi”, quello dove ci si conosce davvero, dove il gruppo diventa un po’ la tua seconda famiglia.
        </p>

        <p>
          Sono entrata subito nel gruppo, al punto che dopo un solo mese ho avuto una mini parte anche alla replica dello spettacolo dell’anno prima. Poi… ovviamente non poteva andare tutto liscio, giusto? È arrivato il COVID, ci siamo ritrovati chiusi in casa e non potendo metterlo in scena, il nostro spettacolo è diventato un radiogramma.
        </p>

        <figure className="my-6"> 
          <img src="/images/teatro/terzo.png" alt="foto dalla replica dello spettacolo" className="w-full mx-auto block pt-4 pb-2" /> 
          <figcaption className="text-[14px] opacity-80 pt-2"> Down & Out - Foto ufficiali del gruppo durante e post spettacolo — Io spettinata, dopo le prove generali, che (chiaramente) mangio le gocciole</figcaption> 
        </figure>

        <p>
          In quarta, con il COVID ancora in giro, il corso è stato attivato solo in primavera, facendo le prove quasi sempre all’aperto, meteo permettendo. Nonostante tutto, siamo riusciti a mettere insieme un mini-spettacolino.
        </p>

        <figure className="my-6"> 
          <img src="/images/teatro/quarto.png" alt="foto dello spettacolo del quarto" className="w-full mx-auto block pt-4 pb-2" /> 
          <figcaption className="text-[14px] opacity-80 pt-2"> Prove generali - Foto di rito post spettacolo finale </figcaption> 
        </figure>

        <p>
          E finalmente eccoci alla quinta. Dopo quattro anni di attesa, eravamo di nuovo in aula, anche se spesso ancora con le mascherine. Ed è stato al primo Martedì di teatro che mi sono resa conto che ero diventata una “dei grandi”, una dei “veterani” del gruppo. E non so come spiegarlo, ma entrando in palestra quel pomeriggio, rivedendo tutti — vecchi e nuovi — l’ho sentito: quell’anno sarebbe stato diverso.
        </p>

        <p>
          Mi ero pure portata dietro Sophie, mia sorella più piccola, che aveva appena iniziato la prima. Era ancora timidissima, e forse proprio per questo ci tenevo così tanto a farle scoprire quel mondo che per me era casa. Non volevo che si lasciasse frenare dalle paranoie, dal “e se non conosco nessuno?”, dal “non fa per me”, dal “al massimo lo inizio l’anno prossimo” ancora prima di provare. Quindi sì, me l’ero praticamente trascinata dietro: <em>«Io ti iscrivo, che tu lo voglia o no. Tu vieni con me.»</em> le dissi a inizio anno. Ripensandoci oggi, è uno dei ricordi più belli che abbiamo insieme. E per me è stato un privilegio enorme poter condividere una passione così grande con una persona a cui tengo così tanto.
        </p>

        <p>
          Insomma, c’erano tutte le premesse per far diventare quell’anno teatrale il migliore di tutti. E lo è stato. Più di quanto mi aspettassi.
        </p>

        <p>
          <strong>E lo è stato.</strong>
        </p>

        <p>
          Più di quanto mi aspettassi.
        </p>

        <p>
          Lo è stato così tanto che a maggio, quando mancavano pochi incontri e solo due spettacoli, sentivo il bisogno di raccontare questa esperienza. Sentivo il bisogno di far capire anche a chi era fuori cosa volesse dire davvero far parte del gruppo di teatro.
        </p>

        <figure className="my-6"> 
          <img src="/images/teatro/quinto.png" alt="foto dello spettacolo del quarto" className="w-full mx-auto block pt-4 pb-2" /> 
          <figcaption className="text-[14px] opacity-80 pt-2"> Il Pranzo Francese: Camerino delle donzelle - L'ultimo abbraccio con Mattia - People from Berlevaag </figcaption> 
        </figure>

        <p>
          Così, presa dal sentimentalismo (e probabilmente anche da un po’ di paura della fine), ho deciso di fare una sorpresa ai miei compagni. Per prima cosa ho scritto nel gruppo chiedendo a tutti di dirmi cosa significasse per loro il teatro. Dopo una valanga di messaggi, risate e gli occhi già lucidi all’idea che tutto stesse per finire… ho preso spunto dalle loro frasi e ho preparato un monologo da leggere appena prima della nostra ultima entrata in scena. Un po’ per chiudere in bellezza.
        </p>

        <p>
          Ma non volevo che fosse “solo” un monologo: volevo anche pubblicarlo sull’ultimo giornalino del Calini di quell’anno… che, tra l’altro, era anche l’ultimo a cui avrei partecipato io. Insomma: ultimo spettacolo, ultimo giornalino, ultimo articolo. <em>Tripla combo inserita. Attivo: Hat-trick della nostalgia!</em>
        </p>

        <p>
          <strong>Sentimentalismi? Ancora? Esatto.</strong>
        </p>

        <p>
          Per questo mi piace l’idea di riportarlo qui. E, anche se spero che in questi quattro anni la mia scrittura sia migliorata, non l’ho toccato: è esattamente com’era allora, perché riflette l’Anna di quel periodo, con tutti i suoi pregi e le sue imperfezioni.
        </p>

        <p className="opacity-70 text-[14px]">
          Tenete solo conto che, come dicevo, era nato per essere recitato più che letto… ma secondo me funziona comunque. (Se volete rivivere quell'atmosfera, questa era la canzone: <a href="https://www.youtube.com/watch?v=49FDEh1Zh5U" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline"> <em>To Build a Home - The Cinematic Orchestra</em></a>).
        </p>

        <hr className="my-20 border-t border-neutral-300 dark:border-neutral-600 pt-4" />
        {/* Monologo in box evidenziato */}
        <div className="my-6 p-4 italic">
          <p>
            "Ciao, io sono Anna, e sono in 5E. Quest’anno, come potrete immaginare, è il mio ultimo anno al Calini e questo significa che tra qualche settimana finiranno tantissime cose per me… finirà il liceo, finiranno le interrogazioni, avrò fatto l’ultima verifica di latino di tutta la mia vita, e tra tutte queste cose, finirà anche un’altra cosa che per me è importantissima: il gruppo teatrale.
          </p>

          <p>
            Sono entrata nel gruppo attuale solo nel triennio, purtroppo. Ma nonostante ciò è come se ci fossi da sempre.
          </p>

          <p>
            Credo che il gruppo di teatro sia un posto magico, ha qualcosa, che è difficile da spiegare. Ci sono delle persone, e loro sono impossibili da spiegare. 
            Ho pensato che sarebbe stato bello cercare in qualche modo di spiegarvi cosa significa fare teatro, quindi ho chiesto una mano a quelle persone impossibili da spiegare, e insieme, abbiamo trovato “diescimila” ragioni per cui dovreste fare teatro… perché fare teatro significa che non vedi l’ora che arrivi il martedì pomeriggio, significa divertirsi facendo le cose più imbarazzanti della propria vita, significa fare un gioco di corpi, significa ballare come matti quando Mattia, il nostro regista, dice DANCE.
          </p>

          <p>
            Fare teatro significa che imparerai cosa vuol dire fare “bradipo”, imparerai cosa devi fare se dicono “4”, se dicono “1”, se dicono “leggero” o se dicono “pesante”. Imparerai che se senti “0” devi cadere per terra, immobile, ma se senti “5” devi correre più veloce che mai, cercando di schivare tutti gli altri…spoiler: ci si scontra sempre. 
          </p>

          <p>
            Smetterai di avere vergogna quando si ballerà tutti assieme ad occhi chiusi o quando farai il tuo primo down…non vi dirò cos’è, lo dovrete venire a scoprire.
          </p>

          <p>
            Fare teatro è un po’ come fare serata di martedì pomeriggio, significa riuscire a creare un gruppo che lavora benissimo insieme, significa che incontrerai un sacco di persone più matte di te e con il tempo rimarrai ammaliato dalla bravura e dai progressi di tutti. 
            Fare teatro significa che dopo le prove si canta De Andrè e si balla Propaganda. 
            E se vi dovesse capitare, durante una pausa, di sentirci urlare di punto in bianco “NIIIIIIIIIINNNJAAAAAA”, tranquilli non siamo pazzi, o meglio, lo siamo sempre stati, solo che Ninja è un gioco bellissimo che facciamo sempre quando siamo in pausa.  
          </p>

          <p>
            Fare teatro vuol dire che se qualcuno dice “CAFFÈ”, tutti rispondono “OLÈ”.
          </p>

          <p>
            E il meglio deve ancora arrivare, perché tutto questo accade alle prove settimanali, quando si sta insieme per circa tre ore; figuratevi ora cosa succede quando ci fanno stare insieme per giornate intere. 
            Perché si, teatro vuol dire che quando ci si avvicina allo spettacolo si fanno gli intensivi, ci si trova la domenica a fare le prove dalla mattina alla sera. E intensivo vuol dire anche pranzo tutti insieme e ancora meglio: significa partitella a calcetto prima che ricomincino le prove. Vuol dire che quando la sera torni a casa non riesci più a togliersi dalla testa le musiche dello spettacolo. Fare teatro significa che salterai un giorno di scuola per fare un’esperienza bellissima: andare in scena a Lovere. 
          </p>

          <figure className="my-6">
            <video src="/images/teatro/video.mp4" controls className="w-full mx-auto block" />
            <figcaption className="text-[14px] opacity-80 pt-2"> Estratto del monologo (aka io che piango) - Foto ufficiali (grazie Doscioli) - Pizzata conclusiva + partita a calcio </figcaption> 
          </figure>

          <p>
            Per non parlare dei momenti più belli, ovvero delle ultime prove, quando si è tutti tesi, degli attimi prima di entrare in scena, prima di “mettere a morte lo spettacolo”. Perché fare teatro significa che prima di uno spettacolo mangerai sicuramente le gocciole, significa vincere la propria timidezza divertendosi, significa imparare a godersi il momento sul palco, per poi applicarlo nella vita reale. Fare teatro significa avere il terrore delle luci, significa non ricordarsi mai da che parte uscire per il cambio scena, avere paura di aver dimenticato parte del costume a casa, significa bandire il viola dal palco; ma significa anche rendere proprie le cose che vedi sul palco, significa imparare ad amare e apprezzare le piccole cose, significa trasformare ansia e paure in energia pura, significa interpretare qualcun altro rimanendo se stessi e significa sbagliare tutte le battute tanto chi se ne accorge.
          </p>

          <p>
            Fare teatro significa che nelle quinte si balla, si canta, si recitano le battute che ormai si sanno a memoria e si piange insieme per le scene commoventi. Significa sentire per mesi alle prove il regista dire “buio” quando si finisce lo spettacolo e poi emozionarsi quando sul palco quel “buio” diventa realtà. Teatro significa rispettare alcune tradizioni, come quella di fare i cori più belli e ignoranti del mondo nei camerini alla fine dello spettacolo, quando tutto quello che ti rimane in corpo sono solo un po’ di lacrime e tantissima adrenalina.
          </p>

          <p>
            E c’è un momento sacrosanto, appena prima di andare in scena. Perché prima di salire sul palco ci si riunisce nei camerini, tutti agitati, ma pronti, arriva la profe e arriva il regista, fanno un discorso, che può concludersi solo in una maniera, con un solo lungo grido che esce dal cuore di tutti noi: “MERDA MERDA MERDA”.
          </p>

          <p>
            Teatro più di tutto significa famiglia, significa divertirsi da matti con i migliori matti del mondo, significa creare legami unici con altre persone, suonarli con loro come se fossero corde di una chitarra magica e ballare tutti insieme sopra a questa melodia senza pensieri.
          </p>

          <p>
            E per ultimo, perché è il momento che chiude sempre tutto, teatro significa…3…2…1…GO.
          </p>

          <p>
            Quindi non perdere tempo, il gruppo ti aspetta, e anche se io non ne farò più parte sono più che sicura che spaccheranno come sempre. E fidati quando ti dico che nel momento in cui entrerai a farne parte, ti pentirai di non aver iniziato prima.
          </p>

          <p className="font-bold"><em>Anna e il Gruppo Teatrale</em></p>
        </div>

        {/* Conclusione personale */}

        <hr className="my-12 border-t border-neutral-300 dark:border-neutral-600" />

        <p>
          Rileggerlo oggi mi fa un po’ sorridere e un po’ commuovere. Spero arrivi anche a voi almeno un pezzetto di ciò che per noi è stato.
        </p>

        <p>
          Fare teatro mi manca, ma al momento non ho il tempo materiale per reinserirlo nella mia routine. In questi anni, ogni volta che a fine anno vado a vedere lo spettacolo dei miei teatranti preferiti, vengo colpita da una botta di nostalgia incredibile: quella che ti fa venire voglia di ridere e piangere contemporaneamente.
        </p>

        <p>
          Quest’anno poi è anche un po’ speciale: è l’ultimo anno di Sophie; ora è lei la “grande” e non vedo l’ora di andare a vedere l’ultimo spettacolo. So già che ci faremo un piantino insieme quando sarà finita.
        </p>

        <p>
          E già che ci sono, voglio riportare anche una promessa che le feci tempo fa: <em>«Ti prometto che, quando finirai il teatro al Calini, troveremo un modo per continuare a farlo, di nuovo, noi due.».</em>
        </p>

      </article>
      <br/>
      <p className="opacity-70 text-[14px]">
        Thank you for reading.<br />
        If you'd like to share your thoughts or ask anything, I'm always open to a conversation. 
      </p>


    </main>
  );
}
