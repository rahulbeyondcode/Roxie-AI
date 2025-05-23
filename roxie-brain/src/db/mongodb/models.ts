import mongoose from 'mongoose';
import {
  CalendarEventsSchema,
  CollectionNamesSchema,
  ConversationSummarySchema,
  FavouriteSongsSchema,
  GrocerySchema,
  HealthLogsSchema,
  MoneyBorrowerSchema,
  OfficeWorkSchema,
  TasksTodoSchema,
  UserSchema,
} from './schemas';

export const CalendarEvents = mongoose.model("calendar_events", CalendarEventsSchema);
export const CollectionNames = mongoose.model("all_collections", CollectionNamesSchema);
export const ConversationSummary = mongoose.model("conversation_summary", ConversationSummarySchema);
export const FavouriteSongs = mongoose.model("favourite_songs", FavouriteSongsSchema);
export const Grocery = mongoose.model("grocery", GrocerySchema);
export const HealthLogs = mongoose.model("health_logs", HealthLogsSchema);
export const MoneyBorrower = mongoose.model("money_borrower", MoneyBorrowerSchema);
export const OfficeWork = mongoose.model("office_work", OfficeWorkSchema);
export const TasksTodo = mongoose.model("tasks_todo", TasksTodoSchema);
export const User = mongoose.model("user", UserSchema);
