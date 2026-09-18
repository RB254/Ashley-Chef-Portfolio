import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetEducation,
  useGetExperiences,
  useGetFeaturedWork,
  useGetGallery,
  useGetInterests,
  useGetLanguages,
  useGetPortfolioSummary,
  useGetProfile,
  useGetReferences,
  useGetSkills,
  useSubmitContact,
} from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const navItems = [
  ['about', 'About'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['work', 'Selected work'],
  ['education', 'Education'],
  ['references', 'References'],
  ['contact', 'Contact'],
];
const localGalleryItems = Array.from({ length: 39 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return {
    id: 1000 + index,
    title: 'Gallery image',
    category: 'Portfolio',
    description: null,
    imageUrl: `/gallery/gallery-${number}.jpg`,
    alt: 'Gallery image',
    featured: false,
  };
});

function imagePath(item: { imageUrl?: string; id?: number }, index: number) {
  return item.imageUrl || `/gallery/gallery-${String(item.id ?? index + 1).padStart(2, '0')}.jpg`;
}

function SectionHeading({ index, title, intro }: { index: string; title: string; intro?: string }) {
  return (
    <div className="mb-12 grid gap-5 md:grid-cols-[120px_1fr] md:items-start">
      <span className="eyebrow pt-2">{index}</span>
      <div>
        <h2 className="font-display text-4xl leading-none tracking-[-0.03em] text-[var(--deep)] md:text-6xl">{title}</h2>
        {intro && <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">{intro}</p>}
      </div>
    </div>
  );
}

function SkeletonSection({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-4" aria-label="Loading content" data-testid="status-loading">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="skeleton h-16 w-full rounded-sm" />
      ))}
    </div>
  );
}

function DataState({ loading, error, empty, children }: { loading: boolean; error: boolean; empty: boolean; children: ReactNode }) {
  if (loading) return <SkeletonSection />;
  if (error) {
    return <p className="border-l-2 border-[var(--clay)] py-3 pl-4 text-sm text-[var(--muted-foreground)]" data-testid="status-error">This section is temporarily unavailable. Please try again shortly.</p>;
  }
  if (empty) {
    return <p className="border-l-2 border-[var(--saffron)] py-3 pl-4 text-sm text-[var(--muted-foreground)]" data-testid="status-empty">No entries have been added here yet.</p>;
  }
  return <>{children}</>;
}

function Header({ profile }: { profile?: { name?: string; title?: string } }) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const go = (id: string) => {
    setOpen(false);
    setLocation(`/#${id}`);
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 20);
  };
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--line)] bg-[rgba(244,238,227,.9)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10">
        <button onClick={() => go('top')} className="group flex items-center gap-3 text-left" data-testid="button-home">
          <span className="flex h-9 w-9 items-center justify-center bg-[var(--deep)] font-display text-xl italic text-[var(--cream)]">A</span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-base text-[var(--deep)]">{profile?.name || 'Ashley Amani Wambura'}</span>
            <span className="eyebrow text-[.57rem]">{profile?.title || 'Pastry & Bakery Professional'}</span>
          </span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          {navItems.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} className="font-mono text-[.65rem] uppercase tracking-[.12em] text-[var(--deep)] transition-colors hover:text-[var(--clay)]" data-testid={`link-nav-${id}`}>
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="/Ashley-Amani-Wambura-CV.pdf" download className="hidden items-center gap-2 border border-[var(--deep)] px-4 py-2 font-mono text-[.65rem] uppercase tracking-[.12em] text-[var(--deep)] transition hover:bg-[var(--deep)] hover:text-[var(--cream)] sm:flex" data-testid="link-download-cv">
            CV <Download size={13} />
          </a>
          <button onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center text-[var(--deep)] lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-[var(--line)] bg-[var(--paper)] px-5 pb-5 pt-2 lg:hidden" aria-label="Mobile navigation">
          {navItems.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} className="flex w-full items-center justify-between border-b border-[var(--line)] py-4 text-left font-mono text-xs uppercase tracking-[.13em] text-[var(--deep)]" data-testid={`link-mobile-nav-${id}`}>
              {label}<ArrowUpRight size={14} />
            </button>
          ))}
          <a href="/Ashley-Amani-Wambura-CV.pdf" download className="mt-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[.13em] text-[var(--clay)]" data-testid="link-mobile-download-cv">Download CV <Download size={14} /></a>
        </nav>
      )}
    </header>
  );
}

