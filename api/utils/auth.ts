export type UserAuthed = {
  authed: true;
  root: false;
  expired: false;

  userId: string;
  accessToken: string;
};

export type UserExpiredAuth = {
  authed: false;
  root: false;
  expired: true;

  userId: string;
};

export type RootAuthed = {
  authed: true;
  root: true;
  expired: false;
};
export const rootAuth: RootAuthed = {
  authed: true,
  root: true,
  expired: false,
};

export type NoAuth = {
  authed: false;
  root: false;
  expired: false;
};
export const noAuth: NoAuth = {
  authed: false,
  root: false,
  expired: false,
};

export type Auth = NoAuth | UserAuthed | RootAuthed;
