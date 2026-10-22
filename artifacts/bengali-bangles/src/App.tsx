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
import { ArrowRight, Check, Menu, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react';
import heroBangles from './assets/hero-bangles.png';
import kakonBaharLogo from './assets/kakon-bahar-logo.jpg';

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
    { id: 1, name: 'Red Glass Stack', description: 'A little light for every day', price: 680, category: 'Everyday', tone: 'red', tag: 'Bestseller', material: 'Hand-finished glass' },
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
      <header className="sticky top-0 z-40 border-b border-[#e6ded0] bg-[#f7f3e9]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-5 py-4 md:px-10">
          <button className="flex items-center gap-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu" data-testid="button-mobile-menu">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-3">
            <a href="#top" className="flex items-center gap-3 no-underline" data-testid="link-home">
              <img src={kakonBaharLogo} alt="Kakon Bahar logo" className="h-14 w-14 shrink-0 object-cover" />
              <span className="leading-tight">
                <span className="serif block text-[19px] tracking-[.02em] text-[#4a2928]">কাকন বাহার</span>
                <span className="block text-[9px] uppercase tracking-[.16em] text-[#8f8174]">Bengali bangles</span>
              </span>
            </a>
          </div>
          <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-5 border-b border-[#e6ded0] bg-[#f7f3e9] px-6 py-6 text-[12px] uppercase tracking-[.16em] md:static md:flex md:flex-row md:items-center md:gap-9 md:border-0 md:bg-transparent md:p-0`} aria-label="Main navigation">
            <a className="transition-colors hover:text-[#79333b]" href="#collection" onClick={() => setMobileMenuOpen(false)}>Shop bangles</a>
            <a className="transition-colors hover:text-[#79333b]" href="#our-story" onClick={() => setMobileMenuOpen(false)}>Our story</a>
            <a className="transition-colors hover:text-[#79333b]" href="#journal" onClick={() => setMobileMenuOpen(false)}>Sunday letter</a>
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
        <section className="relative mx-auto grid max-w-[1360px] items-center gap-7 px-5 pb-10 pt-7 md:min-h-[430px] md:grid-cols-[.9fr_1.1fr] md:gap-10 md:px-10 md:py-10">
          <div className="rise-in relative z-10 order-2 max-w-[530px] md:order-1 md:pl-8">
            <h1 className="serif text-[clamp(2.8rem,5vw,4.8rem)] leading-[1.03] tracking-[-.04em] text-[#482c2a]">
              Bengali bangles <em className="font-medium text-[#9a5152]">for every day.</em>
            </h1>
            <p className="mt-5 max-w-[360px] text-[14px] leading-[1.8] text-[#74695e]">
              Simple, colourful bangles inspired by Bengal.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <a href="#collection" className="group inline-flex items-center gap-4 bg-[#79333b] px-6 py-[14px] text-[10px] uppercase tracking-[.14em] text-[#fff8ee] transition-colors hover:bg-[#59252c]" data-testid="link-shop-collection">
                Shop the collection <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#our-story" className="text-[11px] text-[#77685b] underline decoration-[#cdb9a2] underline-offset-4 hover:text-[#79333b]">Our story</a>
            </div>
          </div>
          <div className="relative order-1 min-h-[280px] overflow-hidden bg-[#e7dccb] md:order-2 md:min-h-[380px]">
            <img src={heroBangles} alt="Vermilion and gold glass bangles resting on handwoven jamdani fabric" className="absolute inset-0 h-full w-full object-cover object-center" />
          </div>
        </section>

        <section id="collection" className="mx-auto max-w-[1360px] px-5 pb-16 pt-12 md:px-10 md:pt-16">
          <div className="mb-9 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="serif text-[clamp(2.3rem,4vw,3.6rem)] leading-none tracking-[-.035em] text-[#482c2a]">The bangle drawer</h2>
              <p className="mt-3 text-[13px] text-[#827568]">Browse bangles inspired by Bengal.</p>
            </div>
            <label className="relative block w-full md:w-[250px]">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#958577]" size={17} strokeWidth={1.5} />
              <input type="search" aria-label="Search bangles" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bangles" className="w-full border-b border-[#cbbba8] bg-transparent py-3 pl-7 pr-2 text-[12px] outline-none placeholder:text-[#a89b8d] focus:border-[#79333b]" data-testid="input-product-search" />
            </label>
          </div>
          <div className="mb-9 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-4 py-[9px] text-[10px] tracking-[.08em] transition-colors ${category === item ? 'border-[#79333b] bg-[#79333b] text-[#fff8ee]' : 'border-[#d8cdbd] text-[#75685b] hover:border-[#9a5152] hover:text-[#79333b]'}`} data-testid={`button-category-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}
          </div>
          {filtered.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-7 md:gap-y-14">
            {filtered.map((product, index) => <article key={product.id} className="group rise-in" style={{ animationDelay: `${index * 70}ms` }} data-testid={`card-product-${product.id}`}>
              <div className={`product-art tone-${product.tone} relative flex aspect-[.86] items-center justify-center overflow-hidden`}>
                <div className={`bangle-stack stack-${product.tone}`} aria-hidden="true"><span /><span /><span /><span /></div>
                <button onClick={() => addToCart(product.id)} className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-center gap-2 bg-[#f7f3e9]/95 py-3 text-[9px] uppercase tracking-[.16em] text-[#522d2d] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100" data-testid={`button-add-${product.id}`}><Plus size={14} /> Add to bag</button>
                <button onClick={() => addToCart(product.id)} className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f3e9] text-[#522d2d] md:hidden" aria-label={`Add ${product.name} to bag`} data-testid={`button-add-mobile-${product.id}`}><Plus size={16} /></button>
              </div>
              <div className="flex items-start justify-between gap-2 pt-4">
                <h3 className="serif text-[15px] leading-tight text-[#482c2a] md:text-[19px]">{product.name}</h3>
                <span className="shrink-0 pt-1 text-[11px] text-[#58473e]">৳{product.price.toLocaleString('en-IN')}</span>
              </div>
            </article>)}
          </div> : <div className="border-y border-[#e2d8c9] py-16 text-center">
            <p className="serif text-2xl text-[#482c2a]">Nothing in this drawer just yet.</p>
            <p className="mt-2 text-[12px] text-[#827568]">Try another search or browse all bangles.</p>
            <button className="mt-5 text-[10px] uppercase tracking-[.16em] text-[#79333b] underline underline-offset-4" onClick={() => { setSearch(''); setCategory('All bangles'); }} data-testid="button-reset-filters">Show everything</button>
          </div>}
        </section>

        <section id="our-story" className="border-y border-[#e5dccd] bg-[#eee8dc]">
          <div className="mx-auto grid max-w-[1360px] gap-5 px-5 py-11 md:grid-cols-2 md:items-center md:px-10 md:py-14">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[.2em] text-[#9a5152]">Our story</p>
              <h2 className="serif text-[clamp(2rem,3.5vw,3rem)] leading-tight text-[#482c2a]">A little Bengal, close to home.</h2>
            </div>
            <p className="max-w-[500px] text-[13px] leading-[1.8] text-[#776b60]">
              Kakon Bahar brings Bengali colour and bangle traditions into everyday dressing.
            </p>
          </div>
        </section>

        <section id="journal" className="mx-auto grid max-w-[1360px] gap-4 px-5 py-11 md:grid-cols-2 md:items-center md:px-10 md:py-14">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[.2em] text-[#9a5152]">A note from Bengal</p>
            <h2 className="serif text-[clamp(2rem,3.5vw,3rem)] leading-tight text-[#482c2a]">The Sunday letter</h2>
          </div>
          <p className="max-w-[500px] text-[13px] leading-[1.8] text-[#776b60]">
            Occasional notes on Bengali craft, colour, and everyday style. Coming soon.
          </p>
        </section>

        <footer className="border-t border-[#e5dccd]">
          <div className="mx-auto flex max-w-[1360px] flex-col gap-2 px-5 py-7 text-[10px] uppercase tracking-[.12em] text-[#8a7b6c] sm:flex-row sm:items-center sm:justify-between md:px-10">
            <span className="serif text-[18px] normal-case tracking-normal text-[#482c2a]">Kakon Bahar</span>
            <span>Bengali bangles · Made in Bengal</span>
            <span>© {new Date().getFullYear()} Kakon Bahar</span>
          </div>
        </footer>
      </main>

      {notice && <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 bg-[#482c2a] px-5 py-3 text-[11px] text-[#fff8ee] shadow-lg" role="status" data-testid="status-notice"><Check className="mr-2 inline" size={14} />{notice}</div>}

      {cartOpen && <div className="fixed inset-0 z-[60]">
        <button className="absolute inset-0 bg-[#231a18]/45" aria-label="Close bag" onClick={() => setCartOpen(false)} data-testid="button-close-cart-overlay" />
        <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-[450px] flex-col bg-[#f7f3e9] shadow-2xl" aria-label="Shopping bag">
          <div className="flex items-center justify-between border-b border-[#e1d7c9] px-6 py-5">
            <h2 className="serif text-[26px] text-[#482c2a]">Your bag <span className="text-[15px] text-[#9a8a7a]">({totalItems})</span></h2>
            <button onClick={() => setCartOpen(false)} className="flex h-9 w-9 items-center justify-center border border-[#d8cdbd] text-[#58473e] hover:bg-[#eee8dc]" aria-label="Close cart" data-testid="button-close-cart"><X size={18} /></button>
          </div>
          {cartItems.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag size={28} strokeWidth={1} className="text-[#a98d76]" />
            <h3 className="serif mt-5 text-[22px] text-[#482c2a]">Your bag is empty.</h3>
            <button onClick={() => setCartOpen(false)} className="mt-6 bg-[#79333b] px-6 py-3 text-[9px] uppercase tracking-[.16em] text-[#fff8ee]" data-testid="button-continue-shopping">Shop bangles</button>
          </div> : <>
            <div className="flex-1 overflow-y-auto px-6">
              {cartItems.map((product) => <div key={product.id} className="flex gap-4 border-b border-[#e1d7c9] py-5" data-testid={`row-cart-${product.id}`}>
                <div className={`product-art tone-${product.tone} flex h-[94px] w-[78px] shrink-0 items-center justify-center`}><div className={`bangle-stack mini stack-${product.tone}`}><span /><span /><span /><span /></div></div>
                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div className="flex justify-between gap-2"><h3 className="serif text-[16px] text-[#482c2a]">{product.name}</h3><span className="text-[11px]">৳{(product.price * cart[product.id]).toLocaleString('en-IN')}</span></div>
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
              <button onClick={() => setNotice('Checkout is not connected yet. No order will be placed.')} className="mt-5 flex w-full items-center justify-center gap-2 bg-[#79333b] py-4 text-[10px] uppercase tracking-[.17em] text-[#fff8ee] transition-colors hover:bg-[#59252c]" data-testid="button-checkout-boundary">Checkout <ArrowRight size={14} /></button>
              <p className="mt-3 text-center text-[9px] text-[#9a8c7d]">Checkout is not connected yet.</p>
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
