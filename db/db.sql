create table actions
(
	action_id bigint auto_increment
		primary key,
	run_id varchar(50) not null,
	detail json not null,
	client_time double not null,
	insert_time timestamp default CURRENT_TIMESTAMP not null,
	seqno int not null,
	constraint action_id
		unique (action_id),
	constraint actions_action_id_uindex
		unique (action_id)
)
;

create index actions_game_runs_game_run_id_fk
	on actions (run_id)
;

create table runs
(
	run_id varchar(50) not null
		primary key,
	session_id varchar(50) null,
	seqno int(10) unsigned not null,
	begin_time double null,
	end_time double null,
	detail_begin json null,
	detail_end json null,
	insert_time timestamp default CURRENT_TIMESTAMP not null,
	constraint game_runs_run_id_uindex
		unique (run_id)
)
;

create index game_runs_game_sessions_game_session_id_fk
	on runs (session_id)
;

create table sessions
(
	session_id varchar(50) not null
		primary key,
	player_id varchar(50) not null,
	game_name text not null,
	begin_time double null,
	end_time double null,
	detail_begin json null,
	detail_end json null,
	insert_time timestamp default CURRENT_TIMESTAMP not null,
	constraint game_sessions_session_id_uindex
		unique (session_id)
)
;

