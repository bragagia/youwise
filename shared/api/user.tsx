type RessourceArray = {
  id: string;
  name: string;
}[];

export type UserResourcesResponse = {
  continue: RessourceArray;
  saveForLater: RessourceArray;
  library: RessourceArray;
  explore: RessourceArray;
};

export type UserCreateRequest = {
  url: string;
};
