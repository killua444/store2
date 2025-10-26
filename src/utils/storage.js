export const getCart = () => JSON.parse(localStorage.getItem('cart')) || []
export const setCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart))

export const getWishlist = () => JSON.parse(localStorage.getItem('wishlist')) || []
export const setWishlist = (wishlist) => localStorage.setItem('wishlist', JSON.stringify(wishlist))

export const getTheme = () => localStorage.getItem('theme') || 'mint'
export const setTheme = (theme) => localStorage.setItem('theme', theme)

export const getAdminAuth = () => localStorage.getItem('admin-pass') === 'shadow2002@'
export const setAdminAuth = (pass) => localStorage.setItem('admin-pass', pass)
export const clearAdminAuth = () => localStorage.removeItem('admin-pass')
