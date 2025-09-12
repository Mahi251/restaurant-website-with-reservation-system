import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    "https://qzhueixquzqnroihhxri.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6aHVlaXhxdXpxbnJvaWhoeHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTkwNjcsImV4cCI6MjA3MjQ3NTA2N30.CLkBhF5QCFOndMN0bEp_ow_RBWDnVAc",
  )
}
