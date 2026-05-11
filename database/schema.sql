create table users (
id SERIAL primary key,
username VARCHAR(30) unique not null,
email VARCHAR(255) unique not null,
password_hash varchar(255) not null,
role varchar(30) not null default 'user',
is_active boolean not null default true,
created_at timestamp not null default NOW(),
updated_at TIMESTAMP not null default NOW(),
last_login_at timestamp,

constraint users_role_check
check (role in ('admin', 'moderator', 'user')),

constraint users_username_length_check
check (CHAR_LENGTH(username) >= 3)
);

create table fish(
id SERIAL primary key,
common_name VARCHAR(100) unique not null,
scientific_name varchar(150),
category varchar(50) not null default 'freshwater',
is_active boolean not null default true,
created_at timestamp not null default NOW(),
updated_at TIMESTAMP not null default NOW(),

constraint fish_category_check
check (category in ('freshwater', 'saltwater', 'both', 'other'))
);

create table sessions(
id serial primary key,
user_id integer not null,
title varchar(100),
location varchar(150),
started_at timestamp not null default now(),
ended_at timestamp,
notes text,
created_at timestamp not null default NOW(),
updated_at TIMESTAMP not null default NOW(),

constraint sessions_user_fk
foreign key (user_id) references users(id) on delete cascade,

constraint sessions_time_check
check (ended_at is null or ended_at >= started_at)
);

create table catches (
id serial primary key,
fish_id integer not null,
session_id integer not null,
weight_grams integer,
length_cm decimal(6,2),
caught_at timestamp not null default now(),
notes text,
created_at timestamp not null default NOW(),
updated_at TIMESTAMP not null default NOW(),

constraint catches_fish_fk
foreign key (fish_id) references fish(id) on delete restrict,

constraint catches_session_fk
foreign key (session_id) references sessions(id) on delete cascade,

constraint catches_weight_check
check (weight_grams is null or weight_grams > 0),

constraint catches_length_check
check (length_cm is null or length_cm > 0)
);