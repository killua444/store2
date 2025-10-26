import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback to local JSON
    try {
      const response = await fetch('/src/data/products.json')
      const data = await response.json()
      return data.products
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError)
      return []
    }
  }
}

export const fetchSettings = async () => {
  const { data, error } = await supabase.from('settings').select('*')
  if (error) {
    console.error('Error fetching settings:', error)
    // Fallback to local JSON
    const response = await fetch('/src/data/settings.json')
    return response.json()
  }
  return data.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {})
}

export const addProduct = async (product) => {
  const { data, error } = await supabase.from('products').insert(product)
  if (error) console.error('Error adding product:', error)
  return data
}

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id)
  if (error) console.error('Error updating product:', error)
  return data
}

export const deleteProduct = async (id) => {
  const { data, error } = await supabase.from('products').delete().eq('id', id)
  if (error) console.error('Error deleting product:', error)
  return data
}

export const createOrder = async (order) => {
  const { data, error } = await supabase.from('orders').insert(order)
  if (error) console.error('Error creating order:', error)
  return data
}
