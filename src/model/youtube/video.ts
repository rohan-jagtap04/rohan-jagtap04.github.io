import { Id } from "./id";
import { Snippet } from "./snippet";

export interface Video {
  kind: string;
  etag: string;
  id: Id;
  snippet: Snippet;
}
