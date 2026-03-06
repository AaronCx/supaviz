export const examples = {
  blog: {
    name: 'Blog',
    sql: `CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE
);

CREATE TABLE posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  published boolean DEFAULT false,
  author_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE post_categories (
  post_id uuid REFERENCES posts(id),
  category_id uuid REFERENCES categories(id),
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  body text NOT NULL,
  post_id uuid REFERENCES posts(id),
  author_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id),
  user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE (post_id, user_id)
);`,
  },

  ecommerce: {
    name: 'E-commerce',
    sql: `CREATE TABLE customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE addresses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES customers(id),
  street text NOT NULL,
  city text NOT NULL,
  state text,
  zip text NOT NULL,
  country text NOT NULL DEFAULT 'US',
  is_default boolean DEFAULT false
);

CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  parent_id uuid REFERENCES categories(id)
);

CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  sku text UNIQUE,
  category_id uuid REFERENCES categories(id),
  stock_quantity int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES customers(id),
  status text DEFAULT 'pending',
  total numeric(10,2) NOT NULL,
  shipping_address_id uuid REFERENCES addresses(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL
);

CREATE TABLE reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id),
  customer_id uuid REFERENCES customers(id),
  rating int NOT NULL,
  body text,
  created_at timestamptz DEFAULT now()
);`,
  },

  saas: {
    name: 'SaaS Starter',
    sql: `CREATE TABLE organizations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  plan text DEFAULT 'free',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id uuid REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE memberships (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  org_id uuid REFERENCES organizations(id),
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE (user_id, org_id)
);

CREATE TABLE projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  org_id uuid REFERENCES organizations(id),
  created_by uuid REFERENCES users(id),
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE api_keys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key_hash text NOT NULL UNIQUE,
  name text NOT NULL,
  project_id uuid REFERENCES projects(id),
  created_by uuid REFERENCES users(id),
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES organizations(id),
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);`,
  },
}

export type ExampleKey = keyof typeof examples
