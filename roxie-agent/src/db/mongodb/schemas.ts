import mongoose from "mongoose";

export const CollectionNamesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  location: {
    type: String,
    required: false,
    lowercase: true,
  },
  relation: {
    type: String,
    required: true,
    lowercase: true,
  },
  notes: {
    type: String,
    required: false,
  },
  phone_number: {
    type: Number,
    required: false,
  },
  date_of_birth: {
    type: Date,
    required: false,
  },
  occupation: {
    type: String,
    required: false,
  },
  last_called: {
    type: Date,
    required: false,
  },
  last_met: {
    type: Date,
    required: false,
  },
  is_favorite: {
    type: Boolean,
    required: false,
  },
  profile_photo_urls: {
    type: String,
    required: false,
  },
})

export const OfficeWorkSchema = new mongoose.Schema({
  task_id: {
    type: String,
    required: true,
    lowercase: true,
  },
  about_task: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    lowercase: true,
  },
  note: {
    type: String,
    required: false,
  },
  last_date: {
    type: Date,
    required: false,
  },
})

export const TasksTodoSchema = new mongoose.Schema({
  task_type: {
    type: String,
    required: true,
    lowercase: true,
  },
  task_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    lowercase: true,
  },
  trigger_time: {
    type: String,
    required: false,
  },
  repeat_cycle: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  created_on: {
    type: Date,
    required: false,
  },
})

export const GrocerySchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
})

export const MoneyBorrowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  borrowed_on: {
    type: Date,
    required: true,
  },
  return_on: {
    type: String,
    required: true,
  },
  ask_reminder: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    required: true,
  },
})

export const FavouriteSongsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  movie: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
})

export const CalendarEventsSchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

export const ConversationSummarySchema = new mongoose.Schema({
  thread_id: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: false,
  },
  summary: {
    type: String,
    required: true,
  },
})

export const HealthLogsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  slept_on: {
    type: Date,
    required: false,
  },
  wokeup_at: {
    type: Date,
    required: true,
  },
  health_condition: {
    type: String,
    required: true,
  },
})

