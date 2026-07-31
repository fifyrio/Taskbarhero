import { createClient } from '@supabase/supabase-js'
import { config } from './config'

// Fall back to harmless placeholders when Supabase env is absent (local/preview),
// so the module can be imported without throwing. Real auth requires real env.
export const supabase = createClient(
  config.supabase.url || 'https://placeholder.supabase.co',
  config.supabase.anonKey || 'placeholder-anon-key'
)

export async function signInWithGoogle() {
  const redirectUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/callback`
    : `${config.app.url}/auth/callback`
    
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl
    }
  })
  
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}