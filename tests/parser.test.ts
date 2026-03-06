import { describe, it, expect } from 'vitest'
import { parseSchema } from '../src/core/parser'
import { examples } from '../src/data/examples'

describe('parseSchema', () => {
  it('parses single table with columns correctly', () => {
    const schema = parseSchema(`
      CREATE TABLE users (
        id uuid PRIMARY KEY,
        email text NOT NULL,
        name text
      );
    `)
    expect(schema.tables).toHaveLength(1)
    expect(schema.tables[0].name).toBe('users')
    expect(schema.tables[0].columns).toHaveLength(3)
  })

  it('detects PRIMARY KEY column', () => {
    const schema = parseSchema(`
      CREATE TABLE users (
        id uuid PRIMARY KEY,
        name text
      );
    `)
    const idCol = schema.tables[0].columns.find((c) => c.name === 'id')
    expect(idCol?.isPrimaryKey).toBe(true)
    expect(idCol?.isNullable).toBe(false)
  })

  it('detects FOREIGN KEY with REFERENCES', () => {
    const schema = parseSchema(`
      CREATE TABLE users (id uuid PRIMARY KEY);
      CREATE TABLE posts (
        id uuid PRIMARY KEY,
        author_id uuid REFERENCES users(id)
      );
    `)
    const authorCol = schema.tables[1].columns.find((c) => c.name === 'author_id')
    expect(authorCol?.isForeignKey).toBe(true)
    expect(authorCol?.references).toEqual({ table: 'users', column: 'id' })
    expect(schema.relationships).toHaveLength(1)
  })

  it('handles uuid DEFAULT gen_random_uuid() PRIMARY KEY', () => {
    const schema = parseSchema(`
      CREATE TABLE users (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        email text
      );
    `)
    const idCol = schema.tables[0].columns.find((c) => c.name === 'id')
    expect(idCol?.isPrimaryKey).toBe(true)
    expect(idCol?.type).toBe('uuid')
  })

  it('handles REFERENCES auth.users(id)', () => {
    const schema = parseSchema(`
      CREATE TABLE profiles (
        id uuid PRIMARY KEY,
        auth_id uuid REFERENCES auth.users(id)
      );
    `)
    const authCol = schema.tables[0].columns.find((c) => c.name === 'auth_id')
    expect(authCol?.isForeignKey).toBe(true)
    expect(authCol?.references?.table).toBe('users')
  })

  it('infers one-to-one when FK column has UNIQUE constraint', () => {
    const schema = parseSchema(`
      CREATE TABLE users (id uuid PRIMARY KEY);
      CREATE TABLE profiles (
        id uuid PRIMARY KEY,
        user_id uuid UNIQUE REFERENCES users(id)
      );
    `)
    expect(schema.relationships[0].type).toBe('one-to-one')
  })

  it('throws on invalid SQL with descriptive message', () => {
    expect(() => parseSchema('not valid sql at all')).toThrow('No valid CREATE TABLE')
  })

  it('parses Blog example without error', () => {
    const schema = parseSchema(examples.blog.sql)
    expect(schema.tables.length).toBeGreaterThan(0)
  })

  it('parses E-commerce example without error', () => {
    const schema = parseSchema(examples.ecommerce.sql)
    expect(schema.tables.length).toBeGreaterThan(0)
  })

  it('parses SaaS example without error', () => {
    const schema = parseSchema(examples.saas.sql)
    expect(schema.tables.length).toBeGreaterThan(0)
  })
})
