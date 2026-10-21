import { z } from "zod";
import { cardSchema } from "../../shared/card.mjs";
export type CardContent = z.infer<typeof cardSchema>;
export {
  actionSchema,
  cardSchema,
  initialCard,
  themes,
  templates,
  fromTemplate,
  shareLinks,
  purposes,
} from "../../shared/card.mjs";