function Hero({ profile, summary }: { profile?: any; summary?: any }) {
  const image = '/gallery/gallery-27.jpg';
  return (
    <section id="top" className="relative overflow-hidden bg-[var(--deep)] text-[var(--cream)]">
      <div className="mx-auto grid min-h-[720px] max-w-[1440px] items-end gap-12 px-5 pb-16 pt-32 md:min-h-[800px] md:grid-cols-[1.05fr_.95fr] md:px-10 md:pb-20">
        <div className="relative z-10 max-w-3xl">
          <div className="reveal eyebrow mb-8 text-[var(--saffron)]">Nairobi, Kenya · Portfolio</div>
          <h1 className="reveal reveal-2 font-display text-[clamp(4.2rem,11vw,10.5rem)] leading-[.83] tracking-[-.065em]">
            Ashley<br /><em className="text-[var(--saffron)]">Amani</em><br />Wambura
          </h1>
          <div className="reveal reveal-3 mt-10 flex max-w-xl items-start gap-5 border-l border-[var(--saffron)] pl-5">
            <ArrowDownRight className="mt-1 shrink-0 text-[var(--saffron)]" size={22} />
            <p className="max-w-md text-sm leading-7 text-[rgba(244,238,227,.78)]">
              {profile?.statement || 'Pastry and bakery professional.'}
            </p>
          </div>
          <div className="reveal reveal-3 mt-10 flex flex-wrap gap-3">
            <a href="#work" className="inline-flex items-center gap-3 bg-[var(--saffron)] px-5 py-3 font-mono text-[.66rem] uppercase tracking-[.12em] text-[var(--deep)] transition hover:bg-[var(--cream)]" data-testid="link-hero-work">
              View selected work <ArrowUpRight size={15} />
            </a>
            <a href="#contact" className="inline-flex items-center gap-3 border border-[rgba(244,238,227,.35)] px-5 py-3 font-mono text-[.66rem] uppercase tracking-[.12em] text-[var(--cream)] transition hover:border-[var(--saffron)] hover:text-[var(--saffron)]" data-testid="link-hero-contact">
              Start a conversation
            </a>
          </div>
        </div>
        <div className="relative ml-auto w-full max-w-[540px] md:mb-[-40px]">
          <div className="absolute -left-5 -top-5 h-20 w-20 border-l border-t border-[var(--saffron)] md:-left-8 md:-top-8" />
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--clay)]">
            <img src={image} alt="Ashley Amani Wambura's pastry and bakery work" className="h-full w-full object-cover mix-blend-luminosity opacity-90 transition duration-700 hover:scale-105 hover:mix-blend-normal" data-testid="img-hero-work" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(21,33,29,.8)] to-transparent p-5 pt-28">
              <span className="font-mono text-[.62rem] uppercase tracking-[.14em] text-[var(--cream)]">Selected gallery image</span>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-3 hidden w-32 text-right font-display text-5xl italic leading-none text-[var(--saffron)] md:block">made<br />with<br />care</div>
        </div>
      </div>
      <div className="absolute bottom-6 right-6 hidden font-mono text-[.6rem] uppercase tracking-[.16em] text-[rgba(244,238,227,.55)] md:block">{summary?.galleryCount ?? '—'} gallery entries / 01</div>
    </section>
  );
}

