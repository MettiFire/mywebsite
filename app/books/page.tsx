// File: app/books/page.jsx (o .tsx)

import Link from "next/link";
// import { HiOutlineDocumentText } from "react-icons/hi"; // Icona per notes column (se serve in futuro)
// Importa i dati dal nuovo file
import { booksRead, booksReading, booksToRead } from "@/data/booksData";

export const metadata = {
  title: "Anna's Library",
  description: "A collection of books I've read, I'm reading, or I want to read.",
};

// --- Definizione del Tipo (se usi TypeScript) ---
type Book = {
  date: string;
  title: string;
  author: string;
  genre: string;
  buy: string;
  notesHref: string | null;
};

// --- Helper Functions ---

// Converte la data in formato "Month Year" (es: "May 2025")
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  
  // Gestisce vari formati di data
  const parts = dateStr.split(" ");
  if (parts.length >= 2) {
    const monthMap: {[key: string]: string} = {
      "gen": "Jan", "feb": "Feb", "mar": "Mar", "apr": "Apr", "mag": "May", "giu": "Jun",
      "lug": "Jul", "ago": "Aug", "set": "Sep", "ott": "Oct", "nov": "Nov", "dic": "Dec"
    };
    const month = monthMap[parts[1]] || parts[1];
    const year = parts[2] || parts[0];
    return `${month} ${year}`;
  }
  
  // Formato "2025-10" -> "Oct 2025"
  if (dateStr.includes("-")) {
    const [year, month] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
  }
  
  return dateStr;
}


// Formatta l'autore come "Iniziale. Cognome" (es: "Morgan Housel" -> "M. Housel")
function formatAuthor(author: string): string {
  if (!author) return "";
  
  const parts = author.trim().split(" ");
  if (parts.length === 1) return author; // Se c'è solo una parola, restituiscila così com'è
  
  // Prendi la prima lettera del primo nome e l'ultimo cognome
  const firstInitial = parts[0][0];
  const lastName = parts[parts.length - 1];
  
  return `${firstInitial}. ${lastName}`;
}

// Formatta il genere limitandolo a max 1-2 parole
function formatGenre(genre: string): string {
  if (!genre) return "";
  
  // Separa per virgola o slash e prendi solo la prima parte
  const parts = genre.split(/[,\/]/);
  const firstGenre = parts[0].trim();
  
  // Se la prima parte ha più di 2 parole, prendi solo le prime 2
  const words = firstGenre.split(" ");
  return words.slice(0, 2).join(" ");
}

// --- Componente Tabella ---

function BookTable({ books, showDate = true }: { books: Book[], showDate?: boolean }) {
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="border-b border-neutral-300 dark:border-neutral-600">
          {showDate && <th className="text-left px-4 py-6 text-sm text-neutral-500 dark:text-neutral-400 w-52">Date</th>}
          <th className="text-left px-4 py-6 text-sm text-neutral-500 dark:text-neutral-400">Title</th>
          <th className="text-left px-4 py-6 text-sm text-neutral-500 dark:text-neutral-400 w-32">Author</th>
          <th className="text-left px-4 py-6 text-sm text-neutral-500 dark:text-neutral-400 w-20">Genre</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr 
            key={book.buy} 
            className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            {/* Date */}
            {showDate && <td className="px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{formatDate(book.date)}</td>}
            
            {/* Title (Link) */}
            <td className="px-4 py-4 text-sm text-neutral-900 dark:text-neutral-100 w-150">
              <a href={book.buy} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {book.title}
              </a>
            </td>
            
            {/* Author */}
            <td className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-400">{formatAuthor(book.author)}</td>
            
            {/* Genre */}
            <td className="px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">{formatGenre(book.genre)}</td>
            
            {/* Notes (Link) - COMMENTED OUT, uncomment if needed
            <td className="px-2 py-1 text-sm text-neutral-600 dark:text-neutral-400">
              {book.notesHref && (
                <Link href={book.notesHref} className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors" title="View notes">
                  <HiOutlineDocumentText size={18} />
                </Link>
              )}
            </td>
            */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// --- Componente Pagina Principale ---

export default function BooksPage() {
  // Ordina i libri letti per data (più recente prima)
  const sortedBooksRead = [...booksRead].sort((a, b) => {
    // Funzione helper per convertire la data in timestamp comparabile
    const parseDate = (dateStr: string): number => {
      if (!dateStr) return 0;
      
      // Formato "9 mag 2025"
      const parts = dateStr.split(" ");
      if (parts.length === 3) {
        const monthMap: {[key: string]: number} = {
          "gen": 0, "feb": 1, "mar": 2, "apr": 3, "mag": 4, "giu": 5,
          "lug": 6, "ago": 7, "set": 8, "ott": 9, "nov": 10, "dic": 11
        };
        const day = parseInt(parts[0]);
        const month = monthMap[parts[1]] || 0;
        const year = parseInt(parts[2]);
        return new Date(year, month, day).getTime();
      }
      
      // Formato "2025-10"
      if (dateStr.includes("-")) {
        const [year, month] = dateStr.split("-");
        return new Date(parseInt(year), parseInt(month) - 1, 1).getTime();
      }
      
      return 0;
    };
    
    return parseDate(b.date) - parseDate(a.date); 
  });

  return (
    <main className="max-w-[670px] mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-10">Anna's Library</h1>
      
      <p className="text-neutral-600 dark:text-neutral-400 mb-12">
        This is a collection of books I've read in the last few years. Most of them are in Italian, but you'll also find some in English.
        The library is divided into three sections: <a href="#reading" className="underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-100">currently reading</a>, <a href="#to-read" className="underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-100">to read</a>, and <a href="#read" className="underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-100">read</a>.
      </p>

      
      {/* READING */}
      <section id="reading" className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Reading ({booksReading.length} books)</h2>
        <BookTable books={booksReading} showDate={false} />
      </section>  

      {/* TO READ */}
      <section id="to-read" className="mb-12">
        <h2 className="text-xl font-semibold mb-4">To Read ({booksToRead.length} books)</h2>
        <BookTable books={booksToRead} showDate={false} />
      </section>

      {/* READ */}
      <section id="read" className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Read ({sortedBooksRead.length} books)</h2>
        <BookTable books={sortedBooksRead} />
      </section>
  
    </main>
  );
}