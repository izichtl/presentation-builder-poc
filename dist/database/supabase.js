"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = 'https://ikwwcjqmyxvpbsbyipce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlrd3djanFteXh2cGJzYnlpcGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNDg5NzgsImV4cCI6MjAzMzcyNDk3OH0.bV2_75ea49QOOBlZ6ml0zWW8bA8G01hsXaEW1aKETBU';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
//# sourceMappingURL=supabase.js.map