function About({ profile, languages, interests }: { profile?: any; languages?: any[]; interests?: any[] }) {
  return (
    <section id="about" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      <SectionHeading index="01 / About" title="A measured hand. A curious palate." intro="A professional profile built for pastry kitchens, bakery teams, hotels, restaurants, catering companies, and hospitality employers." />
      <div className="grid gap-14 md:grid-cols-[1fr_1.3fr] md:gap-24">
        <div className="relative">
          <div className="aspect-[4/5] max-w-sm overflow-hidden bg-[var(--sage)]">
            <img src="/gallery/gallery-34.jpg" alt="Plated pastry work from Ashley's portfolio" className="h-full w-full object-cover grayscale-[.2] transition duration-700 hover:scale-105" data-testid="img-about-work" />
          </div>
          <span className="absolute -bottom-7 -right-1 font-display text-5xl italic text-[var(--clay)]">01</span>
        </div>
        <div className="max-w-2xl">
          <p className="font-display text-3xl leading-[1.17] tracking-[-.025em] text-[var(--deep)] md:text-5xl">
            {profile?.statement || 'Pastry and bakery professional.'}
          </p>
          <div className="mt-10 grid gap-8 border-t border-[var(--line)] pt-7 sm:grid-cols-2">
            <div>
              <span className="eyebrow">Based in</span>
              <p className="mt-2 flex items-center gap-2 text-sm text-[var(--deep)]"><MapPin size={14} className="text-[var(--clay)]" />{profile?.location || 'Kenya'}</p>
            </div>
            <div>
              <span className="eyebrow">Languages</span>
              <DataState loading={!languages} error={false} empty={!Array.isArray(languages) || !languages.length}>
                <p className="mt-2 text-sm text-[var(--deep)]">{Array.isArray(languages) ? languages.map((item) => `${item.language} (${item.proficiency})`).join(' · ') : ''}</p>
              </DataState>
            </div>
          </div>
          <div className="mt-10 border-t border-[var(--line)] pt-7">
            <span className="eyebrow">Interests</span>
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.isArray(interests) && interests.length ? interests.map((interest) => <span key={interest.id} className="border border-[var(--line)] px-3 py-2 text-xs text-[var(--deep)]" data-testid={`tag-interest-${interest.id}`}>{interest.name}</span>) : <span className="text-sm text-[var(--muted-foreground)]">No entries have been added here yet.</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience({ data, loading, error }: { data?: any[]; loading: boolean; error: boolean }) {
  const list = Array.isArray(data) ? data : [];
  return (
    <section id="experience" className="bg-[var(--paper)] px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading index="02 / Experience" title="Practice, in sequence." intro="Roles and responsibilities from Ashley's professional experience." />
        <DataState loading={loading} error={error} empty={!list.length}>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {list.map((item, index) => (
              <article key={item.id} className="group grid gap-5 py-8 md:grid-cols-[100px_1fr_1.2fr] md:gap-10 md:py-10" data-testid={`card-experience-${item.id}`}>
                <span className="font-mono text-xs text-[var(--clay)]">0{index + 1}</span>
                <div>
                  <h3 className="font-display text-2xl leading-tight text-[var(--deep)]">{item.position}</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.company}</p>
                </div>
                <div className="md:flex md:items-start md:justify-between md:gap-8">
                  <ul className="space-y-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {Array.isArray(item.responsibilities) && item.responsibilities.map((responsibility: string) => <li key={responsibility} className="flex gap-3"><span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-[var(--saffron)]" />{responsibility}</li>)}
                  </ul>
                  <span className="mt-5 block shrink-0 font-mono text-[.65rem] uppercase tracking-[.12em] text-[var(--deep)] md:mt-0">{item.dates}</span>
                </div>
              </article>
            ))}
          </div>
        </DataState>
      </div>
    </section>
  );
}

function Skills({ skills, loading, error }: { skills?: any[]; loading: boolean; error: boolean }) {
  const list = Array.isArray(skills) ? skills : [];
  return (
    <section id="skills" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      <SectionHeading index="03 / Skills" title="The station, understood." intro="Culinary skill categories presented directly from Ashley's profile." />
      <DataState loading={loading} error={error} empty={!list.length}>
        <div className="grid gap-px bg-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
          {list.map((item, index) => (
            <article key={item.id} className="bg-[var(--cream)] p-7 md:min-h-56 md:p-9" data-testid={`card-skill-${item.id}`}>
              <span className="font-mono text-xs text-[var(--clay)]">0{index + 1}</span>
              <h3 className="mt-8 font-display text-2xl text-[var(--deep)]">{item.name}</h3>
              <div className="mt-5 space-y-2">
                {Array.isArray(item.skills) && item.skills.map((skill: string) => <p key={skill} className="text-sm text-[var(--muted-foreground)]">{skill}</p>)}
              </div>
            </article>
          ))}
        </div>
      </DataState>
    </section>
  );
}

function Lightbox({ item, onClose, onNext, onPrevious }: { item: any; onClose: () => void; onNext: () => void; onPrevious: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNext();
      if (event.key === 'ArrowLeft') onPrevious();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose, onNext, onPrevious]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(21,33,29,.94)] p-4 md:p-10" role="dialog" aria-modal="true" aria-label="Gallery image viewer" data-testid="lightbox">
      <button onClick={onClose} className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center text-[var(--cream)]" aria-label="Close image viewer" data-testid="button-close-lightbox"><X /></button>
      <button onClick={onPrevious} className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[var(--cream)] md:left-8" aria-label="Previous image" data-testid="button-previous-image"><ChevronLeft /></button>
      <figure className="flex max-h-full max-w-5xl flex-col items-center">
        <img src={imagePath(item, item.id)} alt={item.alt || item.title || 'Gallery image'} className="max-h-[75vh] max-w-full object-contain" data-testid={`img-lightbox-${item.id}`} />
        <figcaption className="mt-5 flex w-full max-w-3xl justify-between gap-5 text-[var(--cream)]">
          <span><span className="font-display text-xl">{item.title || 'Gallery image'}</span>{item.description && <span className="mt-1 block text-xs text-[rgba(244,238,227,.65)]">{item.description}</span>}</span>
          <span className="font-mono text-xs text-[var(--saffron)]">ESC / {item.category || 'Gallery'}</span>
        </figcaption>
      </figure>
      <button onClick={onNext} className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[var(--cream)] md:right-8" aria-label="Next image" data-testid="button-next-image"><ChevronRight /></button>
    </div>
  );
}

