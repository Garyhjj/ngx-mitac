interface BasicTable {
  LAST_UPDATED_DATE?: string;
  LAST_UPDATED_BY?: number;
  CREATION_DATE?: string;
  CREATED_BY?: number;
}
export class Project implements BasicTable {
  ID?: number;
  NAME?: string;
  DESCRIPTION?: string;
  START_DATE?: string;
  DUE_DATE?: string;
  OWNER?: string;
  PARENT_HEADER?: number;
  FINISHED_PECENT?: number;
  CLOSED_TASKS_COUNT?: number;
  TOTAL_TASKS_COUNT?: number;
  TYPE?: string;
  children?: Project[];
  LAST_UPDATED_DATE?: string;
  LAST_UPDATED_BY?: number;
  CREATION_DATE?: string;
  CREATED_BY?: number;
}
