import {createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://ikwwcjqmyxvpbsbyipce.supabase.co'
const supabaseKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlrd3djanFteXh2cGJzYnlpcGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNDg5NzgsImV4cCI6MjAzMzcyNDk3OH0.bV2_75ea49QOOBlZ6ml0zWW8bA8G01hsXaEW1aKETBU' as string
export const supabase = createClient(supabaseUrl, supabaseKey)