function Work({ featured, gallery, loading, error }: { featured?: any[]; gallery?: any[]; loading: boolean; error: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const items = useMemo(() => {
    const gallerySource = Array.isArray(gallery) && gallery.length ? gallery : localGalleryItems;
    const featuredList = Array.isArray(featured) ? featured : [];
    const source = featuredList.length
      ? [...featuredList, ...gallerySource.filter((item) => !featuredList.some((feature) => feature.id === item.id))]
      : gallerySource;
    return source;
  }, [featured, gallery]);
  const categories = ['All', ...Array.from(new Set(items.map((item) => item.category).filter(Boolean)))];
  const filtered = filter === 'All' ? items : items.filter((item) => item.category === filter);
  const currentIndex = selected === null ? -1 : filtered.findIndex((item) => item.id === selected);
  const current = currentIndex >= 0 ? filtered[currentIndex] : null;
  return (
    <section id="work" className="bg-[var(--deep)] px-5 py-24 text-[var(--cream)] md:px-10 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading index="04 / Selected work" title="The work speaks first." intro="A selection of gallery images from Ashley's portfolio." />
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => <button key={category} onClick={() => setFilter(category)} className={`border px-3 py-2 font-mono text-[.63rem] uppercase tracking-[.12em] transition ${filter === category ? 'border-[var(--saffron)] bg-[var(--saffron)] text-[var(--deep)]' : 'border-[rgba(244,238,227,.25)] text-[rgba(244,238,227,.7)] hover:border-[var(--saffron)]'}`} data-testid={`button-filter-${category.toLowerCase().replace(/\s+/g, '-')}`}>{category}</button>)}
        </div>
        <DataState loading={loading} error={error} empty={!filtered.length}>
          <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
            {filtered.map((item, index) => (
              <button key={item.id} onClick={() => setSelected(item.id)} className={`group relative mb-3 block w-full overflow-hidden text-left ${index % 5 === 0 ? 'aspect-[4/5]' : index % 3 === 0 ? 'aspect-square' : 'aspect-[4/3]'}`} data-testid={`button-gallery-${item.id}`}>
                <img src={imagePath(item, index)} alt={item.alt || item.title || 'Gallery image'} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-75" data-testid={`img-gallery-${item.id}`} />
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[rgba(21,33,29,.9)] to-transparent p-4 pt-12 transition-transform duration-300 group-hover:translate-y-0">
                  <span className="font-display text-lg">{item.title || 'Gallery image'}</span>
                  <span className="mt-1 block font-mono text-[.58rem] uppercase tracking-[.12em] text-[var(--saffron)]">{item.category || 'Selected work'}</span>
                </span>
              </button>
            ))}
          </div>
        </DataState>
      </div>
      {current && <Lightbox item={current} onClose={() => setSelected(null)} onNext={() => setSelected(filtered[(currentIndex + 1) % filtered.length].id)} onPrevious={() => setSelected(filtered[(currentIndex - 1 + filtered.length) % filtered.length].id)} />}
    </section>
  );
}

function Education({ education, loading, error }: { education?: any[]; loading: boolean; error: boolean }) {
  const list = Array.isArray(education) ? education : [];
  return (
    <section id="education" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      <div className="grid gap-12 md:grid-cols-[.7fr_1.3fr]">
        <SectionHeading index="05 / Education" title="Built on learning." />
        <DataState loading={loading} error={error} empty={!list.length}>
          <div className="space-y-0 border-t border-[var(--line)]">
            {list.map((item) => <article key={item.id} className="border-b border-[var(--line)] py-7" data-testid={`card-education-${item.id}`}>
              <div className="flex flex-wrap justify-between gap-3"><span className="font-display text-2xl text-[var(--deep)]">{item.qualification}</span><span className="font-mono text-[.63rem] uppercase tracking-[.12em] text-[var(--clay)]">{item.period}</span></div>
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">{item.institution}{item.field ? ` · ${item.field}` : ''}</p>
            </article>)}
          </div>
        </DataState>
      </div>
    </section>
  );
}

