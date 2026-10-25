import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xndiilxlsrbqdkijcyyc.supabase.co'
const supabaseKey = 'sb_publishable_9wfxbKL_4dbsXgtJygb7ZQ_9t5Bh7Gv'

export const supabase = createClient(supabaseUrl, supabaseKey)
