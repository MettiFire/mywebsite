import ViewCounter from "@/components/ViewCounter";
import Link from "next/link";

export const metadata = {
  title: "Merda merda merda! / Break a Leg! — Anna's Notebook",
  description: "Behind the Scenes: How theatre and family shaped my high school years",
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
        Merda merda merda! / Break a Leg!
      </h1>

      {/* Data */}
      <p className="text-[14px] text-neutral-600 dark:text-neutral-400 italic mb-10 opacity-70">
        November 24, 2025 • <ViewCounter slug="01-teatro" />
      </p>

      <article className="prose prose-neutral dark:prose-invert">

        {/* Personal Introduction */}
        <p>
            It's been over three years since I finished high school, and with it, one of my greatest passions was put on pause: theater.
        </p>

        <p>
            My first “real” show goes back to middle school, when I played <em>Lucignolo</em> in <em>Pinocchio</em>. Wearing blue overalls and an orange T-shirt.
        </p>

        <p>
            Then came high school. During the first year, I was still figuring things out, but in second year, I gained courage and signed up for the school’s theater course, which I had heard great things about: we had won the last editions of <em>Inventari Superiori</em>, the theater festival where all high schools in Brescia competed.
        </p>

        <p>
            Of course, luck was not on our side: that year was the first and only time they split the groups—lower years on one side, upper years on the other. Ending up in the lower-year group, there were too few of us to put on a full show.
        </p>

        <p>
            So you can imagine that, as soon as third year started, I couldn't wait to join the <em>“real course, the one for the older students”</em>, where you truly get to know each other and the group becomes like a second family.
        </p>

        <p>
            I joined the group right away, and after just a month, I even got a small role in the repeat of the previous year’s show. Then… of course, nothing could go smoothly, right? COVID hit, we were stuck at home, and unable to perform, our show became a radio play.
        </p>

        <figure className="my-6"> 
            <img src="/images/teatro/terzo.png" alt="photo from the show rehearsal" className="w-full mx-auto block pt-4 pb-2" /> 
            <figcaption className="text-[14px] opacity-80 pt-2">Down & Out – Official photos of the group during and after the repeat — Me, messy-haired after the final rehearsal, obviously eating Gocciole</figcaption> 
        </figure>

        <p>
            In fourth year, with COVID still around, the course was only activated in spring, and rehearsals were almost always outdoors, weather permitting. Despite everything, we managed to put together a mini-show.
        </p>

        <figure className="my-6"> 
            <img src="/images/teatro/quarto.png" alt="photo from the fourth-year show" className="w-full mx-auto block pt-4 pb-2" /> 
            <figcaption className="text-[14px] opacity-80 pt-2">Dress rehearsal – Post-show ritual photo</figcaption> 
        </figure>

        <p>
            Finally, fifth year arrived. After four years of waiting, we were back in the classroom, often still wearing masks. It was during the first Tuesday theater session that I realized I had become one of the <em>“older ones”</em>, a <strong><em>“veteran”</em></strong> of the group. I can't really explain it, but entering the gym that afternoon, seeing everyone—old and new—I felt it: this year would be different.
        </p>

        <p>
            I even brought Sophie, my younger sister, who had just started first year. She was very shy, and maybe that’s why I cared so much about showing her this world that had become a home for me. I didn’t want her to be held back by worries, “what if I don’t know anyone?”, “it’s not for me,” or “I can start next year” before even trying. So yes, I practically dragged her along: <em>“I’m signing you up whether you like it or not. You’re coming with me.”</em> I told her at the beginning of the year. Looking back now, it’s one of our most cherished memories. And for me, it was a huge privilege to share such a passion with someone I care about so deeply.
        </p>

        <p>
            In short, everything was set for that theater year to become the best ever.
        </p>

        <p>
            <strong>And it truly was.</strong>
        </p>

        <p>
            More than I could have ever imagined.
        </p>

        <p>
            It was so much that by May, with only a few sessions left and just two shows remaining, I felt the need to tell this story. I wanted to help those outside understand what it really means to be part of the theater group.
        </p>

        <figure className="my-6"> 
            <img src="/images/teatro/quinto.png" alt="photo from the fifth-year show" className="w-full mx-auto block pt-4 pb-2" /> 
            <figcaption className="text-[14px] opacity-80 pt-2">The French Lunch: Dressing room with the ladies – Last hug with Mattia – People from Berlevaag</figcaption> 
        </figure>

        <p>
            So, carried away by sentimentality (and probably a bit of fear of the end), I decided to surprise my teammates. First, I wrote in the group asking everyone to tell me what theater meant to them. After a flood of messages, laughs, and teary eyes at the thought of everything ending… I used their phrases as inspiration to prepare a monologue to read just before our final entrance on stage. A little way to close on a high note.
        </p>

        <p>
            But I didn’t want it to be “just” a monologue: I also wanted to publish it in the final Calini newspaper of that year… which, by the way, was also my last participation. Last show, last newspaper, last article. <em>Triple combo activated: Hat-trick of nostalgia!</em>
        </p>

        <p>
            <strong>Sentimentality? Again? Exactly.</strong>
        </p>

        <p>
            That’s why I like the idea of sharing it here. And even though I hope my writing has improved in the last four years, I haven’t touched it: it’s exactly how it was back then, reflecting the Anna of that time, with all her strengths and imperfections.
        </p>

        <p className="opacity-70 text-[14px]">
            Keep in mind that it was meant to be in italian and, as I said, to be performed rather than read… but I think it still works. (If you want to relive that atmosphere, this was the background song: <a href="https://www.youtube.com/watch?v=49FDEh1Zh5U" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline"> <em>To Build a Home – The Cinematic Orchestra</em></a>).
        </p>

        <hr className="my-20 border-t border-neutral-300 dark:border-neutral-600 pt-4" />
        {/* Highlighted Monologue */}
        <div className="my-6 p-4 italic">
        <p>
            "Hi, I’m Anna, and I’m in 5E. This year, as you can imagine, is my last year at Calini, which means that in a few weeks, many things will come to an end for me… high school, oral exams, my last Latin test ever, and among all these things, something else extremely important for me will end: the theater group.
        </p>

        <p>
            I joined the current group only in the last three years, unfortunately. Yet, it feels as if I had been there forever.
        </p>

        <p>
            I believe the theater group is a magical place, it has something hard to explain. There are people, and they are impossible to explain. I thought it would be nice to somehow explain to you what theater really means, so I asked for help from those impossible-to-explain people, and together, we found “a thousand reasons” why you should do theater… because doing theater means you look forward to Tuesday afternoons, it means having fun doing the most embarrassing things of your life, it means playing a game with your body, it means dancing like crazy when Mattia, our director, says DANCE.
        </p>

        <p>
            Doing theater means you’ll learn what it means to be a “sloth,” you’ll learn what to do if they say “4,” or “1,” or “light,” or “heavy.” You’ll learn that if you hear “0,” you fall to the ground, motionless, but if you hear “5,” you run faster than ever, trying to dodge everyone else… spoiler: collisions always happen.
        </p>

        <p>
            You’ll stop being embarrassed when everyone dances together with closed eyes or when you do your first “down”… I won’t tell you what it is, you’ll have to come discover it.
        </p>

        <p>
            Theater is a bit like a Tuesday evening hangout; it means creating a group that works perfectly together, meeting people crazier than you, and over time, being amazed by everyone’s skills and progress. Theater means that after rehearsals, you sing De André and dance to Propaganda. And if, during a break, you hear us suddenly shout “NIIIIIIIIIINNNJAAAAAA,” don’t worry, we’re not crazy—or rather, we always have been—Ninja is just a beautiful game we play during breaks.
        </p>

        <p>
            Theater means that if someone says “CAFFÈÈÈ,” everyone replies “OLÉ.”
        </p>

        <p>
            And the best is yet to come, because all this happens during weekly rehearsals, about three hours together; imagine what happens when we spend full days together. Yes, theater means that as the show approaches, we do intensive rehearsals, meeting on Sundays from morning to evening. Intensive also means lunch together, and even better: a quick soccer match before rehearsals resume. It means that when you get home at night, you can’t get the show’s music out of your head. Theater means you might skip a day of school for an amazing experience: performing in Lovere.
        </p>

        <figure className="my-6">
            <video src="/images/teatro/video.mp4" controls className="w-full mx-auto block" />
            <figcaption className="text-[14px] opacity-80 pt-2">Excerpt from the monologue (aka me crying) – Official photos (thanks Doscioli) – Pizza + soccer match</figcaption> 
        </figure>

        <p>
            Not to mention the most beautiful moments: the final rehearsals, everyone tense, the moments before stepping on stage, before <em><strong>“killing the show”</strong></em>. Because theater means you’ll definitely eat gocciole before a performance, it means overcoming shyness while having fun, it means learning to enjoy the moment on stage to apply it in real life. Theater means fearing the lights, never remembering which side to exit for a scene change, worrying you forgot part of your costume, banning purple from the stage; but it also means making what you see on stage your own, learning to love and appreciate the little things, turning anxiety and fear into pure energy, playing someone else while staying yourself, and messing up lines without anyone noticing.
        </p>

        <p>
            Theater means dancing, singing, reciting lines backstage, and crying together during touching scenes. It means hearing the director say <strong><em>“blackout”</em></strong> during months of rehearsal and then feeling the emotion when that <strong><em>“blackout”</em></strong> happens on stage. Theater means respecting some traditions, like the silliest and best chants backstage at the end of the show, when all that remains in your body is a few tears and a huge rush of adrenaline.
        </p>

        <p>
            And there’s a sacred moment just before going on stage. Before stepping on stage, we gather in the dressing rooms, all nervous but ready; the teacher and director give a speech, which can only end one way, <em>with one long shout from all our hearts</em>: <em><strong>“MERDA MERDA MERDA”</strong></em>.
        </p>

        <p>
            Above all, theater means family, it means going crazy with the craziest people in the world, creating unique bonds with others, playing them like strings of a magical guitar, and dancing together on this melody without a care in the world.
        </p>

        <p>
            And finally, because it’s the moment that always closes everything, theater means… 3… 2… 1… <em><strong>GO.</strong></em>
        </p>

        <p>
            So don’t waste time, the group is waiting for you, and even if I won’t be part of it anymore, I’m more than sure they’ll rock as always. And trust me, the moment you join, you’ll regret not starting sooner.
        </p>

        <p>
            <em><strong>Blackout</strong></em>.
        </p>

        <p className="text-[14px] opacity-70"><em>Anna & the Theater Group</em></p>
        </div>

        {/* Personal Conclusion */}
        <hr className="my-12 border-t border-neutral-300 dark:border-neutral-600" />

        <p>
            Reading it now makes me smile and get a bit emotional. I hope it conveys even a little piece of what it was for us.
        </p>

        <p>
            I miss theater, but right now I don’t have the time to reintegrate it into my routine. Over the years, whenever I go to see my favorite theater troupe’s shows at the end of the year, I get hit by a wave of nostalgia: the kind that makes you want to laugh and cry at the same time.
        </p>

        <p>
            This year is a bit special too: it’s Sophie’s last year; now she’s the “senior,” and I can’t wait to see her last performance. I already know we’ll shed a little tear together when it’s over.
        </p>

        <p>
            And while I’m at it, I want to share a promise I made to her some time ago: <em>“I promise you that when you finish theater at Calini, we’ll find a way to do it, again, just the two of us.”</em>
        </p>
        <br/>

        <p className="opacity-70 text-[14px]">
            P.S. If you're wondering about the whole <em>“merda, merda, merda”</em> thing: in Italian theater it's a traditional good-luck ritual, the equivalent of saying “break a leg”. Actors shout it together right before going on stage — not because it's crude, but because it's a superstition meant to chase away bad luck and release tension. It’s one of those chaotic, heartfelt little rituals that make backstage moments unforgettable.
        </p>

        </article>

        <br/>
        <p className="opacity-70 text-[14px]">
            Thank you for reading.<br />
            If you’d like to share your thoughts or ask anything, I’m always open to a conversation.
        </p>


    </main>
  );
}