function References({ references, loading, error }: { references?: any[]; loading: boolean; error: boolean }) {
  const list = Array.isArray(references) ? references : [];
  return (
    <section id="references" className="bg-[var(--saffron)] px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading index="06 / References" title="People who know the work." intro="Professional references available for hospitality opportunities." />
        <DataState loading={loading} error={error} empty={!list.length}>
          <div className="grid gap-8 md:grid-cols-2">
            {list.map((item) => <article key={item.id} className="border-t border-[rgba(21,33,29,.3)] pt-5" data-testid={`card-reference-${item.id}`}>
              <h3 className="font-display text-2xl text-[var(--deep)]">{item.name}</h3>
              <p className="mt-2 text-sm text-[var(--deep)]">{item.position}{item.company ? ` · ${item.company}` : ''}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-[var(--deep)]"><a href={`tel:${item.phone}`} className="inline-flex items-center gap-2 hover:underline" data-testid={`link-reference-phone-${item.id}`}><Phone size={13} />{item.phone}</a><a href={`mailto:${item.email}`} className="inline-flex items-center gap-2 hover:underline" data-testid={`link-reference-email-${item.id}`}><Mail size={13} />{item.email}</a></div>
            </article>)}
          </div>
        </DataState>
      </div>
    </section>
  );
}

