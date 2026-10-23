import { useState } from 'react';
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import { useCart } from '@/context/cart-context';
import { products } from '@/data/products';

export default function CartPage() {
  const { lines, totalItems, changeQuantity, removeFromCart } = useCart();
  const [checkoutNotice, setCheckoutNotice] = useState(false);
  const cartItems = lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? [{ ...line, product }] : [];
  });
  const subtotal = cartItems.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );

  return (
    <div className="site-grain min-h-[100dvh] bg-[#f7f3e9] text-[#332b27]">
      <header className="border-b border-[#e6ded0]">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-5 md:px-10">
          <Link href="/" className="serif text-[20px] text-[#482c2a]">
            কাকন বাহার
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[.14em] text-[#79333b] hover:text-[#59252c]"
            data-testid="link-continue-shopping"
          >
            <ArrowLeft size={14} />
            Continue shopping
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5 py-10 md:px-10 md:py-14">
        <div className="flex items-end justify-between border-b border-[#e1d7c9] pb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[.18em] text-[#9a5152]">
              Your cart
            </p>
            <h1 className="serif mt-2 text-[clamp(2rem,4vw,3rem)] text-[#482c2a]">
              Your bag
            </h1>
          </div>
          <span
            className="text-[11px] text-[#827568]"
            data-testid="text-cart-item-count"
          >
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <ShoppingBag size={30} strokeWidth={1} className="text-[#a98d76]" />
            <h2 className="serif mt-5 text-[24px] text-[#482c2a]">
              Your bag is empty.
            </h2>
            <p className="mt-2 text-[12px] text-[#827568]">
              Choose a bangle to see it here.
            </p>
            <Link
              href="/"
              className="mt-6 bg-[#79333b] px-6 py-3 text-[10px] uppercase tracking-[.16em] text-[#fff8ee] transition-colors hover:bg-[#59252c]"
              data-testid="button-shop-bangles"
            >
              Shop bangles
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
            <section aria-label="Items in your bag">
              {cartItems.map(({ product, size, quantity }) => (
                <article
                  key={`${product.id}-${size}`}
                  className="flex gap-4 border-b border-[#e1d7c9] py-5 sm:gap-6"
                  data-testid={`row-cart-${product.id}-${size}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[112px] w-[92px] shrink-0 object-cover sm:h-[140px] sm:w-[118px]"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 py-1">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-[.14em] text-[#9a5152]">
                          {product.category}
                        </p>
                        <h2 className="serif mt-1 text-[17px] leading-tight text-[#482c2a] sm:text-[20px]">
                          {product.name}
                        </h2>
                        <p className="mt-2 text-[11px] text-[#827568]">
                          Size {size}
                        </p>
                      </div>
                      <span
                        className="shrink-0 text-[12px] text-[#482c2a]"
                        data-testid={`text-line-total-${product.id}-${size}`}
                      >
                        ৳{(product.price * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#d8cdbd]">
                        <button
                          type="button"
                          onClick={() => changeQuantity(product.id, size, -1)}
                          className="flex h-9 w-9 items-center justify-center text-[#58473e] transition-colors hover:bg-[#eee8dc]"
                          aria-label={`Remove one ${product.name}, size ${size}`}
                          data-testid={`button-decrease-${product.id}-${size}`}
                        >
                          <Minus size={13} />
                        </button>
                        <span
                          className="w-8 text-center text-[11px] text-[#58473e]"
                          data-testid={`text-quantity-${product.id}-${size}`}
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(product.id, size, 1)}
                          className="flex h-9 w-9 items-center justify-center text-[#58473e] transition-colors hover:bg-[#eee8dc]"
                          aria-label={`Add one ${product.name}, size ${size}`}
                          data-testid={`button-increase-${product.id}-${size}`}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id, size)}
                        className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[.12em] text-[#9b7770] transition-colors hover:text-[#79333b]"
                        aria-label={`Remove ${product.name}, size ${size} from bag`}
                        data-testid={`button-remove-${product.id}-${size}`}
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit border border-[#e1d7c9] bg-[#fffaf2] p-6">
              <h2 className="serif text-[22px] text-[#482c2a]">
                Order summary
              </h2>
              <div className="mt-6 flex items-center justify-between border-t border-[#e1d7c9] pt-5 text-[11px] uppercase tracking-[.12em] text-[#65574d]">
                <span>Subtotal</span>
                <span data-testid="text-cart-subtotal">
                  ৳{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutNotice(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 bg-[#79333b] py-4 text-[10px] uppercase tracking-[.17em] text-[#fff8ee] transition-colors hover:bg-[#59252c]"
                data-testid="button-checkout-boundary"
              >
                Checkout
                <ArrowRight size={14} />
              </button>
              <p className="mt-3 text-center text-[10px] leading-relaxed text-[#9a8c7d]">
                Checkout is not connected yet.
              </p>
              {checkoutNotice && (
                <p
                  className="mt-3 text-center text-[11px] text-[#79333b]"
                  role="status"
                  data-testid="status-checkout-unavailable"
                >
                  No order will be placed.
                </p>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
