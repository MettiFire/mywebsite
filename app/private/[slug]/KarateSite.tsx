'use client';

import Link from 'next/link';

type KaratePage = 'home' | 'chi-siamo' | 'corsi' | 'galleria' | 'contatti';

const pages: Array<{ id: KaratePage; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'chi-siamo', label: 'Chi siamo' },
  { id: 'corsi', label: 'Corsi' },
  { id: 'galleria', label: 'Galleria' },
  { id: 'contatti', label: 'Contatti' },
];

export default function KarateSite({ page }: { page: KaratePage }) {
  const content = {
    home: {
      eyebrow: 'Brescia Karate-Do',
      title: 'Tradizione, disciplina, comunità.',
      text: 'Scuola di Karate Shotokan tradizionale per bambini, ragazzi e adulti.',
    },
    'chi-siamo': {
      eyebrow: 'Chi siamo',
      title: "Una storia lunga piu di trent'anni.",
      text: 'Una scuola costruita su rispetto, autocontrollo e crescita condivisa.',
    },
    corsi: {
      eyebrow: 'Corsi & orari',
      title: 'Trova il corso giusto per te.',
      text: 'Allenamenti per bambini, ragazzi e adulti, con prima prova gratuita.',
    },
    galleria: {
      eyebrow: 'Galleria',
      title: 'I momenti del dojo.',
      text: 'Gare, esami, allenamenti ed eventi della nostra societa.',
    },
    contatti: {
      eyebrow: 'Contatti',
      title: 'Vieni a trovarci sul tatami.',
      text: 'Scrivici per informazioni sui corsi o per prenotare una prova gratuita.',
    },
  }[page];

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#1b1f2a]">
      <header className="border-b border-[#e7e2d7] bg-white">
        <nav className="mx-auto flex min-h-20 w-[min(1180px,92vw)] items-center justify-between gap-6">
          <Link href="/private/karate" className="flex items-center gap-3 font-serif text-lg font-bold text-[#0057b8]">
            <span className="grid size-11 place-items-center rounded-full bg-[#e30613] text-xl text-white">K</span>
            <span>BRESCIA <span className="text-[#e30613]">KARATE-DO</span></span>
          </Link>
          <div className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-sm font-semibold">
            {pages.map((item) => (
              <Link
                key={item.id}
                href={item.id === 'home' ? '/private/karate' : `/private/karate/${item.id}`}
                className={page === item.id ? 'text-[#e30613]' : 'hover:text-[#e30613]'}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <div className="bg-[#e30613] px-4 py-3 text-center text-sm font-semibold text-white">
        Prova iniziale gratuita per chi vuole iniziare
      </div>

      <main>
        <section className="bg-[#0057b8] px-6 py-24 text-white md:py-32">
          <div className="mx-auto w-[min(1180px,92vw)]">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#ffb4b4]">{content.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-tight md:text-7xl">{content.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#dbe5f5]">{content.text}</p>
            {page === 'home' && (
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/private/karate/corsi" className="rounded-sm bg-[#e30613] px-6 py-3 font-bold text-white hover:bg-[#bc040f]">Scopri i corsi</Link>
                <Link href="/private/karate/contatti" className="rounded-sm border border-white/60 px-6 py-3 font-bold hover:bg-white hover:text-[#0057b8]">Contattaci</Link>
              </div>
            )}
          </div>
        </section>

        {page === 'chi-siamo' && (
          <section className="mx-auto w-[min(1180px,92vw)] px-0 py-16">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#e30613]">La nostra identità</p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-tight text-[#0057b8]">Tradizione, rispetto, comunità</h2>
            <p className="mt-5 max-w-3xl leading-8 text-[#6c6a63]">
              Pratichiamo il Karate Shotokan tradizionale secondo l'insegnamento di Gichin Funakoshi. Il karate è un metodo educativo che forma il carattere, rafforza l'autocontrollo e crea legami tra le persone.
            </p>
            <p className="mt-4 max-w-3xl leading-8 text-[#6c6a63]">
              La scuola accoglie bambini, ragazzi e adulti in un ambiente familiare, dove ognuno cresce al proprio ritmo, dal saluto iniziale fino alla cintura nera.
            </p>
            <div className="mt-10 border-l-4 border-[#e30613] bg-white p-6 shadow-sm">
              <h3 className="font-serif text-2xl font-semibold text-[#0057b8]">Maestro Pietro Dall'Olmo</h3>
              <p className="mt-2 text-[#6c6a63]">8° Dan, guida tecnica nazionale e internazionale.</p>
            </div>
          </section>
        )}

        {page === 'corsi' && (
          <section className="mx-auto w-[min(1180px,92vw)] px-0 py-16">
            <div className="grid gap-5 md:grid-cols-2">
              {[
                ['Bambini & Ragazzi', 'Percorso graduale e formativo per i più giovani.', 'Lunedì e Giovedì · 18:00-19:00'],
                ['Adulti · 18+', 'Allenamento Shotokan per ogni livello di esperienza.', 'Martedì e Giovedì · orari da concordare'],
              ].map(([title, text, hours]) => (
                <article key={title} className="border border-[#e7e2d7] bg-white p-7 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e30613]">Corso</p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold text-[#0057b8]">{title}</h2>
                  <p className="mt-3 text-[#6c6a63]">{text}</p>
                  <p className="mt-5 border-t border-dashed border-[#e7e2d7] pt-4 font-semibold">{hours}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 bg-[#faf8f3] p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e30613]">Dove alleniamo</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#0057b8]">Le nostre sedi</h2>
              <p className="mt-3 text-[#6c6a63]">Palestra Quasimodo, Via Costalunga 15, e Palestra Papa Giovanni XXIII, Via Sabbioneta 16, Brescia.</p>
            </div>
          </section>
        )}

        {page === 'galleria' && (
          <section className="mx-auto w-[min(1180px,92vw)] px-0 py-16">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#e30613]">Galleria</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#0057b8]">I momenti del dojo</h2>
            <p className="mt-4 max-w-2xl text-[#6c6a63]">Gare, esami, allenamenti ed eventi della nostra società.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {['Gare', 'Esami', 'Allenamenti', 'Eventi', 'Dojo', 'Comunità'].map((label) => (
                <div key={label} className="grid aspect-[4/3] place-items-center border border-[#e7e2d7] bg-[#0057b8] text-xl font-semibold text-white">{label}</div>
              ))}
            </div>
          </section>
        )}

        {page === 'contatti' && (
          <section className="mx-auto grid w-[min(1180px,92vw)] gap-8 px-0 py-16 md:grid-cols-2">
            <div className="space-y-4">
              {[
                ['Email', 'info@karatedobrescia.it'],
                ['Francesco Savoldi', '339 777 6910'],
                ["Pietro Dall'Olmo", '347 420 0617'],
                ['Sede', "Vicolo dell'Inganno, 1 - Brescia"],
              ].map(([label, value]) => (
                <div key={label} className="border border-[#e7e2d7] bg-[#faf8f3] p-5">
                  <h2 className="font-serif text-xl font-semibold text-[#0057b8]">{label}</h2>
                  <p className="mt-1 text-[#6c6a63]">{value}</p>
                </div>
              ))}
            </div>
            <form className="space-y-4 border border-[#e7e2d7] bg-white p-6" onSubmit={(event) => event.preventDefault()}>
              <h2 className="font-serif text-3xl font-semibold text-[#0057b8]">Scrivici</h2>
              <input className="w-full border border-[#e7e2d7] p-3" required placeholder="Nome e cognome" />
              <input className="w-full border border-[#e7e2d7] p-3" required placeholder="Email o telefono" />
              <textarea className="w-full border border-[#e7e2d7] p-3" rows={5} placeholder="Messaggio" />
              <button className="w-full bg-[#e30613] px-5 py-3 font-bold text-white" type="submit">Invia richiesta</button>
            </form>
          </section>
        )}

        <section className="mx-auto grid w-[min(1180px,92vw)] gap-5 px-0 py-16 md:grid-cols-3">
          {[
            ['01', 'Rispetto', 'Il primo insegnamento dentro e fuori dal dojo.'],
            ['02', 'Disciplina', 'Un percorso graduale per ogni eta e livello.'],
            ['03', 'Comunità', 'Una scuola dove crescere insieme, con fiducia.'],
          ].map(([number, title, text]) => (
            <article key={number} className="border-t-4 border-[#e30613] bg-white p-6 shadow-sm">
              <span className="text-sm font-bold text-[#e30613]">{number}</span>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-[#0057b8]">{title}</h2>
              <p className="mt-2 text-[#6c6a63]">{text}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="bg-[#00468f] px-6 py-10 text-[#dbe5f5]">
        <div className="mx-auto flex w-[min(1180px,92vw)] flex-wrap justify-between gap-4 text-sm">
          <span>ASD Brescia Karate-Do</span>
          <span>Vicolo dell'Inganno, 1 - Brescia</span>
        </div>
      </footer>
    </div>
  );
}