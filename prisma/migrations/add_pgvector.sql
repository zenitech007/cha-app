-- Run this in the Supabase SQL Editor (or via psql) BEFORE running prisma db push.
-- Step 1: Enable the pgvector extension (Supabase has it pre-installed)
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Add the embedding column to the artists table
ALTER TABLE artists ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Step 3: Create an index for fast cosine similarity searches
CREATE INDEX IF NOT EXISTS artists_embedding_idx
  ON artists
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
