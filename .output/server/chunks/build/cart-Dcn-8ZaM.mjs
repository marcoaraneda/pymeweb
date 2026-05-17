import { defineStore } from 'pinia';

const useCartStore = defineStore("cart", {
  state: () => ({
    itemsByContext: {},
    currentContext: "marketplace",
    lastNotice: ""
  }),
  getters: {
    items: (state) => state.itemsByContext[state.currentContext] || [],
    totalItems() {
      return this.items.reduce((acc, item) => acc + item.quantity, 0);
    },
    totalPrice() {
      return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }
  },
  actions: {
    parseMoney(value) {
      if (typeof value === "number") return Number.isFinite(value) ? value : 0;
      if (typeof value === "string") {
        const cleaned = value.replace(/[^\d.,-]/g, "").trim();
        if (!cleaned) return 0;
        const normalized = cleaned.includes(",") && cleaned.includes(".") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned.replace(",", ".");
        const parsed2 = Number(normalized);
        return Number.isFinite(parsed2) ? parsed2 : 0;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    },
    resolveUnitPrice(basePrice, offerPrice, offerMinQty = 1, quantity = 1) {
      const safeBase = Number.isFinite(basePrice) ? Number(basePrice) : 0;
      const hasOffer = offerPrice !== null && offerPrice !== void 0 && offerPrice !== "";
      const safeOffer = hasOffer && Number.isFinite(Number(offerPrice)) ? Number(offerPrice) : null;
      const minQty = Math.max(1, Number(offerMinQty) || 1);
      if (safeOffer != null && safeOffer >= 0 && quantity >= minQty) {
        return safeOffer;
      }
      return safeBase;
    },
    recalculateItemPrice(item) {
      const basePrice = Number.isFinite(Number(item.basePrice)) ? Number(item.basePrice) : Number(item.price || 0);
      const hasOffer = item.offerPrice !== null && item.offerPrice !== void 0 && item.offerPrice !== "";
      const offerPrice = hasOffer && Number.isFinite(Number(item.offerPrice)) ? Number(item.offerPrice) : null;
      const offerMinQty = Math.max(1, Number(item.offerMinQty) || 1);
      item.basePrice = basePrice;
      item.offerPrice = offerPrice;
      item.offerMinQty = offerMinQty;
      item.price = this.resolveUnitPrice(basePrice, offerPrice, offerMinQty, item.quantity);
    },
    clampQuantity(qty, max) {
      const safe = Number.isFinite(qty) ? qty : 0;
      const limited = max && Number.isFinite(max) ? Math.min(safe, max) : safe;
      return Math.max(1, limited);
    },
    limitQuantity(qty, max) {
      const desired = Number.isFinite(qty) ? qty : 0;
      const limited = this.clampQuantity(desired, max);
      return { qty: limited, clamped: limited < desired };
    },
    setNotice(msg) {
      this.lastNotice = msg || "";
    },
    setContext(contextKey) {
      this.currentContext = contextKey || "marketplace";
      if (!this.itemsByContext[this.currentContext]) {
        this.itemsByContext[this.currentContext] = [];
      }
      this.saveToStorage();
    },
    addProduct(product) {
      const list = this.ensureContext();
      const existing = list.find((item) => item.id === product.id);
      const basePrice = this.parseMoney(product.price);
      const offerPrice = product.offer_price != null ? this.parseMoney(product.offer_price) : null;
      const offerMinQty = Math.max(1, Number(product.offer_min_qty) || 1);
      const max = Number.isFinite(product?.stock_available) ? Number(product.stock_available) : null;
      if (existing) {
        const { qty, clamped } = this.limitQuantity(existing.quantity + 1, max ?? existing.max);
        existing.quantity = qty;
        existing.max = max ?? existing.max;
        existing.storeSlug = product.store?.slug || existing.storeSlug || "marketplace";
        existing.basePrice = basePrice;
        existing.offerPrice = offerPrice;
        existing.offerMinQty = offerMinQty;
        this.recalculateItemPrice(existing);
        this.setNotice(clamped ? `Stock limitado a ${qty} unidades` : "");
      } else {
        const { qty, clamped } = this.limitQuantity(1, max);
        const item = {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: Number.isFinite(basePrice) ? basePrice : 0,
          basePrice: Number.isFinite(basePrice) ? basePrice : 0,
          offerPrice,
          offerMinQty,
          image: product.images?.[0]?.image || product.image || null,
          quantity: qty,
          max,
          storeSlug: product.store?.slug || "marketplace"
        };
        this.recalculateItemPrice(item);
        list.push({
          ...item
        });
        this.setNotice(clamped ? `Stock limitado a ${qty} unidades` : "");
      }
      this.saveToStorage();
    },
    addConfiguredProduct(payload) {
      const list = this.ensureContext();
      const product = payload.product || {};
      const basePrice = this.parseMoney(product.price);
      const offerPrice = product.offer_price != null ? this.parseMoney(product.offer_price) : null;
      const offerMinQty = Math.max(1, Number(product.offer_min_qty) || 1);
      const quantity = Math.max(1, Number(payload.quantity) || 1);
      const sizeExtra = payload.size === "grande" ? payload.extraSizeLargePrice || 1200 : 0;
      const friesExtra = payload.fries === "grandes" ? payload.extraFriesLargePrice || 1400 : payload.fries === "medianas" ? payload.extraFriesMediumPrice || 900 : 0;
      const drinkExtra = payload.drink && payload.drink !== "Sin bebida" ? payload.extraDrinkPrice || 1e3 : 0;
      const saucesExtra = Array.isArray(payload.sauces) ? payload.sauces.length * (payload.extraSaucePrice || 250) : 0;
      const addonItems = Array.isArray(payload.addons) ? payload.addons.filter((item2) => item2 && Number(item2.price) >= 0) : [];
      const addonsTotal = addonItems.reduce((acc, item2) => acc + this.parseMoney(item2.price), 0);
      const extrasTotal = sizeExtra + friesExtra + drinkExtra + saucesExtra + addonsTotal;
      const safeBaseUnit = this.resolveUnitPrice(basePrice, offerPrice, offerMinQty, quantity);
      const finalUnitPrice = Math.max(0, Number(safeBaseUnit) + extrasTotal);
      const sauces = Array.isArray(payload.sauces) ? payload.sauces.filter(Boolean) : [];
      const summaryParts = [
        payload.size === "grande" ? "Agrandado" : "Tamaño regular",
        payload.fries && payload.fries !== "ninguna" ? `Papas ${payload.fries}` : "Sin papas",
        payload.drink ? `Bebida: ${payload.drink}` : "Sin bebida",
        sauces.length ? `Salsas: ${sauces.join(", ")}` : "Sin salsas",
        addonItems.length ? `Agregados: ${addonItems.map((item2) => item2.name).join(", ")}` : "Sin agregados"
      ];
      const uniqueId = `${String(product.id || "combo")}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
      const item = {
        id: uniqueId,
        productId: product.id,
        name: String(product.name || "Combo personalizado"),
        price: finalUnitPrice,
        basePrice: finalUnitPrice,
        offerPrice: null,
        offerMinQty: 1,
        image: product.images?.[0]?.image || product.image || null,
        quantity,
        max: Number.isFinite(product?.stock_available) ? Number(product.stock_available) : null,
        storeSlug: product.store?.slug || "marketplace",
        optionsSummary: summaryParts.join(" · "),
        comboConfig: {
          size: payload.size || "regular",
          fries: payload.fries || "ninguna",
          drink: payload.drink || "Sin bebida",
          sauces
        },
        addons: addonItems
      };
      list.push(item);
      this.setNotice("Combo agregado al carrito");
      this.saveToStorage();
    },
    removeProduct(productId) {
      const list = this.ensureContext();
      this.itemsByContext[this.currentContext] = list.filter((item) => item.id !== productId);
      this.saveToStorage();
    },
    updateQuantity(productId, qty) {
      const list = this.ensureContext();
      const item = list.find((i) => i.id === productId);
      if (!item) return;
      const { qty: limited, clamped } = this.limitQuantity(qty, item.max);
      item.quantity = limited;
      this.recalculateItemPrice(item);
      this.setNotice(clamped ? `Stock limitado a ${limited} unidades` : "");
      this.saveToStorage();
    },
    clearCart() {
      this.itemsByContext[this.currentContext] = [];
      this.saveToStorage();
    },
    saveToStorage() {
    },
    loadFromStorage() {
      return;
    },
    ensureContext() {
      if (!this.itemsByContext[this.currentContext]) {
        this.itemsByContext[this.currentContext] = [];
      }
      return this.itemsByContext[this.currentContext];
    }
  }
});

export { useCartStore as u };
//# sourceMappingURL=cart-Dcn-8ZaM.mjs.map
