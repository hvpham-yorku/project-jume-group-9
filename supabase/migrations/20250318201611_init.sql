create table users (
    id uuid primary key default uuid_generate_v4(),
    email text not null unique,
    password text not null,
    created_at timestamp with time zone default now()
);


create table organizations (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    created_at timestamp with time zone default now()
);

-- table matching the actual schema
create table test_table (
    id serial primary key,
    message text,
    created_at timestamp with time zone default now()
);

-- orders table from the schema
create table orders (
    id serial primary key,
    order_number int,
    date timestamp with time zone default now(),
    customer text,
    total numeric,
    notified boolean default false,
    fulfillment_status text,
    items_count int
);


