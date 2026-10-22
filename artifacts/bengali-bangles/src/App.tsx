import { useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Menu, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react';
import heroBangles from './assets/hero-bangles.png';

const queryClient = new QueryClient();

function Home() {
  const [category, setCategory] = useState('All bangles');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [notice, setNotice] = useState('');
  const categories = ['All bangles', 'Everyday', 'Festive', 'Hand-painted', 'Gold tone'];
  const products = [
    { id: 1, name: 'Shonali Glass Stack', description: 'A little light for every day', price: 680, category: 'Everyday', tone: 'red', tag: 'Bestseller', material: 'Hand-finished glass' },
    { id: 2, name: 'Mrittika Terracotta', description: 'Earth, made wearable', price: 920, category: 'Hand-painted', tone: 'clay', tag: 'Small batch', material: 'Hand-painted terracotta' },
    { id: 3, name: 'Jochona Gold Pair', description: 'A quiet festive shimmer', price: 1240, category: 'Gold tone', tone: 'gold', tag: 'New', material: 'Gold-tone brass' },
    { id: 4, name: 'Shiuli Flower Set', description: 'For mornings that feel special', price: 790, category: 'Festive', tone: 'ivory', tag: '', material: 'Enamel & glass' },
    { id: 5, name: 'Kolabou Classic', description: 'A nod to the old neighbourhood', price: 560, category: 'Everyday', tone: 'green', tag: '', material: 'Lacquered glass' },
    { id: 6, name: 'Rongdhonu Mix', description: 'Colour, without a reason', price: 860, category: 'Festive', tone: 'mix', tag: 'Limited', material: 'Mixed glass bangles' },
  ];
  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'All bangles' || product.category === category;
    const matchesSearch = `${product.name} ${product.description} ${product.material}`.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [category, search]);
  const cartItems = products.filter((product) => cart[product.id]);
  const subtotal = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const addToCart = (id: number) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setNotice('Added to your bag');
    window.setTimeout(() => setNotice(''), 1800);
  };
  const changeQuantity = (id: number, delta: number) => setCart((current) => {
    const next = { ...current, [id]: (current[id] || 0) + delta };
    if (next[id] <= 0) delete next[id];
    return next;
  });
  return (
    <div className="site-grain min-h-[100dvh] overflow-hidden bg-[#f7f3e9] text-[#332b27]">
      <div className="bg-[#79333b] px-4 py-2 text-center text-[10px] font-medium tracking-[.19em] text-[#fbf4e8] sm:text-[11px]">
        MADE SLOWLY IN BENGAL <span className="mx-2 text-[#d5ae75]">·</span> FREE SHIPPING ON ORDERS OVER ৳2,000
      </div>
      <header className="sticky top-0 z-40 border-b border-[#e6ded0] bg-[#f7f3e9]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-5 py-4 md:px-10">
          <button className="flex items-center gap-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu" data-testid="button-mobile-menu">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-3">
            <a href="#top" className="flex items-center gap-3 no-underline" data-testid="link-home">
              <span className="serif flex h-10 w-10 items-center justify-center rounded-full border border-[#9a5152] text-[20px] text-[#79333b]">শ</span>
              <span className="leading-tight">
                <span className="serif block text-[19px] tracking-[.02em] text-[#4a2928]">Shonali</span>
                <span className="block text-[9px] uppercase tracking-[.22em] text-[#8f8174]">Bangle atelier</span>
              </span>
            </a>
          </div>
          <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-5 border-b border-[#e6ded0] bg-[#f7f3e9] px-6 py-6 text-[12px] uppercase tracking-[.16em] md:static md:flex md:flex-row md:items-center md:gap-9 md:border-0 md:bg-transparent md:p-0`} aria-label="Main navigation">
            <a className="transition-colors hover:text-[#79333b]" href="#collection" onClick={() => setMobileMenuOpen(false)}>The collection</a>
            <a className="transition-colors hover:text-[#79333b]" href="#our-way" onClick={() => setMobileMenuOpen(false)}>Our way</a>
            <a className="transition-colors hover:text-[#79333b]" href="#journal" onClick={() => setMobileMenuOpen(false)}>Notes from Bengal</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#collection" aria-label="Search collection" className="hidden text-[#4c4138] transition-colors hover:text-[#79333b] sm:block" data-testid="link-search"><Search size={19} strokeWidth={1.5} /></a>
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 text-[11px] uppercase tracking-[.14em]" data-testid="button-open-cart" aria-label={`Open bag, ${totalItems} items`}>
              <ShoppingBag size={19} strokeWidth={1.5} />
              <span className="hidden sm:inline">Your bag</span>
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#79333b] px-1 text-[9px] text-white" data-testid="text-cart-count">{totalItems}</span>
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative mx-auto grid max-w-[1360px] items-center gap-8 px-5 pb-16 pt-10 md:min-h-[620px] md:grid-cols-[.86fr_1.14fr] md:gap-10 md:px-10 md:py-16">
          <div className="rise-in relative z-10 order-2 max-w-[530px] md:order-1 md:pl-8">
            <p className="mb-5 text-[10px] uppercase tracking-[.26em] text-[#9a5152]">A little Bengal, wherever you go</p>
            <h1 className="serif text-[clamp(3.1rem,6.4vw,6.1rem)] leading-[.98] tracking-[-.045em] text-[#482c2a]">
              Colour for the <em className="font-medium text-[#9a5152]">everyday.</em>
            </h1>
            <p className="mt-7 max-w-[390px] text-[14px] leading-[1.9] text-[#74695e]">
              Bangles that carry a little of home. Made by hand in Bengal, and meant to be worn with absolutely anything.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a href="#collection" className="group inline-flex items-center gap-4 bg-[#79333b] px-6 py-[15px] text-[10px] uppercase tracking-[.16em] text-[#fff8ee] transition-colors hover:bg-[#59252c]" data-testid="link-shop-collection">
                Find your stack <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#our-way" className="text-[11px] text-[#77685b] underline decoration-[#cdb9a2] underline-offset-4 hover:text-[#79333b]">A note on how we make</a>
            </div>
            <div className="mt-12 flex items-center gap-3 text-[10px] uppercase tracking-[.16em] text-[#948577]">
              <span className="h-px w-8 bg-[#b99a7d]" /> Small batches, made with care
            </div>
          </div>
          <div className="relative order-1 min-h-[340px] overflow-hidden bg-[#e7dccb] md:order-2 md:min-h-[540px]">
            <img src={heroBangles} alt="Vermilion and gold glass bangles resting on handwoven jamdani fabric" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute bottom-5 left-5 flex items-center gap-3 bg-[#f7f3e9]/90 px-4 py-3 backdrop-blur-sm md:bottom-8 md:left-8">
              <span className="serif text-[22px] text-[#79333b]">01</span>
              <span className="text-[9px] uppercase leading-[1.7] tracking-[.17em] text-[#62564b]">Made by hand<br />in Bengal</span>
            </div>
            <span className="serif absolute right-4 top-4 hidden text-[13px] italic text-[#fffaf2] drop-shadow md:block">the everyday edit, no. 01</span>
          </div>
        </section>

        <section className="border-y border-[#e5dccd] bg-[#eee8dc]">
          <div className="mx-auto grid max-w-[1360px] grid-cols-2 divide-x divide-[#d9cdbb] px-5 md:grid-cols-4 md:px-10">
            {[
              ['01', 'Made in Bengal'], ['02', 'Finished by hand'], ['03', 'Easy to wear'], ['04', 'A little less, better'],
            ].map(([number, label]) => <div key={number} className="flex items-center gap-3 py-5 md:justify-center md:py-6">
              <span className="serif text-[17px] text-[#a36c60]">{number}</span><span className="text-[9px] uppercase tracking-[.14em] text-[#63594f] sm:text-[10px]">{label}</span>
            </div>)}
          </div>
        </section>

        <section id="collection" className="mx-auto max-w-[1360px] px-5 pb-24 pt-20 md:px-10 md:pt-28">
          <div className="mb-9 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[.23em] text-[#9a5152]">Consider this your invitation</p>
              <h2 className="serif text-[clamp(2.3rem,4vw,3.6rem)] leading-none tracking-[-.035em] text-[#482c2a]">The bangle drawer</h2>
              <p className="mt-4 text-[13px] text-[#827568]">Pieces to make getting dressed feel like you.</p>
            </div>
            <label className="relative block w-full md:w-[250px]">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#958577]" size={17} strokeWidth={1.5} />
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a colour, a feeling..." className="w-full border-b border-[#cbbba8] bg-transparent py-3 pl-7 pr-2 text-[12px] outline-none placeholder:text-[#a89b8d] focus:border-[#79333b]" data-testid="input-product-search" />
            </label>
          </div>
          <div className="mb-9 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-4 py-[9px] text-[10px] tracking-[.08em] transition-colors ${category === item ? 'border-[#79333b] bg-[#79333b] text-[#fff8ee]' : 'border-[#d8cdbd] text-[#75685b] hover:border-[#9a5152] hover:text-[#79333b]'}`} data-testid={`button-category-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}
          </div>
          {filtered.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-7 md:gap-y-14">
            {filtered.map((product, index) => <article key={product.id} className="group rise-in" style={{ animationDelay: `${index * 70}ms` }} data-testid={`card-product-${product.id}`}>
              <div className={`product-art tone-${product.tone} relative flex aspect-[.86] items-center justify-center overflow-hidden`}>
                {product.tag && <span className="absolute left-3 top-3 z-10 bg-[#f7f3e9]/90 px-2.5 py-1.5 text-[8px] uppercase tracking-[.15em] text-[#6d5b4c]">{product.tag}</span>}
                <div className={`bangle-stack stack-${product.tone}`} aria-hidden="true"><span /><span /><span /><span /></div>
                <button onClick={() => addToCart(product.id)} className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-center gap-2 bg-[#f7f3e9]/95 py-3 text-[9px] uppercase tracking-[.16em] text-[#522d2d] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100" data-testid={`button-add-${product.id}`}><Plus size={14} /> Add to bag</button>
                <button onClick={() => addToCart(product.id)} className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f3e9] text-[#522d2d] md:hidden" aria-label={`Add ${product.name} to bag`} data-testid={`button-add-mobile-${product.id}`}><Plus size={16} /></button>
              </div>
              <div className="flex items-start justify-between gap-2 pt-4">
                <div><h3 className="serif text-[15px] leading-tight text-[#482c2a] md:text-[19px]">{product.name}</h3><p className="mt-1.5 text-[10px] text-[#8b7d70] md:text-[11px]">{product.description}</p></div>
                <span className="shrink-0 pt-1 text-[11px] text-[#58473e]">৳{product.price.toLocaleString('en-IN')}</span>
              </div>
              <p className="mt-3 text-[8px] uppercase tracking-[.15em] text-[#a19485]">{product.material}</p>
            </article>)}
          </div> : <div className="border-y border-[#e2d8c9] py-16 text-center">
            <p className="serif text-2xl text-[#482c2a]">Nothing in this drawer just yet.</p>
            <p className="mt-2 text-[12px] text-[#827568]">Try another search or browse all bangles.</p>
            <button className="mt-5 text-[10px] uppercase tracking-[.16em] text-[#79333b] underline underline-offset-4" onClick={() => { setSearch(''); setCategory('All bangles'); }} data-testid="button-reset-filters">Show everything</button>
          </div>}
          <div className="mt-12 flex justify-center">
            <span className="flex items-center gap-2 text-[9px] uppercase tracking-[.18em] text-[#8a7b6c]"><ArrowDown size={13} /> A few more things worth knowing below</span>
          </div>
        </section>

        <section className="bg-[#78343b] text-[#f8f0e4]">
          <div className="mx-auto grid max-w-[1360px] md:grid-cols-[.83fr_1.17fr]">
            <div className="flex min-h-[390px] flex-col justify-center px-7 py-14 md:px-16 md:py-20">
              <p className="mb-4 text-[9px] uppercase tracking-[.24em] text-[#d7b88b]">The good kind of everyday</p>
              <h2 className="serif max-w-[470px] text-[clamp(2.7rem,4.8vw,4.6rem)] leading-[1.03] tracking-[-.04em]">A little ritual, before the day begins.</h2>
              <p className="mt-6 max-w-[410px] text-[13px] leading-[1.9] text-[#e2cec0]">The soft clink as they settle at your wrist. The familiar colour you reach for without thinking. These are small things, but they make a day yours.</p>
              <a className="group mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[.16em] text-[#f3d9b4]" href="#collection">Find your everyday pair <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></a>
            </div>
            <div className="relative min-h-[300px] overflow-hidden md:min-h-[500px]">
              <img src={heroBangles} className="absolute inset-0 h-full w-full object-cover object-[65%_center] opacity-80 mix-blend-luminosity" alt="A close study of heirloom-red and gold bangles" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#78343b] via-transparent to-transparent md:from-[#78343b]/50" />
              <span className="serif absolute bottom-7 right-7 text-[13px] italic text-[#fff4e5]">A familiar sound, wherever you are.</span>
            </div>
          </div>
        </section>

        <section id="our-way" className="mx-auto grid max-w-[1360px] gap-12 px-5 py-20 md:grid-cols-[.8fr_1.2fr] md:px-10 md:py-28">
          <div className="md:pt-5">
            <p className="mb-4 text-[10px] uppercase tracking-[.23em] text-[#9a5152]">Not just something pretty</p>
            <h2 className="serif max-w-[420px] text-[clamp(2.7rem,4.5vw,4.3rem)] leading-[1.02] tracking-[-.04em] text-[#482c2a]">Made with a little more meaning.</h2>
          </div>
          <div className="grid gap-9 sm:grid-cols-2">
            <div className="border-t border-[#cdbba6] pt-5">
              <span className="serif text-[18px] text-[#a06059]">01 / The hands</span>
              <h3 className="serif mt-5 text-[22px] text-[#482c2a]">Good things take time.</h3>
              <p className="mt-3 text-[12px] leading-[1.9] text-[#7d7166]">We work with small maker groups across Bengal. Each piece is finished by a person, not a production line, so no two are quite the same.</p>
            </div>
            <div className="border-t border-[#cdbba6] pt-5">
              <span className="serif text-[18px] text-[#a06059]">02 / The feeling</span>
              <h3 className="serif mt-5 text-[22px] text-[#482c2a]">Old stories, easy days.</h3>
              <p className="mt-3 text-[12px] leading-[1.9] text-[#7d7166]">The patterns nod to the things we grew up with. The fit, the colours, the price? All made for right now.</p>
            </div>
            <div className="border-t border-[#cdbba6] pt-5">
              <span className="serif text-[18px] text-[#a06059]">03 / The care</span>
              <h3 className="serif mt-5 text-[22px] text-[#482c2a]">A small, thoughtful parcel.</h3>
              <p className="mt-3 text-[12px] leading-[1.9] text-[#7d7166]">Arrives tucked in recycled paper, ready for you or someone you love. We keep the wrapping lovely, and keep the waste low.</p>
            </div>
            <div className="border-t border-[#cdbba6] pt-5">
              <span className="serif text-[18px] text-[#a06059]">04 / The everyday</span>
              <h3 className="serif mt-5 text-[22px] text-[#482c2a]">Wear them your way.</h3>
              <p className="mt-3 text-[12px] leading-[1.9] text-[#7d7166]">Mix a glass stack with your watch. Wear one gold pair with your oldest kurta. There are no rules in this drawer.</p>
            </div>
          </div>
        </section>

        <section id="journal" className="border-y border-[#e5dccd] bg-[#eee8dc]">
          <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-16 md:grid-cols-[.7fr_1.3fr] md:items-center md:px-10 md:py-20">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[.23em] text-[#9a5152]">A small note from home</p>
              <h2 className="serif text-[clamp(2.3rem,4vw,3.6rem)] leading-none tracking-[-.035em] text-[#482c2a]">The Sunday letter</h2>
            </div>
            <div className="flex flex-col gap-5 md:flex-row md:items-end">
              <p className="max-w-[400px] text-[13px] leading-[1.8] text-[#776b60]">Little stories about the makers, the materials, and the Bengali things that stay with us. Sent when we have something worth saying.</p>
              <button onClick={() => setNotice('Our Sunday letter is coming soon. Thank you for being here.')} className="group flex shrink-0 items-center gap-3 border-b border-[#9b7770] pb-2 text-[10px] uppercase tracking-[.16em] text-[#79333b]" data-testid="button-letter-interest">Keep me in the loop <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] px-5 py-14 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 border-b border-[#dcd0c0] pb-9 sm:flex-row sm:items-center">
            <div><p className="serif text-[24px] text-[#482c2a]">A good thing, shared.</p><p className="mt-1 text-[12px] text-[#827568]">Thoughtful pieces. People you love.</p></div>
            <a href="#collection" className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-[#79333b]">Back to the drawer <ArrowRight size={15} /></a>
          </div>
          <footer className="flex flex-col gap-6 pt-7 text-[10px] uppercase tracking-[.13em] text-[#8a7b6c] sm:flex-row sm:items-center sm:justify-between">
            <span>© 2025 Shonali Bangle Atelier · Made slowly in Bengal</span>
            <div className="flex gap-6"><a href="#our-way" className="hover:text-[#79333b]">Our story</a><button onClick={() => setNotice('For a little help, write to hello@shonalibangles.example')} className="hover:text-[#79333b]" data-testid="button-contact">A little help</button><span>Made for everyday</span></div>
          </footer>
        </section>
      </main>

      {notice && <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 bg-[#482c2a] px-5 py-3 text-[11px] text-[#fff8ee] shadow-lg" role="status" data-testid="status-notice"><Check className="mr-2 inline" size={14} />{notice}</div>}

      {cartOpen && <div className="fixed inset-0 z-[60]">
        <button className="absolute inset-0 bg-[#231a18]/45" aria-label="Close bag" onClick={() => setCartOpen(false)} data-testid="button-close-cart-overlay" />
        <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-[450px] flex-col bg-[#f7f3e9] shadow-2xl" aria-label="Shopping bag">
          <div className="flex items-center justify-between border-b border-[#e1d7c9] px-6 py-5">
            <div><p className="text-[9px] uppercase tracking-[.2em] text-[#9a5152]">The good things</p><h2 className="serif mt-1 text-[26px] text-[#482c2a]">Your bag <span className="text-[15px] text-[#9a8a7a]">({totalItems})</span></h2></div>
            <button onClick={() => setCartOpen(false)} className="flex h-9 w-9 items-center justify-center border border-[#d8cdbd] text-[#58473e] hover:bg-[#eee8dc]" aria-label="Close cart" data-testid="button-close-cart"><X size={18} /></button>
          </div>
          {cartItems.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag size={28} strokeWidth={1} className="text-[#a98d76]" />
            <h3 className="serif mt-5 text-[25px] text-[#482c2a]">A little room for something lovely.</h3>
            <p className="mt-2 max-w-[260px] text-[12px] leading-[1.8] text-[#827568]">Your bag is empty for now. Take a look around the drawer.</p>
            <button onClick={() => setCartOpen(false)} className="mt-6 bg-[#79333b] px-6 py-3 text-[9px] uppercase tracking-[.16em] text-[#fff8ee]" data-testid="button-continue-shopping">Browse the collection</button>
          </div> : <>
            <div className="flex-1 overflow-y-auto px-6">
              {cartItems.map((product) => <div key={product.id} className="flex gap-4 border-b border-[#e1d7c9] py-5" data-testid={`row-cart-${product.id}`}>
                <div className={`product-art tone-${product.tone} flex h-[94px] w-[78px] shrink-0 items-center justify-center`}><div className={`bangle-stack mini stack-${product.tone}`}><span /><span /><span /><span /></div></div>
                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div className="flex justify-between gap-2"><div><h3 className="serif text-[16px] text-[#482c2a]">{product.name}</h3><p className="mt-1 text-[9px] uppercase tracking-[.1em] text-[#958577]">{product.material}</p></div><span className="text-[11px]">৳{(product.price * cart[product.id]).toLocaleString('en-IN')}</span></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-[#d8cdbd]">
                      <button onClick={() => changeQuantity(product.id, -1)} className="flex h-7 w-8 items-center justify-center hover:bg-[#eee8dc]" aria-label={`Remove one ${product.name}`} data-testid={`button-decrease-${product.id}`}><Minus size={12} /></button>
                      <span className="w-7 text-center text-[11px]" data-testid={`text-quantity-${product.id}`}>{cart[product.id]}</span>
                      <button onClick={() => changeQuantity(product.id, 1)} className="flex h-7 w-8 items-center justify-center hover:bg-[#eee8dc]" aria-label={`Add one ${product.name}`} data-testid={`button-increase-${product.id}`}><Plus size={12} /></button>
                    </div>
                    <button onClick={() => setCart((current) => { const next = { ...current }; delete next[product.id]; return next; })} className="text-[9px] uppercase tracking-[.12em] text-[#9b7770] underline underline-offset-4 hover:text-[#79333b]" data-testid={`button-remove-${product.id}`}>Remove</button>
                  </div>
                </div>
              </div>)}
            </div>
            <div className="border-t border-[#e1d7c9] px-6 pb-6 pt-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[.12em] text-[#65574d]"><span>Subtotal</span><span data-testid="text-cart-subtotal">৳{subtotal.toLocaleString('en-IN')}</span></div>
              <p className="mt-2 text-[10px] text-[#958577]">Shipping and any applicable taxes are calculated separately.</p>
              <button onClick={() => setNotice('Checkout is not available in this preview. Your bag is saved here while you browse.')} className="mt-5 flex w-full items-center justify-center gap-2 bg-[#79333b] py-4 text-[10px] uppercase tracking-[.17em] text-[#fff8ee] transition-colors hover:bg-[#59252c]" data-testid="button-checkout-boundary">Continue to checkout <ArrowRight size={14} /></button>
              <p className="mt-3 text-center text-[9px] leading-[1.7] text-[#9a8c7d]">This is a preview storefront. Checkout is not connected, and no order will be placed.</p>
            </div>
          </>}
        </aside>
      </div>}
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
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
