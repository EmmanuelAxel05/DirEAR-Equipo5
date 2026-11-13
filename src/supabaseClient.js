import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cezkircllswuvapuukwl.supabase.co';
const supabaseKey = 'sb_publishable_Du4Z2CHVJenfy8IlOrg0jQ_krnXxiDS';

// IMPORTANTE: Debe decir "export const supabase"
export const supabase = createClient(supabaseUrl, supabaseKey);