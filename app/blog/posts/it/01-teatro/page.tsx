import ViewCounter from "@/components/ViewCounter";
import Link from "next/link";

export const metadata = {
  title: "Sullo spendere tempo — Anna's Notebook",
  description: "Un articolo personale sul tempo e su come lo viviamo.",
};

export default function ArticlePage() {
  return (
    <main className="max-w-[650px] mx-auto px-6 py-20 min-h-screen">

      {/* Link back */}
      <Link 
        href="/blog" 
        className="inline-block mb-6 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors opacity-70"
      >
        ← back
      </Link>

      {/* Titolo */}
      <h1 className="text-3xl font-semibold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
        Merda merda merda!
      </h1>

      {/* Data */}
      <p className="text-neutral-500 dark:text-neutral-400 italic mb-10 flex items-center gap-2 text-sm opacity-70 text-center">
        November 24, 2025 •  
        <ViewCounter slug="01-teatro" />
      </p>

      <article className="prose prose-neutral dark:prose-invert">

        {/* INTRO */}
        <p>
          Ciao, io sono Anna, e sono in 5E. Quest’anno, come potrete immaginare, è il mio ultimo anno al Calini 
          e questo significa che tra qualche settimana finiranno tantissime cose per me… finirà il liceo, 
          finiranno le interrogazioni, avrò fatto l’ultima verifica di latino di tutta la mia vita, 
          e tra tutte queste cose, finirà anche un’altra cosa che per me è importantissima: il gruppo teatrale.
        </p>

        {/* FOTO 1 */}
        <figure className="my-6">
          <img src="/images/teatro-1.jpg" alt="Foto del gruppo teatrale" />
          <figcaption className="text-sm opacity-70 text-center">
            Il nostro gruppo teatrale – dove tutto è iniziato.
          </figcaption>
        </figure>

        <p>
          Sono entrata nel gruppo attuale solo nel triennio, purtroppo. 
          Ma nonostante ciò è come se ci fossi da sempre.
        </p>

        <p>
          Credo che il gruppo di teatro sia un posto magico, ha qualcosa che è difficile da spiegare. 
          Ci sono delle persone, e loro sono impossibili da spiegare.
        </p>

        <p>
          Ho pensato che sarebbe stato bello cercare in qualche modo di spiegarvi cosa significa fare teatro, 
          quindi ho chiesto una mano a quelle persone impossibili da spiegare, e insieme, 
          abbiamo trovato “diescimila” ragioni per cui dovreste fare teatro…
        </p>

        {/* FOTO 2 */}
        <figure className="my-6">
          <img src="/images/teatro-2.jpg" alt="Momento di prova" />
          <figcaption className="text-sm opacity-70 text-center">
            Uno dei nostri momenti preferiti nelle prove.
          </figcaption>
        </figure>

        <p>
          Fare teatro significa che non vedi l’ora che arrivi il martedì pomeriggio, 
          significa divertirsi facendo le cose più imbarazzanti della propria vita, 
          significa fare un gioco di corpi, significa ballare come matti quando Mattia, 
          il nostro regista, dice <strong>DANCE</strong>.
        </p>

        <p>
          Fare teatro significa che imparerai cosa vuol dire fare “bradipo”, 
          imparerai cosa devi fare se dicono “4”, se dicono “1”, se dicono “leggero” o “pesante”. 
          Imparerai che se senti “0” devi cadere per terra, immobile, 
          ma se senti “5” devi correre più veloce che mai, cercando di schivare tutti gli altri… 
          <em>spoiler: ci si scontra sempre</em>.
        </p>

        <p>
          Smetterai di avere vergogna quando si ballerà tutti assieme ad occhi chiusi 
          o quando farai il tuo primo down… non vi dirò cos’è, lo dovrete venire a scoprire.
        </p>

        {/* FOTO 3 */}
        <figure className="my-6">
          <img src="/images/teatro-3.jpg" alt="Ricordi del gruppo" />
          <figcaption className="text-sm opacity-70 text-center">
            Piccoli momenti che diventano ricordi enormi.
          </figcaption>
        </figure>

        <p>
          Fare teatro è un po’ come fare serata di martedì pomeriggio: 
          significa creare un gruppo che lavora benissimo insieme, 
          significa incontrare un sacco di persone più matte di te e 
          rimanere ammaliato dai progressi di tutti.
        </p>

        <p>
          Fare teatro significa che dopo le prove si canta De Andrè e si balla Propaganda. 
          E se vi dovesse capitare, durante una pausa, di sentirci urlare di punto in bianco 
          “NIIIIIIIIIINNNJAAAAAA”, tranquilli, non siamo pazzi. 
          O meglio: lo siamo da sempre, solo che Ninja è un gioco bellissimo che facciamo in pausa.
        </p>

        <p>
          Fare teatro vuol dire che se qualcuno dice “CAFFÈ”, tutti rispondono “OLÈ”.
        </p>

        {/* FOTO 4 */}
        <figure className="my-6">
          <img src="/images/teatro-4.jpg" alt="Giornata di intensivo" />
          <figcaption className="text-sm opacity-70 text-center">
            Gli intensivi: stanchi, felici, uniti.
          </figcaption>
        </figure>

        <p>
          E il meglio deve ancora arrivare, perché tutto questo accade nelle prove settimanali; 
          figuratevi cosa succede quando ci fanno stare insieme per giornate intere.  
          Gli intensivi significano prove dalla mattina alla sera, pranzo insieme e, 
          ancora meglio, partitella a calcetto prima di ricominciare.
        </p>

        <p>
          Vuol dire tornare a casa la sera con le musiche dello spettacolo che ti rimbombano nella testa. 
          Vuol dire saltare un giorno di scuola per andare in scena a Lovere.
        </p>

        <p>
          E poi ci sono i momenti più belli: le ultime prove, gli attimi prima di entrare in scena, 
          prima di <em>mettere a morte lo spettacolo</em>.
        </p>

        <p>
          Fare teatro significa che prima di uno spettacolo mangerai sicuramente le gocciole, 
          significa vincere la propria timidezza divertendosi, significa imparare a godersi il momento sul palco.
        </p>

        <p>
          Significa avere il terrore delle luci, dimenticarsi dove uscire, 
          temere di aver lasciato a casa parte del costume, bandire il viola dal palco, 
          rendere proprie le storie degli altri, trasformare ansia e paure in energia pura.
        </p>

        {/* FOTO 5 */}
        <figure className="my-6">
          <img src="/images/teatro-5.jpg" alt="Dietro le quinte" />
          <figcaption className="text-sm opacity-70 text-center">
            Dietro le quinte succede metà della magia.
          </figcaption>
        </figure>

        <p>
          Fare teatro significa che nelle quinte si balla, si canta, si recitano le battute a memoria 
          e si piange insieme per le scene più intense.
        </p>

        <p>
          Significa sentire per mesi il regista dire “buio” alle prove, 
          e poi emozionarsi quando sul palco quel “buio” diventa realtà.
        </p>

        <p>
          Teatro significa tradizioni: cori assurdi nei camerini a fine spettacolo, 
          quando ti rimangono addosso solo un po’ di lacrime e tantissima adrenalina.
        </p>

        <p>
          E c’è un momento sacrosanto: quello appena prima di salire sul palco.  
          Ci si riunisce nei camerini, tutti agitati ma pronti; la profe e il regista parlano;  
          e c’è un solo modo per concludere:  
        </p>

        <p className="text-center font-bold text-lg">
          “MERDA MERDA MERDA”
        </p>

        <p>
          Teatro significa famiglia: divertirsi con i migliori matti del mondo, 
          creare legami unici, suonare insieme come corde di una chitarra magica, 
          ballare tutti sulla stessa melodia.
        </p>

        <p>
          E per ultimo, perché chiude sempre tutto, teatro significa…  
          <strong>3… 2… 1… GO.</strong>
        </p>

        <p>
          Quindi non perdere tempo: il gruppo ti aspetta.  
          E anche se io non ne farò più parte, sono sicura che spaccheranno come sempre.  
          Fidati quando ti dico che quando entrerai, ti pentirai di non aver iniziato prima.
        </p>

        <hr />

        {/* CITAZIONI */}
        <h2>Citazioni dal gruppo</h2>
        <ul>
          <li>🤝 fare teatro vuol dire fare sempre gli auguri ad Odra</li>
          <li>🤝 avere paura che Silvia mi sgridi perché non ho fatto bene qualcosa</li>
          <li>🤝 insultare Paride</li>
          <li>🤝 rettitudine e felicità SI debbono baciarsSI</li>
          <li>🤝 cantare “TI VOGLIO BENE ASSAI????”</li>
          <li>🤝 TACI SILVIA / DILAZIONE 🤝🤝🤝</li>
          <li>🤝 crush per Raffaella :)</li>
          <li>🤝 urlare DIEU ONNIPOTONT o IIIIIIINFIMO BRIGANTE MANGIASASSI</li>
          <li>🤝 essere perseguitati da Martina e Filippa</li>
          <li>🤝 dibattito sul genere di una tartaruga marina di peluche</li>
          <li>🤝 CORNICIE</li>
          <li>🤝 Marion che ruba gli occhiali e li flexa</li>
          <li>🤝 teatro è coop</li>
          <li>🤝 sesso pazzo con Paride</li>
          <li>🤝 arrivare in ritardo per preparare il caffè alla napoletana</li>
          <li>🤝 TACI SILVIA</li>
          <li>🤝 art-attack</li>
          <li>🤝 discorsi su un certo Carmelo</li>
          <li>🤝 accarezzare il cranio di Ladi</li>
          <li>🤝 sopportare Giada</li>
          <li>🤝 simpare per Luca Minelli e Mattia</li>
          <li>🤝 bucare calzini ogni settimana</li>
          <li>🤝 “pellicce nell'armadio”… ma è Lorenza</li>
          <li>🤝 sperare in una parte dove limoni Paride</li>
          <li>🤝 pregare Gesù Cristo nostro Signore</li>
          <li>🤝 per me teatro significa “Morte”</li>
          <li>🤝 aspettare con ansia il martedì</li>
        </ul>

        <h2>Altro</h2>
        <ul>
          <li>🫱🏻‍🫲🏻 fare gite che altrimenti non faresti</li>
          <li>🤝 ballare le danze estive davanti al museo Tadini</li>
          <li>🫱🏻‍🫲🏻 assistere alla nascita di meme leggendari</li>
          <li>🤝 ascoltare la voce di Mattia ogni settimana</li>
          <li>🤝 sentirsi una paesana perché tutti parlano in dizione tranne te</li>
          <li>🤝 trovare Anna, Silvia e Sophie che recitano monologhi</li>
          <li>🤝 teatro è comprensione (tranne verso Giada)</li>
        </ul>

      </article>


    </main>
  );
}
