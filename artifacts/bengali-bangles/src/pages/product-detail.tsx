import { useEffect, useState } from 'react';
import { Link, useParams } from 'wouter';
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import NotFound from '@/pages/not-found';
import { useCart } from '@/context/cart-context';
import { bangleSizes, products, type BangleSize } from '@/data/products';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find((item) => item.id === Number(productId));
  const { addToCart, totalItems } = useCart();
  const [selectedSize, setSelectedSize] = useState<BangleSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
    setAdded(false);
  }, [productId]);

  if (!product) {
    return <NotFound />;
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product.id, selectedSize, quantity);
    setAdded(true);
  };

  return (
    <div className="site-grain min-h-[100dvh] bg-[#f7f3e9] text-[#332b27]">
      <header className="border-b border-[#e6ded0] bg-[#f7f3e9]/95">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-5 md:px-10">
          <span className="w-8" aria-hidden="true" />
          <span className="serif text-[18px] text-[#482c2a]">কাকন বাহার</span>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[.12em] text-[#482c2a]"
            aria-label={`Return to shop; ${totalItems} items in your bag`}
            data-testid="link-detail-bag"
          >
            <ShoppingBag size={17} />
            <span className="hidden sm:inline">Your bag</span>
            <span data-testid="text-detail-cart-count">{totalItems}</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1200px] gap-8 px-5 py-8 md:grid-cols-[1.1fr_.9fr] md:gap-14 md:px-10 md:py-14">
        <Link
          href="/"
          className="col-span-full inline-flex w-fit items-center gap-2 text-[10px] uppercase tracking-[.14em] text-[#79333b] hover:text-[#59252c]"
          data-testid="link-back-to-collection"
        >
          <ArrowLeft size={15} />
          Back to collection
        </Link>

        <div className="h-fit self-start overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full object-cover"
            data-testid={`img-product-detail-${product.id}`}
          />
        </div>

        <section className="flex flex-col justify-center py-2">
          <p className="text-[10px] uppercase tracking-[.2em] text-[#9a5152]">
            {product.category}
          </p>
          <h1 className="serif mt-3 text-[clamp(2rem,4vw,3.4rem)] leading-tight text-[#482c2a]">
            {product.name}
          </h1>
          <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-[#776b60]">
            {product.description}
          </p>
          <p className="mt-6 text-[18px] text-[#482c2a]" data-testid="text-detail-price">
            ৳{product.price.toLocaleString('en-IN')}
          </p>

          <div className="mt-8 border-y border-[#e1d7c9] py-6">
            <h2 className="text-[11px] uppercase tracking-[.16em] text-[#482c2a]">
              Choose bangle size
            </h2>
            <div
              className="mt-4 grid grid-cols-4 gap-2"
              role="group"
              aria-label="Choose bangle size"
            >
              {bangleSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={selectedSize === size}
                  onClick={() => {
                    setSelectedSize(size);
                    setAdded(false);
                  }}
                  className={`border px-3 py-3 text-[12px] transition-colors ${
                    selectedSize === size
                      ? 'border-[#79333b] bg-[#79333b] text-white'
                      : 'border-[#d8cdbd] text-[#58473e] hover:border-[#79333b]'
                  }`}
                  data-testid={`button-size-${size.replace('.', '-')}`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p
              className="mt-3 text-[11px] text-[#827568]"
              role="status"
              data-testid="text-selected-size"
            >
              {selectedSize
                ? `Selected size ${selectedSize}`
                : 'Select a size to continue.'}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[.16em] text-[#482c2a]">
              Quantity
            </span>
            <div
              className="inline-flex items-center border border-[#d8cdbd] text-[#58473e]"
              role="group"
              aria-label="Quantity"
              data-testid="control-product-quantity"
            >
              <button
                type="button"
                onClick={() => {
                  setQuantity((current) => Math.max(1, current - 1));
                  setAdded(false);
                }}
                disabled={quantity <= 1}
                className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-[#eee8dc] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
                data-testid="button-decrease-product-quantity"
              >
                <Minus size={15} />
              </button>
              <output
                id="product-quantity"
                className="min-w-10 text-center text-[12px]"
                aria-live="polite"
                data-testid="text-product-quantity"
              >
                {quantity}
              </output>
              <button
                type="button"
                onClick={() => {
                  setQuantity((current) => Math.min(10, current + 1));
                  setAdded(false);
                }}
                disabled={quantity >= 10}
                className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-[#eee8dc] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
                data-testid="button-increase-product-quantity"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#79333b] px-6 py-4 text-[10px] uppercase tracking-[.16em] text-white transition-colors hover:bg-[#59252c] disabled:cursor-not-allowed disabled:bg-[#b9a5a0]"
            data-testid="button-detail-add-to-bag"
          >
            <ShoppingBag size={15} />
            Add to bag
          </button>

          {added && (
            <p
              className="mt-4 flex items-center gap-2 text-[12px] text-[#526b4b]"
              role="status"
              data-testid="status-added-to-bag"
            >
              <Check size={15} />
              {quantity} {quantity === 1 ? 'item' : 'items'} in size {selectedSize} added to your bag.
            </p>
          )}

          <Link
            href="/"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#79333b] px-6 py-4 text-[10px] uppercase tracking-[.16em] text-white transition-colors hover:bg-[#59252c]"
            data-testid="link-continue-browsing"
          >
            <ArrowLeft size={14} />
            Continue browsing
          </Link>
        </section>
      </main>
    </div>
  );
}