function Contact({ profile }: { profile?: any }) {
  const mutation = useSubmitContact();
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    const data = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>;
    mutation.mutate({ data: { name: data.name, email: data.email, company: data.company || undefined, opportunity: data.opportunity || undefined, message: data.message } }, {
      onSuccess: () => { setSubmitted(true); event.currentTarget.reset(); },
      onError: () => setFormError('Your message could not be sent. Please check the details and try again.'),
    });
  };
  return (
    <section id="contact" className="bg-[var(--paper)] px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-[.85fr_1.15fr] md:gap-24">
        <div>
          <span className="eyebrow">07 / Contact</span>
          <h2 className="mt-5 font-display text-5xl leading-[.95] tracking-[-.04em] text-[var(--deep)] md:text-7xl">Let’s talk<br /><em>kitchen.</em></h2>
          <p className="mt-8 max-w-sm text-sm leading-7 text-[var(--muted-foreground)]">For employment, collaboration, or hospitality opportunities, send Ashley a message.</p>
          <div className="mt-12 space-y-4 border-t border-[var(--line)] pt-6 text-sm">
            {profile?.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-[var(--deep)] hover:text-[var(--clay)]" data-testid="link-contact-email"><Mail size={15} className="text-[var(--clay)]" />{profile.email}</a>}
            {profile?.phone && <a href={`tel:${profile.phone}`} className="flex items-center gap-3 text-[var(--deep)] hover:text-[var(--clay)]" data-testid="link-contact-phone"><Phone size={15} className="text-[var(--clay)]" />{profile.phone}</a>}
          </div>
          <a href="/Ashley-Amani-Wambura-CV.pdf" download className="mt-10 inline-flex items-center gap-3 font-mono text-[.66rem] uppercase tracking-[.12em] text-[var(--clay)] hover:text-[var(--deep)]" data-testid="link-contact-cv">Download CV <Download size={14} /></a>
        </div>
        <div>
          {submitted ? (
            <div className="border-t-2 border-[var(--saffron)] pt-7" data-testid="status-contact-success">
              <span className="eyebrow">Message received</span>
              <h3 className="mt-5 font-display text-4xl text-[var(--deep)]">Thank you for reaching out.</h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted-foreground)]">Ashley will review your message and respond using the contact details provided.</p>
              <button onClick={() => setSubmitted(false)} className="mt-8 border border-[var(--deep)] px-4 py-3 font-mono text-[.65rem] uppercase tracking-[.12em] text-[var(--deep)]" data-testid="button-send-another">Send another message</button>
            </div>
          ) : (
            <form onSubmit={submit} className="border-t-2 border-[var(--deep)] pt-7" data-testid="form-contact">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block"><span className="eyebrow">Name *</span><input name="name" required minLength={2} maxLength={120} className="mt-3 w-full border-0 border-b border-[var(--line)] bg-transparent px-0 py-3 text-sm text-[var(--deep)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--clay)]" placeholder="Your name" data-testid="input-contact-name" /></label>
                <label className="block"><span className="eyebrow">Email *</span><input name="email" type="email" required maxLength={160} className="mt-3 w-full border-0 border-b border-[var(--line)] bg-transparent px-0 py-3 text-sm text-[var(--deep)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--clay)]" placeholder="you@company.com" data-testid="input-contact-email" /></label>
              </div>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <label className="block"><span className="eyebrow">Company</span><input name="company" maxLength={160} className="mt-3 w-full border-0 border-b border-[var(--line)] bg-transparent px-0 py-3 text-sm text-[var(--deep)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--clay)]" placeholder="Hotel, bakery, restaurant" data-testid="input-contact-company" /></label>
                <label className="block"><span className="eyebrow">Opportunity</span><input name="opportunity" maxLength={160} className="mt-3 w-full border-0 border-b border-[var(--line)] bg-transparent px-0 py-3 text-sm text-[var(--deep)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--clay)]" placeholder="Role or project" data-testid="input-contact-opportunity" /></label>
              </div>
              <label className="mt-7 block"><span className="eyebrow">Message *</span><textarea name="message" required minLength={10} maxLength={3000} rows={5} className="mt-3 w-full resize-y border-0 border-b border-[var(--line)] bg-transparent px-0 py-3 text-sm leading-6 text-[var(--deep)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--clay)]" placeholder="Tell Ashley a little about the opportunity." data-testid="textarea-contact-message" /></label>
              {formError && <p className="mt-5 text-sm text-[var(--clay)]" data-testid="status-contact-error">{formError}</p>}
              <button type="submit" disabled={mutation.isPending} className="mt-8 inline-flex items-center gap-3 bg-[var(--deep)] px-6 py-4 font-mono text-[.66rem] uppercase tracking-[.12em] text-[var(--cream)] transition hover:bg-[var(--clay)] disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-contact">
                {mutation.isPending ? 'Sending…' : 'Send message'} <ArrowUpRight size={15} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer({ profile }: { profile?: any }) {
  return (
    <footer className="bg-[var(--deep)] px-5 py-8 text-[var(--cream)] md:px-10">
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div><p className="font-display text-xl">{profile?.name || 'Ashley Amani Wambura'}</p><p className="mt-1 font-mono text-[.6rem] uppercase tracking-[.14em] text-[rgba(244,238,227,.55)]">{profile?.title || 'Pastry & Bakery Professional'}</p></div>
        <a href="#top" className="inline-flex items-center gap-2 font-mono text-[.62rem] uppercase tracking-[.14em] text-[var(--saffron)]" data-testid="link-back-to-top">Back to top <ArrowUpRight size={14} /></a>
        <p className="font-mono text-[.58rem] uppercase tracking-[.12em] text-[rgba(244,238,227,.45)]">© {new Date().getFullYear()} Ashley Amani Wambura</p>
      </div>
    </footer>
  );
}

function Home() {
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: experiences, isLoading: experiencesLoading, isError: experiencesError } = useGetExperiences();
  const { data: education, isLoading: educationLoading, isError: educationError } = useGetEducation();
  const { data: skills, isLoading: skillsLoading, isError: skillsError } = useGetSkills();
  const { data: gallery, isLoading: galleryLoading, isError: galleryError } = useGetGallery();
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedWork();
  const { data: languages } = useGetLanguages();
  const { data: interests } = useGetInterests();
  const { data: references, isLoading: referencesLoading, isError: referencesError } = useGetReferences();
  const { data: summary } = useGetPortfolioSummary();
  return (
    <div className="grain min-h-[100dvh]">
      <Header profile={profile} />
      {profileLoading ? <div className="flex min-h-[720px] items-end bg-[var(--deep)] p-8 md:p-20"><div className="skeleton h-40 w-full max-w-2xl bg-[rgba(244,238,227,.1)]" /></div> : <Hero profile={profile} summary={summary} />}
      <About profile={profile} languages={languages} interests={interests} />
      <Experience data={experiences} loading={experiencesLoading} error={experiencesError} />
      <Skills skills={skills} loading={skillsLoading} error={skillsError} />
      <Work featured={featured} gallery={gallery} loading={galleryLoading || featuredLoading} error={galleryError} />
      <Education education={education} loading={educationLoading} error={educationError} />
      <References references={references} loading={referencesLoading} error={referencesError} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </div>
  );
}

function Router() {
  return (
    <ErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={Home} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;