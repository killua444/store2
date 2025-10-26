export const waPhone = '212696952145';

export const waOrderLink = (text) =>
  `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;

export const buildProductMessage = (p) => [
  `🛍️ *${p.title}*`,
  `ID: ${p.id}`,
  `Price: MAD ${p.price}`,
  `Image: ${p.image}`,
  `Link: ${window.location.origin}/#/product/${p.id}`
].join('\n');

export const buildCartMessage = (customer, items, total) => {
  const L = [`🧾 *Order Summary*`, `👤 ${customer.name} | 📞 ${customer.phone}`];
  L.push('\n*Items:*');
  items.forEach((it) =>
    L.push(`• ${it.title} (ID: ${it.id}) | Qty: ${it.qty} | MAD ${it.price}`)
  );
  L.push(`\nTotal: MAD ${total}`);
  return L.join('\n');
};
