import Link from "next/link";

export const metadata = {
  title: "Anna's Library",
  description: "A collection of books I've read, I'm reading, or I want to read.",
};

const booksRead = [
  {
    date: "2025-10",
    title: "The Art of Spending Money",
    author: "Morgan Housel",
    genre: "Personal Finance",
    rating: "★★★★☆",
    buy: "https://www.amazon.com",
    notesHref: "/books/the-art-of-spending-money",
  },
];

const booksReading = [
  {
    date: "2025-11",
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Productivity",
    rating: "—",
    buy: "https://www.amazon.com",
    notesHref: null,
  },
];

const booksToRead = [
  {
    date: "",
    title: "The Beginning of Infinity",
    author: "David Deutsch",
    genre: "Science / Philosophy",
    rating: null,
    buy: "https://www.amazon.com",
    notesHref: null,
  },
];

function BookItem({ book }: {
  book: {
    date: string;
    title: string;
    author: string;
    genre: string;
    rating: string | null;
    buy: string;
    notesHref: string | null;
  };
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-3">
      {/* Data */}
      <span className="text-neutral-500 dark:text-neutral-400 md:w-20 text-sm flex-shrink-0">
        {book.date}
      </span>

      {/* Titolo */}
      <a
        href={book.buy}
        target="_blank"
        className="text-neutral-900 dark:text-neutral-100 hover:underline flex-1"
      >
        {book.title}
      </a>

      {/* Autore */}
      <span className="text-neutral-600 dark:text-neutral-400 text-sm md:w-40 flex-shrink-0">
        {book.author}
      </span>

      {/* Genere */}
      <span className="text-neutral-500 dark:text-neutral-400 text-sm md:w-32 flex-shrink-0">
        {book.genre}
      </span>

      {/* Rating */}
      {book.rating && (
        <span className="text-yellow-500 dark:text-yellow-400 text-sm md:w-20 flex-shrink-0">
          {book.rating}
        </span>
      )}

      {/* Note */}
      {book.notesHref && (
        <Link
          href={book.notesHref}
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:underline"
        >
          notes →
        </Link>
      )}
    </div>
  );
}

export default function BooksPage() {
  return (
    <main className="max-w-[650px] mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-10">Anna's Library</h1>

      {/* READ */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Read</h2>
        <div className="space-y-3">
          {booksRead.map((b) => (
            <BookItem key={b.title} book={b} />
          ))}
        </div>
      </section>

      {/* READING */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Reading</h2>
        <div className="space-y-3">
          {booksReading.map((b) => (
            <BookItem key={b.title} book={b} />
          ))}
        </div>
      </section>

      {/* TO READ */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">To Read</h2>
        <div className="space-y-3">
          {booksToRead.map((b) => (
            <BookItem key={b.title} book={b} />
          ))}
        </div>
      </section>

    </main>
  );
}